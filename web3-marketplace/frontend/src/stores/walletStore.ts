import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { api } from '../services/api'

interface WalletState {
  address: string | null
  balance: number
  escrowBalance: number
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      balance: 0,
      escrowBalance: 0,

      connectWallet: async () => {
        try {
          // In a real app, this would integrate with wallet provider
          // For now, we'll use the first wallet from the blockchain
          const wallets = await api.get('/users')

          if (wallets.data.data.length > 0) {
            const wallet = wallets.data.data[0]
            set({ address: wallet.address })
            await get().refreshBalance()
            toast.success('Wallet connected!')
          } else {
            // Create a new wallet
            const newWallet = await api.post('/users/wallet', {
              name: `User-${Date.now()}`
            })
            set({ address: newWallet.data.data.address })
            toast.success('New wallet created!')
          }
        } catch (error) {
          toast.error('Failed to connect wallet')
          console.error(error)
        }
      },

      disconnectWallet: () => {
        set({ address: null, balance: 0, escrowBalance: 0 })
        toast.success('Wallet disconnected')
      },

      refreshBalance: async () => {
        const { address } = get()
        if (!address) return

        try {
          const response = await api.get(`/users/${address}`)
          set({
            balance: response.data.data.balance.blockchain,
            escrowBalance: response.data.data.balance.escrow,
          })
        } catch (error) {
          console.error('Failed to refresh balance:', error)
        }
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
)
