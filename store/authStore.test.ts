import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './authStore'
import { User } from '@/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
})

describe('authStore', () => {
  beforeEach(() => {
    localStorageMock.clear()
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    })
  })

  it('should initialize with default state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(true)
  })

  it('should login and store auth data', () => {
    const mockUser: User = {
      id: '1',
      phone: '9876543210',
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const mockToken = 'test-token-123'

    useAuthStore.getState().login(mockUser, mockToken)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)

    // Verify localStorage
    expect(localStorage.getItem('authToken')).toBe(mockToken)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })

  it('should logout and clear auth data', () => {
    const mockUser: User = {
      id: '1',
      phone: '9876543210',
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const mockToken = 'test-token-123'

    // First login
    useAuthStore.getState().login(mockUser, mockToken)
    
    // Then logout
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)

    // Verify localStorage is cleared
    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('should load stored auth from localStorage', () => {
    const mockUser: User = {
      id: '1',
      phone: '9876543210',
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const mockToken = 'test-token-123'

    // Manually set localStorage
    localStorage.setItem('authToken', mockToken)
    localStorage.setItem('user', JSON.stringify(mockUser))

    // Load stored auth
    useAuthStore.getState().loadStoredAuth()

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
  })

  it('should handle missing stored auth gracefully', () => {
    // No data in localStorage
    useAuthStore.getState().loadStoredAuth()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
  })

  it('should handle corrupted localStorage data', () => {
    // Set invalid JSON
    localStorage.setItem('authToken', 'test-token')
    localStorage.setItem('user', 'invalid-json{')

    // Should not throw error
    expect(() => {
      useAuthStore.getState().loadStoredAuth()
    }).not.toThrow()

    const state = useAuthStore.getState()
    expect(state.isLoading).toBe(false)
  })
})
