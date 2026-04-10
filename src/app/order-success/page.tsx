'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Check, Package, MapPin, Calendar, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Optional: Trigger confetti or extra animation here
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-12">
        {/* Success Animation Container */}
        <div className="relative inline-block">
             <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping duration-1000 scale-150 opacity-20" />
             <div className="relative bg-green-500 h-24 w-24 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-in zoom-in-50 duration-700">
                <Check className="h-12 w-12 text-white stroke-[4px] animate-in slide-in-from-bottom-2 duration-500 delay-300" />
             </div>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Yay! Order Placed</h1>
            <p className="text-muted-foreground font-bold italic text-sm uppercase tracking-widest px-8">
                Your delicious meal is being prepared and will be delivered shortly.
            </p>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                            <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="text-[10px] font-black italic uppercase tracking-widest text-muted-foreground">Order ID</span>
                    </div>
                    <span className="text-sm font-black italic uppercase tracking-tighter">#{orderId?.slice(0, 8) || 'ORDER_ID'}</span>
                </div>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                            <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="text-[10px] font-black italic uppercase tracking-widest text-muted-foreground">Est. Delivery</span>
                    </div>
                    <span className="text-sm font-black italic uppercase tracking-tighter">35-45 MINS</span>
                </div>

                <div className="pt-4 space-y-3">
                    <Link href={`/orders/${orderId}`} className="w-full inline-block">
                        <Button className="w-full h-14 rounded-2xl font-black italic uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                            Track Your Order <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/" className="w-full inline-block">
                        <Button variant="outline" className="w-full h-14 rounded-2xl font-black italic uppercase tracking-widest text-xs border-primary/20 text-primary hover:bg-primary/5">
                            <Home className="mr-2 h-4 w-4" /> Go to Home
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>

        <p className="text-[10px] font-black italic text-muted-foreground uppercase tracking-[0.2em] animate-in fade-in duration-1000 delay-1000">
            Thank you for choosing Foodzy
        </p>
      </div>
    </div>
  )
}
