import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
  restaurantName: string
  image?: string
}

interface CartStore {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      addItem: (item) => {
        const currentItems = get().items
        const currentRestaurantId = get().restaurantId
        const existingItem = currentItems.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          })
        } else {
          // Check if adding from a different restaurant
          if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
             // We'll throw an error or handle it in the UI. 
             // For simplicity, let's keep the logic but we'll use a better UI later.
             // If we want Foodzy-like behavior, we should NOT add it here if it's different.
             // Let's assume the UI will handle the confirmation before calling addItem if different.
             throw new Error('RESTAURANT_MISMATCH')
          } else {
            set({ 
              items: [...currentItems, item],
              restaurantId: item.restaurantId,
              restaurantName: item.restaurantName
            })
          }
        }
      },
      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id)
        set({ 
          items: newItems,
          restaurantId: newItems.length > 0 ? get().restaurantId : null,
          restaurantName: newItems.length > 0 ? get().restaurantName : null
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          })
        }
      },
      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
