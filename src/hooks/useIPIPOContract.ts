import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { IPIPO_CONTRACT_CONFIG, CampaignKind } from '@/config/contracts'
import { CONTRACT_CONFIG } from '@/config/web3'
import { parseEther } from 'viem'

/**
 * IPIPO合约交互Hook
 * 提供合约的读取和写入功能
 */

// ===== 读取函数 =====

// 获取活动信息
export function useCampaign(campaignId: number | string) {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'campaigns',
    args: [BigInt(campaignId)],
    query: {
      enabled: !!campaignId && campaignId !== '0',
    }
  })
}

// 获取用户在某个活动中的权益凭证余额
export function useVoucherBalance(userAddress?: `0x${string}`, campaignId?: number | string) {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'balanceOf',
    args: userAddress && campaignId ? [userAddress, BigInt(campaignId)] : undefined,
    query: {
      enabled: !!userAddress && !!campaignId,
    }
  })
}

// 获取创作者的活动列表
export function useCreatorCampaigns(creatorAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'getCampaignsByCreator',
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: !!creatorAddress,
    }
  })
}

// 获取活动状态
export function useCampaignStatus(campaignId: number | string) {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'getCampaignStatus',
    args: [BigInt(campaignId)],
    query: {
      enabled: !!campaignId && campaignId !== '0',
    }
  })
}

// 获取下一个活动ID
export function useNextCampaignId() {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'getNextCampaignId',
  })
}

// 获取核销记录
export function useRedemption(redemptionId: number | string) {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'redemptions',
    args: [BigInt(redemptionId)],
    query: {
      enabled: !!redemptionId && redemptionId !== '0',
    }
  })
}

// 获取活动的核销记录列表
export function useCampaignRedemptions(campaignId: number | string) {
  return useReadContract({
    address: CONTRACT_CONFIG.IPIPO_ADDRESS,
    abi: IPIPO_CONTRACT_CONFIG.abi,
    functionName: 'getRedemptionsByCampaign',
    args: [BigInt(campaignId)],
    query: {
      enabled: !!campaignId && campaignId !== '0',
    }
  })
}

// ===== 写入函数 =====

// 创建活动
export function useCreateCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createCampaign = async (params: {
    kind: CampaignKind
    name: string
    description: string
    creatorHandle: string
    basePrice: string // ETH amount as string
    supply: number
    metaURI?: string
  }) => {
    try {
      const priceInWei = parseEther(params.basePrice)
      const metaURI = params.metaURI || `ipfs://QmDefault${Date.now()}` // 临时IPFS URI
      
      await writeContract({
        address: CONTRACT_CONFIG.IPIPO_ADDRESS,
        abi: IPIPO_CONTRACT_CONFIG.abi,
        functionName: 'createCampaign',
        args: [
          params.kind,
          params.name,
          params.description,
          params.creatorHandle,
          priceInWei,
          BigInt(params.supply),
          metaURI
        ],
      })
    } catch (err) {
      console.error('创建活动失败:', err)
      throw err
    }
  }

  return {
    createCampaign,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error
  }
}

// 购买权益凭证
export function usePurchaseVouchers() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const purchaseVouchers = async (campaignId: number | string, amount: number, pricePerVoucher: string) => {
    try {
      const totalPrice = parseEther((parseFloat(pricePerVoucher) * amount).toString())
      
      await writeContract({
        address: CONTRACT_CONFIG.IPIPO_ADDRESS,
        abi: IPIPO_CONTRACT_CONFIG.abi,
        functionName: 'purchaseVouchers',
        args: [BigInt(campaignId), BigInt(amount)],
        value: totalPrice,
      })
    } catch (err) {
      console.error('购买权益凭证失败:', err)
      throw err
    }
  }

  return {
    purchaseVouchers,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error
  }
}

// 核销权益凭证
export function useRedeemVoucher() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const redeemVoucher = async (campaignId: number | string, proofURL: string) => {
    try {
      await writeContract({
        address: CONTRACT_CONFIG.IPIPO_ADDRESS,
        abi: IPIPO_CONTRACT_CONFIG.abi,
        functionName: 'redeemVoucher',
        args: [BigInt(campaignId), proofURL],
      })
    } catch (err) {
      console.error('核销权益凭证失败:', err)
      throw err
    }
  }

  return {
    redeemVoucher,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error
  }
}

// 暂停/恢复活动
export function useManageCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const setCampaignPaused = async (campaignId: number | string, paused: boolean) => {
    try {
      await writeContract({
        address: CONTRACT_CONFIG.IPIPO_ADDRESS,
        abi: IPIPO_CONTRACT_CONFIG.abi,
        functionName: 'setCampaignPaused',
        args: [BigInt(campaignId), paused],
      })
    } catch (err) {
      console.error('管理活动失败:', err)
      throw err
    }
  }

  return {
    setCampaignPaused,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error
  }
}

// 提现收益
export function useWithdrawProceeds() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawProceeds = async (campaignId: number | string) => {
    try {
      await writeContract({
        address: CONTRACT_CONFIG.IPIPO_ADDRESS,
        abi: IPIPO_CONTRACT_CONFIG.abi,
        functionName: 'withdrawProceeds',
        args: [BigInt(campaignId)],
      })
    } catch (err) {
      console.error('提现失败:', err)
      throw err
    }
  }

  return {
    withdrawProceeds,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error
  }
}
