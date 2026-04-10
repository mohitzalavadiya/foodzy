import { SupabaseClient } from '@supabase/supabase-js'

// --- Types ---

export interface Restaurant {
  id: string
  name: string
  image_url: string
  rating: number
  category: string
  address: string
  description: string
  is_approved: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  category: string
  image_url: string
  is_available: boolean
  restaurant_id: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  restaurantId: string
  restaurantName: string
  image_url?: string
}

export interface Order {
  id: string
  user_id: string
  restaurant_id: string
  total_amount: number
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  delivery_address: string
  created_at: string
  restaurants?: { name: string }
  items?: OrderItem[]
}

export interface Review {
  id: string
  restaurant_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
}

export interface Offer {
  id: string
  restaurant_id: string
  title: string
  description: string
  code: string
  discount_percentage: number
  max_discount: number
  min_order_value: number
  color: string
}

export interface Profile {
  id: string
  role: 'customer' | 'admin' | 'restaurant_owner'
  full_name?: string
  avatar_url?: string
  created_at: string
}

// --- API Service Factory ---

/**
 * Creates an API service instance using the provided Supabase client.
 * This allows the service to be used on both server and client without
 * leaking server-only dependencies.
 */
export const createApiService = (supabase: SupabaseClient) => ({
  // Restaurants
  async getRestaurants() {
    // Try with is_approved filter first; if column doesn't exist, fall back to all
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_approved', true)
      .order('rating', { ascending: false })

    if (error) {
      if (error.message?.includes('is_approved') || error.code === '42703') {
        const { data: fallback, error: fallbackError } = await supabase
          .from('restaurants')
          .select('*')
          .order('rating', { ascending: false })
        if (fallbackError) throw new Error(fallbackError.message)
        return (fallback as Restaurant[]) || []
      }
      throw new Error(error.message)
    }
    return (data as Restaurant[]) || []
  },

  async getRestaurantById(id: string) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*, menu_items(*)')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data as (Restaurant & { menu_items: MenuItem[] }) | null
  },

  async getRestaurantOffers(restaurantId: string) {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('restaurant_id', restaurantId)

    if (error) {
        return [
            { id: '1', restaurant_id: restaurantId, title: '40% OFF up to ₹80', code: 'WELCOMEGT', description: 'Use code WELCOMEGT', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { id: '2', restaurant_id: restaurantId, title: 'Flat ₹50 Cashback', code: 'PAYTM50', description: 'Using Paytm Wallet', color: 'bg-purple-50 text-purple-700 border-purple-100' }
        ] as any[]
    }
    return data as Offer[]
  },

  // Orders
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, restaurants(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as Order[]
  },

  async getOrderTracking(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, restaurants(name)')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as Order
  },

  // Reviews
  async getRestaurantReviews(restaurantId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data as Review[]
  },

  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw new Error(error.message)
    return data as Profile
  }
})
