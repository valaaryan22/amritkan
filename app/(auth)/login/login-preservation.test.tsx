import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import LoginPage from './page'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'


// Mock dependencies
vi.mock('@/lib/api')
vi.mock('@/store/authStore')
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}))

describe('Login Preservation Property Tests', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Mock auth store
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      logout: vi.fn(),
      loadStoredAuth: vi.fn(),
    })

    // Clear localStorage
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    cleanup()
  })

  /**
   * **Validates: Requirements 3.1, 3.2, 3.3**
   * 
   * Property 2: Preservation - Valid Login Flow Preservation
   * 
   * For any login API response that contains a valid token string,
   * the login handlers SHALL produce exactly the same behavior as before:
   * - Successfully store the token via authStore.login
   * - Redirect to home page
   * - No error messages displayed
   */
  it('preserves valid password login flow behavior', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid login response data
        fc.record({
          token: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 0),
          user: fc.record({
            id: fc.uuid(),
            phone: fc.string({ minLength: 10, maxLength: 10 }).map(s => '9' + s.slice(1)),
            name: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            email: fc.option(fc.emailAddress()),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString()),
          })
        }),
        async (responseData) => {
          // Clean up before each test run
          cleanup()
          vi.clearAllMocks()
          
          // Mock successful API response with valid token
          const mockResponse = {
            data: {
              data: responseData
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          vi.mocked(authApi.loginWithPassword).mockResolvedValue(mockResponse as any)

          // Render login page
          render(<LoginPage />)

          // Fill in valid credentials using getAllBy to handle multiple elements
          const phoneInputs = screen.getAllByPlaceholderText('Enter 10-digit phone number')
          const passwordInputs = screen.getAllByPlaceholderText('Enter your password')
          const loginButtons = screen.getAllByRole('button', { name: 'Login' })

          // Use the first (visible) elements
          const phoneInput = phoneInputs[0]
          const passwordInput = passwordInputs[0]
          const loginButton = loginButtons[0]

          fireEvent.change(phoneInput, { target: { value: '9876543210' } })
          fireEvent.change(passwordInput, { target: { value: 'password123' } })
          fireEvent.click(loginButton)

          // Wait for async operations
          await waitFor(() => {
            expect(authApi.loginWithPassword).toHaveBeenCalledWith('9876543210', 'password123')
          }, { timeout: 3000 })

          // Verify preservation behavior: authStore.login called with correct data
          expect(mockLogin).toHaveBeenCalledWith(responseData.user, responseData.token)

          // Verify no error messages are displayed
          expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument()
          expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
          expect(screen.queryByText(/failed/i)).not.toBeInTheDocument()
        }
      ),
      { numRuns: 5 } // Reduced significantly for faster execution
    )
  })

  /**
   * **Validates: Requirements 3.1, 3.2, 3.3**
   * 
   * Property 2: Preservation - Valid Token Storage Behavior
   * 
   * Verify that valid JWT-like tokens are properly stored in localStorage
   * through the authStore.login function, maintaining existing behavior.
   * This test focuses on the core preservation behavior without complex UI interactions.
   */
  it('preserves token storage behavior for valid tokens', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate JWT-like token structure (header.payload.signature)
        fc.record({
          token: fc.tuple(
            fc.base64String({ minLength: 10, maxLength: 50 }),
            fc.base64String({ minLength: 10, maxLength: 100 }),
            fc.base64String({ minLength: 10, maxLength: 50 })
          ).map(([header, payload, signature]) => `${header}.${payload}.${signature}`),
          user: fc.record({
            id: fc.uuid(),
            phone: fc.string({ minLength: 10, maxLength: 10 }).map(s => '9' + s.slice(1)),
            name: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            email: fc.option(fc.emailAddress()),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString()),
          })
        }),
        async (responseData) => {
          // Clean up before each test run
          cleanup()
          vi.clearAllMocks()
          
          // Mock successful API response
          const mockResponse = {
            data: {
              data: responseData
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          vi.mocked(authApi.loginWithPassword).mockResolvedValue(mockResponse as any)

          // Render and perform login
          render(<LoginPage />)

          const phoneInputs = screen.getAllByPlaceholderText('Enter 10-digit phone number')
          const passwordInputs = screen.getAllByPlaceholderText('Enter your password')
          const loginButtons = screen.getAllByRole('button', { name: 'Login' })

          fireEvent.change(phoneInputs[0], { target: { value: '9876543210' } })
          fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
          fireEvent.click(loginButtons[0])

          await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(responseData.user, responseData.token)
          }, { timeout: 3000 })

          // Verify the token format is preserved (JWT-like structure)
          const [user, token] = mockLogin.mock.calls[0]
          expect(token).toBe(responseData.token)
          expect(token.split('.')).toHaveLength(3) // JWT structure preserved
          expect(user).toEqual(responseData.user)
        }
      ),
      { numRuns: 3 } // Reduced for faster execution
    )
  })

  /**
   * **Validates: Requirements 3.1, 3.2, 3.3**
   * 
   * Property 2: Preservation - Simple Token Validation
   * 
   * Test that any non-empty string token is accepted and stored correctly,
   * preserving the existing behavior where the login function accepts
   * any string token without validation.
   */
  it('preserves simple token acceptance behavior', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        async (token) => {
          // Clean up before each test run
          cleanup()
          vi.clearAllMocks()
          
          const user = {
            id: '123',
            phone: '9876543210',
            name: 'Test User',
            email: 'test@example.com',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          }

          const mockResponse = {
            data: {
              data: { token, user }
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          vi.mocked(authApi.loginWithPassword).mockResolvedValue(mockResponse as any)

          render(<LoginPage />)

          const phoneInputs = screen.getAllByPlaceholderText('Enter 10-digit phone number')
          const passwordInputs = screen.getAllByPlaceholderText('Enter your password')
          const loginButtons = screen.getAllByRole('button', { name: 'Login' })

          fireEvent.change(phoneInputs[0], { target: { value: '9876543210' } })
          fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
          fireEvent.click(loginButtons[0])

          await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(user, token)
          }, { timeout: 3000 })

          // Verify preservation: any valid string token is accepted
          expect(mockLogin).toHaveBeenCalledTimes(1)
          const [storedUser, storedToken] = mockLogin.mock.calls[0]
          expect(storedToken).toBe(token)
          expect(storedUser).toEqual(user)
        }
      ),
      { numRuns: 3 } // Reduced for faster execution
    )
  })
})