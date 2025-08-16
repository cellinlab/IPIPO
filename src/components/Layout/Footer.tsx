import { Github, Twitter, FileText } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-gradient-card border-t border-primary/20 text-base-content">
      {/* Logo */}
      <div className="mb-4">
        <Logo size="xl" />
      </div>
      
      {/* 导航链接 */}
      <nav className="grid grid-flow-col gap-6">
        <a className="link link-hover text-base-content/80 hover:text-primary transition-colors">关于我们</a>
        <a className="link link-hover text-base-content/80 hover:text-primary transition-colors">联系方式</a>
        <a className="link link-hover text-base-content/80 hover:text-primary transition-colors">帮助文档</a>
        <a className="link link-hover text-base-content/80 hover:text-primary transition-colors">条款协议</a>
      </nav>
      
      {/* 社交媒体链接 */}
      <nav>
        <div className="grid grid-flow-col gap-6">
          <a 
            href="https://github.com/cellinlab/IPIPO.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-base-content/60 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
          >
            <Github className="w-6 h-6" />
          </a>
          <a 
            href="https://twitter.com/cellinlab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-base-content/60 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-base-content/60 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
          >
            <FileText className="w-6 h-6" />
          </a>
        </div>
      </nav>
      
      {/* 版权信息 */}
      <aside className="border-t border-base-300 pt-6 w-full text-center">
        <p className="font-medium mb-2">Copyright © 2024 - IPIPO. All rights reserved.</p>
        <p className="text-sm text-base-content/60 mb-2">
          影响力预售平台 - 让创作者把未来的注意力今天就变现
        </p>
        <div className="flex justify-center gap-4 text-xs text-base-content/50">
          <span>🚀 Web3原生</span>
          <span>💎 链上透明</span>
          <span>⚡ 即时交易</span>
        </div>
      </aside>
    </footer>
  )
}
