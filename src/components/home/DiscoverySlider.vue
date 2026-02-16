<template>
  <section class="discovery-slider-section py-6 md:py-8">
    <div class="container mx-auto px-4">
      <div v-if="sectionTitle || sectionSubtitle" class="mb-5 px-1">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">{{ sectionTitle }}</h2>
            <p v-if="sectionSubtitle" class="text-gray-500 text-sm mt-1">{{ sectionSubtitle }}</p>
          </div>
          <router-link v-if="sectionLink" :to="sectionLink" class="text-blue-600 text-sm font-bold hover:underline">
            {{ sectionLinkText || 'Voir tout' }}
          </router-link>
        </div>
      </div>

      <div class="relative group">
        <!-- Navigation Buttons (Desktop only) -->
        <button 
          v-if="layout === 'slider'"
          @click="scroll('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -left-2 md:-left-5 pointer-events-auto"
          aria-label="Scroll left"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button 
          v-if="layout === 'slider'"
          @click="scroll('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -right-2 md:-right-5 pointer-events-auto"
          aria-label="Scroll right"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <div 
          ref="scrollContainer"
          :class="[
            layout === 'slider' 
              ? 'flex overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth' 
              : 'flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0'
          ]"
        >
          <!-- Loop through discovery cards -->
          <div 
            v-for="card in cards" 
            :key="card.id"
            :class="[
              'bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300',
              layout === 'slider'
                ? 'flex-shrink-0 w-[240px] sm:w-[280px] md:w-[350px] lg:w-[380px] snap-center first:ml-4 last:mr-4'
                : 'flex-shrink-0 w-[240px] sm:w-[280px] snap-center md:w-full md:flex-shrink-1'
            ]"
          >
            <!-- Grid Card Type -->
            <template v-if="getCardType(card) === 'grid'">
              <div class="p-5 flex flex-col h-full">
                <h3 class="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{{ card.title }}</h3>
                
                <div 
                  class="grid gap-3 mb-4 flex-1"
                  :class="card.cols === 3 ? 'grid-cols-3' : 'grid-cols-2'"
                >
                  <div 
                    v-for="item in (card.items || [])" 
                    :key="item.name"
                    class="group cursor-pointer"
                    @click="navigateTo(item.link || '#')"
                  >
                    <div class="aspect-square bg-white rounded-2xl p-2 mb-2 flex items-center justify-center border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all overflow-hidden">
                      <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                      <div v-else class="text-gray-300"><i class="fas fa-image text-2xl"></i></div>
                    </div>
                    <p class="text-[10px] md:text-xs font-semibold text-gray-700 truncate mb-0.5">{{ item.name }}</p>
                    <p v-if="item.subtext" class="text-[9px] md:text-[10px] text-gray-500">{{ item.subtext }}</p>
                  </div>
                </div>
                
                <router-link v-if="card.link" :to="card.link" class="text-blue-600 text-sm font-bold hover:underline inline-flex items-center gap-1 mt-2">
                  {{ card.linkText || 'Voir plus' }} <i class="fas fa-chevron-right text-[10px]"></i>
                </router-link>
              </div>
            </template>

            <!-- Promo/Banner Card Type -->
            <template v-else>
              <div class="p-5 flex flex-col h-full bg-white relative">
                <!-- Header -->
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-900 line-clamp-1">{{ card.title }}</h3>
                  <p v-if="card.subtitle" class="text-xs text-gray-500 mt-1">{{ card.subtitle }}</p>
                </div>

                <!-- Content (Image) -->
                <div 
                  class="flex-1 min-h-[160px] md:min-h-[200px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-colors mb-4"
                  :style="card.promoStyle === 'color' ? { backgroundColor: card.backgroundColor || '#2563eb' } : { backgroundColor: '#f3f4f6' }"
                  @click="navigateTo(card.link || '#')"
                >
                    <!-- Background Image -->
                    <img v-if="card.promoStyle !== 'color' && card.image" :src="card.image" class="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105">
                    
                    <!-- Overlay Content inside image -->
                    <div class="relative z-10 flex flex-col items-center justify-center h-full w-full p-4">
                      <h3 
                          class="mb-2 drop-shadow-md"
                          :class="[
                              card.promoStyle === 'color' ? 'text-white' : 'text-white',
                              card.promoTextSize || 'text-2xl',
                              card.promoTextWeight || 'font-bold'
                          ]"
                          :style="{ color: card.promoTextColor }"
                      >
                        {{ card.promoText }}
                      </h3>
                    </div>

                    <!-- Dark overlay -->
                    <div v-if="card.promoStyle !== 'color' && card.image" class="absolute inset-0 bg-black/30 z-0"></div>
                </div>

                 <!-- Footer -->
                <router-link v-if="card.linkText || card.link" :to="card.link || '#'" class="text-blue-600 text-sm font-bold hover:underline inline-flex items-center gap-1 mt-2">
                  {{ card.linkText || 'Voir plus' }} <i class="fas fa-chevron-right text-[10px]"></i>
                </router-link>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface DiscoveryItem {
  name?: string;
  image?: string;
  link?: string;
  subtext?: string;
}

interface DiscoveryCard {
  id: number | string;
  type: 'grid' | 'banner' | 'promo';
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  linkText?: string;
  seeMoreLink?: string;
  seeMoreText?: string;
  bannerActionText?: string;
  cols?: number; // 2 or 3
  items?: DiscoveryItem[];
  // Promo specific
  promoText?: string;
  promoStyle?: 'image' | 'color';
  backgroundColor?: string;
  promoTextSize?: string;
  promoTextWeight?: string;
  promoTextColor?: string;
}

const props = withDefaults(defineProps<{
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionLink?: string;
  sectionLinkText?: string;
  cards: DiscoveryCard[];
  layout?: 'slider' | 'grid';
}>(), {
  layout: 'slider'
});

const router = useRouter();
const scrollContainer = ref<HTMLElement | null>(null);

const scroll = (direction: 'left' | 'right') => {
  if (scrollContainer.value) {
    const amount = scrollContainer.value.clientWidth * 0.8
    scrollContainer.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }
}

console.log('DiscoverySlider cards:', props.cards);

const getCardType = (card: DiscoveryCard): string => {
  if (card.type && card.type.toLowerCase() === 'grid') return 'grid';
  if (card.type && (card.type.toLowerCase() === 'promo' || card.type.toLowerCase() === 'banner')) return 'promo';
  
  // Fallback if type is missing or unknown
  if (card.items && card.items.length > 0 && !card.image) return 'grid'; // Grid usually has items and no main background image
  return 'promo'; // Default to promo for visual safety
};

const navigateTo = (link: string) => {
  if (link && link !== '#') {
    router.push(link);
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
