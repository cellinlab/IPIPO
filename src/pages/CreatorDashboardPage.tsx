import { useState, useEffect } from 'react'
import { Campaign } from '@/types'
import { mockCampaigns } from '@/data/mockData'
import { useMockWallet } from '@/hooks/useMockWallet'
import { Plus, BarChart3, Settings, Wallet } from 'lucide-react'

export function CreatorDashboardPage() {
  const { isConnected, address } = useMockWallet()
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'analytics'>('campaigns')

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      if (isConnected) {
        // 过滤出当前用户创建的活动
        const userCampaigns = mockCampaigns.filter(c => c.creator === address)
        setMyCampaigns(userCampaigns)
      } else {
        setMyCampaigns([])
      }
      setLoading(false)
    }

    fetchMyCampaigns()
  }, [isConnected, address])

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold mb-2">请连接钱包</h3>
        <p className="text-base-content/70">
          连接钱包后即可管理您的创作者活动
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">创作者面板</h1>
        <p className="text-lg text-base-content/70">
          管理您的影响力活动，追踪收益表现
        </p>
      </div>

      {/* 标签页导航 */}
      <div className="tabs tabs-boxed justify-center">
        <button 
          className={`tab ${activeTab === 'campaigns' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          我的活动
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          创建活动
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
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
                <div key={campaign.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">
                      {campaign.metaURI?.name}
                      <div className={`badge ${campaign.paused ? 'badge-warning' : 'badge-success'}`}>
                        {campaign.paused ? '已暂停' : '进行中'}
                      </div>
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 my-4">
                      <div className="text-center">
                        <div className="text-xs text-base-content/70">已售</div>
                        <div className="text-lg font-bold">{campaign.sold}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-base-content/70">总量</div>
                        <div className="text-lg font-bold">{campaign.supply}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-base-content/70">收益</div>
                        <div className="text-lg font-bold">
                          {(Number(campaign.basePrice) * campaign.sold / 1e18).toFixed(2)} ETH
                        </div>
                      </div>
                    </div>
                    
                    <div className="progress progress-primary mb-4">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${(campaign.sold / campaign.supply) * 100}%` }}
                      />
                    </div>
                    
                    <div className="card-actions justify-end">
                      <button className="btn btn-sm btn-outline">
                        <Settings className="w-4 h-4 mr-1" />
                        管理
                      </button>
                      <button className="btn btn-sm btn-primary">
                        <Wallet className="w-4 h-4 mr-1" />
                        提现
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">创建新活动</h2>
              
              <form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">活动类型</span>
                  </label>
                  <select className="select select-bordered">
                    <option>Tweet - 发布一条推文</option>
                    <option>Quote - 引用转推</option>
                    <option>Reply - 回复评论</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">活动名称</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="例如：IPIPO #1 — Tweet" 
                    className="input input-bordered" 
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">活动描述</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-24" 
                    placeholder="描述您将提供的服务内容..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">基础价格 (ETH)</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.001"
                      placeholder="0.1" 
                      className="input input-bordered" 
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">总供应量</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      className="input input-bordered" 
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">展示推文链接 (可选)</span>
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://x.com/your_handle/status/123456" 
                    className="input input-bordered" 
                  />
                  <label className="label">
                    <span className="label-text-alt">用于展示您的影响力水平</span>
                  </label>
                </div>
                
                <div className="card-actions justify-end pt-6">
                  <button type="button" className="btn btn-outline">
                    预览
                  </button>
                  <button type="submit" className="btn btn-primary">
                    创建活动
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">总活动数</div>
              <div className="stat-value">{myCampaigns.length}</div>
              <div className="stat-desc">本月 +2</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">总收益</div>
              <div className="stat-value">
                {myCampaigns.reduce((total, c) => total + (Number(c.basePrice) * c.sold / 1e18), 0).toFixed(2)} ETH
              </div>
              <div className="stat-desc">本月 +1.2 ETH</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">总销量</div>
              <div className="stat-value">
                {myCampaigns.reduce((total, c) => total + c.sold, 0)}
              </div>
              <div className="stat-desc">本月 +45</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">收益趋势</h3>
              <div className="h-64 flex items-center justify-center text-base-content/50">
                📊 图表组件待实现
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
