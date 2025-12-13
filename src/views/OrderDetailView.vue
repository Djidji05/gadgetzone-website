<template>
  <div class="container mx-auto px-4 pt-[125px] pb-8 lg:py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="bg-white rounded-lg p-6">
        <div class="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-6">
      <!-- Order Header -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Commande #{{ order.orderNumber }}</h1>
            <p class="text-gray-600">Passée le {{ formatDate(order.createdAt) }}</p>
          </div>

          <div class="mt-4 md:mt-0">
            <span
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium',
                getOrderStatusClass(order.status),
              ]"
            >
              {{ getOrderStatusText(order.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Articles commandés</h2>

        <div class="space-y-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center space-x-4 pb-4 border-b last:border-b-0"
          >
            <img
              :src="item.product.image || '/placeholder-product.jpg'"
              :alt="item.product.name"
              class="w-16 h-16 object-cover rounded"
            />

            <div class="flex-1">
              <h3 class="font-medium">{{ item.product.name }}</h3>
              <p class="text-gray-600 text-sm">Quantité: {{ item.quantity }}</p>
            </div>

            <div class="text-right">
              <p class="font-medium">{{ formatPrice(item.unitPrice) }}</p>
              <p class="text-gray-600 text-sm">{{ formatPrice(item.subtotal) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping Information -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Adresse de livraison</h2>

        <div class="space-y-2">
          <p class="font-medium">
            {{ order.shippingAddress.street }}
          </p>
          <p class="text-gray-600">
            {{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}
          </p>
          <p class="text-gray-600">{{ order.shippingAddress.country }}</p>
          <p class="text-gray-600">{{ order.shippingAddress.phone }}</p>
        </div>
      </div>

      <!-- Payment Information -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Méthode de paiement</h2>

        <div class="flex items-center space-x-3">
          <i :class="getPaymentIcon(order.paymentMethod.type)"></i>
          <span>{{ getPaymentText(order.paymentMethod.type) }}</span>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Récapitulatif</h2>

        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Sous-total</span>
            <span>{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Taxes</span>
            <span>{{ formatPrice(order.tax) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Livraison</span>
            <span>{{ formatPrice(order.shipping) }}</span>
          </div>
          <hr class="my-2" />
          <div class="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Order Actions -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Actions</h2>

        <div class="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
          <button v-if="order.status === 'pending'" @click="cancelOrder" class="btn-secondary">
            Annuler la commande
          </button>

          <button v-if="order.status === 'delivered'" class="btn-primary">Acheter à nouveau</button>

          <button class="btn-secondary">Télécharger la facture</button>

          <router-link to="/contact" class="btn-secondary text-center">
            Contacter le support
          </router-link>
        </div>
      </div>

      <!-- Tracking Information -->
      <div
        v-if="order.trackingNumber && (order.status === 'shipped' || order.status === 'delivered')"
        class="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 class="text-lg font-semibold mb-4">Suivi de livraison</h2>

        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <i class="las fa-truck text-primary-600"></i>
            <span
              >Numéro de suivi: <strong>{{ order.trackingNumber }}</strong></span
            >
          </div>

          <div v-if="order.estimatedDelivery" class="flex items-center space-x-3">
            <i class="las fa-calendar text-primary-600"></i>
            <span
              >Livraison estimée: <strong>{{ formatDate(order.estimatedDelivery) }}</strong></span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <i class="las la-exclamation-circle text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Commande non trouvée</h3>
      <router-link to="/orders" class="btn-primary"> Retour à mes commandes </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersService } from '@/services/orders'
import type { Order } from '@/services/orders'

const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(false)
const order = ref<Order | null>(null)

// Methods
const loadOrder = async () => {
  try {
    isLoading.value = true
    const orderId = Number(route.params.id)
    order.value = await ordersService.getOrder(orderId)
  } catch (error) {
    console.error('Error loading order:', error)
    router.push('/orders')
  } finally {
    isLoading.value = false
  }
}

const cancelOrder = async () => {
  if (!order.value) return

  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    try {
      await ordersService.cancelOrder(order.value.id)
      // Reload order
      await loadOrder()
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

const getPaymentIcon = (type: string) => {
  const icons = {
    visa: 'lab la-cc-visa text-2xl text-blue-600',
    natcash: 'las la-mobile-alt text-2xl text-green-600',
    moncashwise: 'las la-wallet text-2xl text-purple-600',
    zelle: 'las la-university text-2xl text-gray-600',
  }
  return icons[type as keyof typeof icons] || 'las la-credit-card text-2xl text-gray-600'
}

const getPaymentText = (type: string) => {
  const texts = {
    visa: 'Visa',
    natcash: 'Natcash',
    moncashwise: 'Mon Cash Wise',
    zelle: 'Zelle',
  }
  return texts[type as keyof typeof texts] || type
}

// Load order on mount
onMounted(() => {
  loadOrder()
})
</script>
