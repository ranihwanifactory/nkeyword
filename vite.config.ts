import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY works in the browser environment
      // after build, assuming the variable is set during the build process (e.g. in Vercel)
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});