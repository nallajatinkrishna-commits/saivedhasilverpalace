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
        profile: './profile.html',
        articles: './articles.html',
        womens: './womens.html',
        mens: './mens.html',
        gallery: './gallery.html',
        about: './about.html',
        contact: './contact.html',
        adminPrice: './admin-price.html',
        adminInquiries: './admin-inquiries.html',
        adminCustomerLogins: './admin-customer-logins.html',
        adminSessions: './admin-sessions.html',
        adminProducts: './admin-products.html'
      }
    }
  }
});
