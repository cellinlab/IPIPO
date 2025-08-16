import { useState, useEffect, useCallback } from 'react'
import { Campaign, ExploreFilters, SortOptions, PaginatedData } from '@/types'
import { campaignApi } from '@/services/mockApi'

export function useCampaigns(
  filters?: ExploreFilters,
  sort?: SortOptions,
  page = 1,
  pageSize = 12
) {
  const [data, setData] = useState<PaginatedData<Campaign>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    hasMore: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignApi.getAll(filters, sort, page, pageSize)
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.error || '获取活动列表失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page, pageSize])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const refetch = useCallback(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  return {
    campaigns: data.items,
    total: data.total,
    hasMore: data.hasMore,
    loading,
    error,
    refetch,
  }
}

export function useCampaign(id: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaign = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignApi.getById(id)
      if (response.success) {
        setCampaign(response.data)
      } else {
        setError(response.error || '获取活动详情失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCampaign()
  }, [fetchCampaign])

  const refetch = useCallback(() => {
    fetchCampaign()
  }, [fetchCampaign])

  return {
    campaign,
    loading,
    error,
    refetch,
  }
}

export function useCreatorCampaigns(creatorAddress?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async () => {
    if (!creatorAddress) {
      setCampaigns([])
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignApi.getByCreator(creatorAddress)
      if (response.success) {
        setCampaigns(response.data)
      } else {
        setError(response.error || '获取创作者活动失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }, [creatorAddress])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const refetch = useCallback(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  return {
    campaigns,
    loading,
    error,
    refetch,
  }
}

// 购买代金券的Hook
export function useBuyCampaign() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buy = useCallback(async (campaignId: string, amount: number, totalPaid: bigint) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignApi.buy(campaignId, amount, totalPaid)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '购买失败')
        throw new Error(response.error || '购买失败')
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
    buy,
    loading,
    error,
    clearError,
  }
}

// 创建活动的Hook
export function useCreateCampaign() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (campaignData: Parameters<typeof campaignApi.create>[0]) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignApi.create(campaignData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '创建活动失败')
        throw new Error(response.error || '创建活动失败')
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
    create,
    loading,
    error,
    clearError,
  }
}

// 管理活动状态的Hook
export function useManageCampaign() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setPaused = useCallback(async (campaignId: string, paused: boolean) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignApi.setPaused(campaignId, paused)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '操作失败')
        throw new Error(response.error || '操作失败')
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
    setPaused,
    loading,
    error,
    clearError,
  }
}
