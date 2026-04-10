'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, User, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import { CartDrawer } from '@/components/CartDrawer'
import { useEffect, useState } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const cartItemsCount = useCartStore((state) => state.getTotalItems())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'History', icon: ShoppingBag, href: '/orders' },
    { label: 'Cart', icon: ShoppingCart, isCart: true },
    { label: 'Account', icon: User, href: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          const content = (
            <div className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-300 relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}>
              <div className="relative p-1">
                <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                {item.label === 'Cart' && mounted && cartItemsCount > 0 && (
                   <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-primary text-[8px] text-white flex items-center justify-center rounded-full font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className={cn(
                  "text-[9px] font-medium transition-colors",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 h-0.5 w-6 bg-primary rounded-full" />
              )}
            </div>
          )

          if (item.isCart) {
            return (
              <CartDrawer key={item.label}>
                <button className="flex-1 h-full">{content}</button>
              </CartDrawer>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className="flex-1 h-full"
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
