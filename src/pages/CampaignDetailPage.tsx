import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Users, Calendar, DollarSign, Share2, Heart } from 'lucide-react'
import { useCampaign, useBuyCampaign } from '@/hooks/useCampaigns'
import { useMockWallet, formatBalance } from '@/hooks/useMockWallet'
import { formatEthAmount } from '@/services/mockApi'
import { CampaignKind } from '@/types'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { campaign, loading, error } = useCampaign(id!)
  const { buy, loading: buying, error: buyError } = useBuyCampaign()
  const { isConnected, balance } = useMockWallet()
  
  const [buyAmount, setBuyAmount] = useState(1)
  const [, setShowBuyModal] = useState(false)

  const handleBuy = async () => {
    if (!campaign || !isConnected) return
    
    const totalCost = campaign.basePrice * BigInt(buyAmount)
    
    try {
      await buy(campaign.id, buyAmount, totalCost)
      setShowBuyModal(false)
      setBuyAmount(1)
      // TODO: 显示成功提示并刷新数据
    } catch (err) {
      console.error('购买失败:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold mb-2">活动不存在</h3>
        <p className="text-base-content/70 mb-4">{error || '请检查链接是否正确'}</p>
        <Link to="/" className="btn btn-primary">
          返回首页
        </Link>
      </div>
    )
  }

  const totalCost = campaign.basePrice * BigInt(buyAmount)
  const canBuy = isConnected && !campaign.paused && campaign.sold + buyAmount <= campaign.supply
  const soldOutSoon = (campaign.supply - campaign.sold) <= 10

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 返回按钮 */}
      <Link to="/" className="btn btn-ghost btn-sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回活动列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要信息区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 头部信息 */}
          <div className="card bg-gradient-card border border-primary/20 shadow-web3">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring-2 ring-primary/30 ring-offset-2">
                    <img 
                      src={campaign.creatorAvatar || '/default-avatar.png'} 
                      alt={campaign.creatorHandle}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{campaign.metaURI?.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-primary">
                      {campaign.creatorHandle}
                    </span>
                    <div className={`badge badge-lg ${
                      campaign.kind === CampaignKind.Tweet ? 'badge-primary' :
                      campaign.kind === CampaignKind.Quote ? 'badge-secondary' :
                      'badge-accent'
                    }`}>
                      {campaign.kind === CampaignKind.Tweet ? '🐦' :
                       campaign.kind === CampaignKind.Quote ? '🔄' : '💬'} {campaign.kindLabel}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-lg text-base-content/80 leading-relaxed mb-6">
                {campaign.metaURI?.description}
              </p>

              {/* 统计信息 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-base-100 rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm text-base-content/60">当前价格</div>
                  <div className="text-lg font-bold font-mono">
                    {formatEthAmount(campaign.basePrice)} ETH
                  </div>
                </div>
                <div className="text-center p-4 bg-base-100 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <div className="text-sm text-base-content/60">已售出</div>
                  <div className="text-lg font-bold">
                    {campaign.sold}/{campaign.supply}
                  </div>
                </div>
                <div className="text-center p-4 bg-base-100 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-sm text-base-content/60">创建时间</div>
                  <div className="text-sm font-medium">
                    {new Date(campaign.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="text-center p-4 bg-base-100 rounded-lg">
                  <div className="text-sm text-base-content/60">状态</div>
                  <div className={`badge badge-sm mt-1 ${
                    campaign.paused ? 'badge-warning' :
                    campaign.sold >= campaign.supply ? 'badge-error' :
                    'badge-success'
                  }`}>
                    {campaign.paused ? '已暂停' :
                     campaign.sold >= campaign.supply ? '已售罄' :
                     '进行中'}
                  </div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-base-content/60 mb-2">
                  <span>销售进度</span>
                  <span>{Math.round((campaign.sold / campaign.supply) * 100)}%</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-4 relative overflow-hidden">
                  <div 
                    className="bg-gradient-web3 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${(campaign.sold / campaign.supply) * 100}%` }}
                  />
                </div>
                {soldOutSoon && (
                  <div className="text-warning text-sm mt-2 font-medium">
                    ⚠️ 仅剩 {campaign.supply - campaign.sold} 个，即将售罄！
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 展示内容 */}
          {campaign.metaURI?.attributes && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📋 活动详情</h3>
                <div className="space-y-4">
                  {campaign.metaURI.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                      <span className="font-medium">{attr.trait_type}</span>
                      {attr.trait_type === 'Showcase' ? (
                        <a 
                          href={attr.value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="link link-primary flex items-center gap-1"
                        >
                          查看示例 <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-base-content/70">{attr.value}</span>
                      )}
                    </div>
                  ))}
                  {campaign.metaURI.external_url && (
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">创作者主页</span>
                      <a 
                        href={campaign.metaURI.external_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link link-primary flex items-center gap-1"
                      >
                        访问 X 主页 <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 购买侧边栏 */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="card bg-gradient-card border border-primary/20 shadow-web3">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">🚀 立即购买</h3>
                
                {!isConnected ? (
                  <div className="text-center py-6">
                    <p className="text-base-content/70 mb-4">请先连接钱包</p>
                    <button className="btn btn-primary btn-block">
                      连接钱包
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text">购买数量</span>
                        <span className="label-text-alt">最多 {Math.min(10, campaign.supply - campaign.sold)}</span>
                      </label>
                      <div className="join w-full">
                        <button 
                          className="btn join-item"
                          onClick={() => setBuyAmount(Math.max(1, buyAmount - 1))}
                          disabled={buyAmount <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="input input-bordered join-item flex-1 text-center"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                          min="1"
                          max={Math.min(10, campaign.supply - campaign.sold)}
                        />
                        <button 
                          className="btn join-item"
                          onClick={() => setBuyAmount(Math.min(10, campaign.supply - campaign.sold, buyAmount + 1))}
                          disabled={buyAmount >= Math.min(10, campaign.supply - campaign.sold)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-base-100 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>单价</span>
                        <span className="font-mono">{formatEthAmount(campaign.basePrice)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>数量</span>
                        <span>{buyAmount}</span>
                      </div>
                      <div className="divider my-2"></div>
                      <div className="flex justify-between font-bold">
                        <span>总价</span>
                        <span className="font-mono text-primary">
                          {formatEthAmount(totalCost)} ETH
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-base-content/60">
                      <div className="flex justify-between">
                        <span>钱包余额</span>
                        <span className="font-mono">{formatBalance(balance, 4)}</span>
                      </div>
                    </div>

                    {buyError && (
                      <div className="alert alert-error alert-sm">
                        <span className="text-xs">{buyError}</span>
                      </div>
                    )}

                    <button 
                      className={`btn btn-block ${canBuy ? 'btn-web3' : 'btn-disabled'}`}
                      onClick={handleBuy}
                      disabled={!canBuy || buying || totalCost > balance}
                    >
                      {buying && <span className="loading loading-spinner loading-sm"></span>}
                      {buying ? '购买中...' :
                       !canBuy ? '无法购买' :
                       totalCost > balance ? '余额不足' :
                       `购买 ${buyAmount} 个代金券`}
                    </button>

                    <div className="text-xs text-base-content/50 text-center">
                      💡 购买后可在"我的代金券"页面管理和核销
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
