<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-3xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Connexion à votre compte</h1>
        <p class="text-gray-600">
          Pas encore inscrit ?
          <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-semibold">
            Créez un compte
          </router-link>
        </p>
      </div>

      <!-- Main Container with Avatar and Form -->
      <div class="relative flex items-start gap-8">
        <!-- Avatar Character -->
        <div 
          class="flex-shrink-0 transition-all duration-1000 ease-out"
          :style="{ 
            transform: `translateY(${avatarPosition}px) scale(${avatarScale})`,
            opacity: avatarOpacity
          }"
        >
          <div class="w-64 h-80 relative">
            <!-- Realistic 3D Character Image -->
            <img 
              src="/registration_avatar.png" 
              alt="Welcome Back"
              class="w-full h-full object-contain drop-shadow-2xl animate-wave-hand"
              :class="{ 'animate-bounce-slow': isAnimating }"
            />
            <!-- Speech Bubble -->
            <div 
              v-if="formExpanded"
              class="absolute -right-4 top-0 bg-white rounded-2xl shadow-xl p-4 max-w-xs animate-fade-in"
              style="animation-delay: 1s;"
            >
              <div class="relative">
                <p class="text-sm font-medium text-gray-800">
                  Content de vous revoir ! 👋<br/>
                  Connectez-vous pour continuer
                </p>
                <!-- Speech bubble arrow pointing down -->
                <div class="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div 
          class="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-1000 ease-out border-2 border-blue-100"
          :style="{ 
            maxHeight: formExpanded ? '2000px' : '0px',
            opacity: formExpanded ? 1 : 0,
            transform: `scaleY(${formExpanded ? 1 : 0})`,
            transformOrigin: 'top'
          }"
        >
          <div class="p-6">
            <!-- Error Message -->
            <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p class="font-medium">{{ error }}</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
              <!-- Email -->
              <div class="form-group">
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-envelope mr-2 text-blue-500"></i>Email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="votre@email.com"
                />
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-lock mr-2 text-blue-500"></i>Mot de passe
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember"
                    v-model="form.remember"
                    type="checkbox"
                    class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label for="remember" class="ml-3 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" class="text-blue-600 hover:text-blue-700 font-semibold">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-105 active:scale-95"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-sign-in-alt mr-2"></i>
                {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
              </button>
            </form>

            <!-- Social Login -->
            <div class="mt-8">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white text-gray-500 font-medium">Ou continuer avec</span>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="handleGoogleLogin"
                  class="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-all group"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span class="ml-2 text-sm font-medium text-gray-700">Google</span>
                </button>

                <button
                  type="button"
                  @click="handleFacebookLogin"
                  class="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-all group"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span class="ml-2 text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const isLoading = ref(false)
const error = ref('')
const form = ref({
  email: '',
  password: '',
  remember: false,
})

// Animation state
const formExpanded = ref(false)
const avatarPosition = ref(0)
const isAnimating = ref(false)
const avatarScale = ref(0.8)
const avatarOpacity = ref(0)

// Methods
const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''

    await authStore.login(form.value.email, form.value.password)

    // Redirect to intended page or home
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: unknown) {
    const errorResponse = err as { response?: { data?: { message?: string } } }
    error.value = errorResponse.response?.data?.message || 'Erreur de connexion'
  } finally {
    isLoading.value = false
  }
}

// Clear error when form changes
const clearError = () => {
  error.value = ''
}

// OAuth login handlers
const handleGoogleLogin = () => {
  // Redirect to Google OAuth
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
  const redirectUri = `${window.location.origin}/auth/google/callback`
  const scope = 'email profile'
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
  
  window.location.href = googleAuthUrl
}

const handleFacebookLogin = () => {
  // Redirect to Facebook OAuth
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID'
  const redirectUri = `${window.location.origin}/auth/facebook/callback`
  
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&scope=email,public_profile`
  
  window.location.href = facebookAuthUrl
}

// Animation on mount
onMounted(() => {
  // Start animation sequence
  setTimeout(() => {
    // Fade in avatar
    avatarOpacity.value = 1
    
    setTimeout(() => {
      // Scale up avatar
      avatarScale.value = 1
      isAnimating.value = true
      
      // Avatar moves down as form expands
      const interval = setInterval(() => {
        if (avatarPosition.value < 50) {
          avatarPosition.value += 2
        } else {
          clearInterval(interval)
          isAnimating.value = false
        }
      }, 20)
      
      // Expand form with slight delay
      setTimeout(() => {
        formExpanded.value = true
      }, 300)
    }, 400)
  }, 200)
})

// Watch form changes
watch(() => [form.value.email, form.value.password], clearError)
</script>

<style scoped>
@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes wave-hand {
  0%, 100% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(14deg);
  }
  20% {
    transform: rotate(-8deg);
  }
  30% {
    transform: rotate(14deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(0deg);
  }
}

.animate-wave {
  animation: wave 0.5s ease-in-out infinite;
  transform-origin: top;
}

.animate-wave-hand {
  animation: wave-hand 2.5s ease-in-out infinite;
  transform-origin: center;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.form-group {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
