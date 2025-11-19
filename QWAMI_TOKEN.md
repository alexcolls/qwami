# 🌕 QWAMI Token Specification

**Version**: 1.0.0  
**Network**: Solana  
**Type**: Utility Token (SPL Token)

## Overview

QWAMI is the native utility token that powers the KWAMI AI companion ecosystem. It enables NFT holders to recharge and enhance their KWAMI's capabilities through a burn-based deflationary model.

## Core Utility

### 1. ⚡ Energy

**Purpose**: Fuel for AI API calls and DAO participation

**How it Works**:
- KWAMI consumes Energy when making API calls to:
  - ElevenLabs (voice synthesis)
  - OpenAI (language models)
  - Other AI providers
- Without Energy, KWAMI can only use:
  - Local functionality
  - Local AI models (no cloud APIs)
- Energy is also consumed for:
  - Voting in KWAMI DAO proposals
  - Posting proposals in the Agora forum

**Recharge Method**:
- Burn QWAMI tokens to add Energy to your KWAMI NFT
- Energy is tracked on-chain per NFT

**Burn Rate Examples**:
- 100 QWAMI = 10,000 Energy units
- 1,000 QWAMI = 100,000 Energy units
- Custom amounts supported

### 2. 🔗 Connections

**Purpose**: Expand app integration capacity

**How it Works**:
- Connections determine how many user apps your KWAMI can integrate with simultaneously
- Supported integrations include:
  - Instagram
  - WhatsApp
  - Gmail
  - Spotify
  - Twitter/X
  - Discord
  - Telegram
  - Notion
  - Calendar apps
  - And more...

**Default Limits**:
- Base KWAMI NFT: 3 connections
- Each upgrade: +2 connections

**Upgrade Method**:
- Burn QWAMI to permanently increase connection slots
- Upgrades are stored on-chain per NFT

**Burn Rate Examples**:
- 500 QWAMI = +2 connections
- 1,000 QWAMI = +5 connections
- 5,000 QWAMI = +25 connections

### 3. 🦋 Metamorphosis

**Purpose**: Unlock multiple KWAMI configurations

**How it Works**:
- Metamorphosis represents distinct KWAMI configurations:
  - **Mind**: AI model, personality, knowledge base
  - **Soul**: Emotional traits, communication style
  - **Body**: Visual appearance, blob settings
- Each metamorphosis is a complete saved state
- Switch between metamorphoses instantly

**Default Limits**:
- Base KWAMI NFT: 1 metamorphosis (default state)
- Each upgrade: +1 metamorphosis slot

**Use Cases**:
- Professional persona for work
- Casual persona for friends
- Creative persona for art projects
- Gaming persona for entertainment
- Meditation persona for wellness

**Upgrade Method**:
- Burn QWAMI to unlock additional metamorphosis slots
- Each slot stores a complete KWAMI configuration

**Burn Rate Examples**:
- 1,000 QWAMI = +1 metamorphosis
- 5,000 QWAMI = +5 metamorphoses
- 10,000 QWAMI = +10 metamorphoses

## Tokenomics

### Supply

- **Maximum Supply**: 1,000,000,000,000 (1 Trillion)
- **Decimals**: 9 (standard Solana token)
- **Initial Circulation**: TBD at launch

### Pricing

- **Base Price**: 1 QWAMI = $0.01 USD
- **Pricing Model**: Fixed base price for minting
- **Market Price**: Determined by DEX trading after launch

### Distribution (Planned)

- **Public Sale**: 40% (400 Billion)
- **Ecosystem Reserve**: 25% (250 Billion)
- **Team & Advisors**: 15% (150 Billion) - 4 year vest
- **Community Rewards**: 10% (100 Billion)
- **Liquidity Pools**: 10% (100 Billion)

### Deflationary Mechanics

QWAMI is **deflationary** by design:

1. **All utility usage burns tokens permanently**
2. **No token minting after initial supply**
3. **Burn address is verifiable on-chain**
4. **Total supply decreases over time**

**Burn Transparency**:
- All burns sent to: `BURN_ADDRESS` (dead wallet)
- Verifiable on Solana explorers
- Real-time supply tracking
- Burn statistics dashboard

## Smart Contract

### Anchor Program

Built with Anchor Framework for security and reliability:

```rust
// Program structure (simplified)
pub struct QwamiToken {
    pub mint: Account<Mint>,
    pub authority: Pubkey,
    pub total_burned: u64,
}

pub struct KwamiNFT {
    pub energy: u64,
    pub connections: u8,
    pub metamorphoses: u8,
}
```

### Key Instructions

1. **mint_qwami** - Mint new tokens (authority only)
2. **burn_for_energy** - Burn QWAMI for Energy
3. **burn_for_connections** - Burn QWAMI for Connections
4. **burn_for_metamorphosis** - Burn QWAMI for Metamorphosis
5. **transfer** - Standard SPL token transfer

### Security Features

- ✅ Authority-controlled minting
- ✅ Immutable burn mechanism
- ✅ On-chain NFT state tracking
- ✅ Verified burn address
- ✅ Anchor framework safety
- ✅ Comprehensive testing
- ✅ Planned security audit

## DAO Governance

### Voting Power

- Energy can be burned for voting power
- 1,000 Energy = 1 vote
- Votes are weighted by burned Energy
- Prevents plutocracy (must burn to vote)

### Proposal System

- **Posting a Proposal**: Costs 5,000 Energy
- **Voting Period**: 7 days
- **Quorum**: 10% of circulating Energy-backed votes
- **Execution**: Automatic on-chain after passing

### Governance Areas

- Protocol upgrades
- Treasury allocation
- Feature prioritization
- Partnership approvals
- Economic parameter changes

## Integration with KWAMI NFT

### On-Chain State

Each KWAMI NFT stores:

```typescript
interface KwamiState {
  energy: number;           // Current Energy balance
  connections: number;      // Number of connection slots
  metamorphoses: number;    // Number of metamorphosis slots
  lastUpdate: number;       // Timestamp of last modification
}
```

### State Updates

- All QWAMI burns update NFT state atomically
- State changes are permanent and on-chain
- NFT metadata reflects current capabilities
- Verifiable through Solana explorers

## Roadmap

### Q1 2025 - Launch
- [ ] Token deployment on Solana mainnet
- [ ] Basic mint/burn interface
- [ ] Integration with KWAMI NFTs
- [ ] Initial liquidity pools

### Q2 2025 - Governance
- [ ] DAO activation
- [ ] Agora forum launch
- [ ] Proposal system
- [ ] Voting mechanics

### Q3 2025 - Expansion
- [ ] DEX listings (Raydium, Orca)
- [ ] Staking mechanisms
- [ ] Advanced burn utilities
- [ ] Mobile wallet support

### Q4 2025 - Advanced Features
- [ ] Cross-chain bridges
- [ ] Advanced metamorphosis features
- [ ] Enterprise integrations
- [ ] Community grants program

## Purchase Methods

### Primary (Mint)

1. **Direct Mint**: Buy QWAMI with SOL or USDC at qwami.io
2. **Authority-signed**: Server-side minting with authority key
3. **Instant delivery**: Tokens sent directly to wallet

### Secondary (DEX)

After launch:
- Raydium (Solana DEX)
- Orca (Solana DEX)
- Jupiter Aggregator
- Market-determined pricing

## Technical Specifications

### Token Details

```json
{
  "name": "QWAMI Token",
  "symbol": "QWAMI",
  "decimals": 9,
  "supply": 1000000000000,
  "network": "solana",
  "standard": "SPL-Token"
}
```

### Contract Addresses

- **Program ID**: `[To be deployed]`
- **Token Mint**: `[To be deployed]`
- **Burn Address**: `[To be set]`

### RPC Endpoints

- **Mainnet**: https://api.mainnet-beta.solana.com
- **Devnet**: https://api.devnet.solana.com
- **Testnet**: https://api.testnet.solana.com

## Security & Audits

### Current Status

- ✅ Anchor framework implementation
- ✅ Comprehensive unit tests
- ✅ Integration tests
- ⏳ Security audit (scheduled)
- ⏳ Mainnet deployment (after audit)

### Audit Partners

- TBD - Top Solana security firm
- Community review on GitHub
- Bug bounty program planned

## FAQs

### General

**Q: What makes QWAMI different from other tokens?**  
A: QWAMI has real utility - it's not just for trading. You burn it to power your AI companion's capabilities.

**Q: Can I earn QWAMI without buying it?**  
A: Future staking, community rewards, and DAO participation will offer earning opportunities.

**Q: Is QWAMI an investment?**  
A: No. QWAMI is a utility token for using KWAMI services, not an investment vehicle.

### Technical

**Q: Why Solana?**  
A: Fast transactions, low fees, and strong NFT ecosystem support.

**Q: Can burned tokens be recovered?**  
A: No. All burns are permanent and verifiable on-chain.

**Q: How is pricing determined?**  
A: Base mint price is fixed at $0.01. DEX trading determines market price.

### Usage

**Q: Do I need a KWAMI NFT to use QWAMI?**  
A: To burn for Energy/Connections/Metamorphosis, yes. But you can hold and trade QWAMI without an NFT.

**Q: Can I transfer my NFT's Energy to another NFT?**  
A: No. Energy, Connections, and Metamorphoses are bound to the specific NFT.

**Q: What happens if my KWAMI runs out of Energy?**  
A: It can still function with local features and models, but can't make API calls to cloud services.

## Resources

- **Website**: https://qwami.io
- **GitHub**: https://github.com/alexcolls/kwami
- **Discord**: https://discord.gg/kwami
- **Twitter**: https://twitter.com/kwami_io
- **Documentation**: https://github.com/alexcolls/kwami/tree/dev/docs

## Disclaimer

QWAMI is a utility token for the KWAMI ecosystem. It is not intended as an investment, security, or financial instrument. Token holders should not expect profits from the efforts of others. All QWAMI usage involves burning tokens for utility purposes. Participate responsibly and within your means.

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Status**: Pre-Launch

