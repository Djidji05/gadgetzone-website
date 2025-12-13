<template>
  <AuthLayout title="Create account">
    <template #subtitle>
      Already have an account?
      <router-link to="/login" class="text-purple-600 font-semibold ml-1">
        sign in
      </router-link>
    </template>

    <form @submit.prevent="handleRegister" class="mt-8 space-y-4">
      <div v-if="error" class="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
        {{ error }}
      </div>

      <!-- Name Input -->
      <div class="relative">
        <input
          id="name"
          v-model="form.firstName"
          type="text"
          required
          class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder-gray-400"
          placeholder="First Name"
        />
      </div>
      
       <!-- Last Name Input -->
      <div class="relative">
        <input
          id="lastName"
          v-model="form.lastName"
          type="text"
          required
          class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder-gray-400"
          placeholder="Last Name"
        />
      </div>

      <!-- Email Input -->
      <div class="relative">
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder-gray-400"
          placeholder="Email or phone"
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
      </div>
      
       <!-- Confirm Password Input -->
      <div class="relative">
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all placeholder-gray-400"
          placeholder="Confirm Password"
        />
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-[#8B5CF6] text-white rounded-3xl flex items-center justify-between px-6 font-bold shadow-lg shadow-purple-200 hover:bg-[#7C3AED] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <span>{{ isLoading ? 'Creating account...' : 'Sign up' }}</span>
          <i v-if="!isLoading" class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
    return form.value.firstName && form.value.lastName && form.value.email && 
           form.value.password && form.value.confirmPassword && 
           form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  if (!isFormValid.value) {
      error.value = "Please fill all fields correctly"
      return
  }
  
  try {
    isLoading.value = true
    error.value = ''
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
    })
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>
