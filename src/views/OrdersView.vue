<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mes Commandes</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div v-for="n in 4" :key="n" class="bg-white rounded-lg p-6">
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
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="mb-4 md:mb-0">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="font-semibold text-lg">Commande #{{ order.orderNumber }}</h3>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  getOrderStatusClass(order.status),
                ]"
              >
                {{ getOrderStatusText(order.status) }}
              </span>
            </div>
            <p class="text-gray-600">{{ formatDate(order.createdAt) }}</p>
            <p class="text-gray-600 text-sm">
              {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }} •
              {{ formatPrice(order.total) }}
            </p>
          </div>

          <div
            class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0"
          >
            <router-link :to="`/orders/${order.id}`" class="btn-primary text-center">
              Voir détails
            </router-link>

            <button
              v-if="order.status === 'pending'"
              @click="cancelOrder(order.id)"
              class="btn-secondary"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
      <i class="las la-box text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
      <p class="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
      <router-link to="/products" class="btn-primary"> Découvrir nos produits </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ordersService } from '@/services/orders'
import type { Order } from '@/services/orders'

const router = useRouter()

// State
const isLoading = ref(false)
const orders = ref<Order[]>([])

// Methods
const loadOrders = async () => {
  try {
    isLoading.value = true
    orders.value = await ordersService.getCustomerOrders()
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    isLoading.value = false
  }
}

const cancelOrder = async (orderId: number) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    try {
      await ordersService.cancelOrder(orderId)
      // Reload orders
      await loadOrders()
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-HT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price).replace('HTG', 'G')
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

// Load orders on mount
onMounted(() => {
  loadOrders()
})
</script>
