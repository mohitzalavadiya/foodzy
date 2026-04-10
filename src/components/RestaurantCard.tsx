import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RestaurantCardProps {
  id: string
  name: string
  image_url?: string
  rating: number
  category: string
  address?: string
  description?: string
}

export function RestaurantCard({
  id,
  name,
  image_url,
  rating,
  category,
  address,
  description
}: RestaurantCardProps) {
  const imageUrl = image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'

  return (
    <Link href={`/restaurant/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all border border-transparent hover:border-border group bg-transparent duration-300 rounded-2xl">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-sm flex items-center justify-center bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
          
          {/* Promoted Tag */}
          <div className="absolute top-2 left-2 bg-[#F2F2F2]/90 backdrop-blur-sm text-[#4F4F4F] text-[10px] font-medium px-2 py-0.5 rounded shadow-sm z-10">
            Promoted
          </div>

          {/* Discount Badge */}
          <div className="absolute bottom-4 left-0 bg-[#2563EB] text-white font-bold text-[12px] py-1 px-3 pr-5 rounded-r-md shadow-lg z-10">
            Flat 10% OFF
          </div>
          
          <div className="absolute bottom-4 right-2 bg-white/90 backdrop-blur-md text-[#1C1C1C] text-[11px] font-bold py-1 px-2.5 rounded-lg border-none shadow-sm z-10">
            31 min
          </div>
        </div>
        
        <CardContent className="pt-3 px-1 space-y-1">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-bold text-lg text-[#1C1C1C] dark:text-white truncate leading-tight group-hover:text-primary transition-colors">{name}</h3>
            <div className="bg-[#24963F] text-white shrink-0 flex items-center gap-1 rounded-md px-1.5 py-0.5 shadow-sm">
              <span className="text-[11px] font-bold">{rating.toFixed(1)}</span> <Star className="h-2.5 w-2.5 fill-current" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[#828282] text-sm">
            <p className="truncate max-w-[65%] font-medium">
                {description || 'North Indian • Chinese • Italian'}
            </p>
            <p className="font-medium">₹200 for one</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
