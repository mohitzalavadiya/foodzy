'use client'

import { useCartStore } from '@/store/useCartStore'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-muted p-8 rounded-full">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/40" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Looks like you haven&apos;t added anything to your cart yet. Go ahead and explore top restaurants.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 text-lg font-bold">
            Browse Restaurants
          </Button>
        </Link>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const taxes = subtotal * 0.05 // 5% GST
  const deliveryFee = 40
  const total = subtotal + taxes + deliveryFee

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Link href={`/restaurant/${items[0].restaurantId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="font-bold flex items-center gap-2">
                  Ordering from <span className="text-primary">{items[0].restaurantName}</span>
                </h2>
              </div>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4 items-center">
                    <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-muted-foreground">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                      <button
                        className="p-1 hover:bg-background rounded-md transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        className="p-1 hover:bg-background rounded-md transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-bold w-20 text-right">₹{item.price * item.quantity}</p>
                    <button
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Bill Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Item Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (5%)</span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Grand Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full h-14 text-lg font-bold rounded-xl mt-4">
                    Proceed to Checkout
                  </Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center mt-4">
                  By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
