import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { monadTestnet } from './chains'

// 获取配置，优先使用环境变量，否则使用默认值
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined') {
    return defaultValue // 浏览器环境使用默认值
  }
  
  try {
    return import.meta.env?.[key] || defaultValue
  } catch {
    return defaultValue
  }
}

// Web3 配置
export const web3Config = getDefaultConfig({
  appName: 'IPIPO - Influence Pre-sale Platform',
  projectId: getEnvVar('VITE_WC_PROJECT_ID', 'YOUR_PROJECT_ID'), // WalletConnect项目ID
  chains: [monadTestnet],
  ssr: false, // Disable server-side rendering for now
})

// 合约配置常量
export const CONTRACT_CONFIG = {
  // 部署后的真实地址
  IPIPO_ADDRESS: getEnvVar('VITE_CONTRACT_ADDRESS', '0xCDEA758D2D31dd07f28274db27eD24c7bf4476C0') as `0x${string}`,
  DEPLOYMENT_BLOCK: BigInt(getEnvVar('VITE_DEPLOY_BLOCK', '31075502')),
  
  // 网络配置
  CHAIN_ID: parseInt(getEnvVar('VITE_CHAIN_ID', '10143')),
  RPC_URL: getEnvVar('VITE_RPC_URL', 'https://testnet-rpc.monad.xyz/'),
  
  // 应用配置
  PLATFORM_FEE: 250, // 2.5% in basis points
} as const

// 导出类型
export type Web3Config = typeof web3Config
