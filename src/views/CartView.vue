<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-lg p-6">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-gray-300 rounded"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Cart Content -->
    <div v-else-if="!isEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in items" :key="item.id" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center space-x-4">
            <!-- Product Image -->
            <img
              :src="item.product.image || 'https://placehold.co/100?text=No+Image'"
              :alt="item.product.name"
              class="w-20 h-20 object-cover rounded"
              @error="handleImageError"
            />

            <!-- Product Info -->
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ item.product.name }}</h3>
              <p class="text-gray-600">{{ formatPrice(item.product.price) }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center space-x-2">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
              >
                <i class="fas fa-minus text-xs"></i>
              </button>
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>

            <!-- Subtotal -->
            <div class="text-right">
              <div class="font-semibold">{{ formatPrice(item.subtotal) }}</div>
              <button
                @click="removeFromCart(item.id)"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 class="text-lg font-semibold mb-4">Récapitulatif</h3>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <span>Sous-total</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Taxes</span>
              <span>{{ formatPrice(subtotal * 0.1) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Livraison</span>
              <span>{{ formatPrice(subtotal > 5000 ? 0 : 250) }}</span>
            </div>
            <hr class="my-2" />
            <div class="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <router-link to="/checkout" class="w-full btn-primary text-center block">
              Passer la commande
            </router-link>
            <button @click="clearCart" class="w-full btn-secondary">Vider le panier</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-12">
      <i class="las la-shopping-cart text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Votre panier est vide</h3>
      <p class="text-gray-500 mb-6">Ajoutez des produits pour commencer vos achats</p>
      <router-link to="/products" class="btn-primary"> Découvrir nos produits </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// Computed
const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const isEmpty = computed(() => cartStore.isEmpty)
const isLoading = computed(() => cartStore.isLoading)

const total = computed(() => {
  const subtotalValue = subtotal.value
  const tax = subtotalValue * 0.1
  const shipping = subtotalValue > 5000 ? 0 : 250
  return subtotalValue + tax + shipping
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price).replace('HTG', 'G')
}

const updateQuantity = async (itemId: number, quantity: number) => {
  if (quantity > 0) {
    await cartStore.updateQuantity(itemId, quantity)
  }
}

const removeFromCart = async (itemId: number) => {
  await cartStore.removeFromCart(itemId)
}

const clearCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    await cartStore.clearCart()
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/100?text=Error'
}

// Load cart on mount
onMounted(() => {
  cartStore.loadCart()
})
</script>
