import { Link, useLocation } from 'react-router-dom'
import { User, Wallet, Menu, ChevronDown, LogOut, Settings, CreditCard } from 'lucide-react'
import { useMockWallet, formatAddress, formatBalance, getMockAccounts } from '@/hooks/useMockWallet'
import { Logo } from '@/components/Logo'

export function Header() {
  const location = useLocation()
  const { 
    isConnected, 
    address, 
    balance, 
    isConnecting, 
    error, 
    connect, 
    disconnect, 
    switchAccount,
    clearError 
  } = useMockWallet()

  const isActive = (path: string) => location.pathname === path
  const mockAccounts = getMockAccounts()

  const handleConnect = async () => {
    if (error) clearError()
    await connect()
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
            <li><Link to="/my-vouchers">我的代金券</Link></li>
            <li><Link to="/dashboard">创作者面板</Link></li>
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
              className={`${isActive('/') ? 'active' : ''}`}
            >
              探索活动
            </Link>
          </li>
          <li>
            <Link 
              to="/my-vouchers" 
              className={`${isActive('/my-vouchers') ? 'active' : ''}`}
            >
              我的代金券
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={`${isActive('/dashboard') ? 'active' : ''}`}
            >
              创作者面板
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {/* 错误提示 */}
        {error && (
          <div className="alert alert-error alert-sm">
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* 连接状态 */}
        {isConnected ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost flex items-center gap-2">
              <div className="avatar">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium">{formatAddress(address)}</span>
                <span className="text-xs text-base-content/70">{formatBalance(balance, 2)}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </label>
            
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64">
              {/* 当前账户信息 */}
              <li className="menu-title">
                <span>当前账户</span>
              </li>
              <li>
                <div className="flex flex-col gap-1 cursor-default">
                  <span className="font-mono text-xs">{address}</span>
                  <span className="text-sm font-medium">{formatBalance(balance)}</span>
                </div>
              </li>
              
              <div className="divider my-1"></div>
              
              {/* 账户切换 */}
              <li className="menu-title">
                <span>切换账户</span>
              </li>
              {mockAccounts.map((account) => (
                <li key={account.address}>
                  <a 
                    onClick={() => switchAccount(account.address)}
                    className={`${address === account.address ? 'active' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{account.name}</span>
                      <span className="font-mono text-xs opacity-70">
                        {formatAddress(account.address)}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
              
              <div className="divider my-1"></div>
              
              {/* 操作菜单 */}
              <li>
                <a>
                  <Settings className="h-4 w-4" />
                  设置
                </a>
              </li>
              <li>
                <a>
                  <CreditCard className="h-4 w-4" />
                  交易历史
                </a>
              </li>
              <li>
                <a onClick={disconnect} className="text-error">
                  <LogOut className="h-4 w-4" />
                  断开连接
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button 
            onClick={handleConnect} 
            className={`btn btn-primary ${isConnecting ? 'loading' : ''}`}
            disabled={isConnecting}
          >
            {!isConnecting && <Wallet className="h-4 w-4 mr-2" />}
            {isConnecting ? '连接中...' : '连接钱包'}
          </button>
        )}
      </div>
    </header>
  )
}
