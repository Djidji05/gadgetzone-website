<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path || (path !== '/seller/dashboard' && route.path.startsWith(path))
}
</script>

<template>
  <nav class="seller-bottom-nav">
    <router-link to="/seller/dashboard" class="nav-item" :class="{ active: route.path === '/seller/dashboard' }">
      <i class="fas fa-home icon"></i>
      <span>Dashboard</span>
    </router-link>

    <router-link to="/seller/orders" class="nav-item" :class="{ active: isActive('/seller/orders') }">
      <i class="fas fa-shopping-cart icon"></i>
      <span>Commandes</span>
    </router-link>

    <router-link to="/seller/products" class="nav-item" :class="{ active: isActive('/seller/products') }">
      <i class="fas fa-box icon"></i>
      <span>Produits</span>
    </router-link>

    <router-link to="/seller/payments" class="nav-item" :class="{ active: isActive('/seller/payments') }">
      <i class="fas fa-wallet icon"></i>
      <span>Revenue</span>
    </router-link>

    <router-link to="/" class="nav-item">
      <i class="fas fa-store icon"></i>
      <span>Site</span>
    </router-link>
  </nav>
</template>

<style scoped>
.seller-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.5rem 0;
  z-index: 40;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: #2563eb; /* Blue-600 */
}

.icon {
  font-size: 1.25rem;
}

span {
  font-size: 0.65rem;
  font-weight: 600;
}

/* Hide on desktop */
@media (min-width: 768px) {
  .seller-bottom-nav {
    display: none;
  }
}

/* Dark mode support if needed */
:global(.dark) .seller-bottom-nav {
  background: #1f2937;
  border-color: #374151;
}

:global(.dark) .nav-item {
  color: #9ca3af;
}

:global(.dark) .nav-item.active {
  color: #3b82f6;
}
</style>
