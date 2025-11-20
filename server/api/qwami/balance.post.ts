/**
 * 💰 QWAMI Balance API
 * 
 * Returns the QWAMI token balance for a given wallet address.
 */

import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { walletAddress } = body

    if (!walletAddress) {
      return {
        success: false,
        error: 'Wallet address is required',
      }
    }

    // Get config
    const config = useRuntimeConfig()
    const rpcEndpoint = config.public.solanaRpcEndpoint || 'https://api.devnet.solana.com'
    const mintAddress = config.public.qwamiTokenMint

    // Check if mint is configured
    if (!mintAddress || mintAddress === 'PLACEHOLDER_MINT_ADDRESS') {
      // Return 0 balance if mint not configured (graceful degradation)
      return {
        success: true,
        balance: 0,
        mint: null,
        message: 'QWAMI token mint not configured',
      }
    }

    // Check if simulation mode
    if (config.public.devnetSimulation === true || config.public.devnetSimulation === 'true') {
      // Return simulated balance
      return {
        success: true,
        balance: 0,
        mint: mintAddress,
        simulated: true,
        message: 'Running in simulation mode',
      }
    }

    try {
      const connection = new Connection(rpcEndpoint, 'confirmed')
      const walletPubkey = new PublicKey(walletAddress)
      const mintPubkey = new PublicKey(mintAddress)

      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        walletPubkey
      )

      // Get account info
      const accountInfo = await getAccount(connection, tokenAccount)

      return {
        success: true,
        balance: Number(accountInfo.amount),
        mint: mintAddress,
        tokenAccount: tokenAccount.toBase58(),
      }
    } catch (err: any) {
      // Token account doesn't exist = 0 balance
      if (err.message?.includes('could not find account')) {
        return {
          success: true,
          balance: 0,
          mint: mintAddress,
          message: 'No token account found (0 balance)',
        }
      }

      throw err
    }
  } catch (err: any) {
    console.error('❌ Failed to fetch QWAMI balance:', err)
    
    return {
      success: false,
      error: err.message || 'Failed to fetch balance',
      balance: 0,
    }
  }
})


