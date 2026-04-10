'use client'

import { useCartStore } from '@/store/useCartStore'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{children}</>

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-l shadow-2xl rounded-l-4xl">
        <SheetHeader className="p-6 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                Your Cart
            </SheetTitle>
            <Badge variant="outline" className="font-black italic uppercase tracking-widest text-[10px] py-1 px-3 bg-primary/5 text-primary border-primary/20">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-muted p-12 rounded-full scale-110">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Your cart is empty</h3>
                <p className="text-xs font-bold italic text-muted-foreground uppercase tracking-widest">Add some delicious items from nearby restaurants</p>
              </div>
              <Button 
                onClick={() => setIsOpen(false)}
                className="rounded-2xl font-black italic uppercase tracking-widest text-xs px-8 h-12"
              >
                Start Exploring
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group animate-in slide-in-from-right-4 duration-300">
                  <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border shadow-sm transition-transform group-hover:scale-105">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground/20" />
                        </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-black italic uppercase tracking-tighter line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h4>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/5 transition-all"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <p className="text-[10px] font-bold italic text-muted-foreground uppercase tracking-widest">{item.restaurantName}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-black italic">₹{item.price}</p>
                        <div className="flex items-center bg-muted/50 rounded-xl p-1 border">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 flex items-center justify-center hover:bg-background rounded-lg transition-colors"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-black italic">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 flex items-center justify-center hover:bg-background rounded-lg transition-colors"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-5 border-t flex flex-col gap-3 bg-white">
            <div className="space-y-3 w-full">
              {/* Promo Code Section - Compact */}
              <div className="bg-[#f3f4f6] dark:bg-zinc-900/50 p-4 rounded-xl space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-primary/10 rounded flex items-center justify-center">
                            <Star className="h-2.5 w-2.5 text-primary fill-primary" />
                        </div>
                        <span className="text-[10px] font-black italic uppercase tracking-widest text-[#1c1c1c] dark:text-white">Applied Promo Code</span>
                    </div>
                    <button className="text-[10px] font-black italic uppercase tracking-widest text-primary hover:underline">Offers</button>
                 </div>
                 <div className="flex gap-2">
                    <input 
                        placeholder="Enter promo code"
                        className="flex-1 bg-white dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-[10px] font-bold italic uppercase tracking-widest focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                    />
                    <Button className="h-9 px-4 rounded-lg font-black italic uppercase tracking-widest text-[9px] bg-[#EF4F5F] hover:bg-[#EF4F5F]/90 text-white shadow-md">
                        Apply
                    </Button>
                 </div>
              </div>

              {/* Bill Details */}
              <div className="px-1 space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold italic uppercase tracking-widest">
                    <span className="text-muted-foreground">Order Subtotal</span>
                    <span className="text-[#1c1c1c] dark:text-white">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold italic uppercase tracking-widest text-green-600">
                    <span>Discount Applied</span>
                    <span>-₹0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold italic uppercase tracking-widest">
                    <span className="text-muted-foreground">Delivery Handling</span>
                    <span className="text-green-600 font-black">FREE</span>
                  </div>
                  
                  <Separator className="my-2 opacity-5" />
                  
                  <div className="flex justify-between items-end pt-1">
                    <div>
                        <p className="text-[10px] font-black italic uppercase tracking-widest opacity-40 leading-none">Total Payable</p>
                        <p className="text-2xl font-black italic text-[#1c1c1c] dark:text-white tracking-tighter mt-1">₹{totalPrice}</p>
                    </div>
                    <Link href="/checkout" className="flex-1 ml-6" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-xl font-black italic uppercase tracking-widest text-sm bg-[#EF4F5F] hover:bg-[#EF4F5F]/90 text-white shadow-xl shadow-primary/10 transform active:scale-95 transition-all">
                        Checkout <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variant === 'outline' ? "text-foreground" : "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            className
        )}>
            {children}
        </span>
    )
}
