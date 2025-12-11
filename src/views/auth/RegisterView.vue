<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-3xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Créer votre compte</h1>
        <p class="text-gray-600">
          Déjà inscrit ?
          <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
            Connectez-vous
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
              alt="Welcome Character"
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
                  Bienvenue ! 👋<br/>
                  Créons votre compte ensemble !
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

            <form @submit.prevent="handleRegister" class="space-y-6">
              <!-- Name Fields -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-user mr-2 text-blue-500"></i>Prénom
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Jean"
                  />
                </div>

                <div class="form-group">
                  <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-user mr-2 text-blue-500"></i>Nom
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Dupont"
                  />
                </div>
              </div>

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

              <!-- Phone -->
              <div class="form-group">
                <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-phone mr-2 text-blue-500"></i>Téléphone (optionnel)
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="+509 34 56 78 90"
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
                  minlength="6"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <!-- Confirm Password -->
              <div class="form-group">
                <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-lock mr-2 text-blue-500"></i>Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="••••••••"
                />
                <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" 
                   class="mt-1 text-sm text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              </div>

              <!-- Password Requirements -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800">
                  <i class="fas fa-info-circle mr-2"></i>
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-start">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  required
                  class="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label for="terms" class="ml-3 block text-sm text-gray-700">
                  J'accepte les
                  <router-link to="/terms" class="text-blue-600 hover:text-blue-700 font-semibold">
                    conditions d'utilisation
                  </router-link>
                  et la
                  <router-link to="/privacy" class="text-blue-600 hover:text-blue-700 font-semibold">
                    politique de confidentialité
                  </router-link>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading || !isFormValid"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-105 active:scale-95"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-user-plus mr-2"></i>
                {{ isLoading ? 'Inscription en cours...' : 'S\'inscrire maintenant' }}
              </button>
            </form>

            <!-- Social Registration -->
            <div class="mt-8">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white text-gray-500 font-medium">Ou s'inscrire avec</span>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const isLoading = ref(false)
const error = ref('')
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

// Animation state
const formExpanded = ref(false)
const avatarPosition = ref(0)
const isAnimating = ref(false)
const avatarScale = ref(0.8)
const avatarOpacity = ref(0)

// Computed
const isFormValid = computed(() => {
  return (
    form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.acceptTerms &&
    form.value.password === form.value.confirmPassword &&
    form.value.password.length >= 6
  )
})

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) return

  try {
    isLoading.value = true
    error.value = ''

    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
    })

    // Redirect to home after successful registration
    router.push('/')
  } catch (err: unknown) {
    const errorResponse = err as { response?: { data?: { message?: string } } }
    error.value = errorResponse.response?.data?.message || "Erreur d'inscription"
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
watch(() => [form.value.email, form.value.password, form.value.confirmPassword], clearError)
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
.form-group:nth-child(3) { animation-delay: 0.3s; }
.form-group:nth-child(4) { animation-delay: 0.4s; }
.form-group:nth-child(5) { animation-delay: 0.5s; }
.form-group:nth-child(6) { animation-delay: 0.6s; }

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
