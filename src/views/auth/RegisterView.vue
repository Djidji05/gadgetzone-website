<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-store text-white text-xl"></i>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Créer votre compte</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            connectez-vous à votre compte existant
          </router-link>
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Jean"
              />
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700"> Nom </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Téléphone (optionnel)
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="+509 34 56 78 90"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="text-sm text-gray-600">
          <p>Le mot de passe doit contenir au moins 6 caractères.</p>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            J'accepte les
            <router-link to="/terms" class="text-primary-600 hover:text-primary-500">
              conditions d'utilisation
            </router-link>
            et la
            <router-link to="/privacy" class="text-primary-600 hover:text-primary-500">
              politique de confidentialité
            </router-link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ isLoading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </div>
      </form>

      <!-- Social Registration (Optional) -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">Ou s\'inscrire avec</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <i class="lab la-google"></i>
          </button>

          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <i class="lab la-facebook"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

// Watch form changes
watch(() => [form.value.email, form.value.password, form.value.confirmPassword], clearError)
</script>
