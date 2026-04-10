'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, Ticket, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to place an order')
        router.push('/login?next=/checkout')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router, supabase.auth])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/')
    }
  }, [mounted, items.length, router])

  if (!mounted || items.length === 0) return null

  const subtotal = getTotalPrice()
  const taxes = subtotal * 0.05
  const deliveryFee = 0 // Making it free for premium feel in demo
  const total = subtotal + taxes + deliveryFee

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error('Please provide a delivery address')
      return
    }

    setLoading(true)
    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: items[0].restaurantId,
          total_amount: total,
          delivery_address: address,
          status: 'pending',
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            image_url: item.image,
          }))
        })
        .select()
        .single()

      if (orderError) throw orderError

      clearCart()
      router.push(`/order-success?id=${order.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-32">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col gap-12">
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-background shadow-sm border">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Checkout</h1>
                        <p className="text-muted-foreground font-bold italic text-xs uppercase tracking-widest">Secure Payment Gateway</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Side: Address & Payment */}
                    <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">Delivery Address</h2>
                            </div>
                            <Card className="rounded-3xl shadow-xl border-none overflow-hidden">
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black italic uppercase tracking-widest text-muted-foreground ml-1">Home / Office Address</label>
                                            <Input
                                                placeholder="e.g. 123, Street Name, Landmark"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="h-16 rounded-2xl bg-muted/50 border-none px-6 text-lg font-bold italic placeholder:font-normal"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">Payment Mode</h2>
                            </div>
                            <Card className="rounded-3xl shadow-xl border-none overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="p-6 border-2 border-primary bg-primary/5 rounded-[2rem] flex items-center justify-between group transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                                                <CreditCard className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black italic leading-none mb-1">Cash on Delivery</p>
                                                <p className="text-[10px] font-black italic text-muted-foreground uppercase tracking-widest">Pay in cash when order arrives</p>
                                            </div>
                                        </div>
                                        <div className="h-6 w-6 rounded-full border-4 border-primary bg-white flex items-center justify-center shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <div className="flex items-center gap-4 bg-green-50/50 dark:bg-green-950/10 p-6 rounded-3xl border border-green-100 dark:border-green-900/20">
                            <div className="bg-green-600 h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black italic text-green-700 dark:text-green-500 uppercase tracking-tight">Safe and Secure</p>
                                <p className="text-xs font-bold italic text-muted-foreground">Your data is protected by industry standard encryption.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                             <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                                <CardHeader className="bg-muted/30 p-8 pb-4">
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Order Summary</CardTitle>
                                    <p className="text-[10px] font-black italic text-primary uppercase tracking-widest mt-1">from {items[0].restaurantName}</p>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center group">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black italic uppercase tracking-tight">{item.name}</span>
                                                    <span className="text-[10px] font-black italic text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</span>
                                                </div>
                                                <span className="font-black italic text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-muted/20 p-4 rounded-2xl border border-dashed flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Ticket className="h-4 w-4 text-primary" />
                                            <span className="text-[10px] font-black italic uppercase tracking-widest">Apply Coupon</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    <Separator className="opacity-10" />

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-muted-foreground">
                                            <span>Subtotal</span>
                                            <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-muted-foreground">
                                            <span>GST (5%)</span>
                                            <span className="text-foreground">₹{taxes.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-muted-foreground">
                                            <span>Delivery Charge</span>
                                            <span className="text-green-600 font-black">FREE</span>
                                        </div>
                                    </div>

                                    <Separator className="opacity-10" />

                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black italic uppercase tracking-widest text-muted-foreground">Total amount</span>
                                            <span className="text-3xl font-black italic text-primary tracking-tighter italic">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-16 text-xs font-black italic uppercase tracking-widest rounded-2xl mt-4 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
