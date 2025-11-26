<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
      <p class="text-gray-600">Découvrez notre sélection de produits de qualité</p>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Rechercher un produit..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="handleFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <!-- Sort -->
        <select
          v-model="sortBy"
          @change="handleFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="name">Nom</option>
          <option value="price">Prix</option>
          <option value="createdAt">Nouveauté</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <ProductGrid />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/products/ProductGrid.vue'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()

// State
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const sortBy = ref('name')
// const sortOrder = ref<'asc' | 'desc'>('asc')

// Computed
const categories = computed(() => productsStore.categories)

// Methods
const handleSearch = () => {
  router.push({
    name: 'products',
    query: {
      search: searchQuery.value,
      category: selectedCategory.value,
      sortBy: sortBy.value,
    },
  })
  loadProducts()
}

const handleFilter = () => {
  router.push({
    name: 'products',
    query: {
      search: searchQuery.value,
      category: selectedCategory.value,
      sortBy: sortBy.value,
    },
  })
  loadProducts()
}

const loadProducts = () => {
  const query = route.query
  productsStore.loadProducts(Number(query.page) || 1, {
    search: query.search as string,
    category: Number(query.category) || undefined,
  })
}

// Initialize from URL params
onMounted(() => {
  searchQuery.value = (route.query.search as string) || ''
  selectedCategory.value = Number(route.query.category) || null
  sortBy.value = (route.query.sortBy as string) || 'name'

  loadProducts()
})
</script>
