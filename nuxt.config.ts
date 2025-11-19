// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  devtools: { enabled: true },
  
  // SPA mode (no SSR)
  ssr: false,
  
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
  modules: [],
  
  // Build configuration
  build: {
    transpile: []
  },
  
  // Vite configuration
  vite: {
    build: {
      target: 'es2020'
    }
  }
})

