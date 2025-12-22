<template>
  <div class="container mx-auto px-4 py-8 pt-20 md:pt-8">
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
        <div>
          <!-- Thumbnails Gallery -->
          <div class="grid grid-cols-4 gap-2 mb-4">
            <div 
              v-for="(img, index) in productImages" 
              :key="index"
              class="aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200"
              :class="currentImageIndex === index ? 'border-primary-500 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'"
              @click="currentImageIndex = index"
            >
              <img :src="img" :alt="`${product.name} view ${index + 1}`" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
            <img
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Navigation Buttons -->
            <button 
              @click.stop="prevImage"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              v-if="productImages.length > 1"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <button 
              @click.stop="nextImage"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              v-if="productImages.length > 1"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Product Info Column -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

          <!-- Price -->
          <div class="mb-6">
            <span class="text-3xl font-bold text-primary-600">
              {{ formatPrice(product.price) }}
            </span>
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
                  aria-label="Diminuer quantité"
                >
                  <i class="las la-minus"></i>
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  :min="1"
                  :max="product.stock"
                  class="w-16 text-center border-0 focus:outline-none"
                  aria-label="Quantité"
                />
                <button
                  @click="quantity < product.stock && quantity++"
                  :disabled="quantity >= product.stock"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Augmenter quantité"
                >
                  <i class="las la-plus"></i>
                </button>
              </div>
            </div>

            <button
              @click="addToCart"
              :disabled="product.stock === 0 || isAddingToCart"
              class="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center py-3"
            >
              <i v-if="isAddingToCart" class="las la-spinner la-spin mr-2"></i>
              <i v-else class="las la-shopping-cart mr-2"></i>
              {{ product.stock === 0 ? 'Indisponible' : 'Ajouter au panier' }}
            </button>
          </div>

          <!-- Detailed Information Section (Tabs) -->
          <div id="details-section" class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Tabs Header -->
            <div class="flex border-b border-gray-200 overflow-x-auto">
              <button 
                v-for="tab in ['Description', 'Spécifications', 'Avis']" 
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  'px-6 md:px-8 py-4 font-semibold text-lg transition-colors border-b-2 outline-none whitespace-nowrap',
                  activeTab === tab ? 'border-primary-600 text-primary-600 bg-primary-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-6 md:p-8">
              <!-- Description Tab -->
              <div v-if="activeTab === 'Description'" class="prose max-w-none text-gray-600">
                <h3 class="text-xl font-bold text-gray-900 mb-4">À propos de ce produit</h3>
                <p class="whitespace-pre-line">{{ product.description }}</p>
                
                <div v-if="product.features && product.features.length > 0" class="mt-8">
                  <h4 class="text-lg font-bold text-gray-900 mb-4">Caractéristiques principales</h4>
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li v-for="(feature, index) in product.features" :key="index" class="flex items-start">
                      <i class="las la-check-circle text-green-500 text-xl mr-3 mt-0.5"></i>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Specifications Tab -->
              <div v-if="activeTab === 'Spécifications'">
                <h3 class="text-xl font-bold text-gray-900 mb-6">Spécifications Techniques</h3>
                <div v-if="product.specifications && Object.keys(product.specifications).length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div v-for="(value, key) in product.specifications" :key="key" class="flex border-b border-gray-100 py-3">
                    <span class="font-medium text-gray-900 w-1/3">{{ key }}</span>
                    <span class="text-gray-600 w-2/3">{{ value }}</span>
                  </div>
                </div>
                <div v-else class="text-gray-500 italic">
                  Aucune spécification technique disponible pour ce produit.
                </div>
              </div>

              <!-- Reviews Tab (Real) -->
              <div v-if="activeTab === 'Avis'">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-xl font-bold text-gray-900">Avis Clients ({{ reviews.length }})</h3>
                  <button 
                    @click="showReviewForm = !showReviewForm" 
                    class="btn-secondary"
                  >
                    {{ showReviewForm ? 'Annuler' : 'Écrire un avis' }}
                  </button>
                </div>
                
                <!-- Review Form -->
                <div v-if="showReviewForm" class="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 class="font-bold text-lg mb-4">Laissez votre avis</h4>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
                      <div class="flex gap-2">
                        <button 
                          v-for="star in 5" 
                          :key="star" 
                          @click="newReview.rating = star"
                          class="text-2xl focus:outline-none transition-transform hover:scale-110"
                          :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                        >
                          ★
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                      <textarea 
                        v-model="newReview.comment"
                        rows="3"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Qu'avez-vous pensé de ce produit ?"
                      ></textarea>
                    </div>
                    <button 
                      @click="submitReview"
                      :disabled="isSubmittingReview"
                      class="btn-primary"
                    >
                      {{ isSubmittingReview ? 'Envoi...' : 'Publier l\'avis' }}
                    </button>
                  </div>
                </div>
                
                <div class="space-y-6">
                  <div v-if="reviews.length === 0" class="text-center py-8 text-gray-500">
                    Soyez le premier à donner votre avis !
                  </div>

                  <div 
                    v-for="review in reviews" 
                    :key="review.id" 
                    class="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div class="flex items-center mb-2">
                      <div class="flex text-yellow-400 text-sm mr-2">
                        <span v-for="n in 5" :key="n">
                          <i :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                        </span>
                      </div>
                      <span class="font-bold text-gray-900 mr-2">{{ maskName(review.user?.name) }}</span>
                      <span class="text-gray-400 text-sm">- {{ formatDate(review.createdAt) }}</span>
                    </div>
                    <p class="text-gray-600">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { productsService, type Product } from '@/services/products'
import ProductCard from '@/components/products/ProductCard.vue'

import { useAuthStore } from '@/stores/auth'

const route = useRoute()
// ... existing content ...

const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

// State
const productId = Number(route.params.id)
const product = ref<Product | null>(null)
const isLoading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)
const currentImageIndex = ref(0)
const isDescriptionExpanded = ref(false)
const activeTab = ref('Description')

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

// Watchers
watch(product, (newProduct) => {
  if (newProduct) {
    currentImageIndex.value = 0
  }
})

// Load product
onMounted(async () => {
  console.log('🔍 ProductDetailView monté avec ID:', productId)
  try {
    isLoading.value = true
    console.log('📦 Chargement du produit...', productId)
    product.value = await productsStore.loadProduct(productId)
    console.log('✅ Produit chargé:', product.value?.name)
    
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
    alert('Veuillez vous connecter pour laisser un avis.')
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
    alert('Merci pour votre avis !')
  } catch (error) {
    console.error('Erreur envoi avis:', error)
    alert('Une erreur est survenue.')
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
