// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  // Development server configuration
  devServer: {
    port: 4444
  },

  // SPA mode (no SSR)
  ssr: false,

  // Custom directory structure
  dir: {
    pages: 'app/pages',
    layouts: 'app/layouts',
    public: 'public'
  },

  // Point to custom app.vue location
  srcDir: './',
  rootDir: './',

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'QWAMI Token',
      meta: [
        { name: 'description', content: 'QWAMI - The native KWAMI NFT token for AI Energy, Connections, and Metamorphosis' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  // CSS configuration
  css: [
    '@/app/assets/css/main.css'
  ],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Modules
  modules: ['@pinia/nuxt'],

  // Build configuration
  build: {
    transpile: []
  },

  // Vite configuration
  vite: {
    esbuild: {
      target: 'esnext'
    },
    build: {
      target: 'esnext'
    },
    optimizeDeps: {
      include: ['@solana/web3.js', 'buffer'],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    define: {
      'process.env.BROWSER': true
    }
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server-side only)
    qwamiAuthorityPrivateKey: process.env.NUXT_QWAMI_AUTHORITY_PRIVATE_KEY || 'PLACEHOLDER_BASE58_PRIVATE_KEY',
    
    // Public config (available on client)
    public: {
      // Solana network configuration
      solanaNetwork: process.env.NUXT_PUBLIC_SOLANA_NETWORK || 'devnet',
      solanaRpcEndpoint: process.env.NUXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
      
      // QWAMI token configuration
      qwamiTokenProgramId: process.env.NUXT_PUBLIC_QWAMI_TOKEN_PROGRAM_ID || 'PLACEHOLDER_PROGRAM_ID',
      qwamiTokenMint: process.env.NUXT_PUBLIC_QWAMI_TOKEN_MINT || 'PLACEHOLDER_MINT_ADDRESS',
      qwamiTokenAuthority: process.env.NUXT_PUBLIC_QWAMI_TOKEN_AUTHORITY || 'PLACEHOLDER_AUTHORITY_PUBKEY',
      
      // Token economics
      qwamiBasePriceCents: parseInt(process.env.NUXT_PUBLIC_QWAMI_BASE_PRICE_CENTS || '1'),
      solUsdPrice: parseFloat(process.env.NUXT_PUBLIC_SOL_USD_PRICE || '150'),
      
      // Feature flags
      devnetSimulation: process.env.NUXT_PUBLIC_DEVNET_SIMULATION === 'true',
      stakingEnabled: process.env.NUXT_PUBLIC_STAKING_ENABLED === 'true',
      daoEnabled: process.env.NUXT_PUBLIC_DAO_ENABLED === 'true',
      
      // External links
      kwamiWebsite: process.env.NUXT_PUBLIC_KWAMI_WEBSITE || 'https://kwami.io',
      candyWebsite: process.env.NUXT_PUBLIC_CANDY_WEBSITE || 'https://candy.kwami.io',
      marketWebsite: process.env.NUXT_PUBLIC_MARKET_WEBSITE || 'https://market.kwami.io',
      githubUrl: process.env.NUXT_PUBLIC_GITHUB_URL || 'https://github.com/alexcolls/kwami',
    }
  }
})

