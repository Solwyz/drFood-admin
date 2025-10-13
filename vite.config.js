import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vite.dev/config/ 
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 3001,        // Set custom port (e.g., 3001)
    // allowedHosts: ['dev-admin.solwys.com', 'www.dev-admin.solwys.com']
  },
  resolve: {
    alias: {
      // Set up aliases for easier imports, especially for assets
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  build: {
    // Define the build output directory
    outDir: 'dist',
    assetsDir: 'assets',  // Place all assets inside the assets folder in dist
    // Additional optimization if needed for images and static assets
    rollupOptions: {
      output: {
        // Maintain file names (hashes added for cache busting)
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
