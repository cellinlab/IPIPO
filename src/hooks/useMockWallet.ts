import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MockWalletState {
  isConnected: boolean
  address: string | null
  balance: bigint
  chainId: number
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  setBalance: (balance: bigint) => void
  clearError: () => void
  switchAccount: (newAddress: string) => void
}

// 预设的模拟账户
const mockAccounts = [
  {
    address: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
    name: 'Alice (Creator)',
    balance: BigInt('1000000000000000000000'), // 1000 ETH
  },
  {
    address: '0x8ba1f109551bD432803012645Hac136c',
    name: 'Bob (Buyer)',
    balance: BigInt('500000000000000000000'), // 500 ETH
  },
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Carol (Trader)',
    balance: BigInt('2000000000000000000000'), // 2000 ETH
  }
]

// Mock钱包状态管理
export const useMockWallet = create<MockWalletState>()(
  persist(
    (set, _get) => ({
      isConnected: false,
      address: null,
      balance: BigInt('1000000000000000000000'), // 1000 ETH
      chainId: 1337, // Mock Local Chain
      isConnecting: false,
      error: null,
      
      connect: async () => {
        set({ isConnecting: true, error: null })
        
        try {
          // 模拟连接延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 随机选择一个账户或使用默认账户
          const randomAccount = mockAccounts[Math.floor(Math.random() * mockAccounts.length)]
          
          set({
            isConnected: true,
            address: randomAccount.address,
            balance: randomAccount.balance,
            isConnecting: false,
          })
          
          console.log(`Mock钱包已连接: ${randomAccount.name} (${randomAccount.address})`)
        } catch (error) {
          set({
            isConnecting: false,
            error: '连接钱包失败',
          })
        }
      },
      
      disconnect: () => {
        set({
          isConnected: false,
          address: null,
          error: null,
        })
        console.log('Mock钱包已断开连接')
      },
      
      setBalance: (balance: bigint) => {
        set({ balance })
      },
      
      clearError: () => {
        set({ error: null })
      },
      
      switchAccount: (newAddress: string) => {
        const account = mockAccounts.find(acc => acc.address === newAddress)
        if (account) {
          set({
            address: account.address,
            balance: account.balance,
          })
          console.log(`切换到账户: ${account.name} (${account.address})`)
        }
      },
    }),
    {
      name: 'mock-wallet-storage',
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
        balance: state.balance,
      }),
    }
  )
)

// 模拟交易函数
export const mockTransaction = async (_params: {
  to?: string
  data?: string
  value?: bigint
  gasLimit?: number
}): Promise<{
  hash: string
  blockNumber: number
  gasUsed: number
  status: 'success' | 'failed'
}> => {
  // 模拟交易延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 模拟偶尔的交易失败
  if (Math.random() < 0.05) {
    throw new Error('交易失败: 网络拥堵')
  }
  
  return {
    hash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
    gasUsed: Math.floor(Math.random() * 100000) + 21000,
    status: 'success',
  }
}

// 获取所有模拟账户
export const getMockAccounts = () => mockAccounts

// 格式化地址显示
export const formatAddress = (address: string | null, length = 4): string => {
  if (!address) return ''
  return `${address.slice(0, 2 + length)}...${address.slice(-length)}`
}

// 格式化余额显示
export const formatBalance = (balance: bigint, decimals = 4): string => {
  const eth = Number(balance) / 1e18
  return `${eth.toFixed(decimals)} ETH`
}
