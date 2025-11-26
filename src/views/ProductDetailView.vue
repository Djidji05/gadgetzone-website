<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="h-96 bg-gray-300 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
          <div class="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Images -->
      <div>
        <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <img
            :src="product.image || '/placeholder-product.jpg'"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

        <!-- Price -->
        <div class="mb-6">
          <span class="text-3xl font-bold text-primary-600">
            {{ formatPrice(product.price) }}
          </span>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Description</h3>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <!-- Stock -->
        <div class="mb-6">
          <div class="flex items-center space-x-2">
            <div
              :class="['w-3 h-3 rounded-full', product.stock > 0 ? 'bg-green-500' : 'bg-red-500']"
            ></div>
            <span class="text-gray-600">
              {{
                product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'
              }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button
                @click="quantity > 1 && quantity--"
                :disabled="quantity <= 1"
                class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                <i class="las la-minus"></i>
              </button>
              <input
                v-model.number="quantity"
                type="number"
                :min="1"
                :max="product.stock"
                class="w-16 text-center border-0 focus:outline-none"
              />
              <button
                @click="quantity < product.stock && quantity++"
                :disabled="quantity >= product.stock"
                class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                <i class="las la-plus"></i>
              </button>
            </div>
          </div>

          <button
            @click="addToCart"
            :disabled="product.stock === 0 || isAddingToCart"
            class="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <i v-if="isAddingToCart" class="las la-spinner la-spin mr-2"></i>
            <i v-else class="las la-shopping-cart mr-2"></i>
            {{ product.stock === 0 ? 'Indisponible' : 'Ajouter au panier' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <i class="las la-exclamation-circle text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Produit non trouvé</h3>
      <router-link to="/products" class="btn-primary"> Retour aux produits </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/products'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

// State
const productId = Number(route.params.id)
const product = ref<Product | null>(null)
const isLoading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)

// Computed
// const currentProduct = computed(() => product.value)
// const isLoadingProduct = computed(() => isLoading.value)

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

const addToCart = async () => {
  if (!product.value || product.value.stock === 0 || isAddingToCart.value) return

  try {
    isAddingToCart.value = true
    await cartStore.addToCart(product.value.id, quantity.value)
  } catch (error) {
    console.error('Erreur ajout panier:', error)
  } finally {
    isAddingToCart.value = false
  }
}

// Load product
onMounted(async () => {
  console.log('🔍 ProductDetailView monté avec ID:', productId)
  try {
    isLoading.value = true
    console.log('📦 Chargement du produit...', productId)
    product.value = await productsStore.loadProduct(productId)
    console.log('✅ Produit chargé:', product.value?.name)
  } catch (error) {
    console.error('❌ Error loading product:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
