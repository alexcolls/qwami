<template>
  <div class="app-page">
    <!-- Background blob (same as landing page) -->
    <div id="kwami-container-app" class="blob-background" />

    <!-- Header -->
    <header class="app-header">
      <NuxtLink to="/" class="logo-link">
        <span class="logo-emoji">☀️</span>
        <span class="logo-text">QWAMI</span>
      </NuxtLink>

      <nav class="nav-links">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <a href="https://kwami.io" target="_blank" class="nav-link">KWAMI</a>
        <a href="https://candy.kwami.io" target="_blank" class="nav-link">Mint NFT</a>
        <a href="https://github.com/alexcolls/kwami" target="_blank" class="nav-link">GitHub</a>
      </nav>
    </header>

    <!-- Main content -->
    <div class="app-content">
      <div class="content-wrapper">
        <!-- Page title -->
        <div class="page-header">
          <h1 class="page-title">
            <span class="title-emoji">☀️</span> QWAMI Token App
          </h1>
          <p class="page-subtitle">
            Mint QWAMI tokens or burn them to power your KWAMI NFT
          </p>
        </div>

        <!-- Token info cards -->
        <QwamiTokenInfo />

        <!-- Glass window (mint/burn interface) -->
        <QwamiGlassWindow />

        <!-- Additional info section -->
        <div class="info-section">
          <div class="info-card-large">
            <h3 class="info-title">⚡ What is Energy?</h3>
            <p class="info-text">
              Energy fuels your KWAMI's AI API calls to providers like ElevenLabs and OpenAI. 
              Burn QWAMI tokens to recharge your KWAMI's energy pool and enable cloud AI features.
            </p>
          </div>

          <div class="info-card-large">
            <h3 class="info-title">🔗 What are Connections?</h3>
            <p class="info-text">
              Connections determine how many app integrations your KWAMI can hold simultaneously. 
              Expand your connection capacity to integrate with Instagram, WhatsApp, Gmail, and more.
            </p>
          </div>

          <div class="info-card-large">
            <h3 class="info-title">🦋 What is Metamorphosis?</h3>
            <p class="info-text">
              Metamorphosis slots allow you to save multiple KWAMI configurations (Mind, Soul, Body). 
              Create different personas for work, play, creativity, and wellness.
            </p>
          </div>
        </div>

        <!-- Links section -->
        <div class="links-section">
          <h3 class="links-title">Learn More</h3>
          <div class="links-grid">
            <a href="https://kwami.io" target="_blank" class="link-card">
              <span class="link-emoji">👻</span>
              <span class="link-text">KWAMI Framework</span>
            </a>
            <a href="https://candy.kwami.io" target="_blank" class="link-card">
              <span class="link-emoji">🍬</span>
              <span class="link-text">Mint KWAMI NFT</span>
            </a>
            <a href="https://github.com/alexcolls/kwami" target="_blank" class="link-card">
              <span class="link-emoji">⭐</span>
              <span class="link-text">GitHub Repository</span>
            </a>
            <NuxtLink to="/" class="link-card">
              <span class="link-emoji">☀️</span>
              <span class="link-text">About QWAMI</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <p>Built with 💜 for the KWAMI community</p>
      <p class="footer-links">
        <a href="https://github.com/alexcolls/kwami" target="_blank">GitHub</a>
        <span>•</span>
        <a href="https://kwami.io" target="_blank">KWAMI</a>
        <span>•</span>
        <NuxtLink to="/">About</NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'QWAMI Token App - Mint & Burn',
  meta: [
    {
      name: 'description',
      content: 'Mint QWAMI tokens or burn them for Energy, Connections, and Metamorphosis to power your KWAMI AI companion'
    }
  ]
})

// Initialize blob animation
onMounted(async () => {
  if (process.client) {
    try {
      // Dynamically import blob module
      const blobModule = await import('~/app/assets/js/blob')
      if (blobModule && typeof blobModule.default === 'function') {
        blobModule.default('kwami-container-app')
      }
    } catch (error) {
      console.warn('Could not initialize blob:', error)
    }
  }
})
</script>

<style scoped>
.app-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0a2e 100%);
  color: #fff;
  position: relative;
  overflow-x: hidden;
}

.blob-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  transition: transform 0.3s;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-emoji {
  font-size: 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #fff;
}

.app-content {
  position: relative;
  z-index: 1;
  padding: 2rem 1rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-emoji {
  font-size: 3.5rem;
}

.page-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

.info-section {
  margin: 4rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card-large {
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s;
}

.info-card-large:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.info-text {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.links-section {
  margin: 4rem 0;
  text-align: center;
}

.links-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #fff;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.link-card {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.5);
}

.link-emoji {
  font-size: 2rem;
}

.link-text {
  font-weight: 600;
  font-size: 1.05rem;
}

.app-footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4rem;
}

.footer-links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-title {
    font-size: 2rem;
  }

  .title-emoji {
    font-size: 2.5rem;
  }

  .info-section {
    grid-template-columns: 1fr;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>


