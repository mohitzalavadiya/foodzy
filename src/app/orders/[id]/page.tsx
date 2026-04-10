'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getClientApi } from '@/lib/api-factory'
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck, MapPin, ArrowLeft, Phone, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const statuses = [
  { id: 'pending', label: 'Order Placed', icon: Clock, description: 'We have received your order' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, description: 'The kitchen is preparing your food' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, description: 'Your rider is on the way' },
  { id: 'delivered', label: 'Delivered', icon: PackageCheck, description: 'Enjoy your meal!' },
]

export default function OrderTrackingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const apiInstance = getClientApi()
        const data = await apiInstance.getOrderTracking(id as string)
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order tracking:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setOrder((prev: any) => ({ ...prev, ...payload.new }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, supabase])

  if (loading) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black italic uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Syncing Status...</p>
        </div>
    )
  }

  if (!order) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
            <div className="bg-muted p-8 rounded-full">
                <Clock className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Order not found</h1>
            <Button onClick={() => router.push('/')} variant="outline" className="rounded-2xl font-black italic uppercase tracking-widest text-[10px]">Back to Home</Button>
        </div>
    )
  }

  const currentStatusIndex = statuses.findIndex((s) => s.id === order.status)

  return (
    <div className="min-h-screen bg-muted/30 pb-32">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col gap-12">
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <Link href="/orders">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-background shadow-sm border">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Track Order</h1>
                        <p className="text-muted-foreground font-bold italic text-xs uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Status Pulse Header */}
                        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/30 flex flex-wrap justify-between items-center gap-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                             <div className="relative z-10 space-y-2">
                                <p className="text-[10px] font-black italic uppercase tracking-[0.2em] opacity-80">Current Status</p>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                                    {(statuses[currentStatusIndex] || statuses[0]).label}
                                </h2>
                                <p className="text-sm font-bold italic opacity-70">Estimated Arrival: 25-30 mins</p>
                             </div>
                             <div className="relative z-10 h-20 w-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
                                <Bike className="h-10 w-10 animate-bounce" />
                             </div>
                        </div>

                        {/* Timeline */}
                        <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden">
                            <CardContent className="p-10">
                                <div className="relative space-y-12 before:absolute before:left-7 before:top-4 before:bottom-4 before:w-1 before:bg-muted-foreground/10 before:rounded-full">
                                    {statuses.map((status, index) => {
                                        const isCompleted = index <= currentStatusIndex
                                        const isCurrent = index === currentStatusIndex
                                        const Icon = status.icon
                                        
                                        return (
                                            <div key={status.id} className="relative flex gap-8 items-start group">
                                                <div className={cn(
                                                    "relative z-10 h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                    isCompleted 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                                                        : "bg-muted text-muted-foreground/40 scale-100"
                                                )}>
                                                    <Icon className={cn("h-6 w-6", isCurrent && "animate-pulse")} />
                                                    {isCurrent && (
                                                        <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-ping opacity-20" />
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1 pt-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h3 className={cn(
                                                            "text-xl font-black italic uppercase tracking-tighter transition-colors",
                                                            isCompleted ? "text-foreground" : "text-muted-foreground/30"
                                                        )}>
                                                            {status.label}
                                                        </h3>
                                                        {isCompleted && !isCurrent && (
                                                            <CheckCircle2 className="h-5 w-5 text-green-500 animate-in fade-in zoom-in duration-300" />
                                                        )}
                                                    </div>
                                                    <p className={cn(
                                                        "text-sm font-bold italic transition-colors",
                                                        isCompleted ? "text-muted-foreground" : "text-muted-foreground/20"
                                                    )}>
                                                        {status.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address & Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="rounded-3xl shadow-lg border-none">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="bg-muted p-4 rounded-2xl">
                                        <MapPin className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black italic uppercase tracking-widest text-muted-foreground mb-1">Delivery Address</p>
                                        <p className="text-sm font-black italic uppercase line-clamp-1">{order.delivery_address || 'Current Location'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="flex gap-3">
                                <Button className="flex-1 h-full rounded-3xl font-black italic uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                    <Phone className="mr-2 h-4 w-4" /> Call Rider
                                </Button>
                                <Button variant="outline" className="flex-1 h-full rounded-3xl font-black italic uppercase tracking-widest text-[10px] border-2">
                                    <HelpCircle className="mr-2 h-4 w-4" /> Support
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                             <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                                <CardHeader className="bg-muted/30 p-8 pb-4">
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Order Summary</CardTitle>
                                    <p className="text-[10px] font-black italic text-primary uppercase tracking-widest mt-1">from {order.restaurants?.name || 'Restaurant'}</p>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-4">
                                        {(order.items || []).map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center group">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black italic uppercase tracking-tight">{item.name}</span>
                                                    <span className="text-[10px] font-black italic text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</span>
                                                </div>
                                                <span className="font-black italic text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="opacity-10" />

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-muted-foreground">
                                            <span>Subtotal</span>
                                            <span className="text-foreground">₹{(order.total_amount - (order.total_amount * 0.05)).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-muted-foreground">
                                            <span>GST (5%)</span>
                                            <span className="text-foreground">₹{(order.total_amount * 0.05).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-black italic uppercase tracking-widest text-muted-foreground">
                                            <span>Delivery</span>
                                            <span className="text-green-600 font-black">FREE</span>
                                        </div>
                                    </div>

                                    <Separator className="opacity-10" />

                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black italic uppercase tracking-widest text-muted-foreground">Amount Paid</span>
                                            <span className="text-3xl font-black italic text-primary tracking-tighter">₹{order.total_amount.toFixed(2)}</span>
                                        </div>
                                    </div>
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
