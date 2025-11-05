<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 py-8 px-4">
    <div class="w-full max-w-3xl mx-auto">
      <!-- Main Glass Window -->
      <ClientOnly>
        <QwamiGlassWindow />
      </ClientOnly>

      <!-- Footer Disclaimer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          QWAMI is a utility token for AI services. Not financial advice. Do your own research.
        </p>
        <p class="text-xs text-gray-600 mt-2">
          Network: <span class="text-blue-400 font-mono">{{ config.public.solanaNetwork }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

// SEO
useHead({
  title: 'QWAMI Token - Mint & Burn',
  meta: [
    {
      name: 'description',
      content: 'Mint and burn QWAMI tokens - the utility token powering the Quami AI ecosystem on Solana.',
    },
    {
      property: 'og:title',
      content: 'QWAMI Token',
    },
    {
      property: 'og:description',
      content: 'Utility token for Quami AI services. Mint, burn, and manage your QWAMI tokens.',
    },
  ],
});
</script>

<style scoped>
/* Additional page-specific styles if needed */
</style>
