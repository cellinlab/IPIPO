import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Campaign } from '@/types'
import { mockCampaigns } from '@/data/mockData'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const found = mockCampaigns.find(c => c.id === id)
      setCampaign(found || null)
      setLoading(false)
    }

    fetchCampaign()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold mb-2">活动不存在</h3>
        <p className="text-base-content/70">请检查链接是否正确</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">活动详情 #{campaign.id}</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">{campaign.metaURI?.name}</h2>
          <p className="text-base-content/70">{campaign.metaURI?.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-base-content/70">创作者</label>
                <p className="text-lg">{campaign.creatorHandle}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-base-content/70">类型</label>
                <p className="text-lg">{campaign.kindLabel}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-base-content/70">当前价格</label>
                <p className="text-lg font-bold">{Number(campaign.basePrice) / 1e18} ETH</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-base-content/70">总供应量</label>
                <p className="text-lg">{campaign.supply}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-base-content/70">已售出</label>
                <p className="text-lg">{campaign.sold}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-base-content/70">剩余</label>
                <p className="text-lg font-bold">{campaign.supply - campaign.sold}</p>
              </div>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="card-actions justify-end">
            <button className="btn btn-primary btn-lg">
              购买代金券
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
