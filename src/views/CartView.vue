<template>
<div class="container mx-auto px-4 pt-6 pb-32 lg:pt-8 lg:pb-12">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold text-gray-900">Mon Panier</h1>
      <button 
        @click="shareCart"
        class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium text-sm"
      >
        <i class="fas fa-share-alt"></i>
        <span class="hidden sm:inline">Partager ({{ selectedItems.size }})</span>
      </button>
    </div>

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
      


      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Select All Mobile -->
        <div class="lg:hidden bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between mb-2">
            <div class="flex items-center gap-3" @click="toggleSelectAll">
                <div 
                  class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                  :class="isAllSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200'"
                >
                  <i v-if="isAllSelected" class="fas fa-check text-[10px]"></i>
                </div>
                <span class="text-sm font-bold text-gray-700">Tout sélectionner</span>
            </div>
            <button @click="clearCart" class="text-red-500 text-xs font-bold">Vider</button>
        </div>
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden lg:block mb-4">
           <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div 
                  @click="toggleSelectAll"
                  class="w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                  :class="isAllSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 hover:border-blue-400'"
                >
                  <i v-if="isAllSelected" class="fas fa-check text-xs"></i>
                </div>
                <h2 class="font-bold text-gray-900 text-lg">Tout sélectionner ({{ items.length }} articles)</h2>
              </div>
              <button @click="clearCart" class="text-red-500 text-sm font-medium hover:text-red-700 transition-colors">
                Vider le panier
              </button>
           </div>
        </div>

        <div v-for="item in items" :key="item.id" class="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:border-blue-100 transition-all duration-300">
          <div class="flex gap-4">
             <!-- Image with Checkbox overlay -->
             <div class="shrink-0 relative">
               <router-link :to="'/products/' + item.product.id" class="block relative overflow-hidden rounded-xl w-24 h-24 bg-gray-50 border border-gray-100">
                 <img
                   :src="item.product.image || 'https://placehold.co/100?text=No+Image'"
                   :alt="item.product.name"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   @error="handleImageError"
                 />
               </router-link>
               
               <!-- Checkbox Overlay -->
               <div 
                  @click="toggleSelection(item.id)"
                  class="absolute top-1 left-1 z-10 w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm"
                  :class="selectedItems.has(item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/80 backdrop-blur-sm border-gray-200'"
               >
                  <i v-if="selectedItems.has(item.id)" class="fas fa-check text-[10px]"></i>
               </div>
             </div>

             <!-- Details -->
             <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                   <div class="flex justify-between items-start gap-3">
                      <router-link :to="'/products/' + item.product.id" class="text-base font-bold text-gray-900 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
                        {{ item.product.name }}
                      </router-link>
                      <div class="flex items-center gap-1">
                        <button @click="shareItem(item)" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all shrink-0" title="Partager">
                          <i class="far fa-share-square text-lg"></i>
                        </button>
                        <button @click="removeFromCart(item.id)" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all shrink-0" title="Supprimer">
                          <i class="fas fa-trash-alt text-lg"></i>
                        </button>
                      </div>
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

        <!-- Cart Summary Mobile (Floating above BottomNav) -->
        <div class="lg:hidden fixed bottom-[57px] left-0 right-0 z-[45] px-4 pb-2 pointer-events-none">
            <router-link 
              to="/checkout" 
              class="w-full bg-blue-600 text-white text-center flex items-center justify-center py-4 text-base font-black rounded-2xl active:scale-95 transition-all shadow-xl hover:bg-blue-700 pointer-events-auto"
              :class="{ 'opacity-50 pointer-events-none grayscale': selectedCount === 0 }"
            >
              CHECKOUT ({{ selectedCount }}) - {{ formatPrice(total) }}
            </router-link>
        </div>

        <!-- Spacer for mobile to clear the fixed bar -->
        <div class="lg:hidden h-24"></div>
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
            
            <div class="h-px bg-gray-100 my-2"></div>
         
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">Total</span>
              <span class="text-2xl font-bold text-blue-600">{{ formatPrice(subtotal) }}</span>
            </div>
          </div>

          <div class="space-y-3 hidden lg:block">
            <router-link 
              to="/checkout" 
              class="w-full bg-blue-600 text-white text-center flex items-center justify-center py-4 text-base font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              :class="{ 'opacity-50 pointer-events-none grayscale': selectedCount === 0 }"
            >
              Checkout
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
import { useUiStore } from '@/stores/ui'

const cartStore = useCartStore()
const uiStore = useUiStore()

// State
const selectedItems = computed(() => cartStore.selectedItems)
const toggleSelection = (id: number) => cartStore.toggleSelection(id)
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    cartStore.clearSelection()
  } else {
    cartStore.selectAll()
  }
}

// Computed
const items = computed(() => cartStore.items)
const isEmpty = computed(() => cartStore.isEmpty)
const isLoading = computed(() => cartStore.isLoading)

// Watch items to auto-select all newly loaded items
watch(items, (newItems) => {
  if (newItems.length > 0 && selectedItems.value.size === 0) {
    cartStore.selectAll()
  }
}, { immediate: true })

const isAllSelected = computed(() => {
  return items.value.length > 0 && selectedItems.value.size === items.value.length
})

const selectedCount = computed(() => {
  return items.value
    .filter(item => selectedItems.value.has(item.id))
    .reduce((count, item) => count + item.quantity, 0)
})

const subtotal = computed(() => {
  return items.value
    .filter(item => selectedItems.value.has(item.id))
    .reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
})

const total = computed(() => subtotal.value)


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
  uiStore.confirm({
    title: 'Vider le panier',
    message: 'Êtes-vous sûr de vouloir vider votre panier ?',
    type: 'warning',
    confirmText: 'Vider le panier',
    cancelText: 'Annuler',
    onConfirm: async () => {
      await cartStore.clearCart()
    }
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/100?text=Error'
}

// Load cart on mount
onMounted(() => {
  cartStore.loadCart()
})

// Sharing Logic
const shareCart = async () => {
  if (selectedItems.value.size === 0) {
    uiStore.showToast("Sélectionnez au moins un article à partager", "warning")
    return
  }

  const selectedProducts = items.value.filter(item => selectedItems.value.has(item.id))
  const shareData = {
    title: 'Ma sélection GadgetZone',
    text: `Regarde ma sélection sur GadgetZone ! J'ai choisi ${selectedItems.value.size} articles pour un total de ${formatPrice(total.value)}.`,
    url: window.location.origin + '/cart'
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      uiStore.showToast('Lien du panier copié !', 'success')
    }
  } catch (err) {
    console.error('Error sharing cart:', err)
  }
}

const shareItem = async (item: any) => {
  const shareData = {
    title: item.product.name,
    text: `Regarde ce produit sur GadgetZone : ${item.product.name} à ${formatPrice(item.product.price)}`,
    url: window.location.origin + '/products/' + item.product.id
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      uiStore.showToast('Lien du produit copié !', 'success')
    }
  } catch (err) {
    console.error('Error sharing item:', err)
  }
}
</script>
