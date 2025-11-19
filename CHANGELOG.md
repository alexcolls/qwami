# Changelog

All notable changes to the QWAMI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-19

### 🎉 Major Redesign - Informative Landing Page

Complete transformation from Nuxt-based mint/burn interface to Vite-based informative landing page inspired by kwami.io.

### Added

#### Core Features
- ☀️ **16 Informative Sections** covering all aspects of QWAMI token
  - Introduction and overview
  - Energy, Connections, and Metamorphosis explanations
  - Tokenomics and supply information
  - DAO governance details
  - Roadmap and future plans
  
#### Visual Design
- 🎨 **Smooth scroll-based navigation** with section transitions
- 🌈 **Dynamic color palettes** per section (14 unique gradients)
- 💫 **Interactive sidebar navigation** with sphere indicators
- ✨ **Custom cursor light effect** (desktop only)
- 📱 **Fully responsive** mobile and desktop layouts

#### Technical Infrastructure
- ⚡ **Vite build system** for fast development and optimized production builds
- 📝 **TypeScript** for type safety
- 🎯 **Custom scroll management** system
- 🎨 **Modern CSS** with animations and transitions

#### Documentation
- 📚 **Comprehensive README** with quick start guide
- 📄 **QWAMI_TOKEN.md** - Complete token specification
- 🚀 **DEPLOYMENT.md** - Production deployment guide
- 📝 **CHANGELOG.md** - Version history tracking

### Changed

#### Project Structure
- **Framework**: Nuxt 4 → Vite 7
- **UI Library**: Nuxt UI → Custom CSS
- **State Management**: Pinia → Vanilla TypeScript classes
- **Purpose**: Functional app → Informative landing page

#### Technology Stack
```diff
- Nuxt 4
- Vue 3
- Nuxt UI
- Pinia
- Solana Web3.js
- Anchor

+ Vite 7
+ TypeScript 5.9
+ Custom CSS
+ Vanilla JS classes
+ No blockchain integration (informative only)
```

### Removed

#### Nuxt-Specific Files
- `app.vue` - Root Nuxt component
- `nuxt.config.ts` - Nuxt configuration
- `pages/index.vue` - Nuxt page component
- `components/Qwami/GlassWindow.vue` - Mint/burn UI
- `components/Qwami/TokenInfo.vue` - Token info component
- `stores/wallet.ts` - Pinia wallet store
- `server/api/` - Server API routes
- `composables/useAnchor.ts` - Anchor integration

#### Dependencies
- All Nuxt-related packages
- Vue ecosystem packages
- Solana/Anchor packages (moved to separate mint app)
- Pinia state management
- Nuxt UI library

### Technical Details

#### New File Structure
```
qwami/
├── index.html              # Main entry (14 sections)
├── src/
│   ├── main.ts            # Scroll management & navigation
│   └── style.css          # Global styles & animations
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
├── QWAMI_TOKEN.md         # Token specification
├── DEPLOYMENT.md          # Deployment guide
└── CHANGELOG.md           # This file
```

#### Color Palette System
14 unique color gradients based on Tailwind colors:
- Violet (QWAMI primary)
- Pink, Amber, Emerald, Cyan
- Blue, Indigo, Violet, Purple
- Fuchsia, Pink, Rose, Orange, Yellow

#### Section Breakdown
0. **Introduction** - QWAMI Token overview
1. **What is QWAMI** - Core concept
2. **Energy** - AI API fuel ⚡
3. **Connections** - App integrations 🔗
4. **Metamorphosis** - Configuration slots 🦋
5. **Tokenomics** - Supply & pricing 📊
6. **DAO Governance** - Community participation 🏛️
7. **How to Get** - Purchase methods 💰
8. **Burning** - Deflationary mechanics 🔥
9. **NFT Integration** - KWAMI synergy 🎨
10. **Ecosystem** - Connected platforms 🌐
11. **Security** - Audits & safety 🔒
12. **Roadmap** - Future development 🗺️
13. **Get Started** - CTA and docs 🚀

### Performance Targets

- ⚡ **Lighthouse Performance**: 95+
- ♿ **Accessibility**: 100
- 🏆 **Best Practices**: 100
- 🔍 **SEO**: 100
- 📦 **Bundle Size**: < 100KB gzipped

### Migration Notes

#### For Developers

If you were using the old Nuxt-based mint/burn interface:

1. **Mint/Burn Functionality**: Now handled separately (see `../quami/` repo)
2. **Wallet Integration**: Moved to dedicated app
3. **Smart Contract Calls**: Handled by backend services
4. **This Project**: Now purely informative landing page

#### Environment Variables

No environment variables needed for this static site.
Future API integration will use `VITE_*` prefix.

### Future Plans

See QWAMI_TOKEN.md roadmap section for:
- Q1 2025: Token launch
- Q2 2025: DAO activation
- Q3 2025: DEX listings
- Q4 2025: Advanced features

---

## [0.1.0] - 2024-01-XX (Legacy)

### Initial Nuxt-based Mint/Burn Interface

- Basic wallet connection (Phantom)
- QWAMI minting functionality
- QWAMI burning functionality  
- Token balance display
- Nuxt UI components
- Server-side minting API

**Note**: This version has been completely redesigned. See v1.0.0 above.

---

## Version History

- **v1.0.0** (2025-11-19) - Informative landing page redesign
- **v0.1.0** (2024-XX-XX) - Initial Nuxt mint/burn interface

---

**Format**: [Keep a Changelog](https://keepachangelog.com/)  
**Versioning**: [Semantic Versioning](https://semver.org/)
