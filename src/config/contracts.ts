// IPIPO 合约配置
export const IPIPO_CONTRACT_CONFIG = {
  // 合约地址 - 部署后更新
  address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  
  // 部署区块 - 用于事件扫描起始点
  deploymentBlock: 0n,
  
  // 主要ABI函数签名 - 从编译后的合约中提取
  abi: [
    // 视图函数
    {
      type: 'function',
      name: 'campaigns',
      stateMutability: 'view',
      inputs: [{ name: 'campaignId', type: 'uint256' }],
      outputs: [
        { name: 'id', type: 'uint256' },
        { name: 'creator', type: 'address' },
        { name: 'creatorHandle', type: 'string' },
        { name: 'kind', type: 'uint8' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'basePrice', type: 'uint256' },
        { name: 'priceStep', type: 'uint256' },
        { name: 'supply', type: 'uint256' },
        { name: 'sold', type: 'uint256' },
        { name: 'paused', type: 'bool' },
        { name: 'createdAt', type: 'uint256' },
        { name: 'metaURI', type: 'string' }
      ]
    },
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [
        { name: 'account', type: 'address' },
        { name: 'id', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'uint256' }]
    },
    {
      type: 'function',
      name: 'getCampaignsByCreator',
      stateMutability: 'view',
      inputs: [{ name: 'creator', type: 'address' }],
      outputs: [{ name: '', type: 'uint256[]' }]
    },
    {
      type: 'function',
      name: 'getCampaignStatus',
      stateMutability: 'view',
      inputs: [{ name: 'campaignId', type: 'uint256' }],
      outputs: [{ name: '', type: 'uint8' }]
    },
    {
      type: 'function',
      name: 'getNextCampaignId',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }]
    },
    {
      type: 'function',
      name: 'redemptions',
      stateMutability: 'view',
      inputs: [{ name: 'redemptionId', type: 'uint256' }],
      outputs: [
        { name: 'id', type: 'uint256' },
        { name: 'campaignId', type: 'uint256' },
        { name: 'redeemer', type: 'address' },
        { name: 'proofURL', type: 'string' },
        { name: 'status', type: 'uint8' },
        { name: 'timestamp', type: 'uint256' }
      ]
    },
    {
      type: 'function',
      name: 'getRedemptionsByCampaign',
      stateMutability: 'view',
      inputs: [{ name: 'campaignId', type: 'uint256' }],
      outputs: [{ name: '', type: 'uint256[]' }]
    },
    
    // 写入函数
    {
      type: 'function',
      name: 'createCampaign',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'kind', type: 'uint8' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'creatorHandle', type: 'string' },
        { name: 'basePrice', type: 'uint256' },
        { name: 'supply', type: 'uint256' },
        { name: 'metaURI', type: 'string' }
      ],
      outputs: [{ name: '', type: 'uint256' }]
    },
    {
      type: 'function',
      name: 'purchaseVouchers',
      stateMutability: 'payable',
      inputs: [
        { name: 'campaignId', type: 'uint256' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: []
    },
    {
      type: 'function',
      name: 'redeemVoucher',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'campaignId', type: 'uint256' },
        { name: 'proofURL', type: 'string' }
      ],
      outputs: []
    },
    {
      type: 'function',
      name: 'setCampaignPaused',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'campaignId', type: 'uint256' },
        { name: 'paused', type: 'bool' }
      ],
      outputs: []
    },
    {
      type: 'function',
      name: 'withdrawProceeds',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'campaignId', type: 'uint256' }],
      outputs: []
    },
    
    // 事件
    {
      type: 'event',
      name: 'CampaignCreated',
      inputs: [
        { name: 'campaignId', type: 'uint256', indexed: true },
        { name: 'creator', type: 'address', indexed: true },
        { name: 'kind', type: 'uint8', indexed: false },
        { name: 'name', type: 'string', indexed: false },
        { name: 'basePrice', type: 'uint256', indexed: false },
        { name: 'supply', type: 'uint256', indexed: false }
      ]
    },
    {
      type: 'event',
      name: 'VouchersPurchased',
      inputs: [
        { name: 'campaignId', type: 'uint256', indexed: true },
        { name: 'buyer', type: 'address', indexed: true },
        { name: 'amount', type: 'uint256', indexed: false },
        { name: 'totalPaid', type: 'uint256', indexed: false }
      ]
    },
    {
      type: 'event',
      name: 'VoucherRedeemed',
      inputs: [
        { name: 'campaignId', type: 'uint256', indexed: true },
        { name: 'redemptionId', type: 'uint256', indexed: true },
        { name: 'redeemer', type: 'address', indexed: true },
        { name: 'proofURL', type: 'string', indexed: false }
      ]
    },
    {
      type: 'event',
      name: 'CampaignPaused',
      inputs: [
        { name: 'campaignId', type: 'uint256', indexed: true },
        { name: 'paused', type: 'bool', indexed: false }
      ]
    },
    {
      type: 'event',
      name: 'ProceedsWithdrawn',
      inputs: [
        { name: 'campaignId', type: 'uint256', indexed: true },
        { name: 'creator', type: 'address', indexed: true },
        { name: 'amount', type: 'uint256', indexed: false }
      ]
    }
  ]
} as const;

// 枚举对应合约中的enum
export enum CampaignKind {
  Tweet = 0,
  Quote = 1,
  Reply = 2
}

export enum CampaignStatus {
  Active = 0,
  Paused = 1,
  SoldOut = 2,
  Ended = 3
}

export enum RedemptionStatus {
  Pending = 0,
  Completed = 1,
  Disputed = 2
}
