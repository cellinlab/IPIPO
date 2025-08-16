import { Campaign, Voucher, Purchase, Redemption, ApiResponse, PaginatedData, ExploreFilters, SortOptions, CampaignKind, RedemptionStatus } from '@/types'
import { mockCampaigns, mockVouchers } from '@/data/mockData'

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API响应包装器
const createApiResponse = <T>(data: T, success = true, message?: string): ApiResponse<T> => ({
  success,
  data,
  message,
})

// 模拟错误响应
const createErrorResponse = <T>(error: string): ApiResponse<T> => ({
  success: false,
  data: {} as T,
  error,
})

// Campaign相关API
export const campaignApi = {
  // 获取所有活动（带筛选和排序）
  async getAll(filters?: ExploreFilters, sort?: SortOptions, page = 1, pageSize = 12): Promise<ApiResponse<PaginatedData<Campaign>>> {
    await delay(500) // 模拟网络延迟
    
    try {
      let filteredCampaigns = [...mockCampaigns]
      
      // 应用筛选
      if (filters) {
        if (filters.kind && filters.kind.length > 0) {
          filteredCampaigns = filteredCampaigns.filter(c => filters.kind!.includes(c.kind))
        }
        if (filters.status && filters.status.length > 0) {
          filteredCampaigns = filteredCampaigns.filter(c => filters.status!.includes(c.status))
        }
        if (filters.creator) {
          filteredCampaigns = filteredCampaigns.filter(c => 
            c.creator.toLowerCase() === filters.creator!.toLowerCase() ||
            c.creatorHandle.toLowerCase().includes(filters.creator!.toLowerCase())
          )
        }
        if (filters.search) {
          const search = filters.search.toLowerCase()
          filteredCampaigns = filteredCampaigns.filter(c =>
            c.creatorHandle.toLowerCase().includes(search) ||
            c.metaURI?.name.toLowerCase().includes(search) ||
            c.metaURI?.description.toLowerCase().includes(search)
          )
        }
        if (filters.priceRange) {
          filteredCampaigns = filteredCampaigns.filter(c =>
            c.basePrice >= filters.priceRange!.min && c.basePrice <= filters.priceRange!.max
          )
        }
      }
      
      // 应用排序
      if (sort) {
        filteredCampaigns.sort((a, b) => {
          let aValue: number, bValue: number
          
          switch (sort.field) {
            case 'created_at':
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
              break
            case 'price':
              aValue = Number(a.basePrice)
              bValue = Number(b.basePrice)
              break
            case 'sold':
              aValue = a.sold
              bValue = b.sold
              break
            case 'remaining':
              aValue = a.supply - a.sold
              bValue = b.supply - b.sold
              break
            default:
              return 0
          }
          
          return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
        })
      }
      
      // 分页
      const total = filteredCampaigns.length
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const items = filteredCampaigns.slice(startIndex, endIndex)
      
      return createApiResponse({
        items,
        total,
        page,
        pageSize,
        hasMore: endIndex < total
      })
    } catch (error) {
      return createErrorResponse(`获取活动列表失败: ${error}`)
    }
  },
  
  // 根据ID获取单个活动
  async getById(id: string): Promise<ApiResponse<Campaign | null>> {
    await delay(300)
    
    try {
      const campaign = mockCampaigns.find(c => c.id === id)
      return createApiResponse(campaign || null)
    } catch (error) {
      return createErrorResponse(`获取活动详情失败: ${error}`)
    }
  },
  
  // 根据创作者地址获取活动
  async getByCreator(creatorAddress: string): Promise<ApiResponse<Campaign[]>> {
    await delay(400)
    
    try {
      const campaigns = mockCampaigns.filter(c => 
        c.creator.toLowerCase() === creatorAddress.toLowerCase()
      )
      return createApiResponse(campaigns)
    } catch (error) {
      return createErrorResponse(`获取创作者活动失败: ${error}`)
    }
  },
  
  // 创建新活动（模拟合约调用）
  async create(campaignData: {
    kind: CampaignKind
    name: string
    description: string
    basePrice: bigint
    supply: number
    showcaseUrl?: string
    creatorHandle: string
  }): Promise<ApiResponse<Campaign>> {
    await delay(1000) // 模拟区块链交易延迟
    
    try {
      const newCampaign: Campaign = {
        id: (mockCampaigns.length + 1).toString(),
        creator: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999', // 模拟当前用户地址
        creatorHandle: campaignData.creatorHandle,
        creatorAvatar: '/avatar.png',
        kind: campaignData.kind,
        kindLabel: ['Tweet', 'Quote', 'Reply'][campaignData.kind],
        basePrice: campaignData.basePrice,
        priceStep: BigInt('0'),
        supply: campaignData.supply,
        sold: 0,
        paused: false,
        status: 'active' as any,
        createdAt: new Date().toISOString(),
        metaURI: {
          name: campaignData.name,
          description: campaignData.description,
          external_url: 'https://x.com/cellinlab',
          image: `https://picsum.photos/400/200?random=${Date.now()}`,
          attributes: [
            { trait_type: 'Kind', value: ['Tweet', 'Quote', 'Reply'][campaignData.kind] },
            { trait_type: 'SLA', value: 'Deliver within 7 days after coordination.' },
            ...(campaignData.showcaseUrl ? [{ trait_type: 'Showcase', value: campaignData.showcaseUrl }] : [{ trait_type: 'Showcase', value: 'https://x.com/cellinlab/status/1956527249223483563' }])
          ]
        }
      }
      
      // 添加到模拟数据中（实际应用中会通过区块链事件更新）
      mockCampaigns.push(newCampaign)
      
      return createApiResponse(newCampaign, true, '活动创建成功')
    } catch (error) {
      return createErrorResponse(`创建活动失败: ${error}`)
    }
  },
  
  // 购买代金券（模拟合约调用）
  async buy(campaignId: string, amount: number, totalPaid: bigint): Promise<ApiResponse<Purchase>> {
    await delay(800)
    
    try {
      const campaign = mockCampaigns.find(c => c.id === campaignId)
      if (!campaign) {
        return createErrorResponse('活动不存在')
      }
      
      if (campaign.sold + amount > campaign.supply) {
        return createErrorResponse('购买数量超过剩余供应量')
      }
      
      if (campaign.paused) {
        return createErrorResponse('活动已暂停')
      }
      
      // 创建购买记录
      const purchase: Purchase = {
        id: `p${Date.now()}`,
        campaignId,
        buyer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        amount,
        unitPrice: campaign.basePrice,
        totalPaid,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`
      }
      
      // 更新活动销量
      campaign.sold += amount
      
      return createApiResponse(purchase, true, '购买成功')
    } catch (error) {
      return createErrorResponse(`购买失败: ${error}`)
    }
  },
  
  // 暂停/恢复活动
  async setPaused(campaignId: string, paused: boolean): Promise<ApiResponse<boolean>> {
    await delay(600)
    
    try {
      const campaign = mockCampaigns.find(c => c.id === campaignId)
      if (!campaign) {
        return createErrorResponse('活动不存在')
      }
      
      campaign.paused = paused
      return createApiResponse(true, true, paused ? '活动已暂停' : '活动已恢复')
    } catch (error) {
      return createErrorResponse(`操作失败: ${error}`)
    }
  }
}

// Voucher相关API
export const voucherApi = {
  // 获取用户的代金券
  async getByUser(userAddress: string): Promise<ApiResponse<Voucher[]>> {
    await delay(600)
    
    try {
      // 模拟根据用户地址过滤代金券
      const userVouchers = mockVouchers.filter(v => 
        v.purchaseHistory.some(p => p.buyer.toLowerCase() === userAddress.toLowerCase())
      )
      
      return createApiResponse(userVouchers)
    } catch (error) {
      return createErrorResponse(`获取代金券失败: ${error}`)
    }
  },
  
  // 核销代金券
  async redeem(campaignId: string, proofURL: string): Promise<ApiResponse<Redemption>> {
    await delay(1000)
    
    try {
      const voucher = mockVouchers.find(v => v.campaignId === campaignId)
      if (!voucher) {
        return createErrorResponse('代金券不存在')
      }
      
      if (voucher.balance <= 0) {
        return createErrorResponse('代金券余额不足')
      }
      
      // 验证proof URL格式
      if (!proofURL.includes('x.com') && !proofURL.includes('twitter.com')) {
        return createErrorResponse('请提供有效的X/Twitter链接')
      }
      
      // 创建核销记录
      const redemption: Redemption = {
        id: `r${Date.now()}`,
        campaignId,
        redeemer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        proofURL,
        status: RedemptionStatus.Completed,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`
      }
      
      // 更新代金券余额
      voucher.balance -= 1
      voucher.totalRedeemed += 1
      voucher.redemptionHistory.push(redemption)
      
      return createApiResponse(redemption, true, '核销成功')
    } catch (error) {
      return createErrorResponse(`核销失败: ${error}`)
    }
  }
}

// 用户相关API
export const userApi = {
  // 获取用户统计信息
  async getStats(userAddress: string): Promise<ApiResponse<{
    totalCampaigns: number
    totalEarnings: bigint
    totalSpent: bigint
    totalVouchers: number
  }>> {
    await delay(400)
    
    try {
      const userCampaigns = mockCampaigns.filter(c => 
        c.creator.toLowerCase() === userAddress.toLowerCase()
      )
      
      const totalEarnings = userCampaigns.reduce((sum, c) => 
        sum + (c.basePrice * BigInt(c.sold)), BigInt(0)
      )
      
      const userVouchers = mockVouchers.filter(v =>
        v.purchaseHistory.some(p => p.buyer.toLowerCase() === userAddress.toLowerCase())
      )
      
      const totalSpent = userVouchers.reduce((sum, v) =>
        sum + v.purchaseHistory
          .filter(p => p.buyer.toLowerCase() === userAddress.toLowerCase())
          .reduce((vSum, p) => vSum + p.totalPaid, BigInt(0))
      , BigInt(0))
      
      const totalVouchers = userVouchers.reduce((sum, v) => sum + v.balance, 0)
      
      return createApiResponse({
        totalCampaigns: userCampaigns.length,
        totalEarnings,
        totalSpent,
        totalVouchers
      })
    } catch (error) {
      return createErrorResponse(`获取用户统计失败: ${error}`)
    }
  }
}

// 工具函数：生成随机以太坊地址
export const generateRandomAddress = (): string => {
  const chars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

// 工具函数：格式化ETH金额
export const formatEthAmount = (wei: bigint, decimals = 4): string => {
  const eth = Number(wei) / 1e18
  return eth.toFixed(decimals)
}

// 工具函数：解析ETH金额到wei
export const parseEthAmount = (eth: string): bigint => {
  const amount = parseFloat(eth)
  return BigInt(Math.floor(amount * 1e18))
}
