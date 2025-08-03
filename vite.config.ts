import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          maps: ['leaflet', 'react-leaflet'],
          animations: ['framer-motion'],
          state: ['zustand'],
          utils: ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@react-three/fiber', '@react-three/drei']
  },
  server: {
    port: 5173
  }
})
