import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@mantine')) {
            return 'vendor-mantine';
          }
          if (id.includes('node_modules/@tabler')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
})
