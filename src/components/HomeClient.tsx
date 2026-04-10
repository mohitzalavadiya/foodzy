'use client'

import { RestaurantCard } from '@/components/RestaurantCard'
import Image from 'next/image'
import Link from 'next/link'
import { UtensilsCrossed, Filter, ChevronDown, Star, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Restaurant } from '@/lib/api'

interface HomeClientProps {
  initialRestaurants: Restaurant[]
}

const categories = [
  { id: 'delivery', name: 'Delivery', icon: '/icons/delivery.png', activeIcon: '/icons/delivery.png', color: 'bg-[#FCEEC0]' },
  { id: 'dining', name: 'Dining Out', icon: '/icons/dining.png', activeIcon: '/icons/dining.png', color: 'bg-[#E5F3F3]' },
  { id: 'nightlife', name: 'Nightlife', icon: '/icons/nightlife.png', activeIcon: '/icons/nightlife.png', color: 'bg-[#EDF4FF]' },
]

const collections = [
  { id: '1', title: 'Great Cafes', count: '11 Places', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80' },
  { id: '2', title: 'Gujarati Delicacies', count: '9 Places', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80' },
  { id: '3', title: 'Luxury Dining', count: '15 Places', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80' },
  { id: '4', title: 'Must-visit in Surat', count: '20 Places', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' },
]

export function HomeClient({ initialRestaurants }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState('delivery')

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest">
            <span className="hover:text-primary cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer">India</span>
            <span>/</span>
            <span className="text-foreground">Surat Restaurants</span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="container mx-auto px-4 border-b md:border-none mb-4 md:mb-12">
        <div className="flex gap-4 md:gap-14 overflow-x-auto no-scrollbar py-2">
           {categories.map((cat) => (
             <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                    "flex items-center gap-3 md:gap-5 pb-5 border-b-2 transition-all group shrink-0",
                    activeTab === cat.id ? "border-[#EF4F5F]" : "border-transparent opacity-60 hover:opacity-100"
                )}
             >
                <div className={cn(
                    "h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center p-3 transition-all group-hover:scale-105 shadow-sm relative overflow-hidden",
                    activeTab === cat.id ? cat.color : "bg-zinc-100 dark:bg-zinc-800"
                )}>
                    <Image 
                        src={activeTab === cat.id ? (cat.activeIcon || cat.icon) : cat.icon} 
                        alt={cat.name} 
                        fill
                        className="object-contain p-2.5" 
                    />
                </div>
                <span className={cn(
                    "text-lg md:text-2xl font-medium transition-colors",
                    activeTab === cat.id ? "text-[#EF4F5F] font-bold" : "text-[#828282] font-medium"
                )}>
                    {cat.name}
                </span>
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 pb-16">
        {/* Collections Section */}
        {activeTab === 'dining' && (
            <section className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1C1C1C] dark:text-white">Collections</h2>
                        <p className="text-[#828282] text-sm md:text-lg">Explore curated lists of top restaurants, cafes, pubs, and bars in Surat, based on trends</p>
                    </div>
                    <Link href="#" className="hidden md:flex items-center gap-1 text-[#EF4F5F] text-sm font-medium hover:underline">
                        All collections in Surat
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {collections.map((coll) => (
                        <div key={coll.id} className="relative aspect-3/4 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                            <Image src={coll.image} alt={coll.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white pr-4">
                                <h4 className="font-bold text-lg md:text-xl mb-1 leading-tight">{coll.title}</h4>
                                <div className="flex items-center gap-1 text-xs md:text-sm font-medium opacity-90 italic">
                                    <span>{coll.count}</span>
                                    <ChevronRight className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Improved Promo Banner */}
        <div className="mb-14 relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl animate-in fade-in zoom-in-95 duration-700">
            <Image 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80" 
                alt="Promo Banner" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-center px-8 md:px-20 space-y-6 md:space-y-8">
                <div className="space-y-2">
                    <h3 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase drop-shadow-md">Get up to</h3>
                    <div className="flex items-baseline gap-4">
                        <span className="text-white text-7xl md:text-9xl font-black italic leading-none drop-shadow-lg">50%</span>
                        <span className="text-white text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-2">OFF</span>
                    </div>
                    <p className="text-white/95 text-xl md:text-3xl font-bold italic tracking-tight drop-shadow-md">on your dining bills with Foodzy</p>
                </div>
                
                <div className="flex">
                    <Button className="bg-[#EF4F5F] hover:bg-[#EF4F5F]/90 text-white rounded-2xl h-14 md:h-16 px-10 md:px-14 text-sm md:text-lg font-black italic uppercase tracking-[0.2em] shadow-2xl transform hover:scale-105 active:scale-95 transition-all">
                        Check out all the restaurants
                    </Button>
                </div>
            </div>
            
            {/* Subtle decorative elements */}
            <div className="absolute top-8 right-8 h-16 w-16 border-t-4 border-r-4 border-white/20 rounded-tr-3xl" />
            <div className="absolute bottom-8 right-8 h-16 w-16 border-b-4 border-r-4 border-white/20 rounded-br-3xl" />
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-[72px] z-30 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 mb-8 border-b md:border-none">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                <Button variant="outline" size="sm" className="rounded-xl border-muted-foreground/20 text-[#1C1C1C] dark:text-white flex items-center gap-2 h-9">
                    <Filter className="h-4 w-4 text-primary" /> Filters
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-muted-foreground/20 text-[#1C1C1C] dark:text-white h-9">
                    Pure Veg
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-muted-foreground/20 text-[#1C1C1C] dark:text-white flex items-center gap-2 h-9">
                    Rating: 4.0+ <ChevronDown className="h-4 w-4 opacity-40" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-muted-foreground/20 text-[#1C1C1C] dark:text-white h-9">
                    Offers
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-muted-foreground/20 text-[#1C1C1C] dark:text-white h-9">
                    Cuisines <ChevronDown className="h-4 w-4 opacity-40" />
                </Button>
            </div>
        </div>

        {/* Restaurant List */}
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
            {activeTab === 'delivery' ? 'Delivery Restaurants in Surat' : 'Best Dining Restaurants in Surat'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {initialRestaurants.map((restaurant, i) => (
              <div 
                key={restaurant.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${(i % 12) * 100}ms` }}
              >
                <RestaurantCard {...restaurant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
