import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-date-pickers'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true // Add for better debugging
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  // Add this if you're using environment variables
  define: {
    'process.env': {}
  }
})