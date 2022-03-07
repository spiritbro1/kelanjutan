import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { PythConnection } from './src/PythConnection'
import { getPythProgramKeyForCluster } from './src/cluster'
import { PriceStatus } from './src'

const SOLANA_CLUSTER_NAME: Cluster = 'mainnet-beta'
const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER_NAME))
const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME)
// getAll(connection, pythPublicKey)


