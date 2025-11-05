import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  
  ssr: false, // SPA mode

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'QWAMI Token - Mint & Burn',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'QWAMI is the utility token powering the Quami AI ecosystem on Solana. Mint and burn QWAMI tokens for AI services.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },

  runtimeConfig: {
    // Server-side only
    qwamiAuthorityPrivateKey: process.env.NUXT_QWAMI_AUTHORITY_PRIVATE_KEY || '',

    // Public (client + server)
    public: {
      solanaNetwork: process.env.NUXT_PUBLIC_SOLANA_NETWORK || 'devnet',
      rpcUrl: process.env.NUXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com',
      qwamiTokenMint: process.env.NUXT_PUBLIC_QWAMI_TOKEN_MINT || '',
      qwamiTokenProgramId: process.env.NUXT_PUBLIC_QWAMI_TOKEN_PROGRAM_ID || '',
      qwamiTokenAuthority: process.env.NUXT_PUBLIC_QWAMI_TOKEN_AUTHORITY || '',
      qwamiBasePriceUsd: parseFloat(process.env.NUXT_PUBLIC_QWAMI_BASE_PRICE_USD || '0.01'),
      treasuryWallet: process.env.NUXT_PUBLIC_TREASURY_WALLET || '',
      usdcMint: process.env.NUXT_PUBLIC_USDC_MINT || '',
    },
  },

  vite: {
    define: {
      global: 'globalThis',
      'process.env': {},
    },
    resolve: {
      alias: {
        buffer: 'buffer/',
        stream: 'stream-browserify',
        util: 'util/',
      },
    },
    optimizeDeps: {
      include: ['buffer', '@solana/web3.js', '@solana/spl-token'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  },

  colorMode: {
    preference: 'dark',
  },

  ui: {
    // Default dark theme
  },

  piniaPersistedstate: {
    storage: 'localStorage',
  },

  compatibilityDate: '2025-11-05',
});
