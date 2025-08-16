import { Campaign, CampaignKind, CampaignStatus, Voucher, RedemptionStatus, Purchase, Redemption } from '@/types'

// Mock活动数据
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    creator: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
    creatorHandle: '@crypto_alice',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    kind: CampaignKind.Tweet,
    kindLabel: 'Tweet',
    basePrice: BigInt('100000000000000000'), // 0.1 ETH
    priceStep: BigInt('0'),
    supply: 100,
    sold: 45,
    paused: false,
    status: CampaignStatus.Active,
    createdAt: '2024-01-15T10:00:00Z',
    metaURI: {
      name: 'IPIPO #1 — Tweet',
      description: '为您的项目发布一条高质量推文，7天内交付',
      external_url: 'https://x.com/crypto_alice',
      image: 'https://picsum.photos/400/200?random=1',
      attributes: [
        { trait_type: 'Kind', value: 'Tweet' },
        { trait_type: 'SLA', value: 'Deliver within 7 days after DM.' },
        { trait_type: 'Showcase', value: 'https://x.com/crypto_alice/status/12345' }
      ]
    }
  },
  {
    id: '2',
    creator: '0x8ba1f109551bD432803012645Hac136c',
    creatorHandle: '@defi_bob',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    kind: CampaignKind.Quote,
    kindLabel: 'Quote',
    basePrice: BigInt('150000000000000000'), // 0.15 ETH
    priceStep: BigInt('10000000000000000'), // 0.01 ETH
    supply: 50,
    sold: 23,
    paused: false,
    status: CampaignStatus.Active,
    createdAt: '2024-01-14T15:30:00Z',
    metaURI: {
      name: 'IPIPO #2 — Quote Tweet',
      description: '专业引用转推您的内容，带来更多曝光',
      external_url: 'https://x.com/defi_bob',
      image: 'https://picsum.photos/400/200?random=2',
      attributes: [
        { trait_type: 'Kind', value: 'Quote' },
        { trait_type: 'SLA', value: 'Deliver within 3 days after coordination.' },
        { trait_type: 'Showcase', value: 'https://x.com/defi_bob/status/54321' }
      ]
    }
  },
  {
    id: '3',
    creator: '0x1234567890123456789012345678901234567890',
    creatorHandle: '@nft_carol',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    kind: CampaignKind.Reply,
    kindLabel: 'Reply',
    basePrice: BigInt('50000000000000000'), // 0.05 ETH
    priceStep: BigInt('0'),
    supply: 200,
    sold: 180,
    paused: false,
    status: CampaignStatus.Active,
    createdAt: '2024-01-13T09:15:00Z',
    metaURI: {
      name: 'IPIPO #3 — Reply',
      description: '在您的推文下进行专业回复互动',
      external_url: 'https://x.com/nft_carol',
      image: 'https://picsum.photos/400/200?random=3',
      attributes: [
        { trait_type: 'Kind', value: 'Reply' },
        { trait_type: 'SLA', value: 'Deliver within 24 hours after request.' },
        { trait_type: 'Showcase', value: 'https://x.com/nft_carol/status/98765' }
      ]
    }
  },
  {
    id: '4',
    creator: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
    creatorHandle: '@crypto_alice',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    kind: CampaignKind.Tweet,
    kindLabel: 'Tweet',
    basePrice: BigInt('200000000000000000'), // 0.2 ETH
    priceStep: BigInt('0'),
    supply: 25,
    sold: 25,
    paused: false,
    status: CampaignStatus.SoldOut,
    createdAt: '2024-01-12T14:00:00Z',
    metaURI: {
      name: 'IPIPO #4 — Premium Tweet',
      description: '高质量推文内容，包含详细分析和见解',
      external_url: 'https://x.com/crypto_alice',
      image: 'https://picsum.photos/400/200?random=4',
      attributes: [
        { trait_type: 'Kind', value: 'Tweet' },
        { trait_type: 'SLA', value: 'Deliver within 5 days after coordination.' },
        { trait_type: 'Showcase', value: 'https://x.com/crypto_alice/status/11111' }
      ]
    }
  }
]

// Mock代金券数据
export const mockVouchers: Voucher[] = [
  {
    campaignId: '1',
    campaign: mockCampaigns[0],
    balance: 3,
    totalPurchased: 5,
    totalRedeemed: 2,
    purchaseHistory: [
      {
        id: 'p1',
        campaignId: '1',
        buyer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        amount: 3,
        unitPrice: BigInt('100000000000000000'),
        totalPaid: BigInt('300000000000000000'),
        timestamp: '2024-01-16T10:30:00Z',
        txHash: '0x1111...'
      } as Purchase,
      {
        id: 'p2',
        campaignId: '1',
        buyer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        amount: 2,
        unitPrice: BigInt('100000000000000000'),
        totalPaid: BigInt('200000000000000000'),
        timestamp: '2024-01-17T15:20:00Z',
        txHash: '0x2222...'
      } as Purchase
    ],
    redemptionHistory: [
      {
        id: 'r1',
        campaignId: '1',
        redeemer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        proofURL: 'https://x.com/crypto_alice/status/completed1',
        status: RedemptionStatus.Completed,
        timestamp: '2024-01-18T12:00:00Z',
        txHash: '0x3333...',
        note: '推文已发布，内容质量很高'
      } as Redemption,
      {
        id: 'r2',
        campaignId: '1',
        redeemer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        proofURL: 'https://x.com/crypto_alice/status/completed2',
        status: RedemptionStatus.Completed,
        timestamp: '2024-01-19T09:30:00Z',
        txHash: '0x4444...'
      } as Redemption
    ]
  },
  {
    campaignId: '2',
    campaign: mockCampaigns[1],
    balance: 1,
    totalPurchased: 2,
    totalRedeemed: 1,
    purchaseHistory: [
      {
        id: 'p3',
        campaignId: '2',
        buyer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        amount: 2,
        unitPrice: BigInt('150000000000000000'),
        totalPaid: BigInt('300000000000000000'),
        timestamp: '2024-01-15T11:15:00Z',
        txHash: '0x5555...'
      } as Purchase
    ],
    redemptionHistory: [
      {
        id: 'r3',
        campaignId: '2',
        redeemer: '0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999',
        proofURL: 'https://x.com/defi_bob/status/quote1',
        status: RedemptionStatus.Completed,
        timestamp: '2024-01-16T16:45:00Z',
        txHash: '0x6666...'
      } as Redemption
    ]
  }
]

// 辅助函数：根据ID获取活动
export function getCampaignById(id: string): Campaign | undefined {
  return mockCampaigns.find(campaign => campaign.id === id)
}

// 辅助函数：根据创作者地址获取活动
export function getCampaignsByCreator(creatorAddress: string): Campaign[] {
  return mockCampaigns.filter(campaign => campaign.creator.toLowerCase() === creatorAddress.toLowerCase())
}

// 辅助函数：获取用户的代金券
export function getVouchersByUser(_userAddress: string): Voucher[] {
  // 这里简化处理，实际应该根据用户地址过滤
  return mockVouchers
}
