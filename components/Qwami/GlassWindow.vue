<template>
  <div class="qwami-glass-window">
    <!-- Header with wallet connection -->
    <div class="glass-header">
      <h2 class="glass-title">
        <span class="title-emoji">☀️</span> QWAMI Token
      </h2>
      
      <ClientOnly>
        <WalletMultiButton dark />
      </ClientOnly>
    </div>

    <!-- Error message -->
    <div v-if="wallet.error" class="error-message">
      ⚠️ {{ wallet.error }}
      <button type="button" class="close-error" @click="wallet.clearError">✕</button>
    </div>

    <!-- Balances (only show when connected) -->
    <div v-if="wallet.connected.value" class="balances-section">
      <div class="balance-item">
        <span class="balance-label">SOL Balance</span>
        <span class="balance-value">{{ wallet.solBalanceFormatted }} SOL</span>
      </div>
      <div class="balance-item">
        <span class="balance-label">QWAMI Balance</span>
        <span class="balance-value">{{ wallet.qwamiBalanceFormatted }} QWAMI</span>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="wallet.connected.value" class="tabs-container">
      <button
        type="button"
        class="tab-button"
        :class="{ active: activeTab === 'mint' }"
        @click="activeTab = 'mint'"
      >
        💎 Mint
      </button>
      <button
        type="button"
        class="tab-button"
        :class="{ active: activeTab === 'burn' }"
        @click="activeTab = 'burn'"
      >
        🔥 Burn
      </button>
    </div>

    <!-- Mint Tab -->
    <div v-if="wallet.connected.value && activeTab === 'mint'" class="tab-content">
      <h3 class="tab-title">Mint QWAMI Tokens</h3>
      <p class="tab-description">
        Purchase QWAMI tokens with SOL. 1 QWAMI = ${{ stats.tokenomics.value.basePrice }}
      </p>

      <div class="input-group">
        <label class="input-label">Amount (QWAMI)</label>
        <input
          v-model.number="mintAmount"
          type="number"
          class="token-input"
          placeholder="1000"
          min="1"
        />
        <div class="input-hint">
          ≈ {{ stats.calculateSolForQwami(mintAmount || 0).toFixed(4) }} SOL
        </div>
      </div>

      <button
        type="button"
        class="action-button"
        :disabled="minting || !mintAmount || mintAmount <= 0"
        @click="handleMint"
      >
        {{ minting ? 'Minting...' : `Mint ${mintAmount || 0} QWAMI` }}
      </button>

      <div v-if="simulationMode" class="simulation-notice">
        ⚠️ Simulation mode active - no real tokens will be minted
      </div>
    </div>

    <!-- Burn Tab -->
    <div v-if="wallet.connected.value && activeTab === 'burn'" class="tab-content">
      <h3 class="tab-title">Burn QWAMI for Utility</h3>
      <p class="tab-description">
        Permanently burn tokens to power your KWAMI NFT capabilities
      </p>

      <!-- Burn type selector -->
      <div class="burn-type-selector">
        <button
          v-for="type in burnTypes"
          :key="type.id"
          type="button"
          class="burn-type-btn"
          :class="{ active: burnType === type.id }"
          @click="burnType = type.id"
        >
          <span class="burn-type-emoji">{{ type.emoji }}</span>
          <span class="burn-type-label">{{ type.label }}</span>
        </button>
      </div>

      <div class="input-group">
        <label class="input-label">Amount (QWAMI)</label>
        <input
          v-model.number="burnAmount"
          type="number"
          class="token-input"
          :placeholder="burnTypes.find(t => t.id === burnType)?.min || 100"
          :min="burnTypes.find(t => t.id === burnType)?.min || 1"
        />
        <div class="input-hint">
          {{ getBurnConversion() }}
        </div>
      </div>

      <button
        type="button"
        class="action-button burn"
        :disabled="burning || !burnAmount || burnAmount <= 0"
        @click="handleBurn"
      >
        {{ burning ? 'Burning...' : `Burn ${burnAmount || 0} QWAMI` }}
      </button>

      <div v-if="!simulationMode" class="burn-notice">
        ⚠️ Burning is permanent and cannot be undone
      </div>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      ✅ {{ successMessage }}
      <button type="button" class="close-success" @click="successMessage = ''">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WalletMultiButton } from 'solana-wallets-vue'

const wallet = useQwamiWallet()
const stats = useQwamiStats()
const anchor = useAnchor()
const config = useRuntimeConfig()

// State
const activeTab = ref<'mint' | 'burn'>('mint')
const mintAmount = ref<number>(1000)
const burnAmount = ref<number>(100)
const burnType = ref<'energy' | 'connections' | 'metamorphosis'>('energy')
const minting = ref(false)
const burning = ref(false)
const successMessage = ref('')

// Computed
const simulationMode = computed(() => {
  return config.public.devnetSimulation === true
})

// Burn types
const burnTypes: Array<{
  id: 'energy' | 'connections' | 'metamorphosis'
  emoji: string
  label: string
  min: number
  convert: (amount: number) => number
  unit: string
}> = [
  {
    id: 'energy',
    emoji: '⚡',
    label: 'Energy',
    min: stats.burnRates.value.energy.min,
    convert: (amount: number) => stats.calculateEnergy(amount),
    unit: 'Energy',
  },
  {
    id: 'connections',
    emoji: '🔗',
    label: 'Connections',
    min: stats.burnRates.value.connections.min,
    convert: (amount: number) => stats.calculateConnections(amount),
    unit: 'Connections',
  },
  {
    id: 'metamorphosis',
    emoji: '🦋',
    label: 'Metamorphosis',
    min: stats.burnRates.value.metamorphosis.min,
    convert: (amount: number) => stats.calculateMetamorphosis(amount),
    unit: 'Slots',
  },
]

// Methods
const handleMint = async () => {
  if (!mintAmount.value || mintAmount.value <= 0) return

  minting.value = true
  successMessage.value = ''

  try {
    const walletAddress = wallet.publicKey.value?.toBase58()
    if (!walletAddress) {
      throw new Error('Wallet not connected')
    }

    const response = await $fetch('/api/qwami/purchase', {
      method: 'POST',
      body: {
        walletAddress,
        amount: mintAmount.value,
      },
    })

    if (response && typeof response === 'object' && 'success' in response && response.success) {
      successMessage.value = `Successfully minted ${mintAmount.value} QWAMI!`
      
      // Refresh balances
      setTimeout(() => {
        wallet.fetchBalances()
      }, 2000)
      
      // Reset form
      mintAmount.value = 1000
    } else {
      const error = (response as any).error || 'Minting failed'
      wallet.error = error
    }
  } catch (err: any) {
    console.error('Mint error:', err)
    wallet.error = err.message || 'Failed to mint tokens'
  } finally {
    minting.value = false
  }
}

const handleBurn = async () => {
  if (!burnAmount.value || burnAmount.value <= 0) return

  burning.value = true
  successMessage.value = ''

  try {
    switch (burnType.value) {
      case 'energy':
        await anchor.burnForEnergy(burnAmount.value)
        break
      case 'connections':
        await anchor.burnForConnections(burnAmount.value)
        break
      case 'metamorphosis':
        await anchor.burnForMetamorphosis(burnAmount.value)
        break
      default:
        throw new Error('Invalid burn type')
    }

    const conversion = getBurnConversion()
    successMessage.value = `Successfully burned ${burnAmount.value} QWAMI for ${conversion}!`
    
    // Reset form
    burnAmount.value = burnTypes.find(t => t.id === burnType.value)?.min || 100
  } catch (err: any) {
    console.error('Burn error:', err)
    wallet.error = err.message || 'Failed to burn tokens'
  } finally {
    burning.value = false
  }
}

const getBurnConversion = (): string => {
  const type = burnTypes.find(t => t.id === burnType.value)
  if (!type || !burnAmount.value) return ''
  
  const converted = type.convert(burnAmount.value)
  return `${converted} ${type.unit}`
}
</script>

<style scoped>
.qwami-glass-window {
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
}

.glass-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.glass-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-emoji {
  font-size: 1.75rem;
}

.action-button {
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message, .success-message {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #FCA5A5;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6EE7B7;
}

.close-error, .close-success {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

.balances-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.balance-item {
  flex: 1;
  background: rgba(139, 92, 246, 0.1);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.balance-label {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.balance-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: rgba(139, 92, 246, 0.05);
  padding: 0.5rem;
  border-radius: 12px;
}

.tab-button {
  flex: 1;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button.active {
  background: rgba(139, 92, 246, 0.2);
  color: #fff;
}

.tab-content {
  margin-top: 1.5rem;
}

.tab-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.tab-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.token-input {
  width: 100%;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.token-input:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.6);
}

.input-hint {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.action-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.action-button.burn {
  background: linear-gradient(135deg, #F59E0B, #EF4444);
}

.burn-type-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.burn-type-btn {
  flex: 1;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.burn-type-btn.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  color: #fff;
}

.burn-type-emoji {
  font-size: 1.5rem;
}

.burn-type-label {
  font-size: 0.85rem;
  font-weight: 600;
}

.simulation-notice, .burn-notice {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
}

.simulation-notice {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #FCD34D;
}

.burn-notice {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #FCA5A5;
}

@media (max-width: 640px) {
  .qwami-glass-window {
    padding: 1.5rem;
    margin: 1rem;
  }

  .glass-header {
    flex-direction: column;
    gap: 1rem;
  }

  .balances-section {
    flex-direction: column;
  }

  .burn-type-selector {
    flex-direction: column;
  }
}
</style>


