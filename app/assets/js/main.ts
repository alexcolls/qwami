// QWAMI Token - Main client-side logic
console.log('☀️ QWAMI Token - Initializing...');

import { QwamiBlob } from './blob';

// Tailwind -500 colors for color palettes (16 sections)
const tailwindColors500 = [
  '#8B5CF6', // violet-500 (QWAMI primary)
  '#EC4899', // pink-500
  '#F59E0B', // amber-500
  '#10B981', // emerald-500
  '#06B6D4', // cyan-500
  '#3B82F6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
];

// Helper function to blend two hex colors
function blendColors(color1: string, color2: string): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round((r1 + r2) / 2);
  const g = Math.round((g1 + g2) / 2);
  const b = Math.round((b1 + b2) / 2);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Generate color palettes
const colorPalettes = tailwindColors500.map((color, index) => {
  const nextColor = tailwindColors500[(index + 1) % tailwindColors500.length];
  const middleColor = blendColors(color, nextColor);
  
  return {
    primary: color,
    secondary: nextColor,
    accent: middleColor
  };
});

// Custom Cursor Light Manager
class CursorLight {
  private light: HTMLElement | null = null;
  private isActive = false;

  constructor() {
    this.light = document.getElementById('cursor-light');
    if (this.light) {
      this.init();
    }
  }

  private init() {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.light) {
        this.light.style.left = `${e.clientX}px`;
        this.light.style.top = `${e.clientY}px`;
      }
      
      if (!this.isActive) {
        this.isActive = true;
        if (this.light) this.light.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      if (this.light) {
        this.light.classList.remove('active');
      }
      this.isActive = false;
    });

    document.addEventListener('mouseenter', () => {
      if (this.isActive && this.light) {
        this.light.classList.add('active');
      }
    });
  }

  public updateColors(palette: { primary: string, secondary: string, accent: string }) {
    if (!this.light) return;
    
    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    this.light.style.background = `radial-gradient(
      circle at center,
      ${hexToRgba(palette.primary, 0.25)} 0%,
      ${hexToRgba(palette.secondary, 0.15)} 25%,
      ${hexToRgba(palette.accent, 0.08)} 50%,
      transparent 70%
    )`;
  }
}

// Sidebar Navigation Manager
class SidebarNavigator {
  private sphereElements: HTMLElement[] = [];
  private container: HTMLElement | null = null;
  private totalSections: number;

  constructor(totalSections: number) {
    this.totalSections = totalSections;
    this.container = document.getElementById('sphere-container');

    if (this.container) {
      this.generateSpheres();
    }
  }

  private generateSpheres() {
    if (!this.container) return;

    for (let i = 0; i < this.totalSections; i++) {
      const sphere = document.createElement('button');
      sphere.className = 'nav-sphere';
      sphere.setAttribute('data-section', i.toString());
      sphere.setAttribute('aria-label', `Navigate to section ${String(i).padStart(2, '0')}`);
      
      let palette;
      if (i === 0) {
        palette = {
          primary: '#8B5CF6',
          secondary: '#EC4899'
        };
      } else {
        palette = colorPalettes[i];
      }
      sphere.style.background = `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`;
      
      sphere.addEventListener('click', (event) => {
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        const sectionIndex = parseInt(target.getAttribute('data-section') || '0', 10);
        this.navigateToSection(sectionIndex);
      });
      
      this.sphereElements.push(sphere);
      this.container!.appendChild(sphere);
    }
  }

  private navigateToSection(sectionIndex: number) {
    const docHeight = document.documentElement.scrollHeight;
    const sectionHeight = docHeight / this.totalSections;
    const targetScroll = sectionIndex * sectionHeight;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  public updateActiveSphere(sectionIndex: number) {
    this.sphereElements.forEach((sphere, index) => {
      if (index === sectionIndex) {
        sphere.classList.add('active');
      } else {
        sphere.classList.remove('active');
      }
    });
  }
}

// Main scroll handler
class ScrollManager {
  private sections: NodeListOf<Element>;
  private currentSection = 0;
  private root: HTMLElement;
  private sidebarNav: SidebarNavigator;
  private cursorLight: CursorLight;
  private blob: QwamiBlob | null = null;

  constructor() {
    this.sections = document.querySelectorAll('.text-section');
    this.root = document.documentElement;
    this.root.style.setProperty('--section-count', this.sections.length.toString());
    this.sidebarNav = new SidebarNavigator(this.sections.length);
    this.cursorLight = new CursorLight();
    
    // Initialize blob visualization
    this.initBlob();
    
    this.init();
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.handleScroll(); // Initial call
  }

  private initBlob() {
    try {
      this.blob = new QwamiBlob('kwami-container');
      console.log('✨ QWAMI Blob initialized');
    } catch (error) {
      console.error('Failed to initialize blob:', error);
    }
  }

  public getCurrentSection(): number {
    return this.currentSection;
  }

  public getSections(): NodeListOf<Element> {
    return this.sections;
  }

  private init() {
    // Set initial colors for section 0
    this.updateColors(0);
    this.cursorLight.updateColors(colorPalettes[0]);
    if (this.blob) {
      this.blob.updateColors(colorPalettes[0]);
    }
  }

  private handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    
    const totalSections = this.sections.length;
    const sectionHeight = docHeight / totalSections;
    const section = Math.min(
      Math.floor(scrollTop / sectionHeight),
      totalSections - 1
    );

    this.updateActiveSection(section);
    this.sidebarNav.updateActiveSphere(section);

    if (section !== this.currentSection) {
      this.currentSection = section;
      const palette = colorPalettes[section % colorPalettes.length];
      this.updateColors(section);
      this.cursorLight.updateColors(palette);
      if (this.blob) {
        this.blob.updateColors(palette);
      }
    }
  }

  private updateActiveSection(section: number) {
    this.sections.forEach((sec, index) => {
      if (index === section) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });
  }

  private updateColors(section: number) {
    const palette = colorPalettes[section % colorPalettes.length];
    this.root.style.setProperty('--color-primary', palette.primary);
    this.root.style.setProperty('--color-secondary', palette.secondary);
    this.root.style.setProperty('--color-accent', palette.accent);
  }
}

// Action button routes
interface ActionConfig {
  url?: string;
  message: string;
}

const ACTION_ROUTES: Record<string, ActionConfig> = {
  'get-qwami': {
    url: '/app',
    message: 'Opening QWAMI app...'
  },
  'learn-energy': {
    url: 'https://github.com/alexcolls/kwami/blob/dev/docs/QWAMI_TOKEN.md#energy',
    message: 'Opening Energy docs...'
  },
  'expand-connections': {
    url: 'https://github.com/alexcolls/kwami/blob/dev/docs/QWAMI_TOKEN.md#connections',
    message: 'Opening Connections docs...'
  },
  'unlock-metamorphosis': {
    url: 'https://github.com/alexcolls/kwami/blob/dev/docs/QWAMI_TOKEN.md#metamorphosis',
    message: 'Opening Metamorphosis docs...'
  },
  'view-dividends': {
    url: '/app',
    message: 'Opening QWAMI app...'
  },
  'start-staking': {
    url: '/app',
    message: 'Opening QWAMI app...'
  },
  'join-dao': {
    url: '/app',
    message: 'Opening QWAMI app...'
  },
  'buy-qwami': {
    url: '/app',
    message: 'Opening QWAMI app...'
  },
  'mint-kwami': {
    url: 'https://candy.kwami.io',
    message: 'Opening KWAMI Mint...'
  },
  'connect-wallet': {
    url: '/app',
    message: 'Opening QWAMI app...'
  },
  'read-docs': {
    url: 'https://github.com/alexcolls/kwami/tree/dev/docs',
    message: 'Opening documentation...'
  }
};

class ActionButtonManager {
  private buttons: NodeListOf<HTMLButtonElement>;

  constructor() {
    this.buttons = document.querySelectorAll('[data-action-key]');
    if (!this.buttons.length) return;
    this.attachListeners();
  }

  private attachListeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', this.handleClick.bind(this));
    });
  }

  private handleClick(event: Event) {
    event.preventDefault();
    const button = event.currentTarget as HTMLButtonElement;
    const key = button.dataset.actionKey;
    if (!key) return;
    const config = ACTION_ROUTES[key];
    if (!config) return;

    button.classList.add('triggered');
    window.setTimeout(() => button.classList.remove('triggered'), 400);

    if (config.url) {
      // Internal navigation for /app routes
      if (config.url.startsWith('/')) {
        window.location.href = config.url;
      } else {
        // External links open in new tab
        window.open(config.url, '_blank', 'noopener,noreferrer');
      }
    }

    console.log(`✨ ${config.message}`);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new ScrollManager();
  new ActionButtonManager();
  
  console.log('🌕 QWAMI Token initialized!');
});

// Add scroll indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
scrollIndicator.textContent = '↓';
document.body.appendChild(scrollIndicator);

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollIndicator.style.opacity = '0';
  } else {
    scrollIndicator.style.opacity = '0.5';
  }
});

// Initialize function
export default function initQwami() {
  // Console message
  console.log(`
    ☀️ QWAMI Token - Fuel Your KWAMI & Earn Weekly Dividends
    
    💰 Dividends: 80% of profits every Friday
    🔒 Staking: Earn APY + Dividends
    ⚡ Energy | 🔗 Connections | 🦋 Metamorphosis
    
    1 QWAMI = $0.01 USD | Max Supply: 1 Trillion
    Decimals: 0 (Integer) | Network: Solana SPL
    
    Revenue: market.kwami.io + candy.kwami.io
    Learn more at qwami.io
  `);
  
  // Return initialization status
  return true;
}

