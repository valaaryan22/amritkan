import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, generateId, cn } from './utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('should format currency in INR', () => {
      expect(formatCurrency(100)).toBe('₹100')
      expect(formatCurrency(1000)).toBe('₹1,000')
      expect(formatCurrency(1234.56)).toBe('₹1,234.56')
    })
  })

  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('2024')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('foo', { bar: true })).toBe('foo bar')
      expect(cn('foo', { bar: false })).toBe('foo')
    })
  })
})
