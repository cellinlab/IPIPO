import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, ExternalLink, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'
import { useUserVouchers, useRedeemVoucher } from '@/hooks/useVouchers'
import { useMockWallet } from '@/hooks/useMockWallet'
import { formatEthAmount } from '@/services/mockApi'
import { CampaignKind, RedemptionStatus } from '@/types'

export function MyVouchersPage() {
  const { isConnected, address } = useMockWallet()
  const { vouchers, loading, error, refetch } = useUserVouchers(address || undefined)
  const { redeem, loading: redeeming, error: redeemError } = useRedeemVoucher()
  
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null)
  const [proofURL, setProofURL] = useState('')
  const [showRedeemModal, setShowRedeemModal] = useState(false)

  const handleRedeem = async () => {
    if (!selectedVoucher || !proofURL.trim()) return
    
    try {
      await redeem(selectedVoucher, proofURL.trim())
      setShowRedeemModal(false)
      setProofURL('')
      setSelectedVoucher(null)
      refetch() // 刷新数据
    } catch (err) {
      console.error('核销失败:', err)
    }
  }

  const openRedeemModal = (campaignId: string) => {
    setSelectedVoucher(campaignId)
    setShowRedeemModal(true)
    setProofURL('')
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold mb-2">请连接钱包</h3>
        <p className="text-base-content/70 mb-4">
          连接钱包后即可查看您持有的代金券
        </p>
        <Link to="/" className="btn btn-primary">
          去探索活动
        </Link>
      </div>
    )
  }

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

  const totalBalance = vouchers.reduce((sum, v) => sum + v.balance, 0)
  const totalRedeemed = vouchers.reduce((sum, v) => sum + v.totalRedeemed, 0)
  const totalValue = vouchers.reduce((sum, v) => 
    sum + Number(v.campaign.basePrice) * v.balance / 1e18, 0
  )

  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            我的权益凭证
          </h1>
          <div className="absolute inset-0 bg-gradient-glow opacity-50 blur-3xl -z-10"></div>
        </div>
        <p className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
          管理您持有的影响力权益凭证，随时核销获得对应的X平台曝光服务
        </p>
      </div>

      {/* 统计概览 */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-web3 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Ticket className="w-8 h-8" />
          </div>
                      <div className="stat-title">持有权益凭证</div>
          <div className="stat-value text-primary">{totalBalance}</div>
          <div className="stat-desc">来自 {vouchers.length} 个活动</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">已核销</div>
          <div className="stat-value text-secondary">{totalRedeemed}</div>
          <div className="stat-desc">历史核销记录</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <div className="text-accent font-mono text-lg">ETH</div>
          </div>
          <div className="stat-title">代金券价值</div>
          <div className="stat-value text-accent font-mono">{totalValue.toFixed(4)}</div>
          <div className="stat-desc">当前持有价值</div>
        </div>
      </div>

      {vouchers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">暂无权益凭证</h3>
          <p className="text-base-content/70 mb-4">
            您还没有购买任何影响力权益凭证
          </p>
          <Link to="/" className="btn btn-primary">
            去探索活动
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {vouchers.map((voucher) => (
            <div key={voucher.campaignId} className="card bg-gradient-card border border-primary/20 shadow-web3">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* 活动信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full ring-2 ring-primary/30">
                          <img 
                            src={voucher.campaign.creatorAvatar || '/default-avatar.png'} 
                            alt={voucher.campaign.creatorHandle}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{voucher.campaign.metaURI?.name}</h3>
                        <p className="text-base-content/70">
                          {voucher.campaign.creatorHandle} • {voucher.campaign.kindLabel}
                        </p>
                      </div>
                      <div className={`badge badge-lg ${
                        voucher.campaign.kind === CampaignKind.Tweet ? 'badge-primary' :
                        voucher.campaign.kind === CampaignKind.Quote ? 'badge-secondary' :
                        'badge-accent'
                      }`}>
                        {voucher.campaign.kind === CampaignKind.Tweet ? '🐦' :
                         voucher.campaign.kind === CampaignKind.Quote ? '🔄' : '💬'}
                      </div>
                    </div>

                    <p className="text-base-content/80 mb-4">
                      {voucher.campaign.metaURI?.description}
                    </p>

                    {/* 代金券统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-base-100 rounded-lg">
                        <div className="text-xs text-base-content/60">持有数量</div>
                        <div className="text-lg font-bold text-primary">{voucher.balance}</div>
                      </div>
                      <div className="text-center p-3 bg-base-100 rounded-lg">
                        <div className="text-xs text-base-content/60">已核销</div>
                        <div className="text-lg font-bold text-secondary">{voucher.totalRedeemed}</div>
                      </div>
                      <div className="text-center p-3 bg-base-100 rounded-lg">
                        <div className="text-xs text-base-content/60">单价</div>
                        <div className="text-sm font-mono">{formatEthAmount(voucher.campaign.basePrice)} ETH</div>
                      </div>
                      <div className="text-center p-3 bg-base-100 rounded-lg">
                        <div className="text-xs text-base-content/60">总价值</div>
                        <div className="text-sm font-mono">
                          {formatEthAmount(voucher.campaign.basePrice * BigInt(voucher.balance))} ETH
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button 
                      className="btn btn-primary"
                      onClick={() => openRedeemModal(voucher.campaignId)}
                      disabled={voucher.balance === 0}
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      {voucher.balance > 0 ? '核销使用' : '已用完'}
                    </button>
                    <Link 
                      to={`/campaigns/${voucher.campaignId}`}
                      className="btn btn-outline btn-sm"
                    >
                      查看活动 <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>

                {/* 核销历史 */}
                {voucher.redemptionHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-base-300">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      核销记录 ({voucher.redemptionHistory.length})
                    </h4>
                    <div className="space-y-2">
                      {voucher.redemptionHistory.slice(0, 3).map((redemption) => (
                        <div key={redemption.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              redemption.status === RedemptionStatus.Completed ? 'bg-success' :
                              redemption.status === RedemptionStatus.Pending ? 'bg-warning' :
                              'bg-error'
                            }`} />
                            <div>
                              <div className="text-sm font-medium">
                                {new Date(redemption.timestamp).toLocaleDateString('zh-CN')}
                              </div>
                              {redemption.note && (
                                <div className="text-xs text-base-content/60">{redemption.note}</div>
                              )}
                            </div>
                          </div>
                          <a 
                            href={redemption.proofURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-xs"
                          >
                            查看 <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      ))}
                      {voucher.redemptionHistory.length > 3 && (
                        <div className="text-center">
                          <button className="btn btn-ghost btn-xs">
                            查看全部 ({voucher.redemptionHistory.length}) 条记录
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 核销模态框 */}
      {showRedeemModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">核销代金券</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">提交proof URL *</span>
                  <span className="label-text-alt">X/Twitter链接</span>
                </label>
                <input 
                  type="url" 
                  className="input input-bordered w-full input-web3"
                  placeholder="https://x.com/username/status/123456789"
                  value={proofURL}
                  onChange={(e) => setProofURL(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt">请提供您发布的推文链接作为交付证明</span>
                </label>
              </div>

              {redeemError && (
                <div className="alert alert-error">
                  <XCircle className="w-4 h-4" />
                  <span>{redeemError}</span>
                </div>
              )}

              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setShowRedeemModal(false)}
                  disabled={redeeming}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleRedeem}
                  disabled={!proofURL.trim() || redeeming}
                >
                  {redeeming && <span className="loading loading-spinner loading-sm"></span>}
                  {redeeming ? '核销中...' : '确认核销'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
