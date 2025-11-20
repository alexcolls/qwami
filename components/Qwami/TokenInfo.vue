<template>
  <div class="token-info-container">
    <div class="info-card">
      <div class="info-icon">💎</div>
      <div class="info-content">
        <div class="info-label">Symbol</div>
        <div class="info-value">{{ tokenInfo.symbol }}</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-icon">💰</div>
      <div class="info-content">
        <div class="info-label">Price</div>
        <div class="info-value">${{ tokenInfo.basePrice }}</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-icon">📊</div>
      <div class="info-content">
        <div class="info-label">Max Supply</div>
        <div class="info-value">{{ formatSupply(tokenInfo.maxSupply) }}</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-icon">🔥</div>
      <div class="info-content">
        <div class="info-label">Total Burned</div>
        <div class="info-value">{{ formatSupply(tokenInfo.totalBurned || 0) }}</div>
      </div>
    </div>

    <div class="info-card wide">
      <div class="info-icon">🌐</div>
      <div class="info-content">
        <div class="info-label">Network</div>
        <div class="info-value">Solana {{ tokenInfo.network }}</div>
      </div>
    </div>

    <div v-if="tokenInfo.dividendsEnabled" class="info-card wide highlight">
      <div class="info-icon">💸</div>
      <div class="info-content">
        <div class="info-label">Weekly Dividends</div>
        <div class="info-value">80% of profits every Friday</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = useQwamiStats()

// Fetch live stats
const { data: liveStats } = await useFetch('/api/qwami/stats')

const tokenInfo = computed(() => {
  if (liveStats.value && typeof liveStats.value === 'object') {
    return {
      symbol: (liveStats.value as any).symbol || stats.tokenomics.value.symbol,
      basePrice: (liveStats.value as any).basePrice || stats.tokenomics.value.basePrice,
      maxSupply: (liveStats.value as any).maxSupply || stats.tokenomics.value.maxSupply,
      totalBurned: (liveStats.value as any).totalBurned || stats.tokenomics.value.totalBurned,
      network: (liveStats.value as any).network || 'devnet',
      dividendsEnabled: (liveStats.value as any).dividendsEnabled ?? true,
    }
  }
  
  return {
    symbol: stats.tokenomics.value.symbol,
    basePrice: stats.tokenomics.value.basePrice,
    maxSupply: stats.tokenomics.value.maxSupply,
    totalBurned: stats.tokenomics.value.totalBurned,
    network: 'devnet',
    dividendsEnabled: true,
  }
})

const formatSupply = (num: number): string => {
  return stats.formatNumber(num)
}
</script>

<style scoped>
.token-info-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
}

.info-card.wide {
  grid-column: span 2;
}

.info-card.highlight {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-color: rgba(139, 92, 246, 0.4);
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.info-value {
  font-size: 1.25rem;
  color: #fff;
  font-weight: 700;
}

@media (max-width: 768px) {
  .token-info-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .info-card.wide {
    grid-column: span 1;
  }
}
</style>


