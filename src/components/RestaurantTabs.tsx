'use client'

import { useState } from 'react'
import { MenuList } from './MenuList'
import { ReviewList } from './ReviewList'
import { cn } from '@/lib/utils'
import { Info, Utensils, Star, Camera, BookOpen } from 'lucide-react'

interface RestaurantTabsProps {
  restaurant: any
  menuItems: any[]
}

export function RestaurantTabs({ restaurant, menuItems }: RestaurantTabsProps) {
  const [activeTab, setActiveTab] = useState('order')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'order', label: 'Order Online', icon: Utensils },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'menu', label: 'Menu', icon: BookOpen },
  ]

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-40 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 border-b-2 transition-all font-medium text-sm md:text-base whitespace-nowrap flex items-center gap-2",
                activeTab === tab.id 
                  ? "border-primary text-primary font-bold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {/* <tab.icon className="h-4 w-4" /> */}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'order' && (
          <MenuList 
            items={menuItems} 
            restaurantId={restaurant.id} 
            restaurantName={restaurant.name} 
          />
        )}
        
        {activeTab === 'overview' && (
          <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Dining Offers Section */}
            <section className="space-y-6">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-[#1C1C1C] dark:text-white">Dining Offers</h3>
                    <p className="text-[#828282] text-sm font-medium">Tap on any offer to know more</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border bg-linear-to-br from-blue-500 to-blue-700 text-white space-y-8 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 group">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] uppercase font-black italic tracking-widest opacity-80">Pre-book Offer</span>
                             <h4 className="text-lg font-black italic uppercase leading-none">Flat 15% OFF</h4>
                             <p className="text-[10px] opacity-70 italic">Valid till 11:59PM today</p>
                         </div>
                         <div className="pt-2 border-t border-white/20">
                             <span className="text-[10px] font-bold italic opacity-90 group-hover:underline">Booking required</span>
                         </div>
                    </div>

                    <div className="p-5 rounded-2xl border bg-white dark:bg-zinc-800 space-y-8 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 group border-zinc-100 shadow-sm">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] uppercase font-black italic tracking-widest text-[#EF4F5F]">Instant Offer</span>
                             <h4 className="text-lg font-black italic uppercase leading-none text-[#1C1C1C] dark:text-white">Flat 10% OFF</h4>
                             <p className="text-[10px] text-[#828282] italic">on bill payments</p>
                         </div>
                         <div className="pt-2 border-t border-zinc-100">
                             <span className="text-[10px] font-bold italic text-[#828282] opacity-0 group-hover:opacity-100 transition-opacity">View details</span>
                         </div>
                    </div>

                    <div className="p-5 rounded-2xl border bg-white dark:bg-zinc-800 space-y-8 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 group border-zinc-100 shadow-sm">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] uppercase font-black italic tracking-widest text-orange-500">Surprise</span>
                             <h4 className="text-lg font-black italic uppercase leading-none text-[#1C1C1C] dark:text-white">Get a scratch card</h4>
                             <p className="text-[10px] text-[#828282] italic">after every transaction</p>
                         </div>
                         <div className="pt-2 border-t border-zinc-100">
                             <span className="text-[10px] font-bold italic text-[#828282] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Exclusive for you</span>
                         </div>
                    </div>

                    <div className="p-5 rounded-2xl border bg-white dark:bg-zinc-800 space-y-8 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 group border-zinc-100 shadow-sm">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] uppercase font-black italic tracking-widest text-indigo-500">Bank Offer</span>
                             <h4 className="text-lg font-black italic uppercase leading-none text-[#1C1C1C] dark:text-white truncate">Up to ₹500 OFF</h4>
                             <p className="text-[10px] text-[#828282] italic">on credit/debit cards</p>
                         </div>
                         <div className="pt-2 border-t border-zinc-100">
                             <span className="text-[10px] font-bold italic text-[#828282] opacity-0 group-hover:opacity-100 transition-opacity">7+ cards available</span>
                         </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold text-[#1C1C1C] dark:text-white">Menu</h3>
                    <span className="text-[#EF4F5F] text-sm font-bold italic border-b-2 border-transparent hover:border-[#EF4F5F] cursor-pointer transition-all">See all menus</span>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h4 className="text-[11px] uppercase font-black italic tracking-widest text-[#828282] mb-3">Cuisines</h4>
                        <div className="flex flex-wrap gap-2">
                             {(restaurant.category || "").split(',').filter(Boolean).map((cat: string) => (
                                 <span key={cat} className="px-4 py-1.5 rounded-full border border-zinc-200 text-[#1C1C1C] dark:text-white text-xs font-bold italic uppercase tracking-tighter hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                                     {cat.trim()}
                                 </span>
                             ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                        <div className="space-y-4">
                             <h4 className="text-[11px] uppercase font-black italic tracking-widest text-[#828282]">Average Cost</h4>
                             <div className="space-y-1">
                                 <p className="text-lg font-bold text-[#1C1C1C] dark:text-white">₹1,000 for two people (approx.)</p>
                                 <p className="text-[10px] text-[#828282] italic">Exclusive of applicable taxes and charges, if any</p>
                             </div>
                             <div className="pt-2">
                                 <p className="text-xs text-[#1C1C1C] dark:text-white font-medium italic underline underline-offset-4 decoration-dotted decoration-zinc-300">Digital payments accepted</p>
                             </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[11px] uppercase font-black italic tracking-widest text-[#828282]">More Info</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs font-semibold text-[#1C1C1C] dark:text-zinc-300">
                                <li className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">✓</div>
                                    Home Delivery
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">✓</div>
                                    Takeaway Available
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">✓</div>
                                    Vegetarian Only
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">✓</div>
                                    Indoor Seating
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">✓</div>
                                    Free Parking
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        )}

        {activeTab === 'reviews' && (
          <ReviewList restaurantId={restaurant.id} />
        )}

        {(activeTab === 'photos' || activeTab === 'menu') && (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                <Camera className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">Coming soon!</p>
            </div>
        )}
      </div>
    </div>
  )
}
