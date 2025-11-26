import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsService, type Product, type Category } from '@/services/products'
import {
  fallbackFeaturedProducts,
  fallbackCategories,
  isValidApiResponse,
} from '@/services/fallback'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const featuredProducts = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const usingFallback = ref(false)

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(12)
  const totalItems = ref(0)

  // Filters
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  const sortBy = ref('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  // Getters
  const hasProducts = computed(() => products.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  const hasFeaturedProducts = computed(() => featuredProducts.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
  const isUsingFallback = computed(() => usingFallback.value)

  const filteredProducts = computed(() => {
    let filtered = products.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategory.value) {
      filtered = filtered.filter((product) => product.category_id === selectedCategory.value)
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy.value as keyof Product]
      const bValue = b[sortBy.value as keyof Product]

      // Convertir en string pour la comparaison
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      if (sortOrder.value === 'asc') {
        return aStr > bStr ? 1 : -1
      } else {
        return aStr < bStr ? 1 : -1
      }
    })

    return filtered
  })

  // Actions
  const loadProducts = async (page = 1, filters?: { search?: string; category?: number }) => {
    try {
      console.log('📦 Loading products...')
      isLoading.value = true
      error.value = null
      usingFallback.value = false

      const response = await productsService.getProducts({
        category: filters?.category?.toString(),
        search: filters?.search,
        page,
        limit: itemsPerPage.value,
      })
      console.log('📦 Products response:', response)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(response) && response.products && Array.isArray(response.products)) {
        products.value = response.products
        totalItems.value = response.pagination?.total || response.products.length
        currentPage.value = page
        console.log('✅ Products loaded from API:', response.products.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Products API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      products.value = fallbackFeaturedProducts
      totalItems.value = fallbackFeaturedProducts.length
      usingFallback.value = true
      console.log('✅ Fallback products loaded:', fallbackFeaturedProducts.length)
    } finally {
      isLoading.value = false
    }
  }

  const loadProduct = async (id: number) => {
    try {
      console.log('📦 Loading product:', id)
      isLoading.value = true
      error.value = null

      const product = await productsService.getProduct(id)
      console.log('📦 Product response:', product)

      if (isValidApiResponse(product) && product.id) {
        return product
      } else {
        throw new Error('Product not found')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Product API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'Produit non trouvé'

      // Chercher dans les fallbacks
      const fallbackProduct = fallbackFeaturedProducts.find((p) => p.id === id)
      if (fallbackProduct) {
        return fallbackProduct
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadCategories = async () => {
    try {
      console.log('📂 Loading categories...')
      isLoading.value = true
      error.value = null
      usingFallback.value = false

      const categoriesResponse = await productsService.getCategories()
      console.log('📂 Categories response:', categoriesResponse)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(categoriesResponse) && Array.isArray(categoriesResponse)) {
        categories.value = categoriesResponse
        console.log('✅ Categories loaded from API:', categoriesResponse.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Categories API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      categories.value = fallbackCategories
      usingFallback.value = true
      console.log('✅ Fallback categories loaded:', fallbackCategories.length)
    } finally {
      isLoading.value = false
    }
  }

  const loadFeaturedProducts = async () => {
    try {
      console.log('⭐ Loading featured products...')
      isLoading.value = true
      error.value = null
      usingFallback.value = false

      const featured = await productsService.getFeaturedProducts()
      console.log('⭐ Featured products response:', featured)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(featured) && Array.isArray(featured)) {
        featuredProducts.value = featured
        console.log('✅ Featured products loaded from API:', featured.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Featured products API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      featuredProducts.value = fallbackFeaturedProducts
      usingFallback.value = true
      console.log('✅ Fallback featured products loaded:', fallbackFeaturedProducts.length)
    } finally {
      isLoading.value = false
    }
  }

  const searchProducts = async (query: string) => {
    try {
      console.log('🔍 Searching products:', query)
      isLoading.value = true
      error.value = null

      const results = await productsService.searchProducts(query)
      console.log('🔍 Search results:', results)

      if (isValidApiResponse(results) && Array.isArray(results)) {
        return results
      } else {
        throw new Error('Invalid search response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Search API failed, using local search')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'Recherche indisponible'

      // Fallback: chercher localement
      return fallbackFeaturedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()),
      )
    } finally {
      isLoading.value = false
    }
  }

  const loadProductsByCategory = async (categoryId: number) => {
    try {
      console.log('📦 Loading products by category:', categoryId)
      isLoading.value = true
      error.value = null

      const products = await productsService.getProductsByCategory(categoryId)
      console.log('📦 Category products response:', products)

      if (isValidApiResponse(products) && Array.isArray(products)) {
        return products
      } else {
        throw new Error('Invalid category response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Category products API failed, using local filter')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'Catégorie indisponible'

      // Fallback: filtrer localement
      return fallbackFeaturedProducts.filter((product) => product.category_id === categoryId)
    } finally {
      isLoading.value = false
    }
  }

  const setFilters = (filters: {
    search?: string
    category?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    if (filters.search !== undefined) searchQuery.value = filters.search
    if (filters.category !== undefined) selectedCategory.value = filters.category
    if (filters.sortBy !== undefined) sortBy.value = filters.sortBy
    if (filters.sortOrder !== undefined) sortOrder.value = filters.sortOrder
  }

  const clearError = () => {
    error.value = null
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = null
    sortBy.value = 'name'
    sortOrder.value = 'asc'
  }

  // Pagination computed
  const hasPrevPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  return {
    // State
    products,
    categories,
    featuredProducts,
    isLoading,
    error,
    usingFallback,
    currentPage,
    itemsPerPage,
    totalItems,
    searchQuery,
    selectedCategory,
    sortBy,
    sortOrder,

    // Getters
    hasProducts,
    hasCategories,
    hasFeaturedProducts,
    totalPages,
    filteredProducts,
    isUsingFallback,
    hasPrevPage,
    hasNextPage,

    // Actions
    loadProducts,
    loadProduct,
    loadCategories,
    loadFeaturedProducts,
    searchProducts,
    loadProductsByCategory,
    setFilters,
    clearError,
    setPage,
    resetFilters,
  }
})
