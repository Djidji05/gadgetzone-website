<template>


  <!-- Desktop Content (Hidden on Mobile) -->
  <div class="container mx-auto px-4 pt-2 md:pt-8 pb-0">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content -->
      <div class="flex-1 w-full">
        <div class="flex items-center gap-3 mb-8">
          <button @click="router.back()" class="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <i class="fas fa-arrow-left text-gray-600"></i>
          </button>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Rapports & Statistiques</h1>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else>
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Chiffre d'affaires</h3>
                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatPrice(stats.sales) }}</p>
                <p class="text-sm text-green-600 mt-1 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Total cumulé
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Commandes</h3>
                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.orders }}</p>
                <p class="text-sm text-blue-600 mt-1">Commandes uniques</p>
            </div>

            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Produits Actifs</h3>
                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.products }}</p>
                <p class="text-sm text-gray-500 mt-1">Dans votre catalogue</p>
            </div>
          </div>

          <!-- Sales Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Évolution des Ventes</h3>
              <div class="relative h-64 w-full" v-if="stats.chartData && stats.chartData.length > 0">
                  <!-- Simple SVG Area Chart -->
                  <svg viewBox="0 0 100 50" class="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <!-- Gradient definition -->
                      <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
                          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                        </linearGradient>
                      </defs>
                      
                      <!-- Area Path -->
                      <path :d="areaPath" fill="url(#gradient)" stroke="none" />
                      
                      <!-- Line Path -->
                      <path :d="linePath" fill="none" stroke="#2563EB" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />

                      <!-- Points -->
                      <circle 
                        v-for="(point, index) in points" 
                        :key="index"
                        :cx="point.x" 
                        :cy="point.y" 
                        r="0.8" 
                        fill="#2563EB" 
                        class="hover:r-2 transition-all cursor-pointer"
                      >
                        <title>{{ point.date }}: {{ formatPrice(point.amount) }}</title>
                      </circle>
                  </svg>

                  <!-- X Axis Labels (Simplified) -->
                  <div class="flex justify-between mt-2 text-xs text-gray-500">
                      <span>{{ stats.chartData[0]?.date }}</span>
                      <span>{{ stats.chartData[stats.chartData.length - 1]?.date }}</span>
                  </div>
              </div>
              <div v-else class="h-64 flex items-center justify-center text-gray-500 bg-gray-50 border-2 border-dashed border-gray-200 rounded">
                  Pas assez de données pour afficher le graphique
              </div>
          </div>

          <!-- Recent Sales Table (Mini) -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
             <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white">Dernières ventes</h3>
                 <div class="relative w-full sm:w-64">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-search text-gray-400 text-xs"></i>
                    </span>
                    <input 
                      v-model="saleSearch" 
                      type="text" 
                      placeholder="Filtrer les ventes..." 
                      class="block w-full pl-9 pr-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                 </div>
             </div>
             <div class="overflow-x-auto">
                 <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead class="bg-gray-50 dark:bg-gray-900">
                         <tr>
                             <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                             <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                             <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                         </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                         <tr v-for="sale in filteredRecentSales" :key="sale.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                             <td class="px-6 py-4 whitespace-nowrap">
                                 <div class="flex items-center">
                                     <img :src="sale.image || '/placeholder.png'" class="h-10 w-10 rounded-lg object-cover mr-4 bg-gray-100" />
                                     <span class="text-sm font-bold text-gray-900 dark:text-white">{{ sale.productName }}</span>
                                 </div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {{ formatDate(sale.date) }}
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white">
                                 {{ formatPrice(sale.price) }}
                             </td>
                         </tr>
                         <tr v-if="filteredRecentSales.length === 0">
                            <td colspan="3" class="px-12 py-12 text-center">
                                <i class="fas fa-search text-gray-300 text-3xl mb-3"></i>
                                <p class="text-gray-500 text-sm">Aucun résultat trouvé pour votre recherche.</p>
                            </td>
                         </tr>
                     </tbody>
                 </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const saleSearch = ref('');
const stats = ref({
    sales: 0,
    orders: 0,
    products: 0,
    chartData: [] as { date: string, amount: number }[],
    recentSales: [] as any[]
});

const filteredRecentSales = computed(() => {
    if (!saleSearch.value) return stats.value.recentSales || [];
    const query = saleSearch.value.toLowerCase();
    return (stats.value.recentSales || []).filter(sale => 
        sale.productName.toLowerCase().includes(query)
    );
});

const points = computed(() => {
    if (!stats.value.chartData || stats.value.chartData.length === 0) return [];

    const data = stats.value.chartData;
    const maxVal = Math.max(...data.map(d => d.amount)) || 100; // avoid div by 0
    
    // Normalize to 0-100 x, 0-50 y (SVG viewbox)
    // We want some padding on top (e.g. 50 * 0.9)
    const height = 50; 
    const width = 100;

    return data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * width,
        y: height - ((d.amount / maxVal) * height * 0.8), // *0.8 to leave top padding
        amount: d.amount,
        date: d.date
    }));
});

const linePath = computed(() => {
    if (points.value.length === 0) return '';
    const pts = points.value;
    // Simple line: M x1 y1 L x2 y2 ...
    return `M ${pts[0].x} ${pts[0].y} ` + pts.map(p => `L ${p.x} ${p.y}`).join(' ');
});

const areaPath = computed(() => {
    if (points.value.length === 0) return '';
    const pts = points.value;
    const first = pts[0];
    const last = pts[pts.length - 1];
    // Close the path: LinePath -> L right-bottom -> L left-bottom -> Z
    const line = linePath.value;
    return `${line} L ${last.x} 50 L ${first.x} 50 Z`;
});


onMounted(async () => {
    try {
        const res = await api.get('/vendors/me/stats');
        stats.value = res.data;
        
        // Mock data if empty for demonstration (active for demo)
        if (!stats.value.chartData || stats.value.chartData.length === 0) {
           const today = new Date();
           stats.value.chartData = Array.from({length: 7}, (_, i) => {
               const d = new Date();
               d.setDate(today.getDate() - (6 - i));
               return {
                   date: d.toISOString().split('T')[0],
                   amount: Math.floor(Math.random() * 5000) + 1000
               };
           });
        }
    } catch (e) {
        console.error("Failed to load stats", e);
    } finally {
        loading.value = false;
    }
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};
</script>
