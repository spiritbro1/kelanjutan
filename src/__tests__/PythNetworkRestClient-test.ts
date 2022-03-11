import { clusterApiUrl, Connection } from '@solana/web3.js'
import { getPythProgramKeyForCluster, PythHttpClient } from '..'
import * as fs from 'fs'

    const programKey = getPythProgramKeyForCluster('mainnet-beta')
    const currentConnection = new Connection(clusterApiUrl('mainnet-beta'))
    const pyth_client = new PythHttpClient(currentConnection, programKey)
    pyth_client.getData().then(
      (result) => {
        try {
          // console.log('products number: ', result.products.length)
          // console.log('asset types: ', result.assetTypes)
          // console.log('product symbols: ', result.symbols)

          // Find a product with symbol "SOL/USD"
          // const products = result.productFromSymbol
          // expect(products.length).toBeGreaterThan(0)

          // // Find product prices
          // const price = result.productPrice
          // expect(price).toBeDefined()
// console.log(result.productAll[0])
// console.log("jeneng produke",result.prices[0])
// console.log("price e",result.prices[0][1])

const selesai=result.prices.map((a:any)=>{
  const symbol=a[2]
  const product=a[0].productAccountKey.toBase58()
  const price=a[1]
  const publisher=a[0].priceComponents.length>0?a[0].priceComponents.map((b:any)=>b.publisher.toBase58()):[];
  return {product,price,publisher,symbol}
})
fs.writeFileSync("all.json",
JSON.stringify(selesai));
          // console.log('products', products)
          // console.log('price', price[0])

    
        } catch (cerr) {
         
        }
      }
    )
 

