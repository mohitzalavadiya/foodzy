'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-black italic tracking-tight uppercase">Oops! Something went wrong</h2>
        <p className="text-muted-foreground font-medium italic">
          We encountered an unexpected error while preparing your experience. Don&apos;t worry, we&apos;re on it!
        </p>
        {error.digest && (
          <p className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-widest mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => reset()}
          className="rounded-xl font-bold italic uppercase tracking-widest px-8"
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-xl font-bold italic uppercase tracking-widest px-8"
          >
            <Home className="mr-2 h-4 w-4" /> Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
