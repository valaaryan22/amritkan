'use client'

import { useQuery } from '@tanstack/react-query'
import { Wallet as WalletIcon, Plus, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react'
import { walletApi } from '@/lib/api'
import { Wallet, Transaction } from '@/types'
import { Button } from '@/components/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function WalletPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      // Clear the success param from URL
      router.replace('/wallet')
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [searchParams, router])

  const { data: wallet, isLoading: isLoadingBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      try {
        const response = await walletApi.getBalance()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data.data as any
        // Normalize: API returns { available, minimumThreshold } but frontend expects { balance, low_balance_threshold }
        return {
          customer_id: data.customer_id || data.customerId || '',
          balance: data.available ?? data.balance ?? 0,
          low_balance_threshold: data.minimumThreshold ?? data.low_balance_threshold ?? 100,
          updated_at: data.updated_at || data.updatedAt || '',
        } as Wallet
      } catch (error) {
         return {
          customer_id: '',
          balance: 0,
          low_balance_threshold: 100,
          updated_at: '',
        } as Wallet
      }
    },
  })

  const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: async () => {
      try {
        const response = await walletApi.getTransactions()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response.data.data as any[]).map((t: any) => ({
          id: t.id,
          wallet_id: t.walletId || t.wallet_id,
          type: (t.type || 'debit').toLowerCase(),
          amount: t.amount || 0,
          description: t.reason || t.description || 'Transaction',
          reference_type: t.referenceType || t.reference_type,
          reference_id: t.referenceId || t.reference_id,
          balance_after: t.balanceAfter ?? t.balance_after ?? 0,
          created_at: t.createdAt || t.created_at,
        })) as Transaction[]
      } catch (error) {
        return []
      }
    },
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([refetchBalance(), refetchTransactions()])
    setIsRefreshing(false)
  }

  const isLoading = isLoadingBalance || isLoadingTransactions
  const showLowBalanceWarning = wallet && wallet.balance < wallet.low_balance_threshold

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Money added successfully!</p>
            <p className="text-sm text-green-700">Your wallet has been updated.</p>
          </div>
        </div>
      )}

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-6 h-6" />
            <span className="text-lg font-medium">Wallet Balance</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/wallet/add-money')}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Money
          </Button>
        </div>
        <div className="text-4xl font-bold mb-2">
          ₹{Number(wallet?.balance || 0).toFixed(2)}
        </div>
        {showLowBalanceWarning && (
          <div className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2 mt-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Low balance! Add money to continue placing orders.
            </span>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="p-16 text-center">
            <WalletIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Yet</h3>
            <p className="text-gray-500 mb-6">Your transaction history will appear here</p>
            <Button onClick={() => router.push('/wallet/add-money')}>Add Money</Button>
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Unknown Date'}
                    </div>
                    {transaction.reference_type && (
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {transaction.reference_type?.replace('_', ' ') || 'Unknown'}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div
                      className={`text-lg font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹{Number(transaction.amount || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Balance: ₹{Number(transaction.balance_after || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
