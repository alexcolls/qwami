# Changelog

All notable changes to the QWAMI Token project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-10

### Added
- ✨ Initial Nuxt 4 SPA application with SSR disabled
- 💼 Phantom wallet integration with Pinia store
- 🔌 API endpoints for balance checking and token purchasing
- 🧩 Glass morphism UI components using Nuxt UI v4
- ⚡ Lightning bolt favicon
- 📄 Comprehensive documentation (README, NEXT_STEPS, contracts/idl/README)
- 🎨 @alexcolls/nuxt-ux library integration for enhanced UI
- 💰 SOL and QWAMI balance display
- 🔥 Mint/Burn tabs interface (burn pending program deployment)
- 📊 Token information sections (utility, economics, governance, disclaimer)
- 🔐 Server-side authority minting endpoint (placeholder for Anchor integration)
- 🌐 Client-side burn functionality composable (ready for program deployment)
- 📱 Responsive design with dark theme
- 🔧 Buffer polyfill for Solana browser compatibility

### Fixed
- 🔧 Buffer polyfill plugin to resolve SSR errors
- 🎨 Tailwind v4 CSS configuration for proper styling
- 💼 Server-side guards in wallet store for Solana library imports
- 🔌 Dynamic imports to prevent server-side Buffer errors

### Technical
- Framework: Nuxt 4.2.0 (SPA mode)
- UI: Nuxt UI v4 + @alexcolls/nuxt-ux v0.6.0
- Blockchain: Solana (devnet)
- Wallet: Phantom
- State: Pinia with persisted state
- Styling: Tailwind CSS v4

### Pending
- Deploy qwami_token Anchor program to devnet
- Copy IDL from ../quami/solana/anchor/qwami-token/target/idl/
- Complete burn_tokens implementation in composables/useAnchor.ts
- Complete mint_tokens Anchor integration in server/api/qwami/purchase.post.ts
- Add payment verification (SOL/USDC) before minting
- Security audit before mainnet deployment

### Repository
- Main branch: stable releases
- Dev branch: active development
- GitHub: github.com/alexcolls/qwami

---

## [Unreleased]

### Planned
- Payment verification for token purchases
- On-chain program deployment and integration
- Multi-wallet support (Solflare, Backpack, etc.)
- Transaction history
- Price oracle integration
- Staking interface
- Governance voting UI
