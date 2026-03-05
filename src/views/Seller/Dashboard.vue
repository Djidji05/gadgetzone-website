 <template>
 <div class="container mx-auto px-4 pt-2 md:pt-8 pb-0">
 <!-- MOBILE DASHBOARD (Natcash inspired Blue Theme) -->
 <div class="md:hidden bg-gray-50 min-h-screen pb-20 -mx-4 -mt-2 font-sans">
 <!-- Top Section (Header + Balance) -->
 <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-10 pb-20 relative">
 <!-- User Info Row -->
 <div class="flex justify-between items-start mb-10">
 <div @click="router.push('/seller/settings')" class="flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
 <div class="relative">
 <div class="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center p-0.5">
 <img v-if="store.logoUrl" :src="store.logoUrl" class="w-full h-full rounded-full object-cover" />
 <i v-else class="fas fa-store text-xl text-blue-100"></i>
 </div>
 <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-blue-700 rounded-full flex items-center justify-center">
 <i class="fas fa-check text-[8px] text-white"></i>
 </div>
 </div>
 <div>
 <h2 class="font-bold text-xl uppercase tracking-tight">{{ store.name || authStore.customer?.firstName || 'Vendeur' }}</h2>
 <p class="text-xs text-blue-100/80">{{ store.phone || '(509) ---- ----' }}</p>
 </div>
 </div>
 <div class="flex gap-4">
 <button @click="showAiChat = true" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-md active:scale-90 transition-all">
 <i class="fas fa-headset text-sm"></i>
 </button>
 <button @click="router.push('/seller/notifications')" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-md active:scale-90 transition-all">
 <i class="fas fa-bell text-sm"></i>
 <span v-if="notificationsStore.unreadCount > 0" class="absolute top-2.5 right-2.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700 text-[8px] flex items-center justify-center font-bold">{{ notificationsStore.unreadCount }}</span>
 </button>
 </div>
 </div>

 <!-- Balance Display -->
 <div class="mb-4">
 <div class="flex items-center gap-2 mb-2">
 <p class="text-sm text-blue-100/90">Solde Retirable</p>
 <button @click="isBalanceVisible = !isBalanceVisible" class="text-blue-200 hover:text-white transition-colors p-2 -m-2">
 <i class="fas" :class="isBalanceVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
 </button>
 </div>
 <div v-if="loading" class="h-10 w-48 bg-white/20 animate-pulse rounded-lg mb-2"></div>
 <div v-else class="flex items-baseline gap-2">
 <h1 class="text-4xl font-extrabold tracking-tight">
 {{ isBalanceVisible ? formatPrice(availableBalance).replace('HTG', '').trim() : '******' }}
 </h1>
 <span class="text-lg font-bold text-blue-200">HTG</span>
 </div>
 <p class="text-[10px] text-blue-200/60 mt-2 italic">* Basé sur les ventes livrées et dépôts (Com. : {{ store.commission_rate || 10 }}%)</p>
 </div>

 <!-- Abstract Background Element (Simulating the '14th' banner in screenshot) -->
 <div class="absolute right-0 bottom-4 opacity-20 pointer-events-none">
 <i class="fas fa-shield-alt text-[140px] rotate-12"></i>
 </div>
 </div>

 <!-- Main Quick Actions Card -->
 <div class="px-5 -mt-12 relative z-20">
 <div class="bg-white rounded-3xl shadow-xl shadow-blue-950/5 p-5 flex justify-between items-center border border-gray-50">
 <button @click="router.push('/seller/deposits')" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-download"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Depot</span>
 </button>
 <button @click="showWithdrawModal = true" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-reply"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Retrait</span>
 </button>
 <button @click="router.push('/seller/messages')" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-comment-dots"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Messages</span>
 </button>
 <button @click="router.push('/seller/my-qr')" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-qrcode"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Mon QR</span>
 </button>
 </div>
 </div>

 <!-- Explore Section -->
 <div class="px-6 pt-10 pb-6">
 <div v-if="store.id" class="flex justify-between items-center mb-6 overflow-hidden gap-2">
 <h3 class="font-bold text-xl text-gray-900 tracking-tight whitespace-nowrap">Mon Menu</h3>
 <button @click="router.push('/store/' + store.id)" class="text-blue-600 text-[13px] font-bold flex items-center gap-1 group whitespace-nowrap">
 Voir ma boutique
 <i class="fas fa-eye text-[10px] group-hover:scale-110 transition-transform"></i>
 </button>
 </div>

 <div class="grid grid-cols-4 gap-y-8">
 <button @click="navigateToAddProduct" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-plus-circle text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Ajouter<br>Produit</span>
 </button>
 <button @click="router.push('/seller/orders')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-file-invoice text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Gestion<br>Commandes</span>
 </button>
 <button @click="router.push('/seller/products')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-layer-group text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Mes<br>Produits</span>
 </button>
 <button @click="router.push('/seller/reports')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-chart-pie text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Rapports<br>Ventes</span>
 </button>
 <button @click="router.push('/seller/settings')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-store-alt text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Paramètres<br>Boutique</span>
 </button>
 <button @click="router.push('/seller/promotions')" class="flex flex-col items-center gap-3 snap-center">
 <div class="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center shadow-sm active:bg-violet-100 transition-colors">
 <i class="fas fa-bullhorn text-violet-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Promotions<br>Marketing</span>
 </button>
 <button @click="router.push('/seller/reports')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-users-cog text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Ambassadeur</span>
 </button>
 </div>
 </div>

 <!-- Horizontal Scroll Section (Autres Services) -->
 <div class="pt-4 pb-10">
 <div class="flex justify-between items-center px-6 mb-4">
 <h3 class="font-bold text-xl text-gray-900 tracking-tight">Autres Services</h3>
 <button @click="router.push('/seller/services')" class="text-blue-600 text-[13px] font-bold flex items-center gap-1 group">
 Voir Tout
 <i class="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
 </button>
 </div>
 
 <div class="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-4 snap-x snap-mandatory">
 <div v-for="(service, i) in services" :key="i" @click="navigateToService(service)" class="flex-shrink-0 w-32 h-32 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 snap-center flex flex-col items-center justify-center text-center group active:scale-95 transition-all cursor-pointer">
 <div class="w-12 h-12 rounded-full mb-3 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110" :class="service.bg">
 <i :class="[service.icon, service.color, 'text-xl']"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700 leading-tight">{{ service.name }}</span>
 </div>
 </div>
 </div>

 <!-- Recent Transactions -->
 <div class="px-6 pb-20">
 <div class="flex justify-between items-center mb-6">
 <h3 class="font-bold text-xl text-gray-900 tracking-tight">Historique des Transactions</h3>
 <button @click="router.push('/seller/transactions')" class="text-blue-600 text-[13px] font-bold flex items-center gap-1 group">
 Voir Tout
 <i class="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
 </button>
 </div>

 <div class="space-y-4">
 <div v-for="order in recentOrders.slice(0, 3)" :key="order.id" @click="router.push(`/seller/orders/${order.id}`)" class="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4 border border-gray-50 group hover:border-blue-100 transition-colors active:scale-[0.98]">
 <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm border border-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
 <i class="fas" :class="order.status === 'completed' ? 'fa-wallet' : 'fa-receipt'"></i>
 </div>
 <div class="flex-1">
 <h4 class="font-bold text-gray-900 text-[13px] line-clamp-1 leading-tight">{{ order.user?.name || 'Client' }}</h4>
 <p class="text-[10px] text-gray-400 mt-1">{{ new Date(order.created_at).toLocaleDateString() }} {{ new Date(order.created_at).toLocaleTimeString().slice(0,5) }}</p>
 </div>
 <div class="text-right">
 <div class="font-extrabold text-[13px]" :class="order.status === 'completed' ? 'text-green-600' : 'text-gray-900'">
 {{ order.status === 'completed' ? '+' : '' }}{{ formatPrice(order.items.reduce((acc: any, i: any) => acc + (i.price * i.quantity), 0)).replace('HTG', '').trim() }} HTG
 </div>
 <div class="mt-1">
 <span :class="order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600 border-blue-100'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border opacity-70">
 {{ order.status === 'completed' ? 'Reçu' : 'En attente' }}
 </span>
 </div>
 </div>
 </div>
 <div v-if="recentOrders.length === 0" class="text-center py-12 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
 <div class="mb-3"><i class="fas fa-history text-3xl text-gray-200"></i></div>
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
 <div class="bg-transparent md:bg-white md: p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
 <div v-if="loading" class="animate-pulse space-y-3">
 <div class="h-4 w-24 bg-gray-100 rounded"></div>
 <div class="h-8 w-16 bg-gray-200 rounded"></div>
 </div>
 <div v-else class="relative z-10">
 <div class="text-gray-500 text-sm font-medium mb-2">Commandes du jour</div>
 <div class="text-3xl font-bold text-gray-900 ">{{ stats.todayOrders || 0 }}</div>
 <div class="flex items-center mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
 <i class="fas fa-arrow-up mr-1"></i> 12% vs hier
 </div>
 </div>
 <div class="absolute right-4 top-4 p-3 bg-yellow-100 rounded-full text-yellow-600 md:group-hover:scale-110 transition-transform">
 <i class="fas fa-cube text-xl"></i>
 </div>
 </div>

 <!-- Card 2: Sales -->
 <div class="bg-transparent md:bg-white md: p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
 <div v-if="loading" class="animate-pulse space-y-3">
 <div class="h-4 w-24 bg-gray-100 rounded"></div>
 <div class="h-8 w-24 bg-gray-200 rounded"></div>
 </div>
 <div v-else class="relative z-10">
 <div class="text-gray-500 text-sm font-medium mb-2">Ventes du jour</div>
 <div class="text-3xl font-bold text-gray-900 ">{{ formatPrice(stats.todaySales || 0) }}</div>
 <div class="flex items-center mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
 <i class="fas fa-arrow-up mr-1"></i> 8.5% vs hier
 </div>
 </div>
 <div class="absolute right-4 top-4 p-3 bg-green-100 rounded-full text-green-600 md:group-hover:scale-110 transition-transform">
 <i class="fas fa-chart-line text-xl"></i>
 </div>
 </div>

 <!-- Card 3: Balance -->
 <div class="bg-transparent md:bg-white md: p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
 <div v-if="loading" class="animate-pulse space-y-3">
 <div class="h-4 w-24 bg-gray-100 rounded"></div>
 <div class="h-8 w-24 bg-gray-200 rounded"></div>
 </div>
 <div v-else class="relative z-10">
 <div class="flex items-center justify-between mb-2">
 <div class="text-gray-500 text-sm font-medium">Solde Retirable</div>
 <button @click="showWithdrawModal = true" class="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded-md font-bold transition-colors">
 Retrait
 </button>
 </div>
 <div class="text-3xl font-bold text-gray-900 ">{{ formatPrice(availableBalance) }}</div>
 <div class="text-xs text-gray-400 mt-2">Disponible pour virement</div>
 </div>
 <div class="absolute right-4 top-4 p-3 bg-blue-100 rounded-full text-blue-600 md:group-hover:scale-110 transition-transform">
 <i class="fas fa-wallet text-xl"></i>
 </div>
 </div>

 <!-- Card 4: Returns -->
 <div class="bg-transparent md:bg-white md: p-6 rounded-xl shadow-none md:shadow flex flex-col justify-between relative overflow-hidden group">
 <div class="relative z-10">
 <div class="text-gray-500 text-sm font-medium mb-2">Retours & Remboursements</div>
 <div class="text-3xl font-bold text-gray-900 ">0</div>
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
 <div class="lg:col-span-2 bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-6">
 <div class="flex justify-between items-center mb-6">
 <h3 class="text-lg font-bold text-gray-900 ">Détails des Ventes</h3>
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
 <div class="bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
 <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2">
 <i class="fas fa-globe"></i>
 </div>
 <div class="text-xl font-bold">1</div>
 <div class="text-xs text-gray-500">Marché Actif</div>
 </div>
 <!-- Widget 2: Messages -->
 <div class="bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
 <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
 <i class="fas fa-envelope"></i>
 </div>
 <div class="text-xl font-bold">0</div>
 <div class="text-xs text-gray-500">Messages</div>
 </div>
 <!-- Widget 3: Buy Box -->
 <div class="bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
 <div class="text-sm font-medium text-gray-500 mb-1">Buy Box Wins</div>
 <div class="text-xl font-bold text-gray-900 ">80%</div>
 <div class="w-full bg-blue-100 rounded-full h-1.5 mt-2 overflow-hidden">
 <div class="bg-blue-600 h-1.5 rounded-full" style="width: 80%"></div>
 </div>
 </div>
 <!-- Widget 4: Feedback -->
 <div class="bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-4 flex flex-col items-center justify-center text-center">
 <div class="text-sm font-medium text-gray-500 mb-1">Avis Clients</div>
 <div class="text-xl font-bold text-blue-600">4.8 <i class="fas fa-star text-xs"></i></div>
 <div class="text-xs text-gray-400">(12 avis)</div>
 </div>
 </div>
 </div>

 <!-- Bottom Row: Orders Table & Out of Stock (Desktop Only) -->
 <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
 <!-- Recent Orders (Span 2) -->
 <div class="lg:col-span-2 bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-6">
 <div class="flex justify-between items-center mb-6">
 <h3 class="text-lg font-bold text-gray-900 ">Détails des Commandes</h3>
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
 <td class="py-3 font-mono text-xs text-gray-500">{{ formatOrderId(order.order_number || order.id) }}</td>
 <td class="py-3">
 <div class="flex items-center gap-2">
 <img :src="order.items[0]?.product?.image_url || '/placeholder.png'" class="w-8 h-8 rounded bg-gray-100 object-cover"/>
 <span class="font-medium text-gray-900 truncate max-w-[150px]">{{ order.items[0]?.product?.name }}</span>
 <span v-if="order.items.length > 1" class="text-xs text-gray-400">+{{ order.items.length - 1 }}</span>
 </div>
 </td>
 <td class="py-3 text-gray-600">01</td> <!-- Mock qty per order logic usually sums items -->
 <td class="py-3 text-gray-500 text-xs">{{ formatDate(order.created_at) }}</td>
 <td class="py-3 text-right">
 <span :class="{
 'bg-blue-50 text-blue-600 border border-blue-100': order.status === 'pending',
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
 <div class="bg-transparent md:bg-white md: rounded-xl shadow-none md:shadow p-6 flex flex-col">
 <div class="flex justify-between items-center mb-6">
 <h3 class="text-lg font-bold text-gray-900 ">Rupture de Stock</h3>
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

 <!-- Withdrawal Modal -->
 <div v-if="showWithdrawModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showWithdrawModal = false"></div>
 <div class="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar animate-in fade-in zoom-in duration-200 pb-2">
 <div class="p-6">
 <div class="flex justify-between items-center mb-6">
 <h3 class="text-xl font-bold text-gray-900">Demander un Retrait</h3>
 <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-600 p-2">
 <i class="fas fa-times"></i>
 </button>
 </div>

 <div class="mb-6 bg-blue-50 p-5 rounded-2xl border border-blue-100">
 <p class="text-xs text-blue-600 font-bold uppercase mb-1">Solde Retirable</p>
 <p class="text-2xl font-bold text-blue-700">{{ formatPrice(availableBalance) }}</p>
 <div class="flex justify-between mt-3 pt-3 border-t border-blue-100 text-[10px] text-blue-500 font-medium">
 <span>Payé: {{ formatPrice(payoutSummary.totalPaid) }}</span>
 <span>Attente: {{ formatPrice(payoutSummary.pendingValue) }}</span>
 </div>
 </div>

 <form @submit.prevent="handleWithdraw" class="space-y-4">
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Montant à retirer (HTG)</label>
 <div class="relative">
 <input 
 v-model.number="withdrawForm.amount"
 type="number" 
 required
 step="1"
 min="1"
 :max="availableBalance"
 class="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 text-xl font-bold focus:outline-none transition-all pr-12"
 placeholder="0"
 />
 <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">G</span>
 </div>
 </div>

 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Méthode de retrait</label>
 <div class="grid grid-cols-2 gap-3">
 <button 
 type="button"
 @click="withdrawForm.method = 'MonCash'"
 :class="[
 'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
 withdrawForm.method === 'MonCash' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'
 ]"
 >
 <img src="https://moncash.digicelgroup.com/images/moncash_logo.png" class="h-6 object-contain" v-if="false" />
 <i class="fas fa-mobile-alt text-xl" v-else></i>
 <span class="text-xs font-bold">MonCash</span>
 </button>
 <button 
 type="button"
 @click="withdrawForm.method = 'Natcash'"
 :class="[
 'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
 withdrawForm.method === 'Natcash' ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'
 ]"
 >
 <i class="fas fa-wallet text-xl"></i>
 <span class="text-xs font-bold">Natcash</span>
 </button>
 </div>
 </div>

 <!-- Account Info Display -->
 <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 mt-4">
 <div class="mb-3">
 <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Informations du compte</label>
 <p class="text-[10px] text-gray-500 mt-1">Saisissez les informations où vous souhaitez recevoir l'argent. Ce numéro sera enregistré par défaut si vous n'en avez pas encore.</p>
 </div>
 
 <div class="space-y-3">
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro {{ withdrawForm.method }}</label>
 <input 
 v-model="withdrawForm.phone" 
 type="text" 
 placeholder="Ex: 3XXX-XXXX" 
 class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
 required
 />
 </div>
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nom sur le compte</label>
 <input 
 v-model="withdrawForm.accountName" 
 type="text" 
 placeholder="Ex: Jean Dupont" 
 class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
 required
 />
 </div>
 </div>
 </div>

 <button 
 type="submit"
 :disabled="withdrawing || withdrawForm.amount <= 0 || withdrawForm.amount > availableBalance"
 class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-2"
 >
 <i v-if="withdrawing" class="fas fa-circle-notch animate-spin"></i>
 {{ withdrawing ? 'Traitement...' : 'Confirmer le Retrait' }}
 </button>
 </form>
 </div>
 </div>
 </div>
 
 <AiChatWidget v-model:isOpen="showAiChat" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useNotificationsStore } from '@/stores/notifications';
import { useUiStore } from '@/stores/ui';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import SellerMobileHeader from '@/components/layout/SellerMobileHeader.vue';
import AiChatWidget from '@/components/seller/AiChatWidget.vue';
import { formatOrderId } from '@/utils/formatters';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();
const uiStore = useUiStore();

const showAiChat = ref(false);
const loading = ref(true);
const isBalanceVisible = ref(false);
const products = ref<any[]>([]);
const recentOrders = ref<any[]>([]);
const store = reactive<any>({
 name: '',
 status: 'pending'
});
const stats = reactive({
 sales: 0,
 orders: 0,
 products: 0,
 todaySales: 0,
 todayOrders: 0,
 netSales: 0,
 totalDeposits: 0,
 chartData: [] as { date: string, amount: number }[]
});

const payoutSummary = ref({ totalPaid: 0, pendingValue: 0 });
const showWithdrawModal = ref(false);
const withdrawing = ref(false);
const withdrawForm = reactive({
 amount: 0,
 method: 'MonCash',
 phone: '',
 accountName: ''
});

const services = [
 { name: 'Académie', icon: 'fas fa-graduation-cap', color: 'text-blue-600', bg: 'bg-blue-50', route: '/seller/academy' },
 { name: 'Centre Aide', icon: 'fas fa-question-circle', color: 'text-purple-600', bg: 'bg-purple-50', route: '/seller/help' },
 { name: 'Confiance', icon: 'fas fa-shield-alt', color: 'text-indigo-500', bg: 'bg-indigo-50', route: '/seller/trust' },
 { name: 'Booster', icon: 'fas fa-rocket', color: 'text-orange-500', bg: 'bg-orange-50', route: '/seller/boost' },
 { name: 'Communauté', icon: 'fas fa-users', color: 'text-green-600', bg: 'bg-green-50', route: '/seller/community' }
];

const navigateToService = (service: any) => {
 router.push(service.route);
};

// Watch showWithdrawModal to hide/show bottom nav and lock scroll
watch(showWithdrawModal, (val) => {
 uiStore.isSellerNavVisible = !val;
 if (val) {
 document.body.style.overflow = 'hidden';
 // Pre-fill with save default if exists
 if (store.settings?.payoutPhone) {
 withdrawForm.phone = store.settings.payoutPhone;
 withdrawForm.accountName = store.settings.payoutName || '';
 }
 } else {
 document.body.style.overflow = '';
 }
});

watch(showAiChat, (val) => {
 uiStore.isSellerNavVisible = !val;
 if (val) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
});

onUnmounted(() => {
 // Restore navbar visibility and scroll when leaving the page
 uiStore.isSellerNavVisible = true;
 document.body.style.overflow = '';
});

const handleRequestNumberChange = () => {
 uiStore.confirm({
 title: 'Changer de numéro',
 message: 'Êtes-vous sûr de vouloir changer de numéro ? Cette action nécessitera une validation administrative.',
 onConfirm: () => {
 uiStore.showToast("Votre demande de changement de numéro a été transmise à l'administrateur. Vous serez contacté sous peu pour validation.", "info");
 }
 });
};

const availableBalance = computed(() => {
 const val = (stats.netSales || 0) + (stats.totalDeposits || 0) - (payoutSummary.value.totalPaid + payoutSummary.value.pendingValue);
 return Math.max(0, val);
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
 const first = pts[0];
 if (!first) return '';
 
 // Simple line: M x1 y1 L x2 y2 ...
 return `M ${first.x} ${first.y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
});

const areaPath = computed(() => {
 if (points.value.length === 0) return '';
 const pts = points.value;
 const first = pts[0];
 const last = pts[pts.length - 1];
 
 if (!first || !last) return '';
 
 // Close the path: LinePath -> L right-bottom -> L left-bottom -> Z
 const line = linePath.value;
 return `${line} L ${last.x} 50 L ${first.x} 50 Z`;
});


const fetchData = async () => {
 loading.value = true;
 try {
 // Fetch store info
 const storeRes = await api.get('/vendors/me');
 Object.assign(store, storeRes.data);

 // Only fetch stats and data if store is active
 if (store.status === 'active') {
 try {
 const statsRes = await api.get('/vendors/me/stats');
 Object.assign(stats, statsRes.data);
 
 // Fetch products (all, to check low stock)
 await fetchProducts();
 
 // Fetch recent orders
 await fetchRecentOrders();

 // Fetch payout info for balance
 await fetchPayouts();
 } catch (err) {
 console.warn("Error fetching active store data", err);
 }
 }
 
 // Ensure stats properties exist for calculations
 if (stats.sales === undefined) stats.sales = 0;
 if (stats.orders === undefined) stats.orders = 0;

 if(!stats.chartData || stats.chartData.length === 0) {
 const today = new Date();
 const mockData = Array.from({length: 15}, (_, i) => {
 const d = new Date();
 d.setDate(today.getDate() - (14 - i));
 return {
 date: d.toISOString().split('T')[0] || '',
 amount: Math.floor(Math.random() * 5000) + 1000
 };
 });
 stats.chartData = mockData;
 }

 // Mock today's stats for demo (since backend might not return them yet)
 if(!stats.todaySales) stats.todaySales = Math.floor(stats.sales / 30);
 if(!stats.todayOrders) stats.todayOrders = Math.floor(stats.orders / 30);
 
 } catch (e) {
 console.error("Error fetching dashboard data", e);
 } finally {
 loading.value = false;
 }
};

const fetchRecentOrders = async () => {
 if (store.status !== 'active') return;
 try {
 const res = await api.get('/vendors/me/orders', { params: { limit: 5 }});
 recentOrders.value = res.data.orders || [];
 } catch (e) {
 console.error("Error fetching recent orders", e);
 }
}


const fetchProducts = async (page = 1) => {
 if (store.status !== 'active') return;
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

const fetchPayouts = async () => {
 if (store.status !== 'active') return;
 try {
 const res = await api.get('/vendors/me/payouts');
 if (res.data && res.data.summary) {
 payoutSummary.value = res.data.summary;
 }
 } catch (e) {
 console.error("Error fetching payouts", e);
 }
};

const handleWithdraw = async () => {
 if (withdrawForm.amount <= 0) return;
 if (withdrawForm.amount > availableBalance.value) {
 uiStore.showToast("Solde insuffisant", "warning");
 return;
 }
 if (!withdrawForm.phone || !withdrawForm.accountName) {
 uiStore.showToast("Veuillez remplir vos informations de retrait", "warning");
 return;
 }
 
 try {
 withdrawing.value = true;
 // In a real app, we might want to save these settings to the vendor profile too
 await api.post('/vendors/me/payouts', withdrawForm);
 showWithdrawModal.value = false;
 withdrawForm.amount = 0;
 // Refresh data
 await fetchData();
 uiStore.showToast("Votre demande de retrait a été envoyée avec succès !", "success");
 } catch (e: any) {
 uiStore.showToast(e.response?.data?.message || "Erreur lors du retrait", "error");
 } finally {
 withdrawing.value = false;
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

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
