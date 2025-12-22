<template>
  <div class="group relative bg-white rounded-2xl p-2 md:p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer h-full flex flex-col" @click="goToProduct">
    
    <!-- Image Container -->
    <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 md:mb-3 group-hover:shadow-inner transition-all">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
        <i class="fas fa-image text-3xl opacity-50"></i>
      </div>

      <!-- Wishlist Button (Top Right) -->
      <button 
        class="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110 z-10"
        @click.stop="toggleWishlist"
      >
        <i :class="isWishlisted ? 'fas fa-heart text-red-500' : 'far fa-heart'" class="text-xs md:text-sm"></i>
      </button>

      <!-- Add to Cart Button (Bottom Right - Floating) -->
      <button
        @click.stop="addToCart"
        class="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 z-10 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bottom-3"
        :disabled="product.stock === 0"
        title="Ajouter au panier"
      >
        <i class="fas fa-shopping-bag text-xs md:text-sm"></i>
      </button>

      <!-- Stock Badge (Top Left - Optional) -->
      <div v-if="product.stock === 0" class="absolute top-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
        Épuisé
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col space-y-1 md:space-y-2">
      <!-- Title -->
      <h3 class="font-semibold text-gray-800 text-sm md:text-[15px] leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
        {{ product.name }}
      </h3>

      <div class="mt-1 md:mt-2 flex items-end justify-between pt-0 border-t-0">
        <div class="flex flex-col">
           <div class="flex items-baseline gap-2">
             <span class="text-sm md:text-base font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
           </div>
        </div>

        <!-- Desktop Rating (Stars) -->
        <!-- Desktop Rating (Stars) -->
        <div class="hidden md:flex items-center gap-0.5">
           <template v-for="i in 5" :key="i">
             <i 
                class="text-xs"
                :class="[
                  i <= Math.round(Number(product.rating || 0)) 
                    ? 'fas fa-star text-yellow-400' 
                    : 'far fa-star text-gray-300'
                ]"
             ></i>
           </template>
           <span class="text-[10px] text-gray-400 ml-1">({{ product.reviews_count || 0 }})</span>
        </div>

        <!-- Mobile Rating (Badge) -->
        <div class="flex md:hidden items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
           <i class="fas fa-star text-yellow-500 text-[10px]"></i>
           <span class="text-xs font-bold text-gray-700">{{ Number(product.rating || 0).toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { computed } from 'vue'

const props = defineProps<{
  product: any
}>()

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.product.id))

const goToProduct = () => {
  router.push(`/products/${props.product.id}`)
}

const toggleWishlist = () => {
  wishlistStore.toggleItem(props.product)
}

const addToCart = async () => {
  if (props.product.stock > 0) {
    try {
      await cartStore.addToCart(props.product.id, 1)
    } catch (err) {
      console.error('Error adding to cart:', err)
    }
  }
}

const formatPrice = (price: any) => {
    const val = typeof price === 'number' ? price : parseFloat(price)
    return `${val} G`
}
</script>

<style scoped>
/* No extra CSS needed due to Tailwind usage.
   Keeping scoped block empty or minimal to ensure component isolation. */
</style>
