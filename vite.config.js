import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/api': 'http://localhost:80'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Make sure we compile assets cleanly
    rollupOptions: {
      input: {
        main: './index.html',
        wishlist: './wishlist.html',
        cart: './cart.html',
        admin: './admin.html',
        profile: './profile.html'
      }
    }
  }
});
