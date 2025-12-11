<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Découvrez notre sélection de produits de qualité
      </h1>
      <p class="text-gray-600">Des produits premium sélectionnés pour vous</p>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2 relative">
          <div class="relative">
            <i
              class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Rechercher un produit..."
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="handleFilter"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 transition-all appearance-none cursor-pointer"
        >
          <option :value="null">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <!-- Brand Filter -->
        <select
          v-model="selectedBrand"
          @change="handleFilter"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 transition-all appearance-none cursor-pointer"
        >
          <option :value="null">Toutes les marques</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>

        <!-- Sort Filter -->
        <select
          v-model="sortBy"
          @change="handleFilter"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 transition-all appearance-none cursor-pointer"
        >
          <option value="name">Nom</option>
          <option value="price">Prix</option>
          <option value="createdAt">Nouveauté</option>
        </select>
      </div>
    </div>

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

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="relative rounded-2xl shadow-xl overflow-hidden bg-white border border-[#EDEDED] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        @click="goToProduct(product.id)"
      >
        <div class="p-2">
          <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full" style="background: #3b82f6"></span>
            {{ product.name }}
          </h2>
          <p class="text-xs text-gray-500">{{ product.description?.substring(0, 30) }}...</p>

          <!-- Star Rating -->
          <div class="absolute top-2 right-2 flex items-center gap-0.5">
            <i class="fas fa-star text-yellow-400 text-xs"></i>
            <i class="fas fa-star text-yellow-400 text-xs"></i>
            <i class="fas fa-star text-yellow-400 text-xs"></i>
            <i class="fas fa-star text-yellow-400 text-xs"></i>
            <i class="fas fa-star-half-alt text-yellow-400 text-xs"></i>
            <span class="text-xs text-gray-400 font-bold ml-1">4.5</span>
          </div>

          <div class="w-11/12 mx-auto aspect-square rounded-xl overflow-hidden mt-2">
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-[#0A1A2F] to-[#1B263B] flex items-center justify-center text-white text-xl font-bold"
            >
              IMG
            </div>
          </div>

          <div class="flex items-center justify-between mt-2">
            <div>
              <div class="text-lg font-bold" style="color: #0d0d0d">{{ product.price }} G</div>
              <div class="text-xs text-gray-500">
                {{ product.stock > 0 ? 'En stock' : 'Rupture' }}
              </div>
            </div>
            <button
              @click.stop="addToCart(product)"
              class="px-3 py-1 rounded-lg font-semibold transition-colors hover:opacity-90"
              style="background: #3b82f6; color: white"
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
      class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
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
