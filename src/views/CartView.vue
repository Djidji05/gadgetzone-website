<template>
  <div class="container mx-auto px-4 pt-[125px] pb-8 lg:py-8">


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
      
      <!-- Mobile Sticky Section (Button Only) -->
      <div class="lg:hidden sticky top-[125px] z-30 bg-white shadow-sm mb-2.5 border-b border-gray-100 p-3">
          <div class="flex items-center justify-between mb-2">
             <span class="text-sm font-medium text-gray-600">Total estimé:</span>
             <span class="text-lg font-bold text-gray-900">{{ formatPrice(total) }}</span>
          </div>
          <router-link to="/checkout" class="w-full bg-black text-white text-center flex items-center justify-center shadow-lg py-3 text-base font-bold rounded-full">
            Passer la commande ({{ selectedCount }})
          </router-link>
      </div>

      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in items" :key="item.id" class="bg-white rounded-xl shadow-sm p-3 border border-gray-50 relative overflow-hidden">
          <div class="flex gap-3">
             <!-- Checkbox (Functional) -->
             <div 
                class="flex items-center justify-center shrink-0 w-8 h-full cursor-pointer self-center"
                @click="toggleSelection(item.id)"
             >
                <div 
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                  :class="selectedItems.has(item.id) ? 'bg-white border-transparent text-green-500' : 'bg-white border-gray-300'"
                >
                   <i v-if="selectedItems.has(item.id)" class="fas fa-check text-sm"></i>
                </div>
             </div>

             <!-- Image -->
             <router-link :to="'/products/' + item.product.id" class="shrink-0">
               <img
                 :src="item.product.image || 'https://placehold.co/100?text=No+Image'"
                 :alt="item.product.name"
                 class="w-24 h-32 object-cover rounded-lg bg-gray-50"
                 @error="handleImageError"
               />
             </router-link>

             <!-- Details -->
             <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                   <div class="flex justify-between items-start gap-2">
                      <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{{ item.product.name }}</h3>
                      <button @click="removeFromCart(item.id)" class="text-gray-400 hover:text-red-500 shrink-0 p-1 -mt-1 -mr-1">
                        <i class="far fa-trash-alt"></i>
                      </button>
                   </div>
                   <!-- Mock Variant (Could be real if data existed) -->
                   <div class="mt-1 flex flex-wrap gap-1">
                      <span class="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Taille Unique</span>
                   </div>
                </div>

                <div class="flex justify-between items-end mt-2">
                   <div 
                      class="font-bold text-red-600 leading-none transition-all duration-200"
                      :class="formatPrice(item.product.price).length > 10 ? 'text-sm' : 'text-lg'"
                   >
                      {{ formatPrice(item.product.price) }}
                   </div>
                   
                   <!-- Stepper -->
                   <div class="flex items-center border border-gray-200 rounded-full h-8 px-1">
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="w-8 h-full flex items-center justify-center text-gray-500 disabled:opacity-30 active:scale-90 transition-transform"
                      >
                        <i class="fas fa-minus text-[10px]"></i>
                      </button>
                      <span class="w-6 text-center text-sm font-medium">{{ item.quantity }}</span>
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="w-8 h-full flex items-center justify-center text-gray-900 active:scale-90 transition-transform"
                      >
                        <i class="fas fa-plus text-[10px]"></i>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1 hidden lg:block">
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
import { computed, onMounted, ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// State
const selectedItems = ref(new Set<number>())

// Computed
const items = computed(() => cartStore.items)
const isEmpty = computed(() => cartStore.isEmpty)
const isLoading = computed(() => cartStore.isLoading)

// Initialize selection: Select all items by default when loaded
watch(items, (newItems) => {
  if (newItems.length > 0 && selectedItems.value.size === 0) {
    newItems.forEach(item => selectedItems.value.add(item.id))
  }
}, { immediate: true })

// Computed totals based on SELECTION
const selectedSubtotal = computed(() => {
  return items.value
    .filter(item => selectedItems.value.has(item.id))
    .reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
})

const selectedCount = computed(() => {
  return items.value
    .filter(item => selectedItems.value.has(item.id))
    .reduce((count, item) => count + item.quantity, 0)
})

const total = computed(() => {
  const sub = selectedSubtotal.value
  if (sub === 0) return 0
  const tax = sub * 0.1
  const shipping = sub > 5000 ? 0 : 250
  return sub + tax + shipping
})

// Use selectedSubtotal for template display
const subtotal = selectedSubtotal

// Methods
const toggleSelection = (id: number) => {
  if (selectedItems.value.has(id)) {
    selectedItems.value.delete(id)
  } else {
    selectedItems.value.add(id)
  }
}

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
  selectedItems.value.delete(itemId)
}

const clearCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    await cartStore.clearCart()
    selectedItems.value.clear()
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
