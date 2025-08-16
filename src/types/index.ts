// 活动类型枚举
export enum CampaignKind {
  Tweet = 0,
  Quote = 1,
  Reply = 2,
}

// 活动状态
export enum CampaignStatus {
  Active = 'active',
  Paused = 'paused',
  SoldOut = 'sold_out',
}

// 核销状态
export enum RedemptionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Rejected = 'rejected',
}

// 活动数据结构
export interface Campaign {
  id: string
  creator: string
  creatorHandle: string
  creatorAvatar?: string
  kind: CampaignKind
  kindLabel: string
  basePrice: bigint
  priceStep: bigint
  supply: number
  sold: number
  paused: boolean
  status: CampaignStatus
  createdAt: string
  metaURI?: CampaignMeta
}

// 活动元数据
export interface CampaignMeta {
  name: string
  description: string
  external_url: string // X主页链接
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

// 代金券数据
export interface Voucher {
  campaignId: string
  campaign: Campaign
  balance: number
  totalPurchased: number
  totalRedeemed: number
  purchaseHistory: Purchase[]
  redemptionHistory: Redemption[]
}

// 购买记录
export interface Purchase {
  id: string
  campaignId: string
  buyer: string
  amount: number
  unitPrice: bigint
  totalPaid: bigint
  timestamp: string
  txHash: string
}

// 核销记录
export interface Redemption {
  id: string
  campaignId: string
  redeemer: string
  proofURL: string
  status: RedemptionStatus
  timestamp: string
  txHash: string
  note?: string
}

// 持有者信息
export interface Holder {
  address: string
  balance: number
  percentage: number
  firstPurchaseAt: string
  totalPurchased: number
  totalRedeemed: number
}

// 用户数据
export interface User {
  address: string
  ensName?: string
  avatar?: string
  isCreator: boolean
  totalCampaigns: number
  totalEarnings: bigint
  totalSpent: bigint
  reputation: {
    deliveryRate: number // 交付率
    avgDeliveryTime: number // 平均交付时间(小时)
    totalDeliveries: number
  }
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 分页数据
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 筛选和排序参数
export interface ExploreFilters {
  kind?: CampaignKind[]
  status?: CampaignStatus[]
  priceRange?: {
    min: bigint
    max: bigint
  }
  creator?: string
  search?: string
}

export interface SortOptions {
  field: 'created_at' | 'price' | 'sold' | 'remaining'
  direction: 'asc' | 'desc'
}
