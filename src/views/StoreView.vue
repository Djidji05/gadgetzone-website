<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsService, type Product, type Store } from '@/services/products';
import { useUiStore } from '@/stores/ui';
import ProductCard from '@/components/products/ProductCard.vue';

const route = useRoute();
const router = useRouter();

const store = ref<Store | null>(null);
const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const selectedCategory = ref<string | null>(null);
const showOnlyPromos = ref(false);
const uiStore = useUiStore();

const isFollowing = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');

const storeId = computed(() => route.params.id as string);

// Derive categories from the actual products in the store
const categories = computed(() => {
    const cats: Record<string, number> = {};
    products.value.forEach(p => {
        if (p.category) {
            cats[p.category] = (cats[p.category] || 0) + 1;
        }
    });

    // Special case for Natcash/Moncash items that might not have categories set correctly in data
    // but we'll trust the categorical data for now.
    
    return Object.entries(cats).map(([name, count]) => ({ name, count }));
});

const promoCount = computed(() => {
    return products.value.filter(p => p.original_price && Number(p.original_price) > Number(p.price)).length;
});

const filteredProducts = computed(() => {
    let result = products.value;
    
    if (selectedCategory.value) {
        result = result.filter(p => p.category === selectedCategory.value);
    }
    
    if (showOnlyPromos.value) {
        result = result.filter(p => p.original_price && Number(p.original_price) > Number(p.price));
    }
    
    return result;
});

const fetchStoreData = async () => {
    if (!storeId.value || storeId.value === 'undefined') {
        error.value = "Identifiant de boutique invalide.";
        loading.value = false;
        return;
    }
    try {
        loading.value = true;
        error.value = null;
        
        const [storeRes, productsRes] = await Promise.all([
            productsService.getVendor(storeId.value),
            productsService.getProducts({ vendor: storeId.value, limit: 100 })
        ]);
        
        store.value = storeRes;
        products.value = productsRes.products || productsRes || [];
        
        if (store.value) {
            document.title = `${store.value.name} - Boutique GadgetZone`;
        }
    } catch (e: any) {
        console.error("Error fetching store data", e);
        error.value = "Impossible de charger la boutique. Veuillez réessayer plus tard.";
    } finally {
        loading.value = false;
    }
};

const toggleFollow = () => {
    isFollowing.value = !isFollowing.value;
    const message = isFollowing.value 
        ? `Vous suivez maintenant la boutique ${store.value?.name}` 
        : `Vous ne suivez plus la boutique ${store.value?.name}`;
    uiStore.showToast(message, 'success');
};

const handleShare = async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: store.value?.name || 'Boutique GadgetZone',
                text: store.value?.description || 'Découvrez cette boutique sur GadgetZone !',
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            uiStore.showToast('Lien de la boutique copié dans le presse-papier !', 'info');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
};

onMounted(() => {
    fetchStoreData();
});

watch(() => route.params.id, () => {
    if (route.name === 'store-view') {
        fetchStoreData();
        selectedCategory.value = null;
        showOnlyPromos.value = false;
    }
});
</script>

<template>
    <div class="bg-gray-50 min-h-screen pb-20">
        <!-- Store Header -->
        <div class="bg-white border-b border-gray-100 shadow-sm mb-8 overflow-hidden">
            <!-- Banner Placeholder or Actual Banner -->
            <div class="h-40 md:h-64 bg-gradient-to-r from-blue-600 to-blue-900 relative">
                <div v-if="store?.bannerUrl" class="absolute inset-0">
                    <img :src="store.bannerUrl" class="w-full h-full object-cover opacity-50" />
                </div>
                <!-- Glassmorphism overlay for depth -->
                <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <div class="container mx-auto px-6 relative">
                <div class="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 pb-8 gap-4 md:gap-8 text-center md:text-left">
                    <!-- Store Logo -->
                    <div class="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden z-10 transition-transform hover:scale-105 duration-300">
                        <img v-if="store?.logoUrl" :src="store.logoUrl" class="w-full h-full object-cover" />
                        <i v-else class="fas fa-store text-5xl text-gray-100"></i>
                    </div>
                    
                    <div class="flex-1 mb-2">
                        <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{{ store?.name || 'Boutique' }}</h1>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                                <i class="fas fa-check-circle mr-1.5 opacity-70"></i>
                                Vendeur Vérifié
                            </span>
                        </div>
                        <p v-if="store?.description" class="text-gray-500 max-w-2xl text-sm md:text-base leading-relaxed px-4 md:px-0">
                            {{ store.description }}
                        </p>
                    </div>
                    
                    <div class="flex gap-3 md:mb-2">
                        <button 
                            @click="toggleFollow"
                            :class="isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white shadow-blue-200'"
                            class="px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
                        >
                            {{ isFollowing ? 'Suivi' : 'Suivre' }}
                        </button>
                        <button 
                            @click="handleShare"
                            class="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Sidebar Filters (Simplified) -->
                <div class="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-gray-900 flex items-center gap-2">
                                <i class="fas fa-filter text-blue-600 text-sm"></i>
                                Filtrer Boutique
                            </h3>
                            <button v-if="selectedCategory || showOnlyPromos" @click="selectedCategory = null; showOnlyPromos = false" class="text-[10px] font-bold text-red-500 uppercase">Effacer</button>
                        </div>
                        <div class="space-y-1">
                            <div 
                                @click="selectedCategory = null"
                                class="flex justify-between items-center py-2 px-3 rounded-xl cursor-pointer transition-colors"
                                :class="!selectedCategory ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                            >
                                <span class="text-sm">Tous les produits</span>
                                <span class="text-[10px] font-bold opacity-70">{{ products.length }}</span>
                            </div>

                            <div 
                                v-for="cat in categories" 
                                :key="cat.name"
                                @click="selectedCategory = cat.name"
                                class="flex justify-between items-center py-2 px-3 rounded-xl cursor-pointer transition-colors"
                                :class="selectedCategory === cat.name ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                            >
                                <span class="text-sm">{{ cat.name }}</span>
                                <span class="text-[10px] font-bold opacity-70">{{ cat.count }}</span>
                            </div>

                            <hr v-if="categories.length > 0" class="my-3 border-gray-50" />

                            <div 
                                @click="showOnlyPromos = !showOnlyPromos"
                                class="flex justify-between items-center py-2 px-3 rounded-xl cursor-pointer transition-colors"
                                :class="showOnlyPromos ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600 hover:bg-gray-50'"
                            >
                                <span class="text-sm">En Promotion</span>
                                <span class="text-[10px] font-bold opacity-70">{{ promoCount }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stats Card -->
                    <div class="bg-blue-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                        <h3 class="font-bold text-blue-100 mb-4 opacity-80 text-xs uppercase tracking-widest">Performances</h3>
                        <div class="space-y-4 relative z-10">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <i class="fas fa-star text-yellow-400 text-xs"></i>
                                </div>
                                <div>
                                    <p class="text-lg font-black">{{ store?.averageRating || '4.8' }}/5.0</p>
                                    <p class="text-[9px] text-blue-200 uppercase font-bold tracking-tight">Note Moyenne</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <i class="fas fa-shipping-fast text-green-400 text-xs"></i>
                                </div>
                                <div>
                                    <p class="text-lg font-black">{{ store?.shippingSpeed || '95' }}%</p>
                                    <p class="text-[9px] text-blue-200 uppercase font-bold tracking-tight">Expédition Rapide</p>
                                </div>
                            </div>
                        </div>
                        <i class="fas fa-chart-line absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="flex-1">
                    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        <div v-for="i in 8" :key="i" class="h-72 bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100"></div>
                    </div>

                    <div v-else-if="error" class="bg-white p-12 rounded-3xl border border-red-50 text-center shadow-sm">
                        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 text-xl">{{ error }}</h4>
                        <button @click="fetchStoreData" class="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                            Réessayer
                        </button>
                    </div>

                    <div v-else-if="products.length === 0" class="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
                        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-box-open text-gray-200 text-4xl"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 text-2xl">Boutique vide</h4>
                        <p class="text-gray-500 mt-2 max-w-sm mx-auto">Ce vendeur n'a pas encore ajouté de produits dans sa boutique publique.</p>
                    </div>

                    <div v-else>
                        <div class="flex justify-between items-center mb-8 px-2">
                            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Tous nos produits</h2>
                            <div class="flex items-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                                <button 
                                    @click="viewMode = 'grid'"
                                    :class="viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-300 hover:text-gray-400'"
                                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                >
                                    <i class="fas fa-th-large"></i>
                                </button>
                                <button 
                                    @click="viewMode = 'list'"
                                    :class="viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-300 hover:text-gray-400'"
                                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                >
                                    <i class="fas fa-list"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div 
                            :class="[
                                viewMode === 'grid' 
                                    ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
                                    : 'flex flex-col gap-4'
                            ]"
                        >
                            <ProductCard 
                                v-for="product in filteredProducts" 
                                :key="product.id" 
                                :product="product" 
                                :view-mode="viewMode"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1400px;
}
</style>
