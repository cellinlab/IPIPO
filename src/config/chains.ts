import { defineChain } from 'viem'

// Monad Testnet 配置 (官方数据)
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
  testnet: true,
})

// 支持的链
export const supportedChains = [monadTestnet] as const
