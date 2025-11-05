import { defineStore } from 'pinia';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { Buffer } from 'buffer';

// Polyfill for browser
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

interface WalletState {
  isConnected: boolean;
  publicKey: string;
  balances: {
    SOL: number;
    QWAMI: number;
  };
  isLoading: boolean;
  error: string | null;
}

export const useWalletStore = defineStore('wallet', {
  persist: true,

  state: (): WalletState => ({
    isConnected: false,
    publicKey: '',
    balances: {
      SOL: 0,
      QWAMI: 0,
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    shortAddress: (state) => {
      if (!state.publicKey) return '';
      return `${state.publicKey.slice(0, 4)}...${state.publicKey.slice(-4)}`;
    },

    hasPhantom: () => {
      if (typeof window === 'undefined') return false;
      return 'solana' in window && (window as any).solana?.isPhantom;
    },
  },

  actions: {
    /**
     * Connect to Phantom wallet
     */
    async connectWallet() {
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection only available in browser');
      }

      if (!this.hasPhantom) {
        throw new Error('Phantom wallet not found. Please install from https://phantom.app');
      }

      this.isLoading = true;
      this.error = null;

      try {
        const provider = (window as any).solana;

        // Request connection
        const response = await provider.connect({ onlyIfTrusted: false });
        this.publicKey = response.publicKey.toString();
        this.isConnected = true;

        console.log('✅ Wallet connected:', this.shortAddress);

        // Fetch initial balances
        await this.refreshBalances();

        // Setup listeners for account changes
        provider.on('accountChanged', (publicKey: any) => {
          if (publicKey) {
            this.publicKey = publicKey.toString();
            this.refreshBalances();
          } else {
            this.disconnectWallet();
          }
        });

        provider.on('disconnect', () => {
          this.disconnectWallet();
        });
      } catch (error: any) {
        this.error = error.message || 'Failed to connect wallet';
        this.isConnected = false;
        this.publicKey = '';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Disconnect wallet
     */
    async disconnectWallet() {
      if (typeof window === 'undefined') return;

      try {
        const provider = (window as any).solana;
        if (provider?.isPhantom) {
          await provider.disconnect();
        }
      } catch (error) {
        console.warn('Error disconnecting wallet:', error);
      }

      this.isConnected = false;
      this.publicKey = '';
      this.balances = { SOL: 0, QWAMI: 0 };
      console.log('🔌 Wallet disconnected');
    },

    /**
     * Refresh SOL and QWAMI balances
     */
    async refreshBalances() {
      if (!this.isConnected || !this.publicKey) return;

      const config = useRuntimeConfig();
      const connection = new Connection(config.public.rpcUrl as string);

      try {
        // Fetch SOL balance
        const solBalance = await connection.getBalance(new PublicKey(this.publicKey));
        this.balances.SOL = solBalance / 1_000_000_000; // Convert lamports to SOL

        // Fetch QWAMI balance
        await this.fetchQwamiBalance(connection, config);

        console.log('💰 Balances updated:', this.balances);
      } catch (error: any) {
        console.error('Failed to fetch balances:', error);
        this.error = error.message || 'Failed to fetch balances';
      }
    },

    /**
     * Fetch QWAMI token balance
     */
    async fetchQwamiBalance(connection: Connection, config: any) {
      const qwamiMint = config.public.qwamiTokenMint as string;

      if (!qwamiMint) {
        console.warn('QWAMI token mint not configured');
        this.balances.QWAMI = 0;
        return;
      }

      try {
        const wallet = new PublicKey(this.publicKey);
        const mint = new PublicKey(qwamiMint);

        // Get associated token address
        const tokenAccount = await getAssociatedTokenAddress(mint, wallet);

        // Fetch account info
        const accountInfo = await getAccount(connection, tokenAccount);

        // QWAMI has 9 decimals
        const decimals = 9;
        this.balances.QWAMI = Number(accountInfo.amount) / Math.pow(10, decimals);
      } catch (error: any) {
        // Token account doesn't exist - balance is 0
        if (error.name === 'TokenAccountNotFoundError' || error.message?.includes('could not find')) {
          this.balances.QWAMI = 0;
        } else {
          console.warn('Error fetching QWAMI balance:', error);
          this.balances.QWAMI = 0;
        }
      }
    },

    /**
     * Get Phantom provider
     */
    getProvider() {
      if (typeof window === 'undefined') return null;
      if (!this.hasPhantom) return null;
      return (window as any).solana;
    },
  },
});
