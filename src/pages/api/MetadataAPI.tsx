import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCampaign } from '@/hooks/useIPIPOContract'

/**
 * 动态元数据API组件
 * 处理 /api/metadata/{campaignId} 的请求
 */
export function MetadataAPI() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const { data: campaign, isLoading } = useCampaign(campaignId || '0')
  
  useEffect(() => {
    if (campaign && !isLoading) {
      // 解构campaign tuple数据
      const [, , creatorHandle, kind, name, description, basePrice, , supply, sold, paused] = campaign
      
      // 构建ERC-1155元数据
      const metadata = {
        name: name || `IPIPO Campaign #${campaignId}`,
        description: description || 'IPIPO影响力预售权益凭证',
        image: `https://ipipo.vercel.app/images/campaign-${campaignId}.png`,
        external_url: 'https://ipipo.vercel.app/',
        attributes: [
          {
            trait_type: 'Campaign Kind',
            value: ['Tweet', 'Quote', 'Reply'][Number(kind)] || 'Tweet'
          },
          {
            trait_type: 'Creator',
            value: creatorHandle || '@unknown'
          },
          {
            trait_type: 'Base Price',
            value: `${basePrice ? Number(basePrice) / 1e18 : 0} MON`
          },
          {
            trait_type: 'Supply',
            value: supply ? Number(supply) : 0
          },
          {
            trait_type: 'Sold',
            value: sold ? Number(sold) : 0
          },
          {
            trait_type: 'Status',
            value: paused ? 'Paused' : 'Active'
          }
        ],
        properties: {
          category: 'Service Voucher',
          platform: 'IPIPO',
          chain: 'Monad Testnet'
        }
      }
      
      // 在生产环境中，这应该返回JSON响应
      // 但由于这是SPA，我们通过控制台输出供参考
      console.log('Campaign Metadata:', metadata)
    }
  }, [campaign, campaignId, isLoading])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-4">加载元数据...</span>
      </div>
    )
  }
  
  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <span>Campaign #{campaignId} not found</span>
        </div>
      </div>
    )
  }
  
  // 解构campaign tuple数据
  const [, , creatorHandle, kind, name, description, basePrice, , supply, sold, paused] = campaign
  
  // 构建元数据
  const metadata = {
    name: name || `IPIPO Campaign #${campaignId}`,
    description: description || 'IPIPO影响力预售权益凭证 - 个人IP影响力代币化平台',
    image: `https://ipipo.vercel.app/images/campaign-${campaignId}.png`,
    external_url: 'https://ipipo.vercel.app/',
    attributes: [
      {
        trait_type: 'Campaign Kind',
        value: ['Tweet', 'Quote', 'Reply'][Number(kind)] || 'Tweet'
      },
      {
        trait_type: 'Creator',
        value: creatorHandle || '@unknown'
      },
      {
        trait_type: 'Base Price',
        value: `${basePrice ? Number(basePrice) / 1e18 : 0} MON`
      },
      {
        trait_type: 'Supply',
        value: supply ? Number(supply) : 0
      },
      {
        trait_type: 'Sold',
        value: sold ? Number(sold) : 0
      },
      {
        trait_type: 'Status',
        value: paused ? 'Paused' : 'Active'
      }
    ],
    properties: {
      category: 'Service Voucher',
      platform: 'IPIPO',
      chain: 'Monad Testnet',
      contract: '0xCDEA758D2D31dd07f28274db27eD24c7bf4476C0'
    }
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Campaign #{campaignId} Metadata</h2>
          <pre className="bg-base-200 p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
          <div className="card-actions justify-end">
            <button 
              className="btn btn-primary"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
                alert('Metadata copied to clipboard!')
              }}
            >
              复制JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
