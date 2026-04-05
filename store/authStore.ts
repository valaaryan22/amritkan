import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  loadStoredAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user: User, token: string) => {
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  loadStoredAuth: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false })
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        const user = JSON.parse(userStr) as User
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('[Auth] Error loading stored auth:', error)
      set({ isLoading: false })
    }
  },
}))
