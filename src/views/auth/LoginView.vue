<template>
  <AuthLayout title="Login">
    <template #subtitle>
      Don't have an account?
      <router-link to="/register" class="text-purple-600 font-semibold ml-1">
        sign up
      </router-link>
    </template>

    <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
      <div v-if="error" class="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
        {{ error }}
      </div>

      <!-- Email Input -->
      <div class="space-y-4">
        <div class="relative">
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder-gray-400"
            placeholder="Email"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder-gray-400"
            placeholder="Password"
          />
          <router-link 
            to="/forgot-password" 
            class="absolute right-6 top-1/2 transform -translate-y-1/2 text-xs font-bold text-purple-600 hover:text-purple-700"
          >
            FORGOT
          </router-link>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-[#8B5CF6] text-white rounded-3xl flex items-center justify-between px-6 font-bold shadow-lg shadow-purple-200 hover:bg-[#7C3AED] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <span>{{ isLoading ? 'Logging in...' : 'Login' }}</span>
          <i v-if="!isLoading" class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')
const form = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.login(form.value.email, form.value.password)
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>
