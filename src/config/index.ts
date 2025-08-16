// 安全获取环境变量的辅助函数
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue: string = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue
  }
  return defaultValue
}

// 应用配置
export const config = {
  // 环境
  env: getEnvVar('VITE_ENV', 'development'),
  
  // WalletConnect
  walletConnectProjectId: getEnvVar('VITE_WC_PROJECT_ID', 'mock_project_id'),
  
  // 网络配置
  rpcUrl: getEnvVar('VITE_RPC_URL', 'http://localhost:8545'),
  chainId: Number(getEnvVar('VITE_CHAIN_ID', '1337')),
  chainName: getEnvVar('VITE_CHAIN_NAME', 'Mock Network'),
  
  // 合约配置
  contractAddress: getEnvVar('VITE_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'),
  deployBlock: Number(getEnvVar('VITE_DEPLOY_BLOCK', '0')),
  
  // 应用配置
  app: {
    name: 'IPIPO',
    description: 'Influence Pre-sale, Influence Public Offering for Individuals',
    version: '0.1.0',
  },
  
  // 功能开关
  features: {
    enableMockMode: getEnvVar('VITE_ENV', 'development') === 'development',
    enableAnalytics: false,
    enableNotifications: true,
  }
}

// 开发模式检查
export const isDevelopment = config.env === 'development'
export const isProduction = config.env === 'production'

// Mock模式检查
export const isMockMode = config.features.enableMockMode
