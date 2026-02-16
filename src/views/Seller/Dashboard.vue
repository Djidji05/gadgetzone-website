 <template>
  <div class="container mx-auto px-4 pt-2 md:pt-8 pb-0">
    <!-- MOBILE DASHBOARD (Natcash inspired Blue Theme) -->
    <div class="md:hidden bg-gray-50 min-h-screen pb-20 -mx-4 -mt-2 font-sans">
        <!-- Top Section (Header + Balance) -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-10 pb-20 relative">
            <!-- User Info Row -->
            <div class="flex justify-between items-start mb-10">
                <div class="flex items-center gap-4">
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
                    <button class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-md">
                        <i class="fas fa-headset text-sm"></i>
                    </button>
                    <button @click="router.push('/seller/notifications')" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-md">
                        <i class="fas fa-bell text-sm"></i>
                        <span v-if="notificationsStore.unreadCount > 0" class="absolute top-2.5 right-2.5 w-4 h-4 bg-orange-500 rounded-full border-2 border-blue-700 text-[8px] flex items-center justify-center font-bold">{{ notificationsStore.unreadCount }}</span>
                    </button>
                </div>
            </div>

            <!-- Balance Display -->
            <div class="mb-4">
                <div class="flex items-center gap-2 mb-2">
                    <p class="text-sm text-blue-100/90">Total Balance</p>
                    <button @click="isBalanceVisible = !isBalanceVisible" class="text-blue-200 hover:text-white transition-colors">
                        <i class="fas" :class="isBalanceVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
                    </button>
                </div>
                <div class="flex items-baseline gap-2">
                    <h1 class="text-4xl font-extrabold tracking-tight">
                        {{ isBalanceVisible ? formatPrice(stats.sales).replace('HTG', '').trim() : '******' }}
                    </h1>
                    <span class="text-lg font-bold text-blue-200">HTG</span>
                </div>
            </div>

            <!-- Abstract Background Element (Simulating the '14th' banner in screenshot) -->
            <div class="absolute right-0 bottom-4 opacity-20 pointer-events-none">
                <i class="fas fa-shield-alt text-[140px] rotate-12"></i>
            </div>
        </div>

        <!-- Main Quick Actions Card -->
        <div class="px-5 -mt-12 relative z-20">
            <div class="bg-white rounded-3xl shadow-xl shadow-blue-950/5 p-5 flex justify-between items-center border border-gray-50">
                <button class="flex flex-col items-center gap-2 group">
                    <div class="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
                        <i class="fas fa-download"></i>
                    </div>
                    <span class="text-[11px] font-bold text-gray-700">Depot</span>
                </button>
                <button class="flex flex-col items-center gap-2 group">
                    <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
                        <i class="fas fa-reply"></i>
                    </div>
                    <span class="text-[11px] font-bold text-gray-700">Retrait</span>
                </button>
                <button class="flex flex-col items-center gap-2 group">
                    <div class="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <span class="text-[11px] font-bold text-gray-700">Transferer</span>
                </button>
                <button class="flex flex-col items-center gap-2 group">
                    <div class="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <span class="text-[11px] font-bold text-gray-700">Mon QR</span>
                </button>
            </div>
        </div>

        <!-- Explore Section -->
        <div class="px-6 pt-10 pb-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-xl text-gray-900 tracking-tight">Explorez GadgetZone</h3>
                <button class="text-orange-600 text-[13px] font-bold flex items-center gap-1 group">
                    Personnaliser
                    <i class="fas fa-sliders-h text-[10px] group-hover:rotate-180 transition-transform"></i>
                </button>
            </div>

            <div class="grid grid-cols-4 gap-y-8">
                <button @click="navigateToAddProduct" class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <i class="fas fa-plus-circle text-orange-500 text-xl"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Ajouter<br>Produit</span>
                </button>
                <button @click="router.push('/seller/orders')" class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <i class="fas fa-file-invoice text-orange-500 text-xl"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Gestion<br>Commandes</span>
                </button>
                <button @click="router.push('/seller/products')" class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <i class="fas fa-layer-group text-orange-500 text-xl"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Mes<br>Produits</span>
                </button>
                <button @click="router.push('/seller/reports')" class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <i class="fas fa-chart-pie text-orange-500 text-xl"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Rapports<br>Ventes</span>
                </button>
                <button @click="router.push('/seller/settings')" class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <i class="fas fa-store-alt text-orange-500 text-xl"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Paramètres<br>Boutique</span>
                </button>
                <button class="flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <i class="fas fa-users-cog text-orange-500 text-xl"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Ambassadeur</span>
                </button>
            </div>
        </div>

        <!-- Horizontal Scroll Section (Autres Services) -->
        <div class="pt-4 pb-10">
            <div class="flex justify-between items-center px-6 mb-4">
                <h3 class="font-bold text-xl text-gray-900 tracking-tight">Autres Services</h3>
                <button class="text-orange-600 text-[13px] font-bold flex items-center gap-1 group">
                    Voir Tout
                    <i class="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                </button>
            </div>
            
            <div class="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-4 snap-x snap-mandatory">
                <div v-for="i in 3" :key="i" class="flex-shrink-0 w-32 h-32 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 snap-center flex flex-col items-center justify-center text-center group">
                    <div class="w-12 h-12 rounded-full mb-3 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                         <img :src="['/logo_circle.png', '/logo_blue.png', '/logo_mini.png'][i-1] || 'https://placehold.co/400x400?text=Service'" class="w-full h-full object-contain" />
                    </div>
                    <span class="text-[11px] font-bold text-gray-700 leading-tight">{{ ['Market', 'Support', 'Paiement'][i-1] }}</span>
                </div>
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="px-6 pb-20">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-xl text-gray-900 tracking-tight">Historique des Transactions</h3>
                <button class="text-orange-600 text-[13px] font-bold flex items-center gap-1 group">
                    Voir Tout
                    <i class="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                </button>
            </div>

            <div class="space-y-4">
                 <div v-for="order in recentOrders.slice(0, 3)" :key="order.id" class="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4 border border-gray-50 group hover:border-blue-100 transition-colors">
                     <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm border border-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                         <i class="fas" :class="order.status === 'completed' ? 'fa-wallet' : 'fa-receipt'"></i>
                     </div>
                     <div class="flex-1">
                         <h4 class="font-bold text-gray-900 text-[13px] line-clamp-1 leading-tight">{{ order.customer?.firstName || 'Client Client' }}</h4>
                         <p class="text-[10px] text-gray-400 mt-1">{{ new Date(order.created_at).toLocaleDateString() }} {{ new Date(order.created_at).toLocaleTimeString().slice(0,5) }}</p>
                     </div>
                     <div class="text-right">
                         <div class="font-extrabold text-[13px]" :class="order.status === 'completed' ? 'text-green-600' : 'text-gray-900'">
                            {{ order.status === 'completed' ? '+' : '' }}{{ formatPrice(order.items.reduce((acc: any, i: any) => acc + (i.price * i.quantity), 0)).replace('HTG', '').trim() }} HTG
                         </div>
                         <div class="mt-1">
                             <span :class="order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-current opacity-70">
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
const isBalanceVisible = ref(false);
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
