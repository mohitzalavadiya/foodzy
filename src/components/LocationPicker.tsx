'use client'

import { MapPin, ChevronDown, Check } from 'lucide-react'
import { useAddressStore } from '@/store/useAddressStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LocationPicker({ variant = 'default' }: { variant?: 'default' | 'transparent' }) {
  const { currentAddress, savedAddresses, setCurrentAddress } = useAddressStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="ghost" 
            className={cn(
                "flex items-center gap-2 px-1 py-1.5 h-auto hover:bg-transparent rounded-none transition-all group",
                variant === 'transparent' ? "text-white" : "text-[#1C1C1C]"
            )}
        >
          <div className="flex items-center gap-1">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm font-medium truncate max-w-[100px] md:max-w-[150px]">
                {currentAddress}
            </span>
            <ChevronDown className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity ml-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent translate="no" align="start" className="w-[300px] p-2 rounded-2xl shadow-2xl border-none bg-background/95 backdrop-blur">
        <DropdownMenuLabel className="font-black italic uppercase tracking-widest text-[10px] opacity-50 px-3 py-2">Saved Addresses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {savedAddresses.map((addr) => (
          <DropdownMenuItem 
            key={addr.id} 
            onClick={() => setCurrentAddress(addr.address)}
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer group hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black italic uppercase tracking-tight">{addr.label}</span>
                    <span className="text-[10px] font-medium text-muted-foreground line-clamp-1">{addr.address}</span>
                </div>
            </div>
            {currentAddress === addr.address && (
                <Check className="h-3 w-3 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer text-primary bg-primary/5 hover:bg-primary/10 justify-center">
            <span className="text-[10px] font-black italic uppercase tracking-widest">Add New Address</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
