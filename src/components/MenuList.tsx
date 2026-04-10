'use client'

import { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { Plus, Minus, Info, Utensils, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { CartItem } from '@/store/useCartStore'

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  image_url?: string
  is_available?: boolean
}

interface MenuListProps {
  items: MenuItem[]
  restaurantId: string
  restaurantName: string
}

export function MenuList({ items, restaurantId, restaurantName }: MenuListProps) {
  const { addItem, items: cartItems, updateQuantity, clearCart, restaurantId: currentCartRestaurantId, restaurantName: currentCartRestaurantName } = useCartStore()
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [showReplaceCartDialog, setShowReplaceCartDialog] = useState(false)
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null)
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Group items by category
  const categories = Array.from(new Set(items.map((item) => item.category || 'Recommended')))

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0])
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('category-', ''))
          }
        })
      },
      { threshold: 0.2, rootMargin: '-10% 0px -80% 0px' }
    )

    Object.values(menuRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (item: MenuItem) => {
    try {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantId,
            restaurantName,
            image: item.image_url
        })
        toast.success(`${item.name} added to cart`)
    } catch (error: any) {
        if (error.message === 'RESTAURANT_MISMATCH') {
            setPendingItem(item)
            setShowReplaceCartDialog(true)
        } else {
            toast.error('Failed to add item to cart')
        }
    }
  }

  const confirmReplaceCart = () => {
    if (pendingItem) {
        clearCart()
        addItem({
            id: pendingItem.id,
            name: pendingItem.name,
            price: pendingItem.price,
            quantity: 1,
            restaurantId,
            restaurantName,
            image: pendingItem.image_url
        })
        toast.success(`${pendingItem.name} added to cart`)
    }
    setShowReplaceCartDialog(false)
    setPendingItem(null)
  }

  const getItemQuantity = (id: string) => {
    return cartItems.find((i) => i.id === id)?.quantity || 0
  }

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`)
    if (element) {
      const offset = 120 // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Mobile Sticky Category Tabs */}
      <div className="lg:hidden sticky top-16 z-30 bg-background/95 backdrop-blur border-b overflow-x-auto no-scrollbar -mx-4 px-4 mb-6 pt-2">
        <div className="flex gap-4 min-w-max py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                activeCategory === cat
                  ? "bg-[#EF4F5F] text-white shadow-md"
                  : "bg-zinc-100 text-zinc-600 text-nowrap"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Left Sidebar - Categories */}
        <div className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => scrollToCategory(cat)}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-l-lg transition-all border-r-4 text-[13px] font-medium",
                            activeCategory === cat
                                ? "bg-red-50 text-[#EF4F5F] border-[#EF4F5F] font-bold"
                                : "text-zinc-600 border-transparent hover:bg-zinc-50"
                        )}
                    >
                        {cat} ({items.filter(i => (i.category || 'Recommended') === cat).length})
                    </button>
                ))}
            </div>
        </div>

        {/* Right Column - Items */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-[#1C1C1C] dark:text-white">Order Online</h2>
              <div className="relative w-full max-w-[280px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search within menu" 
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/20"
                  />
              </div>
          </div>

          <div className="space-y-12">
            {categories.map((category) => (
                <div 
                    key={category} 
                    id={`category-${category}`} 
                    ref={(el) => { menuRefs.current[category] = el }}
                    className="space-y-4 animate-in fade-in duration-500"
                >
                    <h3 className="text-xl font-bold text-[#1C1C1C] dark:text-white">{category}</h3>
                    <div className="grid gap-8">
                        {items
                            .filter((item) => (item.category || 'Recommended') === category)
                            .map((item) => {
                                const quantity = getItemQuantity(item.id)
                                return (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start gap-6 pb-8 border-b last:border-b-0 group"
                                    >
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col gap-1">
                                                <div className={cn(
                                                    "w-3.5 h-3.5 border-2 flex items-center justify-center rounded-sm shrink-0",
                                                    item.is_available ? "border-green-600" : "border-red-600"
                                                )}>
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        item.is_available ? "bg-green-600" : "bg-red-600"
                                                    )} />
                                                </div>
                                                <h4 className="font-bold text-lg text-[#1C1C1C] dark:text-white group-hover:text-[#EF4F5F] transition-colors">{item.name}</h4>
                                                <p className="font-bold text-sm">₹{item.price}</p>
                                            </div>
                                            <p className="text-[#828282] text-xs font-medium line-clamp-2 italic">{item.description}</p>
                                        </div>

                                        <div className="relative w-[130px] h-[130px] shrink-0">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded-xl border"
                                                    sizes="130px"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center border">
                                                    <Utensils className="h-8 w-8 text-muted-foreground/20" />
                                                </div>
                                            )}
                                            
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90px]">
                                                {quantity > 0 ? (
                                                    <div className="flex items-center justify-between bg-white border border-[#EF4F5F]/30 text-[#EF4F5F] rounded-lg h-9 shadow-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-full w-8 hover:bg-red-50 rounded-none text-[#EF4F5F]"
                                                            onClick={() => updateQuantity(item.id, quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-xs font-bold">{quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-full w-8 hover:bg-red-50 rounded-none text-[#EF4F5F]"
                                                            onClick={() => updateQuantity(item.id, quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        className="w-full bg-white hover:bg-red-50 text-[#EF4F5F] border border-[#EF4F5F]/30 font-bold uppercase text-[10px] h-9 rounded-lg shadow-lg"
                                                        onClick={() => handleAddToCart(item)}
                                                        disabled={!item.is_available}
                                                    >
                                                        {item.is_available ? 'Add' : 'Sold Out'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Replace Cart Confirmation Dialog */}
      <Dialog open={showReplaceCartDialog} onOpenChange={setShowReplaceCartDialog}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader className="items-center text-center space-y-4">
             <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
             </div>
             <DialogTitle className="text-xl">Replace cart items?</DialogTitle>
             <DialogDescription className="text-xs font-bold italic uppercase tracking-widest leading-relaxed">
                Your cart contains items from <span className="text-primary">{currentCartRestaurantName}</span>. 
                Adding this item will clear your current cart. Do you want to continue?
             </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 pt-4">
            <Button 
                onClick={confirmReplaceCart}
                className="w-full h-12 rounded-2xl font-black italic uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
            >
                Yes, Replace Cart
            </Button>
            <Button 
                variant="ghost"
                onClick={() => setShowReplaceCartDialog(false)}
                className="w-full h-12 rounded-2xl font-black italic uppercase tracking-widest text-[10px]"
            >
                No, Keep My Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
