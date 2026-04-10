import { getServerApi } from '@/lib/api-server-factory'
import { 
  Star, 
  ShieldCheck, 
  UtensilsCrossed, 
  Gift, 
  MapPin, 
  ChevronDown,
  Navigation,
  CheckCircle2,
  Phone,
  Search,
  ChevronRight,
  Bookmark,
  Share2,
  Info,
  Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RestaurantTabs } from '@/components/RestaurantTabs'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let restaurant: any = null
  let menuItems: any[] = []
  let offers: any[] = []
  let fetchError = false

  try {
    const apiInstance = await getServerApi()
    const [restaurantData, offersData] = await Promise.all([
      apiInstance.getRestaurantById(id),
      apiInstance.getRestaurantOffers(id)
    ])

    if (!restaurantData) {
      fetchError = true
    } else {
      restaurant = restaurantData
      menuItems = restaurantData.menu_items || []
      offers = offersData || []
    }
  } catch (error) {
    console.error('Error fetching restaurant details:', error)
    fetchError = true
  }

  // Graceful not-found screen
  if (fetchError || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center gap-6">
        <div className="bg-muted p-10 rounded-full shadow-inner">
          <UtensilsCrossed className="h-16 w-16 text-muted-foreground/30" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Restaurant Not Found</h1>
        <p className="text-muted-foreground font-medium max-w-sm">
          This restaurant is not available or is pending approval. Check back later!
        </p>
        <Button asChild size="lg" className="rounded-xl">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  const displayRestaurant = restaurant
  const displayMenuItems = menuItems

  return (
    <div className="min-h-screen bg-background">
      {/* Photo Gallery Grid */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-sm">
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer overflow-hidden">
                <Image
                    src={displayRestaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'}
                    alt={displayRestaurant.name}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80"
                    alt="Gallery 1"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80"
                    alt="Gallery 2"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-sm">View Gallery</span>
                </div>
            </div>
        </div>

        {/* Header Info Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2 flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] dark:text-white tracking-tight">
                    {displayRestaurant.name}
                </h1>
                <p className="text-muted-foreground font-medium">{displayRestaurant.category}</p>
                <p className="text-[#828282] text-sm">{displayRestaurant.address}</p>
                <div className="flex items-center gap-4 pt-2 text-sm font-medium">
                    <span className="text-orange-600">Open now</span>
                    <span className="text-[#828282]">11am – 11pm (Today)</span>
                </div>
            </div>

            <div className="flex gap-4 md:gap-8 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-[#24963F] text-white rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                        <span className="font-bold">{displayRestaurant.rating.toFixed(1)}</span>
                        <Star className="h-3 w-3 fill-current" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-sm">1,245</span>
                        <span className="text-[10px] text-muted-foreground border-b border-dashed border-muted-foreground/30">Dining Reviews</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-[#24963F] text-white rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                        <span className="font-bold">4.2</span>
                        <Star className="h-3 w-3 fill-current" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-sm">3.5k</span>
                        <span className="text-[10px] text-muted-foreground border-b border-dashed border-muted-foreground/30">Delivery Reviews</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Buttons Sticky Bar */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-6">
             <Button variant="outline" className="rounded-xl border-[#828282]/30 text-[#1C1C1C] dark:text-white font-medium flex items-center gap-2 px-6 h-10 hover:bg-muted/50">
                 <Star className="h-4 w-4 text-primary" /> Add Review
             </Button>
             <Button variant="outline" className="rounded-xl border-[#828282]/30 text-[#1C1C1C] dark:text-white font-medium flex items-center gap-2 px-6 h-10 hover:bg-muted/50">
                 <ShieldCheck className="h-4 w-4 text-green-600" /> Direction
             </Button>
             <Button variant="outline" className="rounded-xl border-[#828282]/30 text-[#1C1C1C] dark:text-white font-medium flex items-center gap-2 px-6 h-10 hover:bg-muted/50">
                 <Link href="#" className="flex items-center gap-2">Bookmark</Link>
             </Button>
             <Button variant="outline" className="rounded-xl border-[#828282]/30 text-[#1C1C1C] dark:text-white font-medium flex items-center gap-2 px-6 h-10 hover:bg-muted/50">
                 Share
             </Button>
        </div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mt-4">
            <div className="lg:col-span-3">
                <RestaurantTabs restaurant={displayRestaurant} menuItems={displayMenuItems} />
            </div>

            <div className="hidden lg:block space-y-8">
                {/* Table Reservation Card */}
                <div className="bg-card rounded-2xl p-6 border shadow-sm space-y-6">
                    <h3 className="text-xl font-bold tracking-tight text-[#1C1C1C] dark:text-white">Table reservation</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                             <Star className="h-4 w-4 fill-current" /> Flat 15% OFF + 3 more offers
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <div className="flex flex-col gap-1">
                                 <span className="text-[10px] uppercase font-black italic opacity-40">Date</span>
                                 <div className="p-3 rounded-xl border bg-muted/20 text-sm font-bold flex items-center justify-between cursor-pointer">
                                     Tomorrow <ChevronDown className="h-4 w-4 opacity-40" />
                                 </div>
                             </div>
                             <div className="flex flex-col gap-1">
                                 <span className="text-[10px] uppercase font-black italic opacity-40">Guests</span>
                                 <div className="p-3 rounded-xl border bg-muted/20 text-sm font-bold flex items-center justify-between cursor-pointer">
                                     1 guest <ChevronDown className="h-4 w-4 opacity-40" />
                                 </div>
                             </div>
                        </div>
                        <Button className="w-full bg-[#EF4F5F] hover:bg-[#EF4F5F]/90 text-white rounded-xl h-12 font-black italic uppercase tracking-widest text-xs">
                             Book a table
                        </Button>
                    </div>
                </div>

                {/* Direction Card */}
                <div className="bg-card rounded-2xl p-6 border shadow-sm space-y-4">
                    <h3 className="text-xl font-bold tracking-tight text-[#1C1C1C] dark:text-white">Direction</h3>
                    <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
                         <Image 
                            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80" 
                            alt="Map Placeholder" 
                            fill 
                            className="object-cover opacity-60 grayscale"
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg border-2 border-white">
                                 <MapPin className="h-5 w-5 text-white" />
                             </div>
                         </div>
                    </div>
                    <p className="text-[#828282] text-xs leading-relaxed">{displayRestaurant.address}</p>
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold italic text-[11px] h-9 gap-2">
                             <ShieldCheck className="h-3.5 w-3.5 text-[#828282]" /> Copy
                         </Button>
                         <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold italic text-[11px] h-9 gap-2 text-primary border-primary/30">
                             <ShieldCheck className="h-3.5 w-3.5" /> Direction
                         </Button>
                    </div>
                </div>

                {/* Existing Offers Sidebar as fallback or secondary */}
                {offers.length > 0 && (
                    <div className="bg-card rounded-2xl p-6 border space-y-6 shadow-sm">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold tracking-tight text-[#1C1C1C] dark:text-white">Other Offers</h3>
                        </div>
                        <div className="space-y-4">
                            {offers.map((offer, i) => (
                                <div 
                                    key={offer.id} 
                                    className={cn(
                                        "p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md",
                                        offer.color || 'bg-blue-50 text-blue-700 border-blue-100'
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-5 w-5 rounded bg-white flex items-center justify-center p-1 shadow-xs">
                                            <Gift className="h-3 w-3 text-primary" />
                                        </div>
                                        <h4 className="text-sm font-bold truncate">{offer.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2 italic">{offer.description}</p>
                                    <Badge className="bg-white/90 text-black hover:bg-white font-bold text-[9px] py-0.5 px-2 rounded border border-dashed border-muted-foreground/30">
                                        {offer.code}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
