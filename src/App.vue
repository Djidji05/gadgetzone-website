<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const isScrolled = ref(false)

// Check if current route is an auth page
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

// Gérer le scroll pour le navbar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100 // 10cm ≈ 100px
}

// Initialize auth on app load
onMounted(() => {
  authStore.initAuth()
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Vérifier la position initiale
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Show navbar only on non-auth pages -->
    <AppNavbar v-if="!isAuthPage" :transparent="!isScrolled" />

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Show footer only on non-auth pages -->
    <AppFooter v-if="!isAuthPage" />
    
    <!-- Simple copyright footer for auth pages -->
    <footer v-else class="py-6 bg-white border-t border-gray-200">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm text-gray-600">
          © {{ new Date().getFullYear() }} GadgetZone. Tous droits réservés.
        </p>
        <p class="text-xs text-gray-500 mt-2">
          Votre destination pour les meilleurs gadgets technologiques
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Import Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Custom animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Focus styles */
.focus-ring:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading states */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
