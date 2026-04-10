import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Address {
  id: string
  label: string // 'Home', 'Work', 'Other'
  address: string
  isDefault: boolean
}

interface AddressStore {
  currentAddress: string
  savedAddresses: Address[]
  setCurrentAddress: (address: string) => void
  addAddress: (address: Address) => void
  removeAddress: (id: string) => void
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      currentAddress: 'Janpath, New Delhi',
      savedAddresses: [
        { id: '1', label: 'Home', address: 'Janpath, New Delhi', isDefault: true },
        { id: '2', label: 'Work', address: 'Cyber City, Gurgaon', isDefault: false }
      ],
      setCurrentAddress: (address) => set({ currentAddress: address }),
      addAddress: (address) => set((state) => ({ savedAddresses: [...state.savedAddresses, address] })),
      removeAddress: (id) => set((state) => ({ savedAddresses: state.savedAddresses.filter(a => a.id !== id) })),
    }),
    {
      name: 'address-storage',
    }
  )
)
