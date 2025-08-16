// 应用配置
export const config = {
  // 环境
  env: import.meta.env.VITE_ENV || 'development',
  
  // WalletConnect
  walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID || 'mock_project_id',
  
  // 网络配置
  rpcUrl: import.meta.env.VITE_RPC_URL || 'http://localhost:8545',
  chainId: Number(import.meta.env.VITE_CHAIN_ID) || 1337,
  chainName: import.meta.env.VITE_CHAIN_NAME || 'Mock Network',
  
  // 合约配置
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  deployBlock: Number(import.meta.env.VITE_DEPLOY_BLOCK) || 0,
  
  // 应用配置
  app: {
    name: 'IPIPO',
    description: 'Influence Pre-sale, Influence Public Offering for Individuals',
    version: '0.1.0',
  },
  
  // 功能开关
  features: {
    enableMockMode: import.meta.env.VITE_ENV === 'development',
    enableAnalytics: false,
    enableNotifications: true,
  }
}

// 开发模式检查
export const isDevelopment = config.env === 'development'
export const isProduction = config.env === 'production'

// Mock模式检查
export const isMockMode = config.features.enableMockMode
