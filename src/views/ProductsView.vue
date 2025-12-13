<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->


    <!-- Filters and Search -->


    <!-- Products Grid -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
      ></div>
      <p class="mt-4 text-gray-600">Chargement des produits...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <button @click="loadProducts" class="btn-primary">Réessayer</button>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <div class="mb-4">
        <i class="fas fa-search text-4xl text-gray-300"></i>
      </div>
      <p class="text-gray-600 mb-2">Aucun produit trouvé pour votre recherche.</p>
      <p class="text-sm text-gray-500 mb-4">
        {{ searchQuery ? `Recherche: "${searchQuery}"` : 'Essayez de modifier vos filtres' }}
      </p>
      <button @click="resetFilters" class="btn-primary">Réinitialiser les filtres</button>
    </div>

    <div v-else class="product-grid">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card"
        @click="goToProduct(product.id)"
      >
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
            <button class="product-wishlist-btn" @click.stop>
              <i class="far fa-heart"></i>
            </button>
          </div>

          <div class="product-image-container">
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="product-image"
            />
            <div
              v-else
              class="product-image-placeholder"
            >
              IMG
            </div>
          </div>

          <div class="product-footer">
            <div>
              <div class="product-price">{{ product.price }} G</div>
              <div class="product-stock">
                {{ product.stock > 0 ? 'En stock' : 'Rupture' }}
              </div>
            </div>
            <button
              @click.stop="addToCart(product)"
              class="product-add-btn"
              :disabled="product.stock === 0"
            >
              {{ product.stock > 0 ? 'Ajouter' : 'Indispo' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
      >
        Précédent
      </button>

      <span class="px-3 py-2"> Page {{ currentPage }} sur {{ totalPages }} </span>

      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>

    <!-- Bouton retour en haut flottant -->
    <button
      @click="scrollToTop"
      class="hidden md:block fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
      :class="{ 'opacity-0 invisible': !showScrollTop, 'opacity-100 visible': showScrollTop }"
    >
      <i class="fas fa-arrow-up text-lg"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/products'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

// State
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed
const isLoading = computed(() => productsStore.isLoading)
const error = computed(() => productsStore.error)
const categories = computed(() => productsStore.categories)
const brands = computed(() => productsStore.brands)

// Filters
const searchQuery = computed({
  get: () => productsStore.searchQuery,
  set: (value) => {
    productsStore.searchQuery = value
    currentPage.value = 1 // Reset page when search changes
  },
})

const selectedCategory = computed({
  get: () => productsStore.selectedCategory,
  set: (value) => {
    productsStore.selectedCategory = value
    currentPage.value = 1 // Reset page when category changes
  },
})

const selectedBrand = computed({
  get: () => productsStore.selectedBrand,
  set: (value) => {
    productsStore.selectedBrand = value
    currentPage.value = 1 // Reset page when brand changes
  },
})

const sortBy = computed({
  get: () => productsStore.sortBy,
  set: (value) => {
    productsStore.sortBy = value
    currentPage.value = 1 // Reset page when sort changes
  },
})

// Filtered and paginated products
const filteredProducts = computed(() => {
  return productsStore.filteredProducts
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

// Methods
const loadProducts = async () => {
  try {
    await productsStore.loadProducts()
  } catch {
    console.warn('Backend failed, checking for fallback products')
    // Si le backend échoue, utiliser les produits fallback directement
    if (productsStore.products.length === 0) {
      // Charger les produits fallback manuellement
      const { fallbackFeaturedProducts } = await import('@/services/fallback')
      productsStore.products = fallbackFeaturedProducts
    }
  }
}

const loadCategories = async () => {
  try {
    await productsStore.loadCategories()
  } catch {
    console.warn('Categories backend failed, using fallback')
  }
}

const loadBrands = async () => {
  try {
    await productsStore.loadBrands()
  } catch {
    console.warn('Brands backend failed')
  }
}

const handleSearch = () => {
  // Search is handled by computed setter
}

const handleFilter = () => {
  // Filter is handled by computed setters
}

const addToCart = async (product: Product) => {
  if (product.stock > 0) {
    try {
      await cartStore.addToCart(product.id, 1)
    } catch (err) {
      console.error('Error adding to cart:', err)
    }
  }
}

const goToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

const resetFilters = () => {
  productsStore.searchQuery = ''
  productsStore.selectedCategory = null
  productsStore.selectedBrand = null
  productsStore.sortBy = 'name'
  currentPage.value = 1
}

const handleQueryChange = (query: any) => {
  if (query.category) {
    // Normaliser le nom de la catégorie recherchée
    const categoryName = query.category.toLowerCase().trim()
    
    // Mapping manuel pour les cas courants
    const categoryAliases: Record<string, string[]> = {
      'smartphone': ['smartphone', 'téléphone', 'phone', 'mobile'],
      'laptop': ['laptop', 'ordinateur', 'pc', 'computer'],
      'audio': ['audio', 'casque', 'écouteur', 'headphone', 'speaker', 'enceinte'],
      'gaming': ['gaming', 'jeu', 'console', 'game'],
      'photo': ['photo', 'appareil photo', 'camera', 'caméra'],
      'accessories': ['accessoire', 'accessory', 'gadget']
    }
    
    // Chercher d'abord dans les alias
    let foundCategory = null
    for (const [key, aliases] of Object.entries(categoryAliases)) {
      if (aliases.some(alias => categoryName.includes(alias) || alias.includes(categoryName))) {
        // Chercher la catégorie correspondante dans la liste
        // Prioriser les correspondances exactes ou courtes (catégories principales)
        const matchingCategories = categories.value.filter(cat => 
          aliases.some(alias => cat.name.toLowerCase().includes(alias))
        )
        
        if (matchingCategories.length > 0) {
          // Trier par longueur de nom (les catégories principales ont généralement des noms plus courts)
          matchingCategories.sort((a, b) => a.name.length - b.name.length)
          
          // Prioriser les catégories qui correspondent exactement à un alias
          const exactMatch = matchingCategories.find(cat =>
            aliases.some(alias => cat.name.toLowerCase() === alias || cat.name.toLowerCase() === alias + 's')
          )
          
          foundCategory = exactMatch || matchingCategories[0]
          break
        }
      }
    }
    
    // Si pas trouvé via alias, chercher directement
    if (!foundCategory) {
      const matchingCategories = categories.value.filter(
        cat => cat.name.toLowerCase().includes(categoryName) ||
               categoryName.includes(cat.name.toLowerCase())
      )
      
      if (matchingCategories.length > 0) {
        // Trier par longueur de nom
        matchingCategories.sort((a, b) => a.name.length - b.name.length)
        foundCategory = matchingCategories[0]
      }
    }
    
    if (foundCategory) {
      productsStore.selectedCategory = foundCategory.id
      console.log(`✅ Category matched: "${query.category}" → "${foundCategory.name}" (ID: ${foundCategory.id})`)
    } else {
      console.warn(`⚠️ Category not found: ${query.category}`)
      productsStore.selectedCategory = null
    }
  } else {
    productsStore.selectedCategory = null
  }

  if (query.brand) {
    productsStore.selectedBrand = parseInt(query.brand as string)
  } else {
    productsStore.selectedBrand = null
  }

  if (query.search) {
    productsStore.searchQuery = query.search
  } else {
    productsStore.searchQuery = ''
  }
  
  // Ne pas recharger les produits, le filtrage se fait automatiquement via computed
  // loadProducts() - SUPPRIMÉ
}

// Watch for route changes to reload data
watch(
  () => route.query,
  (newQuery) => {
    handleQueryChange(newQuery)
  },
  { immediate: true },
)

// Lifecycle
onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories(), loadBrands()])
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Scroll to top logic
const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
  top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
/* Responsive Product Grid */
.product-grid {
  display: grid;
  gap: 0.75rem;
  
  /* Mobile: 2 colonnes */
  grid-template-columns: repeat(2, 1fr);
}

/* Tablet: 3 colonnes */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* Desktop: 4 colonnes */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
}

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

.product-wishlist-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
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
