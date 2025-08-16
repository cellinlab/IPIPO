import { Link, useLocation } from 'react-router-dom'
import { User, Menu, ChevronDown, Settings, CreditCard, AlertTriangle } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/hooks/useWallet'
import { Logo } from '@/components/Logo'

export function HeaderWeb3() {
  const location = useLocation()
  const { 
    isConnected, 
    formattedBalance, 
    networkStatus,
  } = useWallet()

  const isActive = (path: string) => location.pathname === path

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <Menu className="h-5 w-5" />
          </label>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/">探索活动</Link></li>
            <li><Link to="/my-vouchers">我的权益凭证</Link></li>
            <li><Link to="/dashboard">创作者面板</Link></li>
            <li><Link to="/transparency">透明度面板</Link></li>
            <li><Link to="/about">项目介绍</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost hover:bg-gradient-card">
          <Logo size="lg" />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link 
              to="/" 
              className={`font-medium ${isActive('/') ? 'bg-gradient-card text-primary' : 'hover:bg-base-200'}`}
            >
              探索活动
            </Link>
          </li>
          {isConnected && (
            <>
              <li>
                <Link 
                  to="/my-vouchers" 
                  className={`font-medium ${isActive('/my-vouchers') ? 'bg-gradient-card text-primary' : 'hover:bg-base-200'}`}
                >
                  我的权益凭证
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`font-medium ${isActive('/dashboard') ? 'bg-gradient-card text-primary' : 'hover:bg-base-200'}`}
                >
                  创作者面板
                </Link>
              </li>
            </>
          )}
          <li>
            <Link 
              to="/transparency" 
              className={`font-medium ${isActive('/transparency') ? 'bg-gradient-card text-primary' : 'hover:bg-base-200'}`}
            >
              透明度面板
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`font-medium ${isActive('/about') ? 'bg-gradient-card text-primary' : 'hover:bg-base-200'}`}
            >
              项目介绍
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        {/* 网络状态指示 */}
        {isConnected && !networkStatus.isCorrectChain && (
          <div className="alert alert-warning mr-4 p-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">请切换到 {networkStatus.targetChain.name}</span>
          </div>
        )}
        
        {/* RainbowKit连接按钮 */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // 注意：`mounted` 和 `authenticationStatus` 在SSR中是必需的
            const ready = mounted && authenticationStatus !== 'loading'
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated')

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="btn btn-primary btn-sm gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        连接钱包
                      </button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="btn btn-error btn-sm gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        切换网络
                      </button>
                    )
                  }

                  return (
                    <div className="flex items-center gap-2">
                      {/* 网络指示器 */}
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center' }}
                        type="button"
                        className="btn btn-ghost btn-sm"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      {/* 账户信息 */}
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
                          <User className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {formatAddress(account.address)}
                          </span>
                          <span className="text-xs text-base-content/70">
                            {formattedBalance.slice(0, 6)} MON
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </label>
                        
                        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 mt-2">
                          <li className="menu-title">
                            <span>账户信息</span>
                          </li>
                          <li>
                            <div className="flex flex-col items-start p-2">
                              <span className="text-xs text-base-content/70">地址</span>
                              <span className="font-mono text-sm">{account.address}</span>
                            </div>
                          </li>
                          <li>
                            <div className="flex flex-col items-start p-2">
                              <span className="text-xs text-base-content/70">余额</span>
                              <span className="font-mono text-sm">{formattedBalance} MON</span>
                            </div>
                          </li>
                          <div className="divider my-1"></div>
                          <li>
                            <button 
                              onClick={openAccountModal}
                              className="gap-2"
                            >
                              <Settings className="w-4 h-4" />
                              账户设置
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  )
}
