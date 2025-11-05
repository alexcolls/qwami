<template>
  <UCard
    class="backdrop-blur-xl bg-gray-900/80 border border-gray-700/50 shadow-2xl max-w-2xl mx-auto"
  >
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <UIcon name="i-heroicons-currency-dollar" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">
              QWAMI Token
            </h2>
            <p class="text-sm text-gray-400">
              Utility token for Quami AI ecosystem
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Wallet Connection Section -->
    <div v-if="!wallet.isConnected" class="space-y-4">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-wallet" class="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p class="text-gray-400 mb-6">
          Connect your Phantom wallet to start minting or burning QWAMI tokens
        </p>
        
        <UButton
          size="xl"
          color="primary"
          :loading="wallet.isLoading"
          :disabled="!wallet.hasPhantom"
          @click="handleConnect"
        >
          <template #leading>
            <UIcon name="i-heroicons-bolt" />
          </template>
          {{ wallet.hasPhantom ? 'Connect Phantom Wallet' : 'Install Phantom Wallet' }}
        </UButton>

        <p v-if="!wallet.hasPhantom" class="text-xs text-gray-500 mt-2">
          Download from <a href="https://phantom.app" target="_blank" class="text-blue-400 hover:underline">phantom.app</a>
        </p>
      </div>

      <!-- Error Display -->
      <UAlert
        v-if="wallet.error"
        color="red"
        variant="soft"
        :title="wallet.error"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
        @close="wallet.error = null"
      />
    </div>

    <!-- Connected View -->
    <div v-else class="space-y-6">
      <!-- Wallet Info -->
      <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div class="flex-1">
          <p class="text-xs text-gray-500 mb-1">
            Connected Wallet
          </p>
          <p class="font-mono text-sm text-gray-300">
            {{ wallet.shortAddress }}
          </p>
        </div>
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          @click="handleDisconnect"
        >
          Disconnect
        </UButton>
      </div>

      <!-- Balances -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20">
          <p class="text-xs text-gray-400 mb-1">
            SOL Balance
          </p>
          <p class="text-2xl font-bold text-white">
            {{ wallet.balances.SOL.toFixed(4) }}
          </p>
        </div>
        <div class="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
          <p class="text-xs text-gray-400 mb-1">
            QWAMI Balance
          </p>
          <p class="text-2xl font-bold text-white">
            {{ wallet.balances.QWAMI.toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- Tabs: Mint / Burn -->
      <UTabs
        v-model="selectedTab"
        :items="tabs"
        class="w-full"
      >
        <template #mint>
          <div class="py-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Amount to Mint (QWAMI)
              </label>
              <UInput
                v-model="mintAmount"
                type="number"
                placeholder="1000"
                size="xl"
                :disabled="isMinting"
              />
              <p class="text-xs text-gray-500 mt-1">
                Cost: ${{ (parseFloat(mintAmount || '0') * config.public.qwamiBasePriceUsd).toFixed(2) }} USD
                ({{ (parseFloat(mintAmount || '0') * config.public.qwamiBasePriceUsd).toFixed(4) }} SOL est.)
              </p>
            </div>

            <UButton
              block
              size="xl"
              color="green"
              :loading="isMinting"
              :disabled="!mintAmount || parseFloat(mintAmount) <= 0"
              @click="handleMint"
            >
              <template #leading>
                <UIcon name="i-heroicons-plus-circle" />
              </template>
              Mint QWAMI Tokens
            </UButton>

            <UAlert
              v-if="mintError"
              color="red"
              variant="soft"
              :title="mintError"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
              @close="mintError = null"
            />

            <UAlert
              v-if="mintSuccess"
              color="green"
              variant="soft"
              title="Tokens minted successfully!"
              :description="`Added ${mintAmount} QWAMI to your wallet`"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'green', variant: 'link' }"
              @close="mintSuccess = false"
            />
          </div>
        </template>

        <template #burn>
          <div class="py-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Amount to Burn (QWAMI)
              </label>
              <UInput
                v-model="burnAmount"
                type="number"
                placeholder="100"
                size="xl"
                :disabled="isBurning"
              />
              <p class="text-xs text-gray-500 mt-1">
                This will permanently destroy {{ burnAmount || 0 }} QWAMI from your wallet
              </p>
            </div>

            <UButton
              block
              size="xl"
              color="red"
              :loading="isBurning"
              :disabled="!burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > wallet.balances.QWAMI"
              @click="handleBurn"
            >
              <template #leading>
                <UIcon name="i-heroicons-fire" />
              </template>
              Burn QWAMI Tokens
            </UButton>

            <UAlert
              v-if="burnError"
              color="red"
              variant="soft"
              :title="burnError"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
              @close="burnError = null"
            />

            <UAlert
              v-if="burnSuccess"
              color="green"
              variant="soft"
              title="Tokens burned successfully!"
              :description="`Destroyed ${burnAmount} QWAMI from circulation`"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'green', variant: 'link' }"
              @close="burnSuccess = false"
            />

            <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p class="text-xs text-yellow-400 flex items-center gap-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                Burning is irreversible. Tokens will be permanently removed from circulation.
              </p>
            </div>
          </div>
        </template>
      </UTabs>

      <!-- Token Information -->
      <div class="pt-6 border-t border-gray-700/50">
        <h3 class="text-lg font-semibold text-white mb-4">
          Token Information
        </h3>
        <QwamiTokenInfo />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const wallet = useWalletStore();
const config = useRuntimeConfig();

const selectedTab = ref(0);
const tabs = [
  { label: 'Mint', icon: 'i-heroicons-plus-circle', slot: 'mint' },
  { label: 'Burn', icon: 'i-heroicons-fire', slot: 'burn' },
];

// Mint state
const mintAmount = ref('');
const isMinting = ref(false);
const mintError = ref<string | null>(null);
const mintSuccess = ref(false);

// Burn state
const burnAmount = ref('');
const isBurning = ref(false);
const burnError = ref<string | null>(null);
const burnSuccess = ref(false);

/**
 * Connect wallet
 */
async function handleConnect() {
  try {
    await wallet.connectWallet();
  } catch (error: any) {
    console.error('Failed to connect wallet:', error);
  }
}

/**
 * Disconnect wallet
 */
async function handleDisconnect() {
  await wallet.disconnectWallet();
}

/**
 * Mint tokens (purchase)
 */
async function handleMint() {
  if (!mintAmount.value || parseFloat(mintAmount.value) <= 0) {
    return;
  }

  isMinting.value = true;
  mintError.value = null;
  mintSuccess.value = false;

  try {
    const response = await $fetch('/api/qwami/purchase', {
      method: 'POST',
      body: {
        wallet: wallet.publicKey,
        amount: parseFloat(mintAmount.value),
        payIn: 'SOL',
      },
    });

    if (!response.success) {
      throw new Error(response.error || 'Mint failed');
    }

    mintSuccess.value = true;
    mintAmount.value = '';

    // Refresh balance after successful mint
    await wallet.refreshBalances();
  } catch (error: any) {
    console.error('Mint error:', error);
    mintError.value = error.message || error.data?.message || 'Failed to mint tokens';
  } finally {
    isMinting.value = false;
  }
}

/**
 * Burn tokens
 */
async function handleBurn() {
  if (!burnAmount.value || parseFloat(burnAmount.value) <= 0) {
    return;
  }

  if (parseFloat(burnAmount.value) > wallet.balances.QWAMI) {
    burnError.value = 'Insufficient QWAMI balance';
    return;
  }

  isBurning.value = true;
  burnError.value = null;
  burnSuccess.value = false;

  try {
    // TODO: Implement client-side burn via Anchor
    // For now, show placeholder error
    throw new Error('Burn functionality not yet implemented. Deploy qwami_token program first and add burn composable.');
  } catch (error: any) {
    console.error('Burn error:', error);
    burnError.value = error.message || 'Failed to burn tokens';
  } finally {
    isBurning.value = false;
  }
}
</script>
