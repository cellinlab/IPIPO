import { defineChain } from 'viem'

// Monad Testnet 配置
export const monadTestnet = defineChain({
  id: 41454,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'], // 实际RPC由比赛方提供
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://testnet-explorer.monad.xyz', // 实际浏览器URL由比赛方提供
    },
  },
  testnet: true,
})

// 支持的链
export const supportedChains = [monadTestnet] as const
