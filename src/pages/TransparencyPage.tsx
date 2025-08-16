import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Users, TrendingUp, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react'
import { useCampaigns } from '@/hooks/useCampaigns'
import { formatEthAmount } from '@/services/mockApi'

// Mock持有者数据 (简化版)
const mockHolders = [
  { address: '0x1234...5678', balance: 5, percentage: 15.2 },
  { address: '0x9abc...def0', balance: 3, percentage: 9.1 },
  { address: '0x2468...ace1', balance: 2, percentage: 6.1 },
  { address: '0x1357...bdf2', balance: 2, percentage: 6.1 },
  { address: '0x8642...cea3', balance: 1, percentage: 3.0 },
]

export function TransparencyPage() {
  const { campaigns, loading } = useCampaigns()
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')

  const currentCampaign = campaigns.find(c => c.id === selectedCampaign) || campaigns[0]

  // 计算全平台统计
  const platformStats = {
    totalCampaigns: campaigns.length,
    totalSupply: campaigns.reduce((sum, c) => sum + c.supply, 0),
    totalSold: campaigns.reduce((sum, c) => sum + c.sold, 0),
    totalValue: campaigns.reduce((sum, c) => sum + (c.basePrice * BigInt(c.sold)), BigInt(0)),
    activeCampaigns: campaigns.filter(c => !c.paused && c.sold < c.supply).length,
  }

  // 超发检查
  const oversoldCampaigns = campaigns.filter(c => c.sold > c.supply)
  const hasOversold = oversoldCampaigns.length > 0

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            透明度面板
          </h1>
          <div className="absolute inset-0 bg-gradient-glow opacity-50 blur-3xl -z-10"></div>
        </div>
        <p className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
          区块链保证的完全透明 • 权益凭证供给量 • 销售记录 • 持有者分布
        </p>
      </div>

      {/* 平台总体统计 */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-web3 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">总活动数</div>
          <div className="stat-value text-primary">{platformStats.totalCampaigns}</div>
          <div className="stat-desc">{platformStats.activeCampaigns} 个活跃</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">总销量</div>
          <div className="stat-value text-secondary">{platformStats.totalSold}</div>
          <div className="stat-desc">/ {platformStats.totalSupply} 总供应</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">交易额</div>
          <div className="stat-value text-accent font-mono">
            {formatEthAmount(platformStats.totalValue)}
          </div>
          <div className="stat-desc">ETH</div>
        </div>

        <div className="stat">
          <div className={`stat-figure ${hasOversold ? 'text-error' : 'text-success'}`}>
            {hasOversold ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
          </div>
          <div className="stat-title">超发检查</div>
          <div className={`stat-value ${hasOversold ? 'text-error' : 'text-success'}`}>
            {hasOversold ? '异常' : '正常'}
          </div>
          <div className="stat-desc">
            {hasOversold ? `${oversoldCampaigns.length} 个异常` : '所有活动正常'}
          </div>
        </div>
      </div>

      {/* 活动选择器 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title mb-4">🔍 活动详细分析</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">选择活动</span>
            </label>
            <select 
              className="select select-bordered input-web3 max-w-md"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.metaURI?.name} - {campaign.creatorHandle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 活动统计 */}
          <div className="card bg-gradient-card border border-primary/20 shadow-web3">
            <div className="card-body">
              <h3 className="card-title mb-4">📊 供给与销售统计</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">活动名称</span>
                  <span className="font-semibold">{currentCampaign.metaURI?.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">创作者</span>
                  <Link 
                    to={currentCampaign.metaURI?.external_url || '#'}
                    target="_blank"
                    className="link link-primary font-semibold flex items-center gap-1"
                  >
                    {currentCampaign.creatorHandle}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">活动类型</span>
                  <div className="badge badge-primary">{currentCampaign.kindLabel}</div>
                </div>
                
                <div className="divider"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">总供应量</span>
                  <span className="text-xl font-bold">{currentCampaign.supply}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">已售数量</span>
                  <span className="text-xl font-bold text-primary">{currentCampaign.sold}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">剩余数量</span>
                  <span className="text-xl font-bold text-secondary">
                    {currentCampaign.supply - currentCampaign.sold}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">销售进度</span>
                  <span className="text-lg font-bold">
                    {((currentCampaign.sold / currentCampaign.supply) * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-base-300 rounded-full h-3">
                  <div 
                    className="bg-gradient-web3 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(currentCampaign.sold / currentCampaign.supply) * 100}%` }}
                  />
                </div>
                
                <div className="divider"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">单价</span>
                  <span className="text-lg font-mono font-bold">
                    {formatEthAmount(currentCampaign.basePrice)} ETH
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">总收益</span>
                  <span className="text-lg font-mono font-bold text-accent">
                    {formatEthAmount(currentCampaign.basePrice * BigInt(currentCampaign.sold))} ETH
                  </span>
                </div>
                
                <div className="divider"></div>
                
                {/* 超发检查 */}
                <div className="alert alert-info">
                  <ShieldCheck className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">超发检查</div>
                    <div className="text-sm">
                      {currentCampaign.sold <= currentCampaign.supply ? (
                        <span className="text-success">✅ 无超发，供应量控制正常</span>
                      ) : (
                        <span className="text-error">❌ 检测到超发！已售 {currentCampaign.sold} {'>'} 供应 {currentCampaign.supply}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 持有者列表 (Mock) */}
          <div className="card bg-gradient-card border border-primary/20 shadow-web3">
            <div className="card-body">
              <h3 className="card-title mb-4">👥 持有者分布 (Mock)</h3>
              
              <div className="alert alert-warning mb-4">
                <AlertTriangle className="w-5 h-5" />
                <div className="text-sm">
                  <strong>演示说明：</strong> 实际项目中会扫描区块链 Transfer 事件计算真实持有者分布
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-base-content/70">
                  <span>地址</span>
                  <span>持有量</span>
                  <span>占比</span>
                </div>
                
                <div className="divider my-2"></div>
                
                {mockHolders.map((holder, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}></div>
                      <span className="font-mono text-sm">{holder.address}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{holder.balance}</div>
                      <div className="text-xs text-base-content/60">{holder.percentage}%</div>
                    </div>
                  </div>
                ))}
                
                <div className="divider"></div>
                
                <div className="text-center text-sm text-base-content/60">
                  总持有者：{mockHolders.length} 人
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 展示链接 */}
      {currentCampaign?.metaURI?.attributes && (
        <div className="card bg-gradient-card border border-primary/20 shadow-web3">
          <div className="card-body">
            <h3 className="card-title mb-4">🌟 创作者展示</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-base-content/70">创作者主页</span>
                <Link 
                  to={currentCampaign.metaURI.external_url || '#'}
                  target="_blank"
                  className="btn btn-outline btn-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  访问 X 主页
                </Link>
              </div>
              
              {currentCampaign.metaURI.attributes.find(attr => attr.trait_type === 'Showcase') && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-base-content/70">影响力展示</span>
                  <Link 
                    to={currentCampaign.metaURI.attributes.find(attr => attr.trait_type === 'Showcase')?.value || '#'}
                    target="_blank"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    查看历史推文
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
