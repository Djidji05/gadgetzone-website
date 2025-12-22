<template>
<div class="container mx-auto px-4 pt-20 pb-12 lg:py-12 align-middle">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse space-y-8 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
             <div v-for="n in 3" :key="n" class="h-32 bg-gray-200 rounded-2xl"></div>
        </div>
        <div class="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>

    <!-- Cart Content -->
    <div v-else-if="!isEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
      
      <!-- Mobile Sticky Section (Button Only) -->
      <div class="lg:hidden sticky top-[110px] z-30 bg-white/80 backdrop-blur-md shadow-sm mb-4 border border-gray-100 rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
             <span class="text-sm font-medium text-gray-600">Total estimé</span>
             <span class="text-lg font-bold text-gray-900">{{ formatPrice(total) }}</span>
          </div>
          <router-link to="/checkout" class="w-full bg-blue-600 text-white text-center flex items-center justify-center shadow-lg py-3.5 text-base font-bold rounded-xl active:scale-95 transition-transform hover:bg-blue-700">
            Passer la commande ({{ selectedCount }})
          </router-link>
      </div>

      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden lg:block mb-4">
           <div class="flex items-center justify-between">
              <h2 class="font-bold text-gray-900 text-lg">Articles ({{ items.length }})</h2>
              <button @click="clearCart" class="text-red-500 text-sm font-medium hover:text-red-700 transition-colors">
                Vider le panier
              </button>
           </div>
        </div>

        <div v-for="item in items" :key="item.id" class="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:border-blue-100 transition-all duration-300">
          <div class="flex gap-4">
             <!-- Checkbox -->
             <div 
                class="flex items-center justify-center shrink-0 w-8 cursor-pointer self-center"
                @click="toggleSelection(item.id)"
             >
                <div 
                  class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  :class="selectedItems.has(item.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-200 group-hover:border-blue-300'"
                >
                   <i v-if="selectedItems.has(item.id)" class="fas fa-check text-xs"></i>
                </div>
             </div>

             <!-- Image -->
             <router-link :to="'/products/' + item.product.id" class="shrink-0 relative overflow-hidden rounded-xl w-24 h-24 bg-gray-50 border border-gray-100">
               <img
                 :src="item.product.image || 'https://placehold.co/100?text=No+Image'"
                 :alt="item.product.name"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 @error="handleImageError"
               />
             </router-link>

             <!-- Details -->
             <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                   <div class="flex justify-between items-start gap-3">
                      <router-link :to="'/products/' + item.product.id" class="text-base font-bold text-gray-900 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
                        {{ item.product.name }}
                      </router-link>
                      <button @click="removeFromCart(item.id)" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all shrink-0">
                        <i class="fas fa-trash-alt text-lg"></i>
                      </button>
                   </div>
                   <!-- <p class="text-xs text-gray-400 mt-1">Variante: Défaut</p> -->
                </div>

                <div class="flex flex-wrap justify-between items-end gap-3 mt-3">
                   <div class="font-bold text-blue-600 text-lg">
                      {{ formatPrice(item.product.price) }}
                   </div>
                   
                   <!-- Quantity Stepper -->
                   <div class="flex items-center bg-gray-50 rounded-xl h-10 border border-gray-100">
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 active:scale-90 transition-all"
                      >
                        <i class="fas fa-minus text-xs"></i>
                      </button>
                      <span class="w-8 text-center text-sm font-bold text-gray-900">{{ item.quantity }}</span>
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="w-10 h-full flex items-center justify-center text-gray-900 hover:text-blue-600 active:scale-90 transition-all"
                      >
                        <i class="fas fa-plus text-xs"></i>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1 space-y-6 sticky top-24">
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden lg:block">
          <h3 class="text-xl font-bold text-gray-900 mb-6 hidden lg:block">Récapitulatif</h3>

          <div class="space-y-4 mb-6 hidden lg:block">
            <div class="flex justify-between text-gray-500 text-sm">
              <span>Sous-total ({{ selectedCount }} articles)</span>
              <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-500 text-sm">
              <span>Taxes estimées</span>
              <span class="font-medium text-gray-900">{{ formatPrice(subtotal * 0.1) }}</span>
            </div>
            <div class="flex justify-between text-gray-500 text-sm">
              <span>Livraison</span>
              <span class="text-green-600 font-medium">{{ subtotal > 5000 ? 'Gratuite' : formatPrice(250) }}</span>
            </div>
            
            <div class="h-px bg-gray-100 my-2"></div>
         
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">Total</span>
              <span class="text-2xl font-bold text-blue-600">{{ formatPrice(total) }}</span>
            </div>
             <p v-if="subtotal > 0 && subtotal < 5000" class="text-xs text-gray-400 text-right mt-1">
              Plus que {{ formatPrice(5000 - subtotal) }} pour la livraison gratuite
            </p>
          </div>

          <div class="space-y-3 hidden lg:block">
            <router-link to="/checkout" class="w-full bg-blue-600 text-white text-center flex items-center justify-center py-4 text-base font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Passer la commande
              <i class="las la-arrow-right ml-2"></i>
            </router-link>
            
            <div class="flex items-center justify-center gap-2 text-gray-400 text-sm mt-4">
              <i class="las la-lock"></i>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>

        <!-- Promo Code (Optional UI) -->
        <!-- <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <h4 class="font-bold text-gray-900 mb-3 text-sm">Code Promo</h4>
           <div class="flex gap-2">
             <input type="text" placeholder="Entrez le code" class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors">
             <button class="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors text-sm">
               Appliquer
             </button>
           </div>
        </div> -->

      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-24 max-w-md mx-auto">
      <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="las la-shopping-cart text-4xl text-gray-300"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h3>
      <p class="text-gray-500 mb-8 leading-relaxed">Il semblerait que vous n'ayez pas encore ajouté de produits. Découvrez nos dernières nouveautés !</p>
      <router-link to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        Découvrir nos produits
      </router-link>
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
