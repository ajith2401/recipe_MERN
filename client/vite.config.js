import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-date-pickers'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})