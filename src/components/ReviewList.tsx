'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, User, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
}

interface ReviewListProps {
  restaurantId: string
}

export function ReviewList({ restaurantId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

      if (!error) {
        setReviews(data || [])
      }
      setLoading(false)
    }

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchReviews()
    checkUser()
  }, [restaurantId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to leave a review')
      return
    }

    setSubmitting(true)
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        restaurant_id: restaurantId,
        user_id: user.id,
        rating,
        comment
      })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Review submitted successfully!')
      setReviews([data, ...reviews])
      setIsOpen(false)
      setComment('')
      setRating(5)
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-muted/20 p-6 rounded-2xl border border-dashed border-muted-foreground/20">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-muted-foreground italic font-medium">Hear what others have to say</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold italic tracking-tighter uppercase px-6">
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Share Your Experience</DialogTitle>
              <DialogDescription className="italic font-medium">
                Your feedback helps us and the restaurant improve.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4">
                <p className="font-bold text-sm uppercase italic tracking-widest text-muted-foreground">Rate your experience</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-full transition-all duration-300 ${rating >= star ? 'bg-primary text-white scale-110' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black italic uppercase tracking-widest text-muted-foreground pl-1">Tell us more</label>
                <Textarea
                  placeholder="The food was amazing! Loved the spices and the temperature..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="rounded-2xl min-h-[120px] focus-visible:ring-primary border-2 p-4 italic font-medium"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-black italic uppercase tracking-widest" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Post Review'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {loading ? (
           <div className="space-y-4">
               {[1, 2].map(i => <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-2xl" />)}
           </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-muted/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase tracking-tighter">Foodie User</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground italic font-medium">
                        <Clock className="h-3 w-3" /> {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white flex items-center gap-1 rounded-lg px-2 py-1">
                    {review.rating} <Star className="h-3 w-3 fill-current" />
                  </Badge>
                </div>
                <p className="text-muted-foreground italic font-medium leading-relaxed leading-relaxed">
                  &quot;{review.comment}&quot;
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center bg-muted/10 rounded-[2.5rem] border border-dashed border-muted-foreground/20">
              <p className="text-sm font-bold italic uppercase tracking-widest text-muted-foreground/40">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  )
}
