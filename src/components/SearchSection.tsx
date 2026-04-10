'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface SearchSectionProps {
  className?: string
}

export function SearchSection({ className }: SearchSectionProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Mock suggestions for now
  const allSuggestions = [
    'Burgers', 'Pizza', 'Italian', 'Sushi', 'Chinese', 'Healthy Food',
    'The Burger Club', 'Pasta Fresca', 'Sushi Zen', 'Spice Route'
  ]

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true)
      const filtered = allSuggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      )
      setTimeout(() => {
        setSuggestions(filtered)
        setLoading(false)
      }, 300)
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4", className)}>
      <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 border-none">
        {/* Location Picker (Static for demo) */}
        <div className="flex items-center gap-2 px-4 py-2 border-r hidden md:flex min-w-[180px]">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm font-black italic truncate">New Delhi</span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="flex items-center gap-3 px-4 py-2 w-full">
            <Search className="h-5 w-5 text-muted-foreground" />
            <form onSubmit={handleSearch} className="flex-1">
              <Input
                placeholder="Search for restaurant, cuisine or a dish"
                className="border-none focus-visible:ring-0 text-md font-medium h-10 w-full p-0 bg-transparent placeholder:italic"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
            </form>
          </div>

          {/* Suggestions Dropdown */}
          {isFocused && (query.length > 0 || suggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              {loading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-black uppercase italic tracking-widest">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(s)
                        router.push(`/search?q=${encodeURIComponent(s)}`)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-muted rounded-xl transition-colors flex items-center gap-3 group"
                    >
                      <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm font-bold italic tracking-tight">{s}</span>
                    </button>
                  ))}
                </div>
              ) : query.length > 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                    <p className="text-xs font-black italic uppercase tracking-widest">No results for &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="py-2">
                    <p className="px-4 py-2 text-[10px] font-black italic uppercase tracking-widest text-muted-foreground/50">Popular Searches</p>
                    {allSuggestions.slice(0, 5).map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(s)
                            router.push(`/search?q=${encodeURIComponent(s)}`)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-muted rounded-xl transition-colors flex items-center gap-3 group"
                        >
                          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          <span className="text-sm font-bold italic tracking-tight">{s}</span>
                        </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Button 
            className="hidden md:flex h-12 px-8 rounded-xl font-black italic uppercase tracking-widest text-xs hover:scale-105 transition-transform"
            onClick={() => handleSearch()}
        >
          Explore
        </Button>
      </div>
    </div>
  )
}
