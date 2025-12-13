<template>
  <div class="min-h-screen">
    <!-- Hero Section with Banners -->
    <!-- New Banner Section -->
    <!-- Mobile Banner (Blue Card) -->
    <section class="container mx-auto px-4 pt-4 pb-8 md:hidden">
      <div class="relative w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl shadow-xl overflow-hidden h-[200px]">
        <!-- Decorative Elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 opacity-20 rounded-full transform -translate-x-1/3 translate-y-1/3 blur-2xl"></div>

        <!-- Carousel Content -->
        <div class="relative h-full w-full overflow-hidden">
          <div 
            class="flex h-full w-full transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentBannerIndex * 100}%)` }"
          >
            <div
              v-for="(banner, index) in banners"
              :key="banner.id"
              class="min-w-full h-full relative flex items-center justify-between px-6"
            >
              <!-- Text Content (Left) -->
              <div class="z-10 max-w-[60%] flex flex-col items-start space-y-2">
                <h2 class="text-xl font-bold text-white leading-tight">
                  {{ banner.title }}
                </h2>
                <p class="text-xs text-blue-50 line-clamp-2">
                  {{ banner.subtitle }}
                </p>
                
                <router-link
                  :to="banner.link || '/products'"
                  class="mt-1 inline-flex items-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg"
                >
                  <i class="fas fa-shopping-bag mr-2"></i>
                  Shop Now
                </router-link>
              </div>

              <!-- Image (Right) -->
              <div class="relative z-10 h-full w-[40%] flex items-center justify-center">
                <img
                  :src="banner.image"
                  :alt="banner.title"
                  class="max-h-[85%] w-auto object-contain drop-shadow-2xl transform rotate-[-5deg]"
                  @error="console.error('❌ Image failed:', banner.image)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Tab (Fluid Notch) -->
        <div class="absolute bottom-[-1px] left-1/2 transform -translate-x-1/2 flex items-end">
           <!-- Left Curve -->
           <div class="w-3 h-3 bg-transparent rounded-br-[12px] shadow-[3px_3px_0_0_white] mb-[0px]"></div>
           
           <!-- Tab Body -->
           <div class="bg-white rounded-t-[10px] px-3 py-1 shadow-sm flex items-center justify-center space-x-1.5 relative z-10">
              <button
                v-for="(banner, index) in banners"
                :key="index"
                @click="goToBanner(index)"
                class="transition-all duration-300 focus:outline-none p-0.5"
              >
                <div 
                  :class="[ 
                    'rounded-full transition-all duration-500 ease-out', 
                    currentBannerIndex === index ? 'w-1.5 h-1.5 bg-blue-600 scale-125' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400' 
                  ]"
                ></div>
              </button>
           </div>
           
           <!-- Right Curve -->
            <div class="w-3 h-3 bg-transparent rounded-bl-[12px] shadow-[-3px_3px_0_0_white] mb-[0px]"></div>
        </div>
      </div>
    </section>

    <!-- Desktop Banner (Full Screen) -->
    <section class="relative hidden md:block">
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
            />

            <!-- Content -->
            <div class="relative text-center text-white px-4 z-10">
              <h1 class="text-5xl font-bold mb-4">{{ banner.title }}</h1>
              <p class="text-2xl mb-6 opacity-90">{{ banner.subtitle }}</p>
              <div class="flex flex-row gap-4 justify-center">
                <router-link
                  :to="banner.link || '/products'"
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
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Produits Vedettes</h2>
        <p class="text-sm md:text-base text-gray-600">Découvrez nos meilleurs produits sélectionnés pour vous</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingFeatured" class="flex overflow-x-auto pb-6 gap-4 no-scrollbar px-2">
        <div
          v-for="n in 3"
          :key="n"
          class="flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)] md:min-w-[280px] md:w-[280px] lg:min-w-[calc(25%-12px)] lg:w-[calc(25%-12px)] rounded-2xl shadow-xl overflow-hidden bg-white border border-[#EDEDED] animate-pulse"
        >
          <div class="p-2">
            <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div class="w-3/4 mx-auto aspect-square rounded-xl bg-gray-300 mb-2"></div>
            <div class="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Featured Products Horizontal Slide -->
      <div v-else class="relative group px-2">
        <!-- Left Button -->
        <button 
          @click="scrollFeatured('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-left-4"
          aria-label="Previous"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Right Button -->
        <button 
          @click="scrollFeatured('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-right-4"
          aria-label="Next"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <div 
          ref="featuredProductsContainer"
          class="flex overflow-x-auto pb-6 gap-4 no-scrollbar scroll-smooth"
        >
          <div 
            v-for="product in featuredProducts"
            :key="product.id"
            class="flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)] md:min-w-[280px] md:w-[280px] lg:min-w-[calc(25%-12px)] lg:w-[calc(25%-12px)]"
          >
            <ProductCard :product="product" />
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

    <!-- Promotions (Special Offers) -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <div class="text-center mb-6 px-2">
           <div>
             <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Offres Spéciales</h2>
             <p class="text-gray-500 text-sm md:text-base mt-1">Codes promo exclusifs pour vous</p>
           </div>
        </div>

        <div class="flex overflow-x-auto pb-8 gap-5 px-2 no-scrollbar lg:justify-center">
          <div
            v-for="offre in offres"
            :key="offre.id"
            class="relative flex-shrink-0 w-[280px] h-[160px] md:w-[320px] md:h-[180px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
            @click="copyCode(offre.code)"
          >
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:scale-110 transition-transform duration-500"></div>
            
            <!-- Decorative Elements -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div class="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-300 opacity-20 rounded-full blur-xl"></div>

            <!-- Content -->
            <div class="relative h-full p-5 flex flex-col justify-between text-white">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-xl font-bold leading-tight">{{ offre.titre }}</h3>
                  <p class="text-blue-100 text-xs mt-1 line-clamp-2 leading-relaxed opacity-90">{{ offre.description }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/10">
                   <i :class="['fas', 'fa-' + offre.icon, 'text-lg']"></i>
                </div>
              </div>

              <!-- Code Chip -->
              <div class="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-1 pr-4 border border-white/10 mt-2 hover:bg-white/20 transition-colors">
                 <div class="bg-white text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm uppercase tracking-wider">
                   {{ offre.code }}
                 </div>
                 <button class="text-xs font-medium text-blue-50 group-hover:text-white transition-colors flex items-center gap-2">
                   <span class="hidden sm:inline">Copier le code</span>
                   <span class="sm:hidden">Copier</span>
                   <i class="far fa-copy"></i>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marques Populaires -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Marques Populaires</h2>
        <p class="text-sm md:text-base text-gray-600">Retrouvez vos marques préférées</p>
      </div>

      <div class="flex overflow-x-auto pb-8 gap-4 px-2 no-scrollbar">
        <router-link
          v-for="brand in brands"
          :key="brand.id"
          :to="`/products?brand=${brand.id}`"
          class="flex-shrink-0 w-[100px] h-[60px] md:w-[140px] md:h-[80px] group relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105 p-2"
        >
          <div class="w-full h-full flex items-center justify-center grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300">
            <img
              v-if="brand.logo_url"
              :src="brand.logo_url"
              :alt="brand.name"
              class="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="text-lg font-bold text-gray-400 group-hover:text-blue-600">{{ brand.name }}</div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 40 Produits Supplémentaires -->
    <section class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Nouveaux produits</h2>
        <p class="text-sm md:text-base text-gray-600">Découvrez nos dernières arrivées</p>
      </div>

      <div class="product-grid">
        <ProductCard
          v-for="product in newProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>


  </div>

  <!-- Bouton retour en haut flottant -->
  <button
    @click="scrollToTop"
    class="hidden md:block fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
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
import ProductCard from '@/components/products/ProductCard.vue'

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

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
  showNotification(`Code "${code}" copié !`, 'success')
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

const featuredProductsContainer = ref<HTMLElement | null>(null)

const scrollFeatured = (direction: 'left' | 'right') => {
  if (featuredProductsContainer.value) {
    const container = featuredProductsContainer.value
    const scrollAmount = container.clientWidth * 0.75 // Scroll 75% of view width
    const targetScroll = direction === 'left' ? -scrollAmount : scrollAmount
    container.scrollBy({ left: targetScroll, behavior: 'smooth' })
  }
}

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

/* Responsive Product Grid (Same as ProductsView) */
.product-grid {
  display: grid;
  gap: 1rem;
  
  /* Mobile: 2 colonnes */
  grid-template-columns: repeat(2, 1fr);
}

/* Tablet: 3 colonnes */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 4 colonnes */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}
</style>
