<template>
  <div v-if="activeBanners.length > 0" class="ad-banners-slider relative group max-w-7xl mx-auto px-4 my-8 sm:my-12 overflow-hidden">
    <!-- Section Title (Shared for the slider) -->
    <div v-if="activeBanners[currentIndex]?.title" class="text-center mb-6 md:mb-8 transition-opacity duration-300" :key="currentIndex">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">{{ activeBanners[currentIndex].title }}</h2>
    </div>

    <!-- Slider Track -->
    <div class="relative overflow-hidden rounded-2xl shadow-sm">
      <div 
        class="flex transition-transform duration-500 ease-out" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(banner, index) in activeBanners" 
          :key="index" 
          class="w-full flex-shrink-0"
        >
          <router-link 
            v-if="banner.link" 
            :to="banner.link" 
            class="block group/item transition-all"
          >
            <img 
              :src="banner.image" 
              class="w-full h-auto object-cover transform group-hover/item:scale-[1.01] transition-transform duration-700 shadow-sm"
              :alt="banner.title || 'Promotion'"
            >
          </router-link>
          <div v-else>
              <img 
                  :src="banner.image" 
                  class="w-full h-auto object-cover shadow-sm"
                  :alt="banner.title || 'Promotion'"
              >
          </div>
        </div>
      </div>

      <!-- Navigation Arrows (Shown on hover) -->
      <template v-if="activeBanners.length > 1">
        <button 
          @click="prevSlide" 
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10 shadow-sm"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          @click="nextSlide" 
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10 shadow-sm"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Indicators -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <button 
            v-for="(_, index) in activeBanners" 
            :key="index"
            @click="currentIndex = index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300'"
          ></button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePersonalizationStore } from '@/stores/personalization';
import { storeToRefs } from 'pinia';

const { adsConfig } = storeToRefs(usePersonalizationStore());
const currentIndex = ref(0);
let intervalId: number | null = null;

const activeBanners = computed(() => {
  const banners = adsConfig.value?.interBanners || [];
  // Also check old single banner format for compatibility
  const single = adsConfig.value?.interBanner;
  
  let list = banners;
  if (list.length === 0 && single) {
    list = [single];
  }

  const now = new Date();
  return list.filter((b: any) => {
    if (!b.isActive || !b.image) return false;
    
    if (b.startDate) {
      if (now < new Date(b.startDate)) return false;
    }
    if (b.endDate) {
      const end = new Date(b.endDate);
      end.setHours(23, 59, 59, 999);
      if (now > end) return false;
    }
    return true;
  });
});

const nextSlide = () => {
  if (activeBanners.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length;
};

const prevSlide = () => {
  if (activeBanners.value.length <= 1) return;
  currentIndex.value = currentIndex.value === 0 
    ? activeBanners.value.length - 1 
    : currentIndex.value - 1;
};

const startAutoSlide = () => {
  stopAutoSlide();
  if (activeBanners.value.length > 1) {
    const interval = (adsConfig.value?.sliderInterval || 6) * 1000;
    intervalId = setInterval(nextSlide, interval);
  }
};

const stopAutoSlide = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>

<style scoped>
.ad-banners-slider img {
  min-height: 120px;
  max-height: 450px;
}

@media (max-width: 640px) {
  .ad-banners-slider img {
    min-height: 80px;
    max-height: 250px;
  }
}
</style>
