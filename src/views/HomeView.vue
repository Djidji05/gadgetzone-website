<template>
  <div class="min-h-screen">
    <!-- Hero Section with Banners -->
    <section class="relative">
      <!-- Full Screen Banner with Carousel -->
      <div class="relative w-screen h-[500px] bg-gray-900">
        <!-- Carousel Container -->
        <div class="relative w-full h-full overflow-hidden">
          <!-- Carousel Slides -->
          <div
            v-for="(banner, index) in banners"
            :key="banner.id"
            v-show="currentBannerIndex === index"
            class="absolute inset-0 transition-opacity duration-1000 flex items-center justify-center"
          >
            <!-- Image Background -->
            <img
              :src="banner.image"
              :alt="banner.title"
              class="absolute inset-0 w-full h-full object-cover"
              @error="console.error('❌ Image failed to load:', banner.image)"
              @load="console.log('✅ Image loaded successfully:', banner.image)"
            />

            <!-- Content -->
            <div class="relative text-center text-white px-4 z-10">
              <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ banner.title }}</h1>
              <p class="text-lg md:text-2xl mb-6 opacity-90">{{ banner.subtitle }}</p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link
                  v-if="banner.link"
                  :to="banner.link"
                  class="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 text-base font-semibold rounded-lg shadow-lg transition-all"
                >
                  <i class="fas fa-shopping-bag mr-2"></i>
                  {{ banner.link ? 'Explorer' : 'En savoir plus' }}
                </router-link>
                <router-link
                  to="/about"
                  class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 text-base font-semibold rounded-lg transition-all"
                >
                  En savoir plus
                </router-link>
              </div>
            </div>
          </div>

          <!-- Carousel Indicators -->
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
              v-for="(banner, index) in banners"
              :key="index"
              @click="goToBanner(index)"
              :class="[
                'w-2 h-2 rounded-full transition-all',
                currentBannerIndex === index
                  ? 'bg-white w-8'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75',
              ]"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="container mx-auto px-4 pt-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Produits Vedettes</h2>
        <p class="text-xl text-gray-600">Découvrez nos meilleurs produits sélectionnés pour vous</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingFeatured" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="n in 3"
          :key="n"
          class="rounded-2xl shadow-xl overflow-hidden bg-white border border-[#EDEDED] animate-pulse"
        >
          <div class="p-2">
            <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div class="w-3/4 mx-auto aspect-square rounded-xl bg-gray-300 mb-2"></div>
            <div class="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Featured Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="relative rounded-2xl shadow-xl overflow-hidden bg-white border border-[#EDEDED] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          @click="goToProduct(product.id)"
        >
          <div class="p-2">
            <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full" style="background: #3b82f6"></span>
              {{ product.name }}
            </h2>
            <p class="text-xs text-gray-500 truncate">{{ product.description }}</p>

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
                :src="product.image_url || product.image || '/images/placeholder.png'"
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div class="flex items-center justify-between mt-2">
              <div>
                <div class="text-lg font-bold" style="color: #0d0d0d">{{ formatPrice(product.price) }}</div>
                <div class="text-xs text-gray-500" v-if="product.stock > 0">En stock</div>
                <div class="text-xs text-red-500" v-else>Rupture</div>
              </div>
              <button
                class="px-3 py-1 rounded-lg font-semibold transition-colors hover:opacity-90"
                style="background: #3b82f6; color: white"
                @click.stop="addToCart(product)"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Products Button -->
      <div class="text-center mt-12 mb-8">
        <router-link to="/products" class="btn-primary text-lg px-8 py-3">
          Voir Tous les Produits
          <i class="fas fa-arrow-right ml-2"></i>
        </router-link>
      </div>
    </section>

    <!-- Promotions -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Offres Spéciales</h2>
          <p class="text-xl text-gray-600">Profitez de nos promotions exclusives</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div
            v-for="offre in offres"
            :key="offre.id"
            class="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex flex-col items-center text-center space-y-4">
              <div class="p-4 rounded-full bg-gray-100">
                <!-- Icon -->
                <i
                  v-if="offre.icon === 'percent'"
                  class="fas fa-percent text-2xl text-gray-700"
                ></i>
                <i
                  v-else-if="offre.icon === 'truck'"
                  class="fas fa-truck text-2xl text-gray-700"
                ></i>
                <i v-else-if="offre.icon === 'star'" class="fas fa-star text-2xl text-gray-700"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ offre.titre }}</h3>
              <p class="text-gray-600">{{ offre.description }}</p>
              <div
                class="mt-3 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold tracking-wider"
              >
                {{ offre.code }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marques Populaires -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Marques Populaires</h2>
        <p class="text-xl text-gray-600">Retrouvez vos marques préférées</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <router-link
          v-for="brand in brands"
          :key="brand.id"
          :to="`/products?brand=${brand.id}`"
          class="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all p-6 bg-white flex items-center justify-center border border-gray-100 cursor-pointer hover:-translate-y-1"
        >
          <div class="aspect-video w-full flex items-center justify-center">
            <img
              v-if="brand.logo_url"
              :src="brand.logo_url"
              :alt="brand.name"
              class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="text-xl font-bold text-gray-400">{{ brand.name }}</div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 40 Produits Supplémentaires -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nouveaux produits</h2>
        <p class="text-xl text-gray-600">Découvrez nos dernières arrivées</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="product in newProducts"
          :key="product.id"
          class="relative rounded-2xl shadow-xl overflow-hidden bg-white border border-[#EDEDED] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          @click="goToProduct(product.id)"
        >
          <div class="p-2">
            <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full" style="background: #3b82f6"></span>
              {{ product.name }}
            </h2>
            <p class="text-xs text-gray-500 truncate">{{ product.description }}</p>

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
                :src="product.image_url || product.image || '/images/placeholder.png'"
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div class="flex items-center justify-between mt-2">
              <div>
                <div class="text-lg font-bold" style="color: #0d0d0d">{{ formatPrice(product.price) }}</div>
                <div class="text-xs text-gray-500">Nouveau</div>
              </div>
              <button
                class="px-3 py-1 rounded-lg font-semibold transition-colors hover:opacity-90"
                style="background: #3b82f6; color: white"
                @click.stop="addToCart(product)"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>

  <!-- Bouton retour en haut flottant -->
  <button
    @click="scrollToTop"
    class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
    :class="{ 'opacity-0 invisible': !showScrollTop, 'opacity-100 visible': showScrollTop }"
  >
    <i class="fas fa-arrow-up text-lg"></i>
  </button>
  <!-- Toast Notification -->
  <Toast
    :message="toastMessage"
    :type="toastType"
    :duration="3000"
    v-if="showToast"
    @close="showToast = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePromotionsStore } from '@/stores/promotions'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import Toast from '@/components/ui/Toast.vue'

const router = useRouter()
const productsStore = useProductsStore()
const promotionsStore = usePromotionsStore()
const cartStore = useCartStore()

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const addToCart = async (product: any) => {
  try {
    await cartStore.addToCart(product.id, 1)
    showNotification(`Produit "${product.name}" ajouté au panier !`, 'success')
  } catch (error) {
    console.error('Error adding to cart:', error)
    showNotification("Erreur lors de l'ajout au panier", 'error')
  }
}

// State

const currentBannerIndex = ref(0)
const isScrolled = ref(false)
const showScrollTop = ref(false)
let bannerInterval: ReturnType<typeof setInterval> | null = null

const goToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// Offres spéciales
const offres = ref([
  {
    id: 1,
    titre: 'Offre -30%',
    code: 'CODE30',
    description: 'Profitez de 30% de réduction sur tous les produits sélectionnés.',
    icon: 'percent',
  },
  {
    id: 2,
    titre: 'Livraison Gratuite',
    code: 'FREEDEL',
    description: 'Obtenez la livraison gratuite sur toute commande au-dessus de 50$.',
    icon: 'truck',
  },
  {
    id: 3,
    titre: 'Offre VIP',
    code: 'VIP2025',
    description: 'Réduction exclusive pour membres premium et clients fidèles.',
    icon: 'star',
  },
])

// 40 produits supplémentaires removed


// Computed
const banners = computed(() => promotionsStore.activeBanners)
const featuredProducts = computed(() => productsStore.featuredProducts)
const newProducts = computed(() => productsStore.newProducts)
  const brands = computed(() => productsStore.brands)
  const promotions = computed(() => promotionsStore.activePromotions)
const isLoadingFeatured = computed(() => productsStore.isLoading)

// Carousel Methods
const previousBanner = () => {
  if (banners.value.length > 0) {
    currentBannerIndex.value =
      currentBannerIndex.value === 0 ? banners.value.length - 1 : currentBannerIndex.value - 1
  }
}

const nextBanner = () => {
  if (banners.value.length > 0) {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
  }
}

const goToBanner = (index: number) => {
  if (index >= 0 && index < banners.value.length) {
    currentBannerIndex.value = index
  }
}

// Scroll detection for navbar transparency and scroll-to-top button
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}



// Auto-rotate banners
const rotateBanners = () => {
  if (banners.value.length > 1) {
    bannerInterval = setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
    }, 5000)
  }
}

// Load data
onMounted(async () => {
  try {
    console.log('🏠 Loading home page data...')

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Initial scroll check
    handleScroll()

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          const offset = 160 // Navbar height
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }
    }

    // Add click listeners to anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    // Load all data in parallel
    await Promise.all([
      promotionsStore.loadAllPromotionsData(),
      productsStore.loadFeaturedProducts(),
      productsStore.loadNewProducts(),
      productsStore.loadBrands(),
    ])

    console.log('📊 Home data loaded:')
    console.log('🎯 Banners:', promotionsStore.activeBanners.length)
    console.log('🎁 Promotions:', promotionsStore.activePromotions.length)
    console.log('⭐ Featured Products:', productsStore.featuredProducts.length)
    console.log('🏷️ Brands:', productsStore.brands.length)

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

// Cleanup scroll listener and interval
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
})
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
