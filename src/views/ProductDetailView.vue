<template>
  <div class="container mx-auto px-4 py-8 pt-4 md:pt-8">
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
    <!-- Product Content (Visible only when product is loaded) -->
    <div v-else-if="product">
      <!-- Main Product Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Images -->
        <!-- Product Images -->
        <div>
          <!-- Mobile: Swipe Gallery -->
          <div class="md:hidden relative mb-6">
            <div 
              class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl bg-gray-100 aspect-square"
              @scroll="handleMobileScroll"
            >
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                class="w-full flex-shrink-0 snap-center"
                @click="openLightbox(index)"
              >
                <img :src="img" :alt="`${product.name} view ${index + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
            
            <!-- Indicators -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none">
               <div 
                 v-for="(_, index) in productImages" 
                 :key="index"
                 class="w-2 h-2 rounded-full transition-all duration-300"
                 :class="currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'"
               ></div>
            </div>
          </div>

          <!-- Desktop: Main Image + Thumbnails Below -->
          <div class="hidden md:block">
            <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group mb-4 border border-gray-100 cursor-zoom-in" @click="openLightbox(currentImageIndex)">
              <img
                :src="selectedImage"
                :alt="product.name"
                class="w-full h-full object-contain p-4"
              />
              
              <!-- Navigation Buttons -->
              <button 
                @click.stop="prevImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                v-if="productImages.length > 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <button 
                @click.stop="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                v-if="productImages.length > 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Thumbnails Gallery (Below) -->
            <div class="grid grid-cols-5 gap-3">
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200"
                :class="currentImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300 scale-95 hover:scale-100'"
                @click="currentImageIndex = index"
              >
                <img :src="img" :alt="`${product.name} thumbnail ${index + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Seller Info (Under Image) -->
          <div v-if="product.store" class="mt-4 text-center">
            <span class="text-sm text-gray-500">Vendu par</span>
            <router-link 
              :to="{ name: 'products', query: { vendor: product.store.id } }"
              class="ml-1 text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors"
            >
              {{ product.store.name }}
            </router-link>
          </div>
        </div>

        <!-- Product Info Column -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

          <!-- Price -->
          <div class="mb-4 flex items-center gap-4">
            <span class="text-3xl font-bold text-primary-600">
              {{ formatPrice(product.price) }}
            </span>
            <div v-if="hasDiscount" class="flex flex-col">
              <span class="text-lg text-gray-400 line-through font-medium">
                {{ formatPrice(product.original_price) }}
              </span>
              <span class="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Économisez {{ discountPercentage }}%
              </span>
            </div>
          </div>



          <!-- Short Description -->
          <div class="mb-6">
            <p class="text-gray-600 line-clamp-3">
              {{ product.description }}
            </p>
            <a href="#details-section" class="text-primary-600 text-sm font-medium hover:underline mt-2 inline-block">
              Voir la description complète
            </a>
          </div>


          <!-- Actions -->
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="quantity > 1 && quantity--"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Diminuer quantité"
                >
                  <i class="las la-minus"></i>
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  :min="1"
                  class="w-16 text-center border-0 focus:outline-none"
                  aria-label="Quantité"
                />
                <button
                  @click="quantity++"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Augmenter quantité"
                >
                  <i class="las la-plus"></i>
                </button>
              </div>
            </div>

            <button
              @click="addToCart"
              :disabled="isAddingToCart"
              class="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center py-3"
            >
              <i v-if="isAddingToCart" class="las la-spinner la-spin mr-2"></i>
              <i v-else class="las la-shopping-cart mr-2"></i>
              Ajouter au panier
            </button>
          </div>

          <!-- Detailed Information Section (Vertical Stack) -->
          <div id="details-section" class="mt-12 max-w-4xl mx-auto">
            
            <!-- Description Section -->
            <section class="mb-16">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <i class="las la-align-left text-xl"></i>
                </span>
                Description
              </h2>
              <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p class="whitespace-pre-line">{{ product.description }}</p>
                
                <div v-if="product.features && product.features.length > 0" class="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 class="text-lg font-bold text-gray-900 mb-4">Caractéristiques principales</h4>
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li v-for="(feature, index) in product.features" :key="index" class="flex items-start">
                      <i class="las la-check text-green-500 text-xl mr-3 mt-0.5 font-bold"></i>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Specifications Section -->
            <section class="mb-16">
               <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <i class="las la-list text-xl"></i>
                </span>
                Spécifications Techniques
              </h2>
              <div v-if="product.specifications && Object.keys(product.specifications).length > 0" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div v-for="(value, key, index) in product.specifications" :key="key" 
                  class="flex py-4 px-6 md:px-8 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                >
                  <span class="font-medium text-gray-900 w-1/3 md:w-1/4">{{ key }}</span>
                  <span class="text-gray-600 w-2/3 md:w-3/4">{{ value }}</span>
                </div>
              </div>
              <div v-else class="text-gray-500 italic bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-300">
                Aucune spécification technique disponible pour ce produit.
              </div>
            </section>

            <!-- Reviews Section -->
            <section class="mb-16">
               <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <i class="las la-star text-xl"></i>
                  </span>
                  Avis Clients <span class="text-gray-400 text-lg ml-2 font-normal">({{ reviews.length }})</span>
                </h2>
                <button 
                  @click="showReviewForm = !showReviewForm" 
                  class="btn-secondary px-6"
                >
                  {{ showReviewForm ? 'Annuler' : 'Écrire un avis' }}
                </button>
              </div>
              
              <!-- Review Form -->
              <div v-if="showReviewForm" class="mb-8 p-6 md:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <h4 class="font-bold text-lg mb-6">Partagez votre expérience</h4>
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                    <div class="flex gap-3">
                      <button 
                        v-for="star in 5" 
                        :key="star" 
                        @click="newReview.rating = star"
                        class="text-3xl focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'"
                      >
                        ★
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                    <textarea 
                      v-model="newReview.comment"
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                      placeholder="Qu'avez-vous pensé de ce produit ? (Qualité, livraison, etc.)"
                    ></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button 
                      @click="submitReview"
                      :disabled="isSubmittingReview"
                      class="btn-primary min-w-[200px]"
                    >
                      {{ isSubmittingReview ? 'Publication...' : 'Publier mon avis' }}
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div v-if="reviews.length === 0" class="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <i class="las la-comment bg-transparent text-3xl text-gray-300"></i>
                  </div>
                  <p class="text-gray-500 font-medium">Aucun avis pour le moment.</p>
                  <p class="text-gray-400 text-sm mt-1">Soyez le premier à partager votre opinion !</p>
                </div>

                <div 
                  v-for="review in reviews" 
                  :key="review.id" 
                  class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold mr-3 shadow-md">
                        {{ review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'C' }}
                      </div>
                      <div>
                         <div class="font-bold text-gray-900">{{ maskName(review.user?.name) }}</div>
                         <div class="text-gray-400 text-xs mt-0.5">{{ formatDate(review.createdAt) }}</div>
                      </div>
                    </div>
                    <div class="flex text-yellow-400 text-sm bg-yellow-50 px-2 py-1 rounded-lg">
                      <span v-for="n in 5" :key="n">
                        <i :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                      </span>
                    </div>
                  </div>
                  <p class="text-gray-600 leading-relaxed pl-[52px]">{{ review.comment }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Produits similaires</h2>
          <div class="flex gap-2">
            <button 
              @click="scrollRelated('left')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll left"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              @click="scrollRelated('right')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll right"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div 
          ref="relatedProductsContainer"
          class="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-1"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div 
            v-for="related in relatedProducts" 
            :key="related.id"
            class="min-w-[160px] md:min-w-[220px] lg:min-w-[250px]"
          >
             <ProductCard :product="related" />
          </div>
        </div>
      </div>
    </div>
    <!-- Lightbox Modal -->
    <div v-if="isLightboxOpen" class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center" @click.self="closeLightbox">
      <button 
        @click="closeLightbox"
        class="absolute top-6 right-6 text-white bg-black/60 p-3 rounded-full hover:bg-white/20 transition-colors z-[10000] shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button 
        @click.stop="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:block"
        v-if="productImages.length > 1"
      >
        <i class="las la-angle-left text-4xl"></i>
      </button>

      <button 
        @click.stop="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:block"
        v-if="productImages.length > 1"
      >
        <i class="las la-angle-right text-4xl"></i>
      </button>

      <div class="w-full h-full flex items-center justify-center p-4">
        <img 
          :src="selectedImage" 
          :alt="product.name" 
          class="max-w-full max-h-full object-contain select-none transition-transform duration-200 cursor-zoom-in"
          @click.stop="nextImage"
        />
      </div>

       <!-- Mobile Thumbnails in Lightbox -->
       <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
          <button
            v-for="(img, index) in productImages" 
            :key="index"
            @click.stop="currentImageIndex = index"
            class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
            :class="currentImageIndex === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { productsService, type Product } from '@/services/products'
import ProductCard from '@/components/products/ProductCard.vue'
import { useUiStore } from '@/stores/ui'

import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@/stores/history'

const route = useRoute()
const historyStore = useHistoryStore()
// ... existing content ...

const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

// State
const productId = Number(route.params.id)
const product = ref<Product | null>(null)
const isLoading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)
const currentImageIndex = ref(0)
const isDescriptionExpanded = ref(false)
const isLightboxOpen = ref(false)

// Reviews State
const reviews = ref<any[]>([])
const showReviewForm = ref(false)
const isSubmittingReview = ref(false)
const newReview = ref({
  rating: 5,
  comment: ''
})

const user = computed(() => authStore.customer)

// Computed
const productImages = computed(() => {
  if (!product.value) return []
  
  // If we have an images array, use it
  if (product.value.images && product.value.images.length > 0) {
    return product.value.images
  }
  
  // Otherwise fall back to the single image
  const mainImage = product.value.image || product.value.image_url || '/placeholder-product.jpg'
  // Create a fake gallery for demo purposes if only one image exists
  // In a real app we would just return [mainImage]
  return [mainImage, mainImage, mainImage, mainImage] 
})

const selectedImage = computed(() => {
  if (productImages.value.length === 0) return ''
  return productImages.value[currentImageIndex.value]
})

const hasDiscount = computed(() => {
  if (!product.value) return false
  const price = Number(product.value.price)
  const original = Number(product.value.original_price)
  return original > price
})

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !product.value) return 0
  const price = Number(product.value.price)
  const original = Number(product.value.original_price)
  return Math.round(((original - price) / original) * 100)
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price).replace('HTG', 'G')
}

const nextImage = () => {
  if (productImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
}

const prevImage = () => {
  if (productImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length
}

const handleMobileScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollPosition = target.scrollLeft
  const width = target.offsetWidth
  // Calculate index based on scroll position
  const index = Math.round(scrollPosition / width)
  if (index !== currentImageIndex.value && index >= 0 && index < productImages.value.length) {
    currentImageIndex.value = index
  }
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden' // Lock scroll
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.style.overflow = '' // Unlock scroll
}

const addToCart = async () => {
  if (!product.value || isAddingToCart.value) return

  try {
    isAddingToCart.value = true
    
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    await cartStore.addToCart(product.value.id, quantity.value)
    uiStore.showToast(`Produit "${product.value.name}" ajouté au panier !`, 'success')
  } catch (error) {
    console.error('Erreur ajout panier:', error)
    uiStore.showToast("Erreur lors de l'ajout au panier", 'error')
  } finally {
    isAddingToCart.value = false
  }
}

// Watchers
watch(product, (newProduct) => {
  if (newProduct) {
    currentImageIndex.value = 0
  }
})

// Keyboard navigation for lightbox
const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

// Load product
onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  console.log('🔍 ProductDetailView monté avec ID:', productId)
  try {
    isLoading.value = true
    console.log('📦 Chargement du produit...', productId)
    product.value = await productsStore.loadProduct(productId)
    console.log('✅ Produit chargé:', product.value?.name)
    
    if (product.value) {
      historyStore.addProductView(product.value)
    }
    
    // Load related products
    await loadRelatedProducts()
    
    // Load reviews
    await loadReviews()
  } catch (error) {
    console.error('❌ Error loading product:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = '' // Ensure scroll is unlocked
})

// Related Products Logic
const relatedProducts = ref<Product[]>([])
const relatedProductsContainer = ref<HTMLElement | null>(null)

const loadRelatedProducts = async () => {
  if (!product.value) return

  try {
    let candidates: Product[] = []
    
    // Try to load by category if available
    if (product.value.category_id) {
      candidates = await productsStore.loadProductsByCategory(product.value.category_id)
    }
    
    // If no category or no results, fallback to general products
    if (candidates.length === 0) {
      if (productsStore.products.length === 0) {
        await productsStore.loadProducts()
      }
      candidates = productsStore.products
    }
    
    // Filter out current product and take 10
    relatedProducts.value = candidates
      .filter(p => p.id !== productId)
      .slice(0, 10)
  } catch (error) {
    console.error('Error loading related products:', error)
  }
}

const scrollRelated = (direction: 'left' | 'right') => {
  if (!relatedProductsContainer.value) {
    console.warn('⚠️ Related products container not found')
    return
  }
  
  console.log('🖱️ Scrolling related products:', direction)
  
  // Calculate scroll amount dynamically based on card width + gap
  let scrollAmount = 300 // default fallback
  const firstCard = relatedProductsContainer.value.children[0] as HTMLElement
  if (firstCard) {
    // Card width + gap (24px for gap-6)
    scrollAmount = firstCard.offsetWidth + 24
  }
  
  if (direction === 'left') {
    relatedProductsContainer.value.scrollLeft -= scrollAmount
  } else {
    relatedProductsContainer.value.scrollLeft += scrollAmount
  }
}

const goToProduct = (id: number) => {
  // Force reload of the page/component since we are already on the detail page
  window.location.href = `/products/${id}`
}

// Reviews Logic
const loadReviews = async () => {
  try {
    reviews.value = await productsService.getReviews(productId)
    console.log('📝 Reviews fetched:', reviews.value)
  } catch (error) {
    console.error('Erreur chargement avis:', error)
  }
}

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    uiStore.showToast('Veuillez vous connecter pour laisser un avis.', 'warning')
    return
  }
  
  try {
    isSubmittingReview.value = true
    await productsService.addReview({
      product_id: productId,
      rating: newReview.value.rating,
      comment: newReview.value.comment
    })
    
    // Reset and reload
    newReview.value = { rating: 5, comment: '' }
    showReviewForm.value = false
    await loadReviews()
    uiStore.showToast('Merci pour votre avis !', 'success')
  } catch (error) {
    console.error('Erreur envoi avis:', error)
    uiStore.showToast('Une erreur est survenue.', 'error')
  } finally {
    isSubmittingReview.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const maskName = (name: string | null | undefined) => {
  if (!name) return 'Client'
  // Keep first 2 chars (or 1 if short) and mask the rest
  if (name.length <= 2) return name + '***'
  return name.substring(0, 3) + '***'
}

</script>
