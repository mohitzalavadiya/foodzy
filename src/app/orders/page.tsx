import { getServerApi } from '@/lib/api-server-factory'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, ShoppingBag } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let orders: any[] = []
  try {
    const apiInstance = await getServerApi()
    orders = await apiInstance.getUserOrders(user.id)
  } catch (error) {
    console.error('Error fetching orders:', error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold italic tracking-tight">Order History</h1>

        {orders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold">No orders yet</h2>
              <p className="text-muted-foreground">You haven&apos;t placed any orders. Start ordering!</p>
            </div>
            <Link href="/">
              <Button className="rounded-full px-8">Browse Restaurants</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders?.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden border">
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{(order as any).restaurants?.name}</h3>
                        <p className="text-sm text-muted-foreground italic flex items-center gap-1 group">
                          Order ID: {order.id.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">₹{order.total_amount}</span>
                        <Badge className={`${getStatusColor(order.status)} border-none capitalize`}>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="hidden md:flex items-center text-primary group font-bold">
                        View Details <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
