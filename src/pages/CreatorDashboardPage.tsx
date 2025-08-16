import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BarChart3, Wallet, TrendingUp, Users, DollarSign, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { useCreatorCampaigns, useCreateCampaign, useManageCampaign } from '@/hooks/useCampaigns'
import { useUserStats } from '@/hooks/useVouchers'
import { useMockWallet } from '@/hooks/useMockWallet'
import { formatEthAmount } from '@/services/mockApi'
import { CampaignKind } from '@/types'

export function CreatorDashboardPage() {
  const { isConnected, address } = useMockWallet()
  const { campaigns: myCampaigns, loading, error, refetch } = useCreatorCampaigns(address || undefined)
  const { stats, loading: statsLoading } = useUserStats(address || undefined)
  const { create, loading: creating, error: createError } = useCreateCampaign()
  const { setPaused, loading: managing } = useManageCampaign()
  
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'analytics'>('campaigns')
  
  // 创建活动表单状态
  const [formData, setFormData] = useState({
    kind: CampaignKind.Tweet,
    name: '',
    description: '',
    basePrice: '',
    supply: '',
    creatorHandle: '',
    showcaseUrl: ''
  })

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    try {
      const campaignData = {
        kind: formData.kind,
        name: formData.name.trim(),
        description: formData.description.trim(),
        basePrice: BigInt(Math.floor(parseFloat(formData.basePrice) * 1e18)),
        supply: parseInt(formData.supply),
        creatorHandle: formData.creatorHandle.trim(),
        showcaseUrl: formData.showcaseUrl.trim() || undefined
      }
      
      await create(campaignData)
      
      // 重置表单
      setFormData({
        kind: CampaignKind.Tweet,
        name: '',
        description: '',
        basePrice: '',
        supply: '',
        creatorHandle: '',
        showcaseUrl: ''
      })
      
      setActiveTab('campaigns')
      refetch()
    } catch (err) {
      console.error('创建活动失败:', err)
    }
  }

  const handleTogglePause = async (campaignId: string, currentPaused: boolean) => {
    try {
      await setPaused(campaignId, !currentPaused)
      refetch()
    } catch (err) {
      console.error('切换状态失败:', err)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold mb-2">请连接钱包</h3>
        <p className="text-base-content/70 mb-4">
          连接钱包后即可管理您的创作者活动
        </p>
        <Link to="/" className="btn btn-primary">
          去探索活动
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            创作者面板
          </h1>
          <div className="absolute inset-0 bg-gradient-glow opacity-50 blur-3xl -z-10"></div>
        </div>
        <p className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
          将您个人IP（个人品牌）的未来影响力预期代币化，提前获得现金流和粉丝支持
        </p>
      </div>

      {/* 收益统计概览 */}
      {!statsLoading && (
        <div className="stats stats-vertical lg:stats-horizontal shadow-web3 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="stat-title">总活动数</div>
            <div className="stat-value text-primary">{stats.totalCampaigns}</div>
            <div className="stat-desc">已创建的活动</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="stat-title">总收益</div>
            <div className="stat-value text-secondary font-mono">
              {formatEthAmount(stats.totalEarnings)} ETH
            </div>
            <div className="stat-desc">累计获得收益</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">总销量</div>
            <div className="stat-value text-accent">
              {myCampaigns.reduce((sum, c) => sum + c.sold, 0)}
            </div>
            <div className="stat-desc">权益凭证销售数量</div>
          </div>
        </div>
      )}

      {/* 标签页导航 */}
      <div className="tabs tabs-boxed justify-center bg-gradient-card border border-primary/20">
        <button 
          className={`tab tab-lg ${activeTab === 'campaigns' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          我的活动
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'create' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          创建活动
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'analytics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          数据分析
        </button>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold mb-2">加载失败</h3>
              <p className="text-base-content/70 mb-4">{error}</p>
              <button onClick={refetch} className="btn btn-primary">重试</button>
            </div>
          ) : myCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">暂无活动</h3>
              <p className="text-base-content/70 mb-4">
                您还没有创建任何影响力活动
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('create')}
              >
                创建第一个活动
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myCampaigns.map((campaign) => (
                <div key={campaign.id} className="card bg-gradient-card border border-primary/20 shadow-web3">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="card-title text-lg">
                        {campaign.metaURI?.name}
                      </h3>
                      <div className={`badge badge-lg ${campaign.paused ? 'badge-warning' : 'badge-success'}`}>
                        {campaign.paused ? '⏸️ 已暂停' : '▶️ 进行中'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-base-content/70 mb-4">
                      {campaign.metaURI?.description}
                    </p>
                    
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-2 bg-base-100 rounded">
                        <div className="text-xs text-base-content/60">已售</div>
                        <div className="text-lg font-bold text-primary">{campaign.sold}</div>
                      </div>
                      <div className="text-center p-2 bg-base-100 rounded">
                        <div className="text-xs text-base-content/60">总量</div>
                        <div className="text-lg font-bold">{campaign.supply}</div>
                      </div>
                      <div className="text-center p-2 bg-base-100 rounded">
                        <div className="text-xs text-base-content/60">单价</div>
                        <div className="text-sm font-mono">{formatEthAmount(campaign.basePrice)}</div>
                      </div>
                      <div className="text-center p-2 bg-base-100 rounded">
                        <div className="text-xs text-base-content/60">收益</div>
                        <div className="text-sm font-bold text-secondary font-mono">
                          {formatEthAmount(campaign.basePrice * BigInt(campaign.sold))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-base-300 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-web3 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(campaign.sold / campaign.supply) * 100}%` }}
                      />
                    </div>
                    
                    <div className="card-actions justify-between">
                      <Link 
                        to={`/campaigns/${campaign.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        查看
                      </Link>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleTogglePause(campaign.id, campaign.paused)}
                          disabled={managing}
                        >
                          {campaign.paused ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {campaign.paused ? '恢复' : '暂停'}
                        </button>
                        <button className="btn btn-sm btn-primary">
                          <Wallet className="w-3 h-3 mr-1" />
                          提现
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto">
          <div className="card bg-gradient-card border border-primary/20 shadow-web3">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 gradient-text">🚀 创建新活动</h2>
              
              <form onSubmit={handleCreateCampaign} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">活动类型 *</span>
                    </label>
                    <select 
                      className="select select-bordered input-web3"
                      value={formData.kind}
                      onChange={(e) => setFormData(prev => ({ ...prev, kind: Number(e.target.value) as CampaignKind }))}
                    >
                      <option value={CampaignKind.Tweet}>🐦 Tweet - 发布一条推文</option>
                      <option value={CampaignKind.Quote}>🔄 Quote - 引用转推</option>
                      <option value={CampaignKind.Reply}>💬 Reply - 回复评论</option>
                    </select>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">创作者名称 *</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="@your_handle" 
                      className="input input-bordered input-web3"
                      value={formData.creatorHandle}
                      onChange={(e) => setFormData(prev => ({ ...prev, creatorHandle: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">活动名称 *</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="例如：IPIPO #1 — Tweet" 
                    className="input input-bordered input-web3" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">活动描述 *</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered input-web3 h-24" 
                    placeholder="预售您个人IP（个人品牌）未来的影响力服务：描述推文主题、发布承诺、交付时间等，让早期支持者了解他们预购的注意力价值..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">基础价格 (ETH) *</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.001"
                      placeholder="0.1" 
                      className="input input-bordered input-web3" 
                      value={formData.basePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">总供应量 *</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      className="input input-bordered input-web3" 
                      value={formData.supply}
                      onChange={(e) => setFormData(prev => ({ ...prev, supply: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">展示推文链接 (可选)</span>
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://x.com/your_handle/status/123456" 
                    className="input input-bordered input-web3" 
                    value={formData.showcaseUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, showcaseUrl: e.target.value }))}
                  />
                  <label className="label">
                    <span className="label-text-alt">💡 用于展示您的影响力水平，帮助买家了解您的推文质量</span>
                  </label>
                </div>

                {createError && (
                  <div className="alert alert-error">
                    <span>{createError}</span>
                  </div>
                )}
                
                <div className="card-actions justify-end pt-6">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setActiveTab('campaigns')}
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-web3"
                    disabled={creating || !formData.name || !formData.description || !formData.basePrice || !formData.supply || !formData.creatorHandle}
                  >
                    {creating && <span className="loading loading-spinner loading-sm"></span>}
                    {creating ? '创建中...' : '创建活动'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-card border border-primary/20 shadow-web3">
              <div className="card-body text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">活动表现</h3>
                <div className="stat-value text-primary">{myCampaigns.length}</div>
                <p className="text-sm text-base-content/60">总活动数</p>
              </div>
            </div>
            
            <div className="card bg-gradient-card border border-primary/20 shadow-web3">
              <div className="card-body text-center">
                <DollarSign className="w-12 h-12 mx-auto text-secondary mb-2" />
                <h3 className="text-lg font-semibold">收益统计</h3>
                <div className="stat-value text-secondary font-mono">
                  {formatEthAmount(stats.totalEarnings)}
                </div>
                <p className="text-sm text-base-content/60">总收益 (ETH)</p>
              </div>
            </div>
            
            <div className="card bg-gradient-card border border-primary/20 shadow-web3">
              <div className="card-body text-center">
                <Users className="w-12 h-12 mx-auto text-accent mb-2" />
                <h3 className="text-lg font-semibold">销售数据</h3>
                <div className="stat-value text-accent">
                  {myCampaigns.reduce((total, c) => total + c.sold, 0)}
                </div>
                <p className="text-sm text-base-content/60">总销量</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-card border border-primary/20 shadow-web3">
            <div className="card-body">
              <h3 className="card-title mb-4">📊 活动收益明细</h3>
              {myCampaigns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>活动名称</th>
                        <th>类型</th>
                        <th>单价</th>
                        <th>已售</th>
                        <th>收益</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myCampaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="font-medium">{campaign.metaURI?.name}</td>
                          <td>
                            <div className="badge badge-sm">
                              {campaign.kindLabel}
                            </div>
                          </td>
                          <td className="font-mono">{formatEthAmount(campaign.basePrice)} ETH</td>
                          <td>{campaign.sold}/{campaign.supply}</td>
                          <td className="font-mono text-secondary font-bold">
                            {formatEthAmount(campaign.basePrice * BigInt(campaign.sold))} ETH
                          </td>
                          <td>
                            <Link 
                              to={`/campaigns/${campaign.id}`}
                              className="btn btn-ghost btn-xs"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-base-content/60">暂无数据</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
