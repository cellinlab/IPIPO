import { useState, useEffect, useCallback } from 'react'
import { Voucher, Redemption } from '@/types'
import { voucherApi, userApi } from '@/services/mockApi'

export function useUserVouchers(userAddress?: string) {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVouchers = useCallback(async () => {
    if (!userAddress) {
      setVouchers([])
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await voucherApi.getByUser(userAddress)
      if (response.success) {
        setVouchers(response.data)
      } else {
        setError(response.error || '获取代金券失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }, [userAddress])

  useEffect(() => {
    fetchVouchers()
  }, [fetchVouchers])

  const refetch = useCallback(() => {
    fetchVouchers()
  }, [fetchVouchers])

  return {
    vouchers,
    loading,
    error,
    refetch,
  }
}

export function useRedeemVoucher() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redeem = useCallback(async (campaignId: string, proofURL: string): Promise<Redemption> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await voucherApi.redeem(campaignId, proofURL)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '核销失败')
        throw new Error(response.error || '核销失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    redeem,
    loading,
    error,
    clearError,
  }
}

export function useUserStats(userAddress?: string) {
  const [stats, setStats] = useState<{
    totalCampaigns: number
    totalEarnings: bigint
    totalSpent: bigint
    totalVouchers: number
  }>({
    totalCampaigns: 0,
    totalEarnings: BigInt(0),
    totalSpent: BigInt(0),
    totalVouchers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!userAddress) {
      setStats({
        totalCampaigns: 0,
        totalEarnings: BigInt(0),
        totalSpent: BigInt(0),
        totalVouchers: 0,
      })
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await userApi.getStats(userAddress)
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error || '获取用户统计失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }, [userAddress])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refetch = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch,
  }
}
