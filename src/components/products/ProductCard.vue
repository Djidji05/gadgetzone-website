<template>
  <div class="card hover:shadow-lg transition-shadow duration-300">
    <!-- Product Image -->
    <div class="relative overflow-hidden rounded-t-lg">
      <img
        :src="product.image || '/placeholder-product.jpg'"
        :alt="product.name"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <!-- Badge for promotion -->
      <div
        v-if="hasPromotion"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
      >
        -{{ promotionDiscount }}%
      </div>

      <!-- Out of stock badge -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <span class="bg-gray-800 text-white px-3 py-1 rounded">Rupture</span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Category -->
      <div class="text-sm text-gray-500 mb-1">{{ product.category }}</div>

      <!-- Product Name -->
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Price -->
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-xl font-bold text-primary-600">
            {{ formatPrice(displayPrice) }}
          </span>
          <span v-if="hasPromotion" class="text-sm text-gray-400 line-through ml-2">
            {{ formatPrice(product.price) }}
          </span>
        </div>

        <!-- Stock indicator -->
        <div class="text-sm" :class="stockClass">
          {{ stockText }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-2">
        <router-link
          :to="`/products/${product.id}`"
          class="flex-1 btn-secondary text-center"
          @click="logProductClick"
        >
          <i class="las la-eye mr-1"></i>
          Voir
        </router-link>

        <button
          @click="addToCart"
          :disabled="product.stock === 0 || isAddingToCart"
          class="flex-1 btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <i v-if="isAddingToCart" class="las la-spinner la-spin mr-1"></i>
          <i v-else class="las la-shopping-cart mr-1"></i>
          {{ product.stock === 0 ? 'Indisponible' : 'Ajouter' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/products'

interface Props {
  product: Product
  promotion?: {
    discount: number
    discountType: 'percentage' | 'fixed'
  }
}

const props = withDefaults(defineProps<Props>(), {
  promotion: undefined,
})

const cartStore = useCartStore()

// State
const isAddingToCart = ref(false)

// Methods
const logProductClick = () => {
  console.log('🔍 Click sur bouton Voir pour produit:', props.product.id, props.product.name)
}

// Computed
const hasPromotion = computed(() => props.promotion && props.promotion.discount > 0)

const promotionDiscount = computed(() => {
  if (!hasPromotion.value) return 0
  return props.promotion!.discountType === 'percentage'
    ? props.promotion!.discount
    : Math.round((props.promotion!.discount / props.product.price) * 100)
})

const displayPrice = computed(() => {
  if (!hasPromotion.value) return props.product.price

  if (props.promotion!.discountType === 'percentage') {
    return props.product.price * (1 - props.promotion!.discount / 100)
  } else {
    return Math.max(0, props.product.price - props.promotion!.discount)
  }
})

const stockClass = computed(() => {
  if (props.product.stock === 0) return 'text-red-500'
  if (props.product.stock < 5) return 'text-yellow-500'
  return 'text-green-500'
})

const stockText = computed(() => {
  if (props.product.stock === 0) return 'Rupture'
  if (props.product.stock < 5) return `Plus que ${props.product.stock}`
  return 'En stock'
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

const addToCart = async () => {
  if (props.product.stock === 0 || isAddingToCart.value) return

  try {
    isAddingToCart.value = true
    await cartStore.addToCart(props.product.id, 1)

    // Optionnel: Afficher une notification
    console.log('Produit ajouté au panier')
  } catch (error) {
    console.error('Erreur ajout panier:', error)
  } finally {
    isAddingToCart.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
