/**
 * 📊 QWAMI Stats API
 * 
 * Returns current token statistics and metrics.
 */

import { Connection, PublicKey } from '@solana/web3.js'

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()
    const rpcEndpoint = config.public.solanaRpcEndpoint || 'https://api.devnet.solana.com'
    const mintAddress = config.public.qwamiTokenMint

    // Basic stats (available even without deployed contract)
    const stats = {
      success: true,
      symbol: 'QWAMI',
      name: 'QWAMI Token',
      decimals: 0,
      maxSupply: 1_000_000_000_000,
      basePrice: 0.01,
      basePriceCents: config.public.qwamiBasePriceCents || 1,
      solUsdPrice: config.public.solUsdPrice || 150,
      network: config.public.solanaNetwork || 'devnet',
      mint: mintAddress,
      
      // Dynamic stats (will be populated if contract is deployed)
      circulatingSupply: null as number | null,
      totalBurned: null as number | null,
      holders: null as number | null,
      
      // Features
      dividendsEnabled: true,
      stakingEnabled: config.public.stakingEnabled === true,
      daoEnabled: config.public.daoEnabled === true,
      
      // Simulation mode
      simulated: config.public.devnetSimulation === true,
    }

    // If mint is configured and not in simulation mode, fetch on-chain data
    if (mintAddress && 
        mintAddress !== 'PLACEHOLDER_MINT_ADDRESS' && 
        !stats.simulated) {
      try {
        const connection = new Connection(rpcEndpoint, 'confirmed')
        const mintPubkey = new PublicKey(mintAddress)

        // Get mint info
        const mintInfo = await connection.getParsedAccountInfo(mintPubkey)
        
        if (mintInfo.value?.data && typeof mintInfo.value.data === 'object' && 'parsed' in mintInfo.value.data) {
          const parsedData = mintInfo.value.data.parsed
          if (parsedData.type === 'mint') {
            const supply = parsedData.info.supply
            stats.circulatingSupply = Number(supply)
            stats.totalBurned = stats.maxSupply - Number(supply)
          }
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch on-chain stats:', err)
        // Don't fail the request, just return null for on-chain data
      }
    }

    return stats
  } catch (err: any) {
    console.error('❌ Stats API error:', err)
    
    return {
      success: false,
      error: err.message || 'Failed to fetch stats',
    }
  }
})


