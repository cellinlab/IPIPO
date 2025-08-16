interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl', 
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  return (
    <div className={`${className} font-bold tracking-tight relative group`}>
      <span className={`${sizeClasses[size]} gradient-text font-black transition-all duration-300 group-hover:scale-105`}>
        IPIPO
      </span>
      {/* 添加微妙的发光效果 */}
      <div className="absolute inset-0 gradient-text opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 pointer-events-none">
        <span className={`${sizeClasses[size]} font-black`}>
          IPIPO
        </span>
      </div>
    </div>
  )
}

export function LogoIcon({ className = "", size = 'md' }: { className?: string, size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`${className} font-bold`}>
      <span className={`${sizeClasses[size]} gradient-text font-black`}>
        IP
      </span>
    </div>
  )
}
