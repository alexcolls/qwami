# 🔗 Solana Wallet Integration

The QWAMI Token app now uses [solana-wallets-vue](https://github.com/lorisleiva/solana-wallets-vue) for comprehensive wallet support!

## ✨ Supported Wallets

Users can now connect with **14+ different wallets**:

### 🔥 Popular Wallets
- **Phantom** - Most popular Solana wallet
- **Solflare** - Feature-rich browser extension
- **Backpack** - Modern multi-chain wallet
- **Glow** - Security-focused wallet
- **Slope** - Mobile-first wallet

### 🌐 Browser Extension Wallets
- **Coinbase Wallet** - From the Coinbase exchange
- **Exodus** - Multi-currency wallet
- **Trust Wallet** - Binance's official wallet
- **Math Wallet** - Multi-chain DeFi wallet
- **Coin98** - Southeast Asia popular wallet
- **Bitpie** - Bitcoin & altcoin wallet

### 🔐 Hardware Wallets
- **Ledger** - Hardware wallet support

### 🛠️ Other Wallets
- **Torus** - Social login wallet
- **Sollet** - Web-based wallet

## 📁 Integration Files

### Plugin
- `plugins/solana.client.ts` - Initializes solana-wallets-vue with all wallet adapters

### Composables
- `composables/useQwamiWallet.ts` - Wraps solana-wallets-vue with QWAMI-specific features (balance tracking)
- `composables/useAnchor.ts` - Token burn operations for Energy, Connections, Metamorphosis
- `composables/useQwamiStats.ts` - Token statistics and calculations

### Components
- `components/Qwami/GlassWindow.vue` - Main mint/burn interface with WalletMultiButton
- `components/Qwami/TokenInfo.vue` - Token stats display
- `app/pages/app.vue` - Dedicated app page with full functionality

### API Endpoints
- `server/api/qwami/balance.post.ts` - Get QWAMI token balance
- `server/api/qwami/purchase.post.ts` - Server-side minting
- `server/api/qwami/stats.get.ts` - Token statistics

## 🎨 UI Features

- **WalletMultiButton** - Beautiful dropdown to select and connect wallets
- **Dark mode support** - Matches QWAMI aesthetic
- **Real-time balance tracking** - SOL and QWAMI balances
- **Graceful error handling** - User-friendly error messages
- **Simulation mode** - Test without deployed contracts

## 🚀 Usage

### For Users
1. Visit `/app` page
2. Click "Select Wallet" button
3. Choose from 14+ supported wallets
4. Connect and start minting/burning QWAMI!

### For Developers

```typescript
// Use the QWAMI wallet composable
const wallet = useQwamiWallet()

// Access wallet state
console.log(wallet.connected.value) // boolean
console.log(wallet.publicKey.value) // PublicKey | null
console.log(wallet.solBalance.value) // number (lamports)
console.log(wallet.qwamiBalance.value) // number (tokens)

// Connect/disconnect
await wallet.connect()
await wallet.disconnect()

// Fetch balances
await wallet.fetchBalances()
```

## 🔧 Configuration

Set in `nuxt.config.ts` runtime config:

```typescript
runtimeConfig: {
  public: {
    solanaNetwork: 'devnet', // or 'mainnet-beta'
    solanaRpcEndpoint: 'https://api.devnet.solana.com',
    qwamiTokenMint: 'YOUR_MINT_ADDRESS',
    devnetSimulation: true, // Enable for testing
  }
}
```

## 📦 Dependencies

- `solana-wallets-vue@^0.7.1` - Vue 3 wallet integration
- `@solana/wallet-adapter-wallets@^0.19.37` - Official wallet adapters
- `@solana/wallet-adapter-base@^0.9.23` - Base adapter types
- `@solana/web3.js@^1.95.4` - Solana JavaScript SDK
- `@solana/spl-token@^0.4.9` - SPL Token operations

## 🎯 Next Steps

1. Deploy QWAMI token program to Solana
2. Update `.env` with real contract addresses
3. Test minting and burning on devnet
4. Add payment verification for minting
5. Deploy to mainnet 🚀

## 📚 Resources

- [solana-wallets-vue GitHub](https://github.com/lorisleiva/solana-wallets-vue)
- [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter)
- [Phantom Wallet](https://phantom.app)
- [Solana Documentation](https://docs.solana.com)

---

**Built with 💜 for the KWAMI community**

