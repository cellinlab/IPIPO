import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExploreFilters, SortOptions, CampaignKind, CampaignStatus } from '@/types'
import { useCampaigns } from '@/hooks/useCampaigns'
import { formatEthAmount } from '@/services/mockApi'

export function ExplorePage() {
  const [filters, setFilters] = useState<ExploreFilters>({})
  const [sortBy, setSortBy] = useState<SortOptions>({
    field: 'created_at',
    direction: 'desc'
  })

  const { campaigns, loading, error, refetch } = useCampaigns(filters, sortBy)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">加载失败</h3>
        <p className="text-base-content/70 mb-4">{error}</p>
        <button onClick={refetch} className="btn btn-primary">
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 float-animate">
            探索影响力活动
          </h1>
          <div className="absolute inset-0 bg-gradient-glow opacity-50 blur-3xl -z-10"></div>
        </div>
        <p className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
          发现创作者的未来影响力，以更低成本锁定优质内容曝光机会
        </p>
        <div className="flex justify-center gap-2 text-sm text-base-content/60">
          <span className="px-3 py-1 bg-primary/10 rounded-full">🚀 Web3原生</span>
          <span className="px-3 py-1 bg-secondary/10 rounded-full">💎 链上透明</span>
          <span className="px-3 py-1 bg-accent/10 rounded-full">⚡ 即时交易</span>
        </div>
      </div>

      {/* 筛选和排序 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <select 
                className="select select-bordered select-sm input-web3"
                value={filters.kind?.[0] ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters(prev => ({
                    ...prev,
                    kind: value ? [Number(value) as CampaignKind] : undefined
                  }))
                }}
              >
                <option value="">🎯 所有类型</option>
                <option value={CampaignKind.Tweet}>🐦 Tweet</option>
                <option value={CampaignKind.Quote}>🔄 Quote</option>
                <option value={CampaignKind.Reply}>💬 Reply</option>
              </select>
              
              <select 
                className="select select-bordered select-sm input-web3"
                value={filters.status?.[0] ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters(prev => ({
                    ...prev,
                    status: value ? [value as CampaignStatus] : undefined
                  }))
                }}
              >
                <option value="">📊 所有状态</option>
                <option value={CampaignStatus.Active}>🟢 进行中</option>
                <option value={CampaignStatus.Paused}>🟡 已暂停</option>
                <option value={CampaignStatus.SoldOut}>🔴 已售罄</option>
              </select>
              
              <input
                type="text"
                placeholder="🔍 搜索创作者或活动..."
                className="input input-bordered input-sm w-52 input-web3"
                value={filters.search ?? ''}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    search: e.target.value || undefined
                  }))
                }}
              />
            </div>
            
            <div className="flex gap-3">
              <select 
                className="select select-bordered select-sm input-web3"
                value={`${sortBy.field}-${sortBy.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-')
                  setSortBy({ 
                    field: field as SortOptions['field'], 
                    direction: direction as 'asc' | 'desc' 
                  })
                }}
              >
                <option value="created_at-desc">⏰ 最新创建</option>
                <option value="created_at-asc">📅 最早创建</option>
                <option value="price-asc">💰 价格最低</option>
                <option value="price-desc">💎 价格最高</option>
                <option value="sold-desc">🔥 最热销</option>
                <option value="remaining-asc">⚡ 即将售罄</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 活动列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign, index) => (
          <div 
            key={campaign.id} 
            className="card bg-gradient-card border border-primary/20 shadow-web3 card-hover"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-body p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                    <img 
                      src={campaign.creatorAvatar || '/default-avatar.png'} 
                      alt={campaign.creatorHandle}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{campaign.creatorHandle}</h3>
                  <div className={`badge badge-sm font-medium ${
                    campaign.kind === CampaignKind.Tweet ? 'badge-primary' :
                    campaign.kind === CampaignKind.Quote ? 'badge-secondary' :
                    'badge-accent'
                  }`}>
                    {campaign.kind === CampaignKind.Tweet ? '🐦' :
                     campaign.kind === CampaignKind.Quote ? '🔄' : '💬'} {campaign.kindLabel}
                  </div>
                </div>
              </div>
              
              <p className="text-base-content/80 mb-6 line-clamp-2 leading-relaxed">
                {campaign.metaURI?.description || '暂无描述'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="text-xs text-base-content/60 mb-1">💰 当前价格</div>
                  <div className="text-lg font-bold text-primary font-mono">
                    {formatEthAmount(campaign.basePrice)} ETH
                  </div>
                </div>
                <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                  <div className="text-xs text-base-content/60 mb-1">📊 剩余数量</div>
                  <div className="text-lg font-bold text-secondary">
                    {campaign.supply - campaign.sold}/{campaign.supply}
                  </div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-base-content/60 mb-2">
                  <span>销售进度</span>
                  <span>{Math.round((campaign.sold / campaign.supply) * 100)}%</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="bg-gradient-web3 h-3 rounded-full transition-all duration-500 relative overflow-hidden" 
                    style={{ width: `${(campaign.sold / campaign.supply) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="card-actions justify-between gap-3">
                <Link 
                  to={`/campaigns/${campaign.id}`}
                  className="btn btn-outline btn-sm flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  📋 查看详情
                </Link>
                <button 
                  className={`btn btn-sm flex-1 ${
                    campaign.paused || campaign.sold >= campaign.supply 
                      ? 'btn-disabled' 
                      : 'btn-web3'
                  }`}
                  disabled={campaign.paused || campaign.sold >= campaign.supply}
                >
                  {campaign.paused ? '⏸️ 已暂停' : 
                   campaign.sold >= campaign.supply ? '🔴 已售罄' : 
                   '🚀 立即购买'}
                </button>
              </div>
            </div>
            
            {/* 发光效果 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-web3 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">暂无活动</h3>
          <p className="text-base-content/70">
            当前没有符合条件的活动，请调整筛选条件或稍后再试
          </p>
        </div>
      )}
    </div>
  )
}
