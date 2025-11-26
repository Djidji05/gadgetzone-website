<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Banners -->
    <section class="relative">
      <!-- Main Banner Carousel -->
      <div class="relative h-96 md:h-[500px] overflow-hidden">
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          v-show="currentBannerIndex === index"
          class="absolute inset-0 transition-opacity duration-1000"
        >
          <img :src="banner.image" :alt="banner.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div class="text-center text-white px-4">
              <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ banner.title }}</h1>
              <p class="text-xl md:text-2xl mb-8">{{ banner.subtitle }}</p>
              <router-link
                v-if="banner.link"
                :to="banner.link"
                class="btn-primary text-lg px-8 py-3"
              >
                Découvrir
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Controls -->
      <div
        v-if="banners.length > 1"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
      >
        <button
          v-for="(_, index) in banners"
          :key="index"
          @click="currentBannerIndex = index"
          :class="[
            'w-3 h-3 rounded-full transition-colors',
            currentBannerIndex === index ? 'bg-white' : 'bg-white bg-opacity-50',
          ]"
        />
      </div>
    </section>

    <!-- Featured Products -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Produits Vedettes</h2>
        <p class="text-xl text-gray-600">Découvrez nos meilleurs produits sélectionnés pour vous</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingFeatured" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="card animate-pulse">
          <div class="h-48 bg-gray-300 rounded-t-lg"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-4 bg-gray-300 rounded w-1/4"></div>
            <div class="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Featured Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
          :promotion="getProductPromotion(product) || undefined"
        />
      </div>

      <!-- View All Products Button -->
      <div class="text-center mt-12">
        <router-link to="/products" class="btn-primary text-lg px-8 py-3">
          Voir Tous les Produits
          <i class="fas fa-arrow-right ml-2"></i>
        </router-link>
      </div>
    </section>

    <!-- Promotions -->
    <section v-if="promotions.length > 0" class="bg-primary-50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Offres Spéciales</h2>
          <p class="text-xl text-gray-600">Profitez de nos promotions exclusives</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="promotion in promotions"
            :key="promotion.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="relative">
              <img
                v-if="promotion.image"
                :src="promotion.image"
                :alt="promotion.title"
                class="w-full h-48 object-cover"
              />
              <div
                v-else
                class="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
              >
                <i class="fas fa-tag text-white text-4xl"></i>
              </div>
              <div
                class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold"
              >
                -{{ promotion.discount
                }}{{ promotion.discountType === 'percentage' ? '%' : ' HTG' }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ promotion.title }}</h3>
              <p class="text-gray-600 mb-4">{{ promotion.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  <i class="fas fa-clock mr-1"></i>
                  Valide jusqu'au {{ formatDate(promotion.endDate) }}
                </div>
                <router-link to="/products" class="btn-primary"> Exploiter l'offre </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Catégories Populaires</h2>
        <p class="text-xl text-gray-600">Explorez nos différentes catégories de produits</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/products?category=${category.id}`"
          class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <div class="aspect-square bg-gray-200">
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center"
            >
              <i class="fas fa-th-large text-white text-4xl"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div class="text-center text-white">
              <h3 class="text-lg font-bold">{{ category.name }}</h3>
              <p class="text-sm opacity-90">{{ category.description }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-gray-900 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Restez Informé</h2>
        <p class="text-xl mb-8">
          Abonnez-vous à notre newsletter pour recevoir les dernières offres et nouveautés
        </p>
        <div class="max-w-md mx-auto flex gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="Votre email"
            class="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            @click="subscribeNewsletter"
            :disabled="!email || isSubscribing"
            class="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <i v-if="isSubscribing" class="fas fa-spinner fa-spin mr-2"></i>
            S'abonner
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePromotionsStore } from '@/stores/promotions'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/products/ProductCard.vue'
import type { Product } from '@/services/products'

const productsStore = useProductsStore()
const promotionsStore = usePromotionsStore()

// State
const email = ref('')
const isSubscribing = ref(false)
const currentBannerIndex = ref(0)

// Computed
const banners = computed(() => promotionsStore.activeBanners)
const featuredProducts = computed(() => productsStore.featuredProducts)
const categories = computed(() => productsStore.categories)
const promotions = computed(() => promotionsStore.activePromotions)
const isLoadingFeatured = computed(() => productsStore.isLoading)

// Methods
const getProductPromotion = (product: Product) => {
  return promotionsStore.getProductPromotion(product.id)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-HT')
}

const subscribeNewsletter = async () => {
  if (!email.value || isSubscribing.value) return

  try {
    isSubscribing.value = true
    // TODO: Implement newsletter subscription API
    console.log('Newsletter subscription:', email.value)
    email.value = ''
    // Show success message
  } catch (error) {
    console.error('Newsletter error:', error)
  } finally {
    isSubscribing.value = false
  }
}

// Auto-rotate banners
const rotateBanners = () => {
  if (banners.value.length > 1) {
    setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
    }, 5000)
  }
}

// Load data
onMounted(async () => {
  try {
    console.log('🏠 Loading home page data...')

    // Load all data in parallel
    await Promise.all([
      promotionsStore.loadAllPromotionsData(),
      productsStore.loadFeaturedProducts(),
      productsStore.loadCategories(),
    ])

    console.log('📊 Home data loaded:')
    console.log('🎯 Banners:', promotionsStore.activeBanners.length)
    console.log('🎁 Promotions:', promotionsStore.activePromotions.length)
    console.log('⭐ Featured Products:', productsStore.featuredProducts.length)
    console.log('📂 Categories:', productsStore.categories.length)

    // Afficher si on utilise les fallbacks
    if (promotionsStore.isUsingFallback || productsStore.isUsingFallback) {
      console.log('⚠️ Using fallback data - API may be unavailable')
    }

    // Start banner rotation
    rotateBanners()
  } catch (error) {
    console.error('❌ Error loading home data:', error)
  }
})
</script>
