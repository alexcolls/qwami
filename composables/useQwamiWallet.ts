/**
 * 🔗 QWAMI Wallet Composable
 * 
 * Wraps solana-wallets-vue with QWAMI-specific functionality.
 * Provides balance tracking and QWAMI token operations.
 */

import { useWallet, useAnchorWallet } from 'solana-wallets-vue'
import { Connection } from '@solana/web3.js'

export const useQwamiWallet = () => {
  const wallet = useWallet()
  const anchorWallet = useAnchorWallet()
  const config = useRuntimeConfig()
  
  // State for balances
  const solBalance = ref<number>(0)
  const qwamiBalance = ref<number>(0)
  const loadingBalance = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get connection
   */
  const getConnection = () => {
    const rpcEndpoint = config.public.solanaRpcEndpoint || 'https://api.devnet.solana.com'
    return new Connection(rpcEndpoint, 'confirmed')
  }

  /**
   * Fetch SOL and QWAMI balances
   */
  const fetchBalances = async () => {
    if (!wallet.connected.value || !wallet.publicKey.value) {
      return
    }

    loadingBalance.value = true
    error.value = null

    try {
      const connection = getConnection()

      // Fetch SOL balance
      const sol = await connection.getBalance(wallet.publicKey.value)
      solBalance.value = sol

      // Fetch QWAMI balance via API
      const mintAddress = config.public.qwamiTokenMint
      if (mintAddress && mintAddress !== 'PLACEHOLDER_MINT_ADDRESS') {
        try {
          const response = await $fetch('/api/qwami/balance', {
            method: 'POST',
            body: {
              walletAddress: wallet.publicKey.value.toBase58(),
            },
          })

          if (response && typeof response === 'object' && 'balance' in response) {
            qwamiBalance.value = (response as any).balance
          }
        } catch (err) {
          console.warn('⚠️ Could not fetch QWAMI balance:', err)
          qwamiBalance.value = 0
        }
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch balances:', err)
      error.value = err.message || 'Failed to fetch balances'
    } finally {
      loadingBalance.value = false
    }
  }

  /**
   * Format SOL balance
   */
  const solBalanceFormatted = computed(() => {
    return (solBalance.value / 1_000_000_000).toFixed(4)
  })

  /**
   * Format QWAMI balance
   */
  const qwamiBalanceFormatted = computed(() => {
    return qwamiBalance.value.toLocaleString()
  })

  /**
   * Short wallet address
   */
  const shortAddress = computed(() => {
    const addr = wallet.publicKey.value?.toBase58()
    if (!addr) return ''
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  })

  /**
   * Watch for connection changes and fetch balances
   */
  watch(() => wallet.connected.value, (connected) => {
    if (connected) {
      fetchBalances()
    } else {
      solBalance.value = 0
      qwamiBalance.value = 0
    }
  }, { immediate: true })

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // From solana-wallets-vue
    ...wallet,
    anchorWallet,
    
    // QWAMI-specific
    solBalance,
    qwamiBalance,
    loadingBalance,
    error,
    solBalanceFormatted,
    qwamiBalanceFormatted,
    shortAddress,
    fetchBalances,
    clearError,
    getConnection,
  }
}

