import { ReactNode } from 'react'
import { HeaderWeb3 } from './HeaderWeb3'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <HeaderWeb3 />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
