 <template>
  <div class="container mx-auto px-4 pt-2 md:pt-8 pb-0">
    <!-- MOBILE DASHBOARD (Site Theme) -->
    <div class="md:hidden bg-gray-50 min-h-screen pb-0 -mx-4 -mt-2">
        <!-- Top Navy Blue Section -->
        <div class="bg-blue-900 text-white px-6 pt-8 pb-8 rounded-b-[2.5rem] relative z-10 shadow-lg shadow-blue-900/20">
            <!-- Header Row -->
            <div class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden ring-2 ring-white/10 bg-white/10 flex items-center justify-center">
                         <img v-if="store.logoUrl" :src="store.logoUrl" class="w-full h-full object-cover" />
                         <i v-else class="fas fa-store text-blue-200"></i>
                    </div>
                    <div>
                        <p class="text-xs text-blue-100 font-medium">Bon retour,</p>
                        <h2 class="font-bold text-lg leading-tight transition-all">{{ store.name || authStore.customer?.firstName || 'Vendeur' }}</h2>
                    </div>
                </div>
                <!-- Notification Bell -->
                <button 
                    @click="router.push('/seller/notifications')"
                    class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center relative hover:bg-white/20 transition-colors"
                >
                    <i class="fas fa-bell text-sm"></i>
                    <span v-if="notificationsStore.unreadCount > 0" class="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-blue-900"></span>
                </button>
            </div>

            <!-- Balance Section -->
            <div class="text-center mb-8">
                <p class="text-xs text-blue-100 mb-2 font-medium">Votre Solde (HTG)</p>
                <h1 class="text-4xl font-bold mb-6 tracking-tight text-white">{{ formatPrice(stats.sales).replace('HTG', '').replace('G', '').trim() }} G</h1>
                
                <div class="flex justify-center gap-4">
                    <button class="bg-white text-blue-900 font-bold px-8 py-3 rounded-2xl text-sm hover:bg-blue-50 transition-colors w-32 shadow-xl shadow-black/10">
                        Retrait
                    </button>
                    <button class="bg-blue-800 text-white border border-blue-700/50 font-bold px-8 py-3 rounded-2xl text-sm hover:bg-blue-700 transition-colors w-32 shadow-lg shadow-black/10">
                        Envoyer
                    </button>
                </div>
            </div>

            <!-- Wallet Tabs (Mock) -->
            <div class="bg-blue-950/50 p-1.5 rounded-2xl inline-flex gap-1 w-full max-w-sm mx-auto block backdrop-blur-sm border border-white/5">
                <button class="flex-1 py-2 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-sm">HTG</button>
                <button class="flex-1 py-2 rounded-xl text-blue-200 font-medium text-xs hover:bg-white/10 transition-colors">USD</button>
                <button class="flex-1 py-2 rounded-xl text-blue-200 font-medium text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
                    <i class="fas fa-plus text-[10px]"></i> Add
                </button>
            </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="px-6 py-8">
            <div class="flex justify-between gap-2 px-2">
                <button @click="navigateToAddProduct" class="flex flex-col items-center gap-3 group">
                    <div class="w-14 h-14 rounded-full bg-white text-blue-900 shadow-sm flex items-center justify-center text-xl group-active:scale-95 transition-transform border border-gray-100 ring-1 ring-gray-50 group-hover:ring-blue-100 group-hover:bg-blue-50">
                        <i class="fas fa-plus"></i>
                    </div>
                    <span class="text-xs font-medium text-gray-600 group-hover:text-blue-900">Ajouter</span>
                </button>
                <button @click="router.push('/seller/orders')" class="flex flex-col items-center gap-3 group">
                    <div class="w-14 h-14 rounded-full bg-white text-orange-600 shadow-sm flex items-center justify-center text-xl group-active:scale-95 transition-transform border border-gray-100 ring-1 ring-gray-50 group-hover:ring-orange-100 group-hover:bg-orange-50">
                        <i class="fas fa-box"></i>
                    </div>
                    <span class="text-xs font-medium text-gray-600 group-hover:text-orange-700">Ordres</span>
                </button>
                <button @click="router.push('/seller/products')" class="flex flex-col items-center gap-3 group">
                    <div class="w-14 h-14 rounded-full bg-white text-teal-600 shadow-sm flex items-center justify-center text-xl group-active:scale-95 transition-transform border border-gray-100 ring-1 ring-gray-50 group-hover:ring-teal-100 group-hover:bg-teal-50">
                        <i class="fas fa-list"></i>
                    </div>
                    <span class="text-xs font-medium text-gray-600 group-hover:text-teal-700">Produits</span>
                </button>
                <button @click="router.push('/seller/settings')" class="flex flex-col items-center gap-3 group">
                    <div class="w-14 h-14 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center text-xl group-active:scale-95 transition-transform border border-gray-100 ring-1 ring-gray-50 group-hover:ring-purple-100 group-hover:bg-purple-50">
                        <i class="fas fa-cog"></i>
                    </div>
                    <span class="text-xs font-medium text-gray-600 group-hover:text-purple-700">Gérer</span>
                </button>
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="px-6 pb-20">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg text-gray-900">Transactions Récentes</h3>
                <button @click="router.push('/seller/orders')" class="text-blue-900 text-sm font-bold hover:underline bg-blue-50 px-3 py-1 rounded-full">Tout voir</button>
            </div>

            <div class="space-y-4">
                 <div v-for="order in recentOrders" :key="order.id" class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100">
                     <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-900">
                         <i class="fas fa-shopping-bag"></i>
                     </div>
                     <div class="flex-1">
                         <h4 class="font-bold text-gray-900 text-sm line-clamp-1">{{ order.items[0]?.product?.name || 'Commande Client' }}</h4>
                         <p class="text-xs text-gray-500">Commande #{{ order.order_number }}</p>
                     </div>
                     <div class="text-right">
                         <div class="font-bold text-gray-900 text-sm">
                            +{{ formatPrice(order.items.reduce((acc: any, i: any) => acc + (i.price * i.quantity), 0)).replace('HTG', '').trim() }}
                         </div>
                         <div class="text-[10px] text-gray-400 mt-0.5">{{ new Date(order.created_at).toLocaleDateString() }}</div>
                     </div>
                </div>
                 <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div class="mb-2"><i class="fas fa-history text-2xl text-gray-300"></i></div>
                    Aucune transaction récente.
                </div>
            </div>
        </div>
    </div>


    <div class="hidden md:flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content -->
      <div class="flex-1 w-full relative">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <!-- Card 1: Orders -->
            <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
               <div class="relative z-10">
                   <div class="text-gray-500 text-sm font-medium mb-2">Commandes du jour</div>
                   <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.todayOrders || 0 }}</div>
                   <div class="flex items-center mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                       <i class="fas fa-arrow-up mr-1"></i> 12% vs hier
                   </div>
               </div>
               <div class="absolute right-4 top-4 p-3 bg-yellow-100 rounded-full text-yellow-600 md:group-hover:scale-110 transition-transform">
                   <i class="fas fa-cube text-xl"></i>
               </div>
            </div>

            <!-- Card 2: Sales -->
            <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
               <div class="relative z-10">
                   <div class="text-gray-500 text-sm font-medium mb-2">Ventes du jour</div>
                   <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatPrice(stats.todaySales || 0) }}</div>
                   <div class="flex items-center mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                       <i class="fas fa-arrow-up mr-1"></i> 8.5% vs hier
                   </div>
               </div>
               <div class="absolute right-4 top-4 p-3 bg-green-100 rounded-full text-green-600 md:group-hover:scale-110 transition-transform">
                   <i class="fas fa-chart-line text-xl"></i>
               </div>
            </div>

            <!-- Card 3: Balance -->
            <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
               <div class="relative z-10">
                   <div class="text-gray-500 text-sm font-medium mb-2">Solde Total</div>
                   <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatPrice(stats.sales) }}</div>
                   <div class="text-xs text-gray-400 mt-2">Disponible pour virement</div>
               </div>
               <div class="absolute right-4 top-4 p-3 bg-blue-100 rounded-full text-blue-600 md:group-hover:scale-110 transition-transform">
                   <i class="fas fa-wallet text-xl"></i>
               </div>
            </div>

            <!-- Card 4: Returns -->
            <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
               <div class="relative z-10">
                   <div class="text-gray-500 text-sm font-medium mb-2">Retours & Remboursements</div>
                   <div class="text-3xl font-bold text-gray-900 dark:text-white">0</div>
                   <div class="text-xs text-gray-400 mt-2">Derniers 30 jours</div>
               </div>
               <div class="absolute right-4 top-4 p-3 bg-red-100 rounded-full text-red-600 md:group-hover:scale-110 transition-transform">
                   <i class="fas fa-undo text-xl"></i>
               </div>
            </div>
        </div>

        <!-- Middle Row: Chart & Widgets (Desktop Only) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Sales Chart (Span 2) -->
            <div class="lg:col-span-2 bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Détails des Ventes</h3>
                    <select class="text-xs border-gray-200 rounded-lg bg-gray-50">
                        <option>7 derniers jours</option>
                        <option>30 derniers jours</option>
                    </select>
                </div>
                <div class="relative h-64 w-full">
                  <svg viewBox="0 0 100 50" class="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
                          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                        </linearGradient>
                      </defs>
                      <path :d="areaPath" fill="url(#gradient)" stroke="none" />
                      <path :d="linePath" fill="none" stroke="#2563EB" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
                      <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="0.8" fill="#2563EB" />
                  </svg>
                   <!-- Axis Labels -->
                   <div class="flex justify-between mt-2 text-xs text-gray-400">
                       <span v-for="(point, i) in points" :key="'label-'+i" v-show="i % 2 === 0">{{ point.date }}</span>
                   </div>
                </div>
            </div>

            <!-- Widgets Column (Span 1) -->
            <div class="grid grid-cols-2 gap-4">
                <!-- Widget 1: Market Place -->
                <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
                    <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="text-xl font-bold">1</div>
                    <div class="text-xs text-gray-500">Marché Actif</div>
                </div>
                 <!-- Widget 2: Messages -->
                 <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="text-xl font-bold">0</div>
                    <div class="text-xs text-gray-500">Messages</div>
                </div>
                 <!-- Widget 3: Buy Box -->
                 <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
                    <div class="text-sm font-medium text-gray-500 mb-1">Buy Box Wins</div>
                    <div class="text-xl font-bold text-gray-900 dark:text-white">80%</div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div class="bg-yellow-400 h-1.5 rounded-full" style="width: 80%"></div>
                    </div>
                </div>
                 <!-- Widget 4: Feedback -->
                 <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
                    <div class="text-sm font-medium text-gray-500 mb-1">Avis Clients</div>
                    <div class="text-xl font-bold text-yellow-500">4.8 <i class="fas fa-star text-xs"></i></div>
                    <div class="text-xs text-gray-400">(12 avis)</div>
                </div>
            </div>
        </div>

        <!-- Bottom Row: Orders Table & Out of Stock (Desktop Only) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Recent Orders (Span 2) -->
            <div class="lg:col-span-2 bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Détails des Commandes</h3>
                    <router-link to="/seller/orders" class="text-sm text-blue-600 hover:underline">Voir tout</router-link>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                            <tr>
                                <th class="pb-3 font-medium">ID Commande</th>
                                <th class="pb-3 font-medium">Produit</th>
                                <th class="pb-3 font-medium">Qté</th>
                                <th class="pb-3 font-medium">Date</th>
                                <th class="pb-3 font-medium text-right">Statut</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
                                <td class="py-3 font-mono text-xs text-gray-500">#{{ order.order_number || order.id }}</td>
                                <td class="py-3">
                                    <div class="flex items-center gap-2">
                                        <img :src="order.items[0]?.product?.image_url || '/placeholder.png'" class="w-8 h-8 rounded bg-gray-100 object-cover"/>
                                        <span class="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{{ order.items[0]?.product?.name }}</span>
                                        <span v-if="order.items.length > 1" class="text-xs text-gray-400">+{{ order.items.length - 1 }}</span>
                                    </div>
                                </td>
                                <td class="py-3 text-gray-600">01</td> <!-- Mock qty per order logic usually sums items -->
                                <td class="py-3 text-gray-500 text-xs">{{ formatDate(order.created_at) }}</td>
                                <td class="py-3 text-right">
                                    <span :class="{
                                        'bg-yellow-100 text-yellow-700': order.status === 'pending',
                                        'bg-green-100 text-green-700': order.status === 'completed' || order.status === 'delivered',
                                        'bg-blue-100 text-blue-700': order.status === 'shipped',
                                        'bg-red-100 text-red-700': order.status === 'cancelled'
                                    }" class="px-2.5 py-1 rounded-full text-xs font-bold">
                                        {{ order.status }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="recentOrders.length === 0">
                                <td colspan="5" class="py-8 text-center text-gray-400">Aucune commande récente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Out of Stock (Span 1) -->
            <div class="bg-transparent md:bg-white dark:bg-transparent md:dark:bg-gray-800 rounded-xl shadow-none md:shadow p-6 flex flex-col">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rupture de Stock</h3>
                     <div class="flex code-nav-buttons">
                         <!-- Simple arrows -->
                         <button @click="prevStockItem" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><i class="fas fa-chevron-left text-xs"></i></button>
                         <button @click="nextStockItem" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 ml-1"><i class="fas fa-chevron-right text-xs"></i></button>
                    </div>
                </div>
                
                <div v-if="lowStockProducts.length > 0" class="flex-1 flex flex-col items-center justify-center text-center p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                     <div class="relative w-24 h-24 mb-4">
                        <img :src="currentStockItem.image_url || '/placeholder.png'" class="w-full h-full object-cover rounded-xl shadow-sm bg-white p-2" />
                        <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{{ currentStockItem.stock }} left</span>
                     </div>
                     <h4 class="font-bold text-gray-900 mb-1 line-clamp-1">{{ currentStockItem.name }}</h4>
                     <p class="text-red-500 font-bold text-lg mb-2">{{ formatPrice(currentStockItem.price) }}</p>
                     <button @click="router.push('/seller/products')" class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                         Gérer le stock
                     </button>
                </div>
                <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <i class="fas fa-check-circle text-4xl text-green-100 mb-2"></i>
                    <p>Stock sain</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useNotificationsStore } from '@/stores/notifications';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import SellerMobileHeader from '@/components/layout/SellerMobileHeader.vue';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();

const loading = ref(false);
const products = ref<any[]>([]);
const recentOrders = ref<any[]>([]);
const store = ref<any>({});
const stats = reactive({
    sales: 0,
    orders: 0,
    products: 0,
    todaySales: 0,
    todayOrders: 0,
    chartData: [] as { date: string, amount: number }[]
});

const productSearch = ref('');
const productSearchTimeout = ref<any>(null);
const productPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
});

const lowStockProducts = computed(() => {
    return products.value.filter(p => p.stock < 5);
});

const currentStockIndex = ref(0);
const currentStockItem = computed(() => {
    if (lowStockProducts.value.length === 0) return {};
    return lowStockProducts.value[currentStockIndex.value] || lowStockProducts.value[0];
});

const nextStockItem = () => {
    if (currentStockIndex.value < lowStockProducts.value.length - 1) {
        currentStockIndex.value++;
    } else {
        currentStockIndex.value = 0;
    }
};

const prevStockItem = () => {
    if (currentStockIndex.value > 0) {
        currentStockIndex.value--;
    } else {
        currentStockIndex.value = lowStockProducts.value.length - 1;
    }
};

// Chart Logic
const points = computed(() => {
    if (!stats.chartData || stats.chartData.length === 0) return [];

    const data = stats.chartData;
    const maxVal = Math.max(...data.map(d => d.amount)) || 100; // avoid div by 0
    
    // Normalize to 0-100 x, 0-50 y (SVG viewbox)
    // We want some padding on top (e.g. 50 * 0.9)
    const height = 50; 
    const width = 100;

    return data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * width,
        y: height - ((d.amount / maxVal) * height * 0.8), // *0.8 to leave top padding
        amount: d.amount,
        date: new Date(d.date).getDate() + '/' + (new Date(d.date).getMonth() + 1)
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


const fetchData = async () => {
    loading.value = true;
    try {
        // Fetch store info
        const storeRes = await api.get('/vendors/me');
        Object.assign(store.value, storeRes.data);

        const statsRes = await api.get('/vendors/me/stats');
        Object.assign(stats, statsRes.data);
        
        // Mock chart data if not present (simulate forecast/trend)
        if(!stats.chartData || stats.chartData.length === 0) {
           const today = new Date();
           stats.chartData = Array.from({length: 15}, (_, i) => {
               const d = new Date();
               d.setDate(today.getDate() - (14 - i));
               return {
                   date: d.toISOString().split('T')[0],
                   amount: Math.floor(Math.random() * 5000) + 1000
               };
           });
        }

        // Mock today's stats for demo (since backend might not return them yet)
        if(!stats.todaySales) stats.todaySales = Math.floor(stats.sales / 30);
        if(!stats.todayOrders) stats.todayOrders = Math.floor(stats.orders / 30);

        // Fetch products (all, to check low stock)
        await fetchProducts();
        
        // Fetch recent orders
        await fetchRecentOrders();
        
    } catch (e) {
        console.error("Error fetching dashboard data", e);
    } finally {
        loading.value = false;
    }
};

const fetchRecentOrders = async () => {
    try {
        const res = await api.get('/vendors/me/orders', { params: { limit: 5 }});
        recentOrders.value = res.data.orders || [];
    } catch (e) {
        console.error("Error fetching recent orders", e);
    }
}


const fetchProducts = async (page = 1) => {
    try {
        const productsRes = await api.get('/vendors/me/products', {
            params: {
                page,
                limit: 10,
                search: productSearch.value || undefined
            }
        });
        
        if (productsRes.data.products) {
            products.value = productsRes.data.products;
            productPagination.value = productsRes.data.pagination;
        } else {
            // Fallback for older API or direct array return
            products.value = productsRes.data;
        }
    } catch (e) {
        console.error("Error fetching products", e);
    }
};

const handleProductSearch = () => {
    if (productSearchTimeout.value) clearTimeout(productSearchTimeout.value);
    productSearchTimeout.value = setTimeout(() => {
        productPagination.value.page = 1;
        fetchProducts(1);
    }, 500);
};

const clearProductSearch = () => {
    productSearch.value = '';
    handleProductSearch();
};

const changeProductPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= productPagination.value.totalPages) {
        fetchProducts(newPage);
    }
};

onMounted(() => {
    fetchData();
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


const navigateToAddProduct = () => {
    router.push('/seller/products/new');
};
</script>
