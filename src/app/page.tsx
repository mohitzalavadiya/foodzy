import { getServerApi } from '@/lib/api-server-factory'
import { HomeClient } from '@/components/HomeClient'
import { UtensilsCrossed } from 'lucide-react'

export default async function HomePage() {
  let restaurants: any[] = []
  let error: string | null = null

  try {
    const api = await getServerApi()
    restaurants = await api.getRestaurants()
  } catch (err: any) {
    console.error('Error fetching restaurants:', err)
    error = err.message
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="p-12 text-center bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 border-dashed max-w-2xl mx-auto">
          <h3 className="text-2xl font-black italic text-red-600 uppercase tracking-tighter mb-2">Something went wrong</h3>
          <p className="text-red-500/80 text-sm font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="bg-muted/30 p-20 rounded-[2.5rem] text-center space-y-6 border border-dashed max-w-2xl mx-auto">
                <div className="bg-background inline-block p-10 rounded-full shadow-inner">
                    <UtensilsCrossed className="h-16 w-16 text-muted-foreground/20" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">No restaurants found</h3>
                    <p className="text-muted-foreground text-sm">We couldn&apos;t find any approved restaurants in Surat. Please try again later.</p>
                </div>
            </div>
        </div>
    )
  }

  return <HomeClient initialRestaurants={restaurants} />
}
