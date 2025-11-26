import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type Customer, type AuthResponse } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const customer = ref<Customer | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!customer.value)
  const customerName = computed(() =>
    customer.value ? `${customer.value.firstName} ${customer.value.lastName}` : '',
  )

  // Actions
  const initAuth = () => {
    const storedAuth = authService.getStoredAuthData()
    if (storedAuth) {
      customer.value = storedAuth.customer
      token.value = storedAuth.token
    }
  }

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const authData = await authService.login({ email, password })

      customer.value = authData.customer
      token.value = authData.token
      authService.saveAuthData(authData)

      return authData
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => {
    try {
      isLoading.value = true
      error.value = null

      const authData = await authService.register(data)

      customer.value = authData.customer
      token.value = authData.token
      authService.saveAuthData(authData)

      return authData
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur d'inscription"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      customer.value = null
      token.value = null
    }
  }

  const updateProfile = async (data: Partial<Customer>) => {
    try {
      isLoading.value = true
      error.value = null

      const updatedCustomer = await authService.updateProfile(data)
      customer.value = updatedCustomer

      // Mettre à jour localStorage
      const storedAuth = authService.getStoredAuthData()
      if (storedAuth) {
        authService.saveAuthData({
          ...storedAuth,
          customer: updatedCustomer,
        })
      }

      return updatedCustomer
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de mise à jour'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const verifyToken = async () => {
    try {
      const isValid = await authService.verifyToken()
      if (!isValid) {
        await logout()
      }
      return isValid
    } catch {
      await logout()
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    customer,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    customerName,

    // Actions
    initAuth,
    login,
    register,
    logout,
    updateProfile,
    verifyToken,
    clearError,
  }
})
