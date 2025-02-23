import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: false, // Desactiva caché de Vite
  server: {
    watch: {
      usePolling: true, // Asegura que los cambios se detecten correctamente
    }
  }
})
