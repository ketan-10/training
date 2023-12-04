import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';
import { BASE_URL } from './src/Constants';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: BASE_URL,
  server: {
    port: 4000,
    open: '/',
  },
  exclude: [
    '@ionic/core/loader', //fix weird Vite error "outdated optimize dep"
  ],
});
