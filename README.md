# 🌕 QWAMI Token - Mint & Burn Interface

Beautiful single-page app (SPA) for minting and burning QWAMI tokens on Solana.

## 🎯 Overview

QWAMI is the utility token powering the Quami AI ecosystem. This app provides a simple, elegant interface for:
- 💰 **Minting** tokens (public purchase via server-side authority)
- 🔥 **Burning** tokens (client-side, owner-signed)
- 📊 Viewing token balances (SOL & QWAMI)
- 📚 Learning about token utility, economics, and governance

## 🏗️ Tech Stack

- **Framework**: Nuxt 4 (SPA mode, `ssr: false`)
- **UI**: Nuxt UI + @alexcolls/nuxt-ux
- **Blockchain**: Solana (devnet)
- **Smart Contract**: Anchor (Rust)
- **Wallet**: Phantom
- **State Management**: Pinia

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (or Bun)
- Phantom wallet extension
- Solana CLI (for deployment)
- Anchor Framework 0.30+ (for program deployment)

### Installation

```bash
# Install dependencies
bun install  # or npm install

# Copy environment template
cp .env.sample .env

# Start development server
bun dev  # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Edit `.env` with your deployed program details:

```env
# Network
NUXT_PUBLIC_SOLANA_NETWORK=devnet
NUXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# QWAMI Token (fill after deployment)
NUXT_PUBLIC_QWAMI_TOKEN_MINT=<mint_address>
NUXT_PUBLIC_QWAMI_TOKEN_PROGRAM_ID=<program_id>
NUXT_PUBLIC_QWAMI_TOKEN_AUTHORITY=<authority_pubkey>
NUXT_PUBLIC_QWAMI_BASE_PRICE_USD=0.01

# Server-only: Authority private key (base58)
NUXT_QWAMI_AUTHORITY_PRIVATE_KEY=<base58_private_key>
```

### Deploy the Anchor Program

The qwami_token program lives in `../quami/solana/anchor/qwami-token/`.

See [`contracts/idl/README.md`](./contracts/idl/README.md) for full deployment instructions.

**Quick Deploy:**

```bash
cd ../quami/solana/anchor/qwami-token
anchor build
anchor deploy
# Copy Program ID to .env
# Run initialization script
# Copy mint/authority addresses to .env
# Copy IDL: cp target/idl/qwami_token.json ../../qwami/contracts/idl/
```

## 📁 Project Structure

```
qwami/
├── app.vue                     # Root app component
├── nuxt.config.ts              # Nuxt configuration (SPA mode)
├── package.json                # Dependencies
├── .env.sample                 # Environment template
│
├── pages/
│   └── index.vue               # Main page
│
├── components/
│   └── Qwami/
│       ├── GlassWindow.vue     # Main UI (mint/burn tabs)
│       └── TokenInfo.vue       # Token information accordion
│
├── stores/
│   └── wallet.ts               # Pinia store (Phantom, balances)
│
├── composables/
│   └── useAnchor.ts            # Anchor client (burn functionality)
│
├── server/
│   └── api/
│       └── qwami/
│           ├── balance.get.ts  # Get QWAMI balance
│           └── purchase.post.ts# Mint tokens (server-signed)
│
└── contracts/
    └── idl/
        └── README.md           # IDL setup instructions
```

## 🎨 Features

### Wallet Connection
- Connect/disconnect Phantom wallet
- Display wallet address and balances
- Auto-refresh on account changes

### Minting (Purchase)
- Input QWAMI amount
- Calculate USD cost (base price)
- Server-side authority minting
- Success/error handling
- Balance auto-refresh

### Burning
- Input QWAMI amount
- Client-side owner-signed transaction
- Permanent token destruction
- Balance validation

### Token Information
- Utility & use cases (AI services consumption)
- Economics & supply mechanics (deflationary model)
- Governance (voting, proposals)
- Disclaimers (utility token, not investment)

## 🛠️ Development

### Run Dev Server

```bash
bun dev
```

### Build for Production

```bash
bun build
```

### Generate Static Site

```bash
bun generate
```

### Type Check

```bash
bun nuxt typecheck
```

## 🔐 Security

- **Private Keys**: Never commit `.env` with real private keys
- **Authority Key**: Server-side only, not exposed to client
- **Wallet Signing**: All client burns are owner-signed via Phantom
- **Network**: Use devnet for testing, mainnet only after audits

## 📝 TODOs

Before going live:

- [ ] Deploy qwami_token Anchor program to devnet
- [ ] Copy IDL to `contracts/idl/qwami_token.json`
- [ ] Complete `composables/useAnchor.ts` burn implementation
- [ ] Complete `server/api/qwami/purchase.post.ts` mint via Anchor
- [ ] Test full mint/burn flow on devnet
- [ ] Add payment verification (SOL/USDC) before minting
- [ ] Security audit before mainnet deployment
- [ ] Set up monitoring and alerting
- [ ] Configure production RPC endpoint

## 📚 Documentation

- [QWAMI Token Overview](../quami/docs/QWAMI_TOKEN.md)
- [Kwami NFT Minting](../quami/docs/KWAMI_NFT_MINTING.md)
- [Solana Programs README](../quami/solana/README.md)
- [Anchor Program Setup](../quami/solana/SETUP.md)

## 🤝 Contributing

This is part of the Quami AI ecosystem. For the main project:
- Repository: `../quami`
- Solana programs: `../quami/solana/anchor/`
- Documentation: `../quami/docs/`

## 📄 License

Part of the Quami project. Check main repo for license details.

---

**Network**: Devnet  
**Status**: In Development  
**Version**: 0.1.0
