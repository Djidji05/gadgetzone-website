<template>
  <div class="product-card" @click="goToProduct">
    <div class="product-card-inner">
      <h2 class="product-title">
        <span class="product-dot"></span>
        {{ product.name }}
      </h2>
      <p class="product-description">{{ product.description?.substring(0, 30) }}...</p>

      <!-- Star Rating / Wishlist Mobile -->
      <div class="product-rating">
        <div class="product-stars">
          <i class="fas fa-star text-yellow-400 text-xs"></i>
          <i class="fas fa-star text-yellow-400 text-xs"></i>
          <i class="fas fa-star text-yellow-400 text-xs"></i>
          <i class="fas fa-star text-yellow-400 text-xs"></i>
          <i class="fas fa-star-half-alt text-yellow-400 text-xs"></i>
          <span class="text-xs text-gray-400 font-bold ml-1">4.5</span>
        </div>
        <button class="product-wishlist-btn" @click.stop="toggleWishlist">
          <i :class="isWishlisted ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
        </button>
      </div>

      <div class="product-image-container">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="product-image"
        />
        <div v-else class="product-image-placeholder">IMG</div>
      </div>

      <div class="product-footer">
        <div>
          <div class="product-price">{{ typeof product.price === 'number' ? product.price : parseFloat(product.price) }} G</div>
          <div class="product-stock">
            {{ product.stock > 0 ? 'En stock' : 'Rupture' }}
          </div>
        </div>
        <button
          @click.stop="addToCart"
          class="product-add-btn"
          :disabled="product.stock === 0"
        >
          {{ product.stock > 0 ? 'Ajouter' : 'Indispo' }}
        </button>
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
      // Optional: Add notification here if needed, or let parent handle it
    } catch (err) {
      console.error('Error adding to cart:', err)
    }
  }
}
</script>

<style scoped>
/* Copied exactly from ProductsView.vue */

/* Product Card */
.product-card {
  position: relative;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: white;
  border: 1px solid #EDEDED;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.product-card-inner {
  padding: 0.75rem;
}

/* Mobile: padding plus petit */
@media (max-width: 768px) {
  .product-card-inner {
    padding: 0.5rem;
  }
}

.product-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

/* Mobile: titre plus petit */
@media (max-width: 768px) {
  .product-title {
    font-size: 0.75rem;
  }
}

.product-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #3b82f6;
}

.product-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

/* Mobile: cacher description */
@media (max-width: 768px) {
  .product-description {
    display: none;
  }
}

.product-rating {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
}

.product-stars {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.product-wishlist-btn {
  display: none;
  background: transparent;
  border: none;
  width: auto;
  height: auto;
  padding: 0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: none;
  color: #9ca3af;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.product-wishlist-btn:active {
  transform: scale(0.95);
}

/* Mobile: cacher étoiles, afficher coeur */
@media (max-width: 768px) {
  .product-stars {
    display: none;
  }
  .product-wishlist-btn {
    display: flex;
  }
}

.product-image-container {
  width: 90%;
  margin: 0.5rem auto;
  aspect-ratio: 1 / 1;
  border-radius: 0.75rem;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0A1A2F 0%, #1B263B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.product-price {
  font-size: 1.125rem;
  font-weight: bold;
  color: #0d0d0d;
}

/* Mobile: prix plus petit */
@media (max-width: 768px) {
  .product-price {
    font-size: 0.875rem;
  }
}

.product-stock {
  font-size: 0.75rem;
  color: #6b7280;
}

.product-add-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  background: #3b82f6;
  color: white;
  transition: opacity 0.2s;
  border: none;
  cursor: pointer;
}

.product-add-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.product-add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile: bouton plus petit */
@media (max-width: 768px) {
  .product-add-btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
