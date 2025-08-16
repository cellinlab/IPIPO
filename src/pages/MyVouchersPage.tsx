import { useState, useEffect } from 'react'
import { Voucher } from '@/types'
import { mockVouchers } from '@/data/mockData'
import { useMockWallet } from '@/hooks/useMockWallet'

export function MyVouchersPage() {
  const { isConnected } = useMockWallet()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      if (isConnected) {
        setVouchers(mockVouchers)
      } else {
        setVouchers([])
      }
      setLoading(false)
    }

    fetchVouchers()
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold mb-2">请连接钱包</h3>
        <p className="text-base-content/70">
          连接钱包后即可查看您持有的代金券
        </p>
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">我的代金券</h1>
        <p className="text-lg text-base-content/70">
          管理您持有的影响力代金券，随时核销使用
        </p>
      </div>

      {vouchers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">暂无代金券</h3>
          <p className="text-base-content/70 mb-4">
            您还没有购买任何代金券
          </p>
          <button className="btn btn-primary">
            去探索活动
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.campaignId} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">
                  {voucher.campaign.metaURI?.name}
                </h3>
                <p className="text-sm text-base-content/70">
                  创作者: {voucher.campaign.creatorHandle}
                </p>
                
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <div className="text-xs text-base-content/70">持有数量</div>
                    <div className="text-lg font-bold">{voucher.balance}</div>
                  </div>
                  <div>
                    <div className="text-xs text-base-content/70">已核销</div>
                    <div className="text-lg">{voucher.totalRedeemed}</div>
                  </div>
                </div>
                
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary btn-sm"
                    disabled={voucher.balance === 0}
                  >
                    {voucher.balance > 0 ? '核销使用' : '已用完'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
