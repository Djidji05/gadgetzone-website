<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon Compte</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg transition-colors',
                activeTab === tab.key
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
            >
              <i :class="tab.icon + ' mr-3'"></i>
              {{ tab.label }}
            </button>
          </nav>

          <hr class="my-4" />

          <button
            @click="handleLogout"
            class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <i class="las la-sign-out-alt mr-3"></i>
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="lg:col-span-2">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Informations personnelles</h2>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Prénom </label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Nom </label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"> Téléphone </label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button type="submit" :disabled="isUpdating" class="btn-primary disabled:opacity-50">
                <i v-if="isUpdating" class="las la-spinner la-spin mr-2"></i>
                {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Orders Tab -->
        <div v-else-if="activeTab === 'orders'" class="space-y-4">
          <h2 class="text-xl font-semibold mb-6">Mes commandes</h2>

          <!-- Loading State -->
          <div v-if="isLoadingOrders" class="animate-pulse space-y-4">
            <div v-for="n in 3" :key="n" class="bg-white rounded-lg p-6">
              <div class="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>

          <!-- Orders List -->
          <div v-else-if="orders.length > 0" class="space-y-4">
            <div
              v-for="order in orders"
              :key="order.id"
              class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">Commande #{{ order.orderNumber }}</h3>
                  <p class="text-gray-600 text-sm">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getOrderStatusClass(order.status),
                    ]"
                  >
                    {{ getOrderStatusText(order.status) }}
                  </span>
                  <p class="font-semibold mt-1">{{ formatPrice(order.total) }}</p>
                </div>
              </div>

              <div class="mt-4 flex justify-between items-center">
                <p class="text-gray-600 text-sm">
                  {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }}
                </p>
                <router-link
                  :to="`/orders/${order.id}`"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Voir détails
                </router-link>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
            <i class="las la-box text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p class="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
            <router-link to="/products" class="btn-primary"> Découvrir nos produits </router-link>
          </div>
        </div>

        <!-- Addresses Tab -->
        <div v-else-if="activeTab === 'addresses'" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Adresses de livraison</h2>

          <div class="text-center py-8">
            <i class="las la-map-marker-alt text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune adresse enregistrée</h3>
            <p class="text-gray-600 mb-6">Ajoutez une adresse pour faciliter vos commandes</p>
            <button class="btn-primary">
              <i class="las la-plus mr-2"></i>
              Ajouter une adresse
            </button>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-else-if="activeTab === 'settings'" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Paramètres</h2>

          <div class="space-y-6">
            <div>
              <h3 class="font-medium mb-3">Notifications</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="mr-3" checked />
                  <span>Recevoir les promotions par email</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="mr-3" checked />
                  <span>Notifications de suivi de commande</span>
                </label>
              </div>
            </div>

            <div>
              <h3 class="font-medium mb-3">Sécurité</h3>
              <div class="space-y-2">
                <button class="text-primary-600 hover:text-primary-700">
                  Changer le mot de passe
                </button>
                <button class="text-primary-600 hover:text-primary-700">
                  Activer l'authentification à deux facteurs
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ordersService } from '@/services/orders'
import type { Order } from '@/services/orders'

const router = useRouter()
const authStore = useAuthStore()

// State
const activeTab = ref('profile')
const isUpdating = ref(false)
const isLoadingOrders = ref(false)
const orders = ref<Order[]>([])

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

// Computed
const tabs = computed(() => [
  { key: 'profile', label: 'Profil', icon: 'las la-user' },
  { key: 'orders', label: 'Commandes', icon: 'las la-box' },
  { key: 'addresses', label: 'Adresses', icon: 'las la-map-marker-alt' },
  { key: 'settings', label: 'Paramètres', icon: 'las la-cog' },
])

// Methods
const updateProfile = async () => {
  try {
    isUpdating.value = true
    await authStore.updateProfile(profileForm.value)
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    isUpdating.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const loadOrders = async () => {
  try {
    isLoadingOrders.value = true
    orders.value = await ordersService.getCustomerOrders()
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    isLoadingOrders.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-HT')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

const getOrderStatusClass = (status: Order['status']) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusText = (status: Order['status']) => {
  const texts = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }
  return texts[status] || status
}

// Initialize
onMounted(() => {
  if (authStore.customer) {
    const customer = authStore.customer
    profileForm.value = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || '',
    }
  }

  if (activeTab.value === 'orders') {
    loadOrders()
  }
})

// Load orders when switching to orders tab
watch(activeTab, (newTab: string) => {
  if (newTab === 'orders' && orders.value.length === 0) {
    loadOrders()
  }
})
</script>
