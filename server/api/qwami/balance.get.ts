import { defineEventHandler, getQuery, createError } from 'h3';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

interface BalanceResponse {
  success: boolean;
  balance?: string;
  balanceRaw?: string;
  decimals?: number;
  error?: string;
}

/**
 * GET /api/qwami/balance?wallet=<address>
 * 
 * Fetches QWAMI token balance for a given wallet address
 */
export default defineEventHandler(async (event): Promise<BalanceResponse> => {
  try {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    
    const walletAddress = query.wallet as string;

    if (!walletAddress) {
      throw createError({
        statusCode: 400,
        message: 'Missing required parameter: wallet',
      });
    }

    const qwamiMint = config.public.qwamiTokenMint as string;

    if (!qwamiMint) {
      throw createError({
        statusCode: 500,
        message: 'QWAMI token mint not configured. Please set NUXT_PUBLIC_QWAMI_TOKEN_MINT',
      });
    }

    console.log(`💰 Checking QWAMI balance for ${walletAddress}`);

    const connection = new Connection(config.public.rpcUrl as string);
    const wallet = new PublicKey(walletAddress);
    const tokenMint = new PublicKey(qwamiMint);

    // Get associated token account
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      wallet
    );

    try {
      // Get account info
      const accountInfo = await getAccount(connection, tokenAccount);
      
      // QWAMI has 9 decimals
      const decimals = 9;
      const balanceRaw = accountInfo.amount.toString();
      const balance = (Number(balanceRaw) / Math.pow(10, decimals)).toString();

      console.log(`✅ Balance: ${balance} QWAMI`);

      return {
        success: true,
        balance,
        balanceRaw,
        decimals,
      };
    } catch (error: any) {
      // Account doesn't exist - balance is 0
      if (error.name === 'TokenAccountNotFoundError' || error.message?.includes('could not find')) {
        console.log('ℹ️  No token account found - balance is 0');
        
        return {
          success: true,
          balance: '0',
          balanceRaw: '0',
          decimals: 9,
        };
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('❌ Balance check failed:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to check QWAMI balance',
    };
  }
});
