import { defineEventHandler, readBody, createError } from 'h3';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';
import bs58 from 'bs58';

interface PurchaseRequest {
  wallet: string;
  amount: number; // QWAMI amount (will be converted to smallest units)
  payIn?: 'SOL' | 'USDC';
  txSignature?: string; // Optional payment proof
}

interface PurchaseResponse {
  success: boolean;
  signature?: string;
  balance?: string;
  error?: string;
}

/**
 * POST /api/qwami/purchase
 * 
 * Mints QWAMI tokens to user's wallet (authority-signed)
 * Phase 1 (devnet): No payment verification, authority mints freely
 * Phase 2 (future): Verify payment before minting
 */
export default defineEventHandler(async (event): Promise<PurchaseResponse> => {
  try {
    const config = useRuntimeConfig();
    const body = await readBody<PurchaseRequest>(event);

    // Validate input
    if (!body.wallet) {
      throw createError({
        statusCode: 400,
        message: 'Missing required field: wallet',
      });
    }

    if (!body.amount || body.amount <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid amount. Must be greater than 0',
      });
    }

    // Check configuration
    const qwamiMint = config.public.qwamiTokenMint as string;
    const programId = config.public.qwamiTokenProgramId as string;
    const authorityKey = config.qwamiAuthorityPrivateKey as string;

    if (!qwamiMint || !programId || !authorityKey) {
      throw createError({
        statusCode: 500,
        message: 'QWAMI token not configured. Please set NUXT_PUBLIC_QWAMI_TOKEN_MINT, NUXT_PUBLIC_QWAMI_TOKEN_PROGRAM_ID, and NUXT_QWAMI_AUTHORITY_PRIVATE_KEY',
      });
    }

    console.log(`🛒 Purchase request: ${body.amount} QWAMI for ${body.wallet}`);

    // Initialize connection and authority
    const connection = new Connection(config.public.rpcUrl as string);
    const authorityKeypair = Keypair.fromSecretKey(bs58.decode(authorityKey));
    const wallet = new PublicKey(body.wallet);
    const mint = new PublicKey(qwamiMint);

    // Convert amount to smallest units (9 decimals)
    const amountRaw = new anchor.BN(body.amount * Math.pow(10, 9));

    console.log(`💰 Minting ${amountRaw.toString()} tokens (raw units)`);

    // Get or create associated token account for user
    const destination = await getAssociatedTokenAddress(
      mint,
      wallet
    );

    console.log(`📍 Destination ATA: ${destination.toString()}`);

    // Check if ATA exists
    const accountInfo = await connection.getAccountInfo(destination);
    const needsAta = !accountInfo;

    // Build transaction
    const tx = new anchor.web3.Transaction();

    // Add create ATA instruction if needed
    if (needsAta) {
      console.log('🔧 Creating associated token account');
      tx.add(
        createAssociatedTokenAccountInstruction(
          authorityKeypair.publicKey, // Payer
          destination,
          wallet,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    // TODO: Add mint_tokens instruction via Anchor
    // For now, this is a placeholder until the program is deployed and IDL is available
    // The actual implementation will use:
    // const program = new anchor.Program(idl, programId, provider);
    // const [tokenAuthority] = await PublicKey.findProgramAddress([...], programId);
    // await program.methods.mintTokens(amountRaw).accounts({...}).rpc();

    console.log('⚠️  Warning: Anchor program mint_tokens not implemented yet');
    console.log('   Deploy the qwami_token program and update this endpoint');

    // For development: simulate success
    if (process.env.NUXT_PUBLIC_SOLANA_NETWORK === 'devnet') {
      console.log('⚠️  DEVNET MODE: Simulating mint (no actual transaction)');
      
      return {
        success: true,
        signature: 'DEVNET_SIMULATION_NO_TX',
        balance: body.amount.toString(),
      };
    }

    throw createError({
      statusCode: 501,
      message: 'Mint functionality not yet implemented. Deploy qwami_token program first.',
    });

  } catch (error: any) {
    console.error('❌ Purchase failed:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to purchase QWAMI tokens',
    };
  }
});
