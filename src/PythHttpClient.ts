import { Commitment, Connection, PublicKey } from '@solana/web3.js'
import { Product, PriceData, parseProductData, parsePriceData, parseBaseData, AccountType } from '.'

export interface PythHttpClientResult {
  assetTypes: string[]
  symbols: string[]
  products: Product[]
  productFromSymbol: Map<string, Product>
  productPrice: Map<string, PriceData>
  prices:any,
  productAll:any
}

/**
 * Reads Pyth price data from a solana web3 connection. This class uses a single HTTP call.
 * Use the method getData() to get updated prices values.
 */
export class PythHttpClient {
  connection: Connection
  pythProgramKey: PublicKey
  commitment: Commitment

  constructor(connection: Connection, pythProgramKey: PublicKey, commitment: Commitment = 'finalized') {
    this.connection = connection
    this.pythProgramKey = pythProgramKey
    this.commitment = commitment
  }

  /*
   * Get Pyth Network account information and return actual price state.
   * The result contains lists of asset types, product symbols and their prices.
   */
  public async getData(): Promise<PythHttpClientResult> {
    const assetTypes = new Set<string>()
    const productSymbols = new Set<string>()
    const products = new Set<Product>()
    const productFromSymbol = new Map<string, Product>()
    const productPrice = new Map<string, PriceData>()
    const prices = new Array<any>()
    const productAll = new Array()

    // Retrieve data from blockchain
    const accountList = await this.connection.getProgramAccounts(this.pythProgramKey, this.commitment)

    // Popolate producs and prices
    const priceDataQueue = new Array<PriceData>()
    const productAccountKeyToProduct = new Map<string, any>()
    const currentSlot = await this.connection.getSlot(this.commitment)

    accountList.forEach((singleAccount) => {
      const base = parseBaseData(singleAccount.account.data)
      if (base) {
        switch (base.type) {
          case AccountType.Mapping:
            // We can skip these because we're going to get every account owned by this program anyway.
            break
          case AccountType.Product:
            const productData = parseProductData(singleAccount.account.data,singleAccount.pubkey.toBase58())

            productAccountKeyToProduct.set(singleAccount.pubkey.toBase58(), productData)
            assetTypes.add(productData.product.asset_type)
            productSymbols.add(productData.product.symbol)
            products.add(productData.product)
            productFromSymbol.set(productData.product.symbol, productData.product)
            productAll.push(productData)
            break
          case AccountType.Price:
            const priceData = parsePriceData(singleAccount.account.data, currentSlot)
            priceDataQueue.push(priceData)
            break
          case AccountType.Test:
            break
          default:
            throw new Error(`Unknown account type: ${base.type}. Try upgrading pyth-client.`)
        }
      }
    })

    priceDataQueue.forEach((priceData) => {
      const product = productAccountKeyToProduct.get(priceData.productAccountKey.toBase58())
      // productAll.filter(a=>a.base58===priceData.productAccountKey.toBase58()).length>0?productAll.filter(a=>a.base58===priceData.productAccountKey.toBase58())[0].publisher=priceData.priceComponents:"";
      if (product) {
        productPrice.set(product.product.symbol, priceData)
        prices.push([priceData,product.priceAccountKey.toBase58()])
      }
    })

    const result: PythHttpClientResult = {
      assetTypes: Array.from(assetTypes),
      symbols: Array.from(productSymbols),
      products: Array.from(products),
      productFromSymbol,
      productPrice,
      prices,
      productAll
    }

    return result
  }
}
