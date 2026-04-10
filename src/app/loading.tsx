import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Loader2 className="absolute inset-0 h-16 w-16 animate-spin-slow text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-black italic tracking-tight uppercase">Loading Deliciousness...</h2>
        <p className="text-muted-foreground font-medium italic">Preparing your experience with love</p>
      </div>
    </div>
  )
}
