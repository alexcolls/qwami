# QWAMI Token IDL

This directory should contain the Anchor IDL (Interface Definition Language) for the QWAMI token program.

## Setup Instructions

After deploying the qwami_token Anchor program, copy the generated IDL here:

```bash
# From the qwami project root
cp ../quami/solana/anchor/qwami-token/target/idl/qwami_token.json ./contracts/idl/
```

## What is the IDL?

The IDL is a JSON file that describes the program's interface:
- Instructions (functions you can call)
- Accounts (data structures)
- Types and error codes

Anchor generates this automatically when you build the program.

## How to Deploy the Program

1. Navigate to the Anchor project:
   ```bash
   cd ../quami/solana/anchor/qwami-token
   ```

2. Build the program:
   ```bash
   anchor build
   ```

3. Deploy to devnet:
   ```bash
   anchor deploy
   ```

4. Copy the Program ID from the output and update `.env`:
   ```
   NUXT_PUBLIC_QWAMI_TOKEN_PROGRAM_ID=<your_program_id>
   ```

5. Initialize the token:
   ```bash
   anchor run init
   ```

6. Update `.env` with the mint address and authority

7. Copy the IDL to this directory (see command above)

## Program Features

The qwami_token program provides:
- `initialize` - Set up the token mint and authority
- `mint_tokens` - Mint new tokens (authority only)
- `burn_tokens` - Burn tokens (owner)
- `update_base_price` - Update base price (authority only)
- `transfer_authority` - Transfer control (authority only)

## Integration Points

Once the IDL is in place, the following will work:
- `composables/useAnchor.ts` - Client-side burn functionality
- `server/api/qwami/purchase.post.ts` - Server-side minting

Both have TODO comments marking where IDL integration is needed.
