import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ajuste seguro para funcionar em Windows/Linux sem erro de __dirname
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
})