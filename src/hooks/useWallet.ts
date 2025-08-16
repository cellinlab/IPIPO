import { useAccount, useBalance, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { monadTestnet } from '@/config/chains'
import { formatEther } from 'viem'

/**
 * 真实的Web3钱包Hook - 替换useMockWallet
 * 提供与Mock版本相同的接口，保证前端组件无需修改
 */
export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // 检查是否在正确的网络
  const isCorrectChain = chainId === monadTestnet.id
  
  // 连接钱包函数
  const connect = async () => {
    try {
      if (!isConnected && openConnectModal) {
        openConnectModal()
      }
      
      // 如果已连接但网络不对，切换网络
      if (isConnected && !isCorrectChain) {
        await switchChain({ chainId: monadTestnet.id })
      }
    } catch (error) {
      console.error('连接钱包失败:', error)
      throw error
    }
  }
  
  // 断开连接
  const handleDisconnect = () => {
    disconnect()
  }
  
  // 切换账户 (Web3钱包中用户需要手动切换)
  const switchAccount = () => {
    // 在真实Web3环境中，用户需要在钱包中手动切换账户
    // 我们可以提示用户或重新打开连接模态框
    if (openConnectModal) {
      openConnectModal()
    }
  }
  
  // 格式化余额显示
  const formattedBalance = balance ? formatEther(balance.value) : '0'
  
  // 网络状态
  const networkStatus = {
    chainId,
    isCorrectChain,
    targetChain: monadTestnet,
  }
  
  return {
    // 基础状态 (与Mock接口保持一致)
    isConnected: isConnected && isCorrectChain, // 只有在正确网络才算完全连接
    address: address || null,
    balance: balance?.value || BigInt(0),
    chainId,
    isConnecting,
    error: null, // 暂时简化，可以后续添加错误处理
    
    // 操作函数 (与Mock接口保持一致)
    connect,
    disconnect: handleDisconnect,
    switchAccount,
    setBalance: () => {}, // Web3环境中余额不能手动设置
    clearError: () => {}, // 暂时简化
    
    // 扩展信息
    formattedBalance,
    networkStatus,
    
    // 原始wagmi hooks (供高级用法)
    rawAccount: { address, isConnected, isConnecting },
    rawBalance: balance,
  }
}

// 导出类型定义
export type WalletState = ReturnType<typeof useWallet>
