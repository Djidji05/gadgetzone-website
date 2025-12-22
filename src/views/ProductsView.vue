<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header removed to prevent duplication -->
    
    <!-- Filters removed to prevent duplication -->
    
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
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
      />
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
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/products'
import ProductCard from '@/components/products/ProductCard.vue'

const route = useRoute()
// ... existing content ...

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

  if (query.promotions === 'true') {
    productsStore.isPromotions = true
  } else {
    productsStore.isPromotions = false
  }

  if (query.ids) {
    const ids = (query.ids as string).split(',').map(Number)
    productsStore.productIds = ids
  } else {
    productsStore.productIds = null
  }
  
  // Recharger les produits avec les nouveaux filtres
  loadProducts()
}

// Watch for route changes to reload data
watch(
  [() => route.query], // Removed categories dependency to avoid loop if categories load late
  ([newQuery]) => {
    handleQueryChange(newQuery)
  },
  { immediate: true },
)

// Lifecycle
onMounted(async () => {
  // loadProducts est déjà appelé par le watcher immédiat
  await Promise.all([loadCategories(), loadBrands()])
  
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
</style>
