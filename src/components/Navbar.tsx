'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, User, Search, LogOut, History, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/useCartStore'
import { Badge } from '@/components/ui/badge'
import { LocationPicker } from '@/components/LocationPicker'
import { CartDrawer } from '@/components/CartDrawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const cartItemsCount = useCartStore((state) => state.getTotalItems())

  const isHomePage = pathname === '/'

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!mounted) return null

  const isDetailedPage = pathname.includes('/restaurant/')

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-white/95 backdrop-blur-md border-b py-3 shadow-sm dark:bg-zinc-950/90"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 md:gap-8 min-h-[64px]">
          <div className="flex items-center gap-8 flex-1">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-primary">
                Foodzy<span className="text-xs align-top opacity-50 ml-0.5">Surat</span>
              </h1>
            </Link>

            {/* Joined Search Box - Always visible on listing/detail now */}
            <div className="hidden md:flex items-center bg-white dark:bg-zinc-900 rounded-xl w-full max-auto max-w-[700px] h-14 shadow-md border animate-in fade-in slide-in-from-top-2 duration-500 overflow-hidden ml-4">
              <div className="flex items-center gap-2 px-4 h-full min-w-[200px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <LocationPicker />
              </div>

              <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700" />

              <div className="flex items-center flex-1 gap-3 px-4 h-full group">
                <Search className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                <form className="flex-1 h-full" onSubmit={(e) => {
                  e.preventDefault()
                  const q = (e.target as any).search.value
                  if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
                }}>
                  <input
                    name="search"
                    type="text"
                    placeholder="Search for restaurant, cuisine or a dish"
                    className="w-full h-full bg-transparent border-none outline-none text-zinc-700 dark:text-zinc-200 text-[15px] placeholder:text-zinc-400"
                  />
                </form>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <CartDrawer>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl transition-colors hover:bg-primary/5 text-zinc-700"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 min-w-0 p-0 flex items-center justify-center bg-primary text-white rounded-full font-black italic text-[10px] border-2 border-background">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 text-[#1C1C1C] dark:text-white">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl">
                  <DropdownMenuLabel className="font-black italic uppercase tracking-widest text-[10px] opacity-50 px-3 py-2">Account Details</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/orders')} className="rounded-xl p-3 cursor-pointer group">
                    <History className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-bold italic">Order History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-3 cursor-pointer text-destructive focus:text-destructive group">
                    <LogOut className="mr-3 h-4 w-4 text-destructive/70 group-hover:text-destructive transition-colors" />
                    <span className="font-bold italic">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className={cn(
                    "rounded-xl font-bold italic",
                    isHomePage && !scrolled ? "text-black hover:bg-white/10" : ""
                  )}>
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button className="rounded-xl font-black italic uppercase tracking-widest text-[10px] h-10 px-6">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
