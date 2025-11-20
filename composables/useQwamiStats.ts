/**
 * 📊 QWAMI Stats Composable
 * 
 * Provides token statistics and metrics for display.
 */

export const useQwamiStats = () => {
  const config = useRuntimeConfig()

  /**
   * Token economics data
   */
  const tokenomics = computed(() => ({
    // Basic info
    symbol: 'QWAMI',
    name: 'QWAMI Token',
    decimals: 0,
    
    // Supply
    maxSupply: 1_000_000_000_000, // 1 Trillion
    circulatingSupply: 0, // TODO: Fetch from chain
    totalBurned: 0, // TODO: Fetch from chain
    
    // Pricing
    basePrice: 0.01, // $0.01 USD
    basePriceCents: config.public.qwamiBasePriceCents || 1,
    solUsdPrice: config.public.solUsdPrice || 150,
    
    // Features
    dividendPercentage: 80, // 80% to holders
    dividendDay: 'Friday',
    stakingEnabled: config.public.stakingEnabled === true || config.public.stakingEnabled === 'true',
    daoEnabled: config.public.daoEnabled === true || config.public.daoEnabled === 'true',
  }))

  /**
   * Burn rates for different utilities
   */
  const burnRates = computed(() => ({
    energy: {
      min: 100,
      max: 10000,
      conversionRate: 100, // 1 QWAMI = 100 Energy
      examples: [
        { qwami: 100, energy: 10_000 },
        { qwami: 1000, energy: 100_000 },
        { qwami: 10000, energy: 1_000_000 },
      ],
    },
    connections: {
      min: 500,
      max: 5000,
      conversionRate: 0.004, // 500 QWAMI = 2 connections
      examples: [
        { qwami: 500, connections: 2 },
        { qwami: 1000, connections: 5 },
        { qwami: 5000, connections: 25 },
      ],
    },
    metamorphosis: {
      min: 1000,
      max: 10000,
      conversionRate: 0.001, // 1000 QWAMI = 1 metamorphosis
      examples: [
        { qwami: 1000, slots: 1 },
        { qwami: 5000, slots: 5 },
        { qwami: 10000, slots: 10 },
      ],
    },
  }))

  /**
   * Staking tiers
   */
  const stakingTiers = computed(() => [
    { period: 'Flexible', days: 0, apy: 5, dividends: true },
    { period: '30 days', days: 30, apy: 10, dividends: true },
    { period: '90 days', days: 90, apy: 15, dividends: true },
    { period: '180 days', days: 180, apy: 25, dividends: true },
    { period: '365 days', days: 365, apy: 40, dividends: true },
  ])

  /**
   * Revenue sources
   */
  const revenueSources = computed(() => [
    {
      name: 'NFT Marketplace',
      url: 'market.kwami.io',
      description: 'Trading commissions from KWAMI NFT sales',
      active: true,
    },
    {
      name: 'NFT Minting',
      url: 'candy.kwami.io',
      description: 'Profits from new KWAMI NFT mints',
      active: true,
    },
    {
      name: 'API Usage',
      url: null,
      description: 'Future revenue from premium API features',
      active: false,
    },
    {
      name: 'Partnerships',
      url: null,
      description: 'Revenue from ecosystem partnerships',
      active: false,
    },
  ])

  /**
   * Calculate QWAMI needed for SOL amount
   */
  const calculateQwamiForSol = (solAmount: number): number => {
    const solUsd = tokenomics.value.solUsdPrice
    const qwamiUsd = tokenomics.value.basePrice
    return Math.floor((solAmount * solUsd) / qwamiUsd)
  }

  /**
   * Calculate SOL needed for QWAMI amount
   */
  const calculateSolForQwami = (qwamiAmount: number): number => {
    const solUsd = tokenomics.value.solUsdPrice
    const qwamiUsd = tokenomics.value.basePrice
    return (qwamiAmount * qwamiUsd) / solUsd
  }

  /**
   * Calculate Energy from QWAMI amount
   */
  const calculateEnergy = (qwamiAmount: number): number => {
    return qwamiAmount * burnRates.value.energy.conversionRate
  }

  /**
   * Calculate Connections from QWAMI amount
   */
  const calculateConnections = (qwamiAmount: number): number => {
    return Math.floor(qwamiAmount * burnRates.value.connections.conversionRate)
  }

  /**
   * Calculate Metamorphosis slots from QWAMI amount
   */
  const calculateMetamorphosis = (qwamiAmount: number): number => {
    return Math.floor(qwamiAmount * burnRates.value.metamorphosis.conversionRate)
  }

  /**
   * Format large numbers
   */
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + 'B'
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M'
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  return {
    tokenomics,
    burnRates,
    stakingTiers,
    revenueSources,
    calculateQwamiForSol,
    calculateSolForQwami,
    calculateEnergy,
    calculateConnections,
    calculateMetamorphosis,
    formatNumber,
  }
}


