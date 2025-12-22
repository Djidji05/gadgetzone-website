<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAuthStore } from '@/stores/auth'
import { useDevice } from '@/composables/useDevice'

const authStore = useAuthStore()
const route = useRoute()
const isScrolled = ref(false)

// Device detection
const { isMobile, isTablet, isDesktop } = useDevice()

// Check if current route is an auth page
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/forgot-password' || route.path === '/reset-password'
})

// Check if footer should be shown
const shouldShowFooter = computed(() => {
  if (isAuthPage.value) return false
  if (!isMobile.value) return true // Desktop/Tablet always show (except auth)
  
  // Mobile: Show only on Home and Products (list)
  return route.name === 'home' || route.name === 'products'
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
  
  // Inactivity tracking (24h)
  setupInactivityTracking()
})

const setupInactivityTracking = () => {
  const INACTIVITY_LIMIT = 6 * 60 * 60 * 1000 // 6 hours
  let activityTimer: number | undefined

  const resetActivity = () => {
    localStorage.setItem('lastActivity', Date.now().toString())
  }

  const checkInactivity = () => {
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10)
    if (lastActivity && Date.now() - lastActivity > INACTIVITY_LIMIT) {
      if (authStore.isAuthenticated) {
        authStore.logout()
        // Optional: Redirect to login or show message
        // window.location.href = '/login' 
      }
    }
  }

  // Events to track
  const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
  events.forEach(event => {
    window.addEventListener(event, () => {
      resetActivity()
      // Optional: Debounce strictly if needed, but simple reset is usually fine for local storage if not spamming it too hard.
      // Actually, writing to LS on every scroll is bad performance. Let's throttle it.
    }, { passive: true })
  })
  
  // Throttle wrapper for resetActivity to avoid excessive LS writes
  let throttleTimer: number | undefined
  const throttledReset = () => {
    if (!throttleTimer) {
        resetActivity()
        throttleTimer = window.setTimeout(() => throttleTimer = undefined, 1000)
    }
  }
  
  // Remove old listeners and add throttled ones
  events.forEach(event => {
    window.removeEventListener(event, resetActivity as any) // Cleanup potential previous (none here but good practice)
    window.addEventListener(event, throttledReset, { passive: true })
  })

  // Check immediately
  checkInactivity()

  // Periodic check
  setInterval(checkInactivity, 60000) // Check every minute
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Device Detection Indicator removed -->

    <!-- Show navbar only on non-auth pages -->
    <AppNavbar v-if="!isAuthPage" :transparent="!isScrolled" />

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Show footer conditionally -->
    <AppFooter v-if="shouldShowFooter" />
    
    <!-- Bottom Navigation (always visible for now) -->
    <BottomNav v-if="!isAuthPage" />
  </div>
</template>

<style>
/* Import Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Mobile padding for bottom nav */
@media (max-width: 768px) {
  .min-h-screen {
    padding-bottom: 80px; /* Space for BottomNav + breathing room */
  }
}

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
