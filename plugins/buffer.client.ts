import { Buffer } from 'buffer';

export default defineNuxtPlugin(() => {
  // Polyfill Buffer for browser environment
  if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    (globalThis as any).Buffer = Buffer;
  }
});
