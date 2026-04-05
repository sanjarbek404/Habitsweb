import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // .env faylini yuklaymiz
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // process.env.API_KEY ni frontendga tanitamiz
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      proxy: {
        // '/api' bilan boshlanadigan har qanday so'rovni Backendga (5000) yo'naltirish
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});