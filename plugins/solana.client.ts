/**
 * 🔌 Solana Wallets Vue Plugin
 * 
 * Initializes solana-wallets-vue with support for dozens of wallets.
 * See: https://github.com/lorisleiva/solana-wallets-vue
 */

import 'solana-wallets-vue/styles.css'
import SolanaWallets from 'solana-wallets-vue'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

// Import wallet adapters
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
  MathWalletAdapter,
  TrustWalletAdapter,
  BitpieWalletAdapter,
  Coin98WalletAdapter,
} from '@solana/wallet-adapter-wallets'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Determine network from config
  const network = (config.public.solanaNetwork || 'devnet') as WalletAdapterNetwork
  
  // Configure wallet options with all supported wallets
  const walletOptions = {
    wallets: [
      // Popular wallets first
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      
      // Browser extension wallets
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new BitpieWalletAdapter(),
      
      // Hardware wallets
      new LedgerWalletAdapter(),
      
      // Other wallets
      new TorusWalletAdapter(),
    ],
    autoConnect: true,
  }

  // Install the plugin
  nuxtApp.vueApp.use(SolanaWallets, walletOptions)
  
  console.log('✅ Solana Wallets initialized with', walletOptions.wallets.length, 'wallet adapters')
})

