# 🚀 Next Steps - QWAMI Token App

Your beautiful QWAMI token minting/burning SPA is now ready for deployment! Here's what to do next:

## ✅ What's Complete

- ✨ Nuxt 4 SPA scaffold (SSR: false)
- 💼 Phantom wallet integration (Pinia store)
- 🔌 API endpoints (balance check + purchase)
- 🧩 Glass window UI (mint/burn tabs)
- 📊 Token information sections
- 📄 Comprehensive documentation

## 📋 Before You Run

### 1. Install Dependencies

```bash
bun install  # or npm install
```

### 2. Set Up Environment

```bash
cp .env.sample .env
```

Edit `.env` - you can leave placeholders for now, the app will degrade gracefully.

### 3. Start Development Server

```bash
bun dev  # or npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

The app will load, but minting/burning won't work until you deploy the Anchor program.

## 🔧 Deploy the QWAMI Token Program

The smart contract lives in `../quami/solana/anchor/qwami-token/`.

### Step-by-Step Deployment

```bash
# 1. Navigate to the Anchor program
cd ../quami/solana/anchor/qwami-token

# 2. Ensure you have Solana CLI and Anchor installed
solana --version
anchor --version

# 3. Configure for devnet
solana config set --url https://api.devnet.solana.com

# 4. Fund your wallet (get devnet SOL)
solana airdrop 2

# 5. Build the program
anchor build

# 6. Deploy to devnet
anchor deploy

# 7. Copy the Program ID from output
# Example: Program Id: Fg6PaFpoGXkYsidMpWxTWKJqz...
```

### Update Environment Variables

After deployment, update `/home/quantium/labs/qwami/.env`:

```env
NUXT_PUBLIC_QWAMI_TOKEN_PROGRAM_ID=<your_program_id>
```

### Initialize the Token

```bash
# Still in ../quami/solana/anchor/qwami-token
anchor run init  # or create your own initialization script
```

This will:
- Create the token mint
- Set up the token authority
- Return mint address and authority pubkey

Update `.env` again:

```env
NUXT_PUBLIC_QWAMI_TOKEN_MINT=<mint_address>
NUXT_PUBLIC_QWAMI_TOKEN_AUTHORITY=<authority_pubkey>
NUXT_QWAMI_AUTHORITY_PRIVATE_KEY=<base58_private_key>
```

### Copy the IDL

```bash
# From qwami project root
cp ../quami/solana/anchor/qwami-token/target/idl/qwami_token.json ./contracts/idl/
```

### Complete the Integration

Now finish the TODOs in:
- `composables/useAnchor.ts` (line 57-59, 88-114)
- `server/api/qwami/purchase.post.ts` (line 103-108)

Both have detailed inline comments and commented-out example code.

## 🧪 Test the Flow

1. **Connect Wallet**
   - Click "Connect Phantom Wallet"
   - Approve connection in Phantom

2. **Check Balance**
   - Should display SOL and QWAMI balances
   - QWAMI will be 0 initially

3. **Mint Tokens** (devnet simulation mode active)
   - Enter amount (e.g., 1000)
   - Click "Mint QWAMI Tokens"
   - Server simulates mint (no real tx yet)
   - Balance updates

4. **Burn Tokens** (needs program deployment)
   - Enter amount to burn
   - Click "Burn QWAMI Tokens"
   - Will error until program is deployed and `useAnchor.ts` is complete

## 🎨 Customize

Feel free to modify:
- `components/Qwami/GlassWindow.vue` - UI styling and layout
- `components/Qwami/TokenInfo.vue` - Token information content
- `nuxt.config.ts` - App configuration
- `app.vue` - Global styles

## 🔐 Production Checklist

Before mainnet:

- [ ] Complete security audit of smart contract
- [ ] Test extensively on devnet
- [ ] Set up proper key management (HSM/multisig)
- [ ] Add payment verification to purchase endpoint
- [ ] Configure production RPC endpoint (Alchemy, QuickNode)
- [ ] Set up monitoring and alerts
- [ ] Document recovery procedures
- [ ] Test disaster recovery
- [ ] Get legal review (if applicable)
- [ ] Prepare incident response plan

## 📚 Documentation

- [Main README](./README.md) - Full project documentation
- [IDL Setup](./contracts/idl/README.md) - Program deployment guide
- [QWAMI Token Specs](../quami/docs/QWAMI_TOKEN.md) - Token economics
- [Solana Setup](../quami/solana/SETUP.md) - Development environment

## 🐛 Troubleshooting

### "Phantom wallet not found"
Install Phantom extension from [phantom.app](https://phantom.app)

### "QWAMI token mint not configured"
Deploy the Anchor program and update `.env` (see above)

### "Insufficient balance" errors
- Get devnet SOL: `solana airdrop 2`
- Check you're on devnet: `solana config get`

### Nuxt build errors
- Delete `.nuxt` and `node_modules`
- Run `bun install` again
- Check Node.js version (18+)

## 💡 Tips

- Use `.env.sample` (not `.env.example`) per your rule
- All commits use emoji prefixes per your rule
- Absolute imports configured in `nuxt.config.ts`
- No example scripts created per your rule
- Changes not pushed (you'll do that manually)

## 🎉 You're All Set!

Run `bun dev` and enjoy your beautiful QWAMI token interface!

Questions? Check the inline comments - they're comprehensive.

---

**Happy minting! ☀️**
