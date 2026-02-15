<template>
  <div class="container mx-auto px-4 pt-2 md:pt-8 pb-0">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen bg-gray-50 rounded-3xl overflow-hidden shadow-sm md:shadow-md -mx-4 md:mx-0">

    <!-- Top Header & Search -->
    <div class="bg-white sticky top-0 z-30 px-4 pt-2 pb-2 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
            <button @click="router.back()" class="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <i class="fas fa-arrow-left text-gray-600"></i>
            </button>
            <h1 class="text-xl font-bold text-gray-900">Commandes</h1>
            <div class="flex-1"></div>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative">
                <i class="fas fa-bell text-gray-500 text-xs"></i>
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
        </div>

        <!-- Search -->
        <div class="relative mb-2">
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input 
              v-model="searchQuery" 
              @input="handleSearch"
              type="text" 
              placeholder="Rechercher une commande/client..." 
              class="w-full bg-gray-100 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder-gray-500"
            />
        </div>
    </div>

    <!-- Horizontal Status Slider (Restored & Refined) -->
    <div class="bg-white pb-4 px-4 border-b border-gray-100 sticky top-[110px] z-20 shadow-sm">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Statut des commandes</p>
        <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
            <button 
                @click="activeStatusFilter = 'all'"
                :class="activeStatusFilter === 'all' ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'bg-white text-gray-500 border border-gray-200'"
                class="whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all snap-center flex items-center gap-2"
            >
                Toutes <span class="bg-white/20 px-1.5 rounded-full text-xs ml-1">{{ pagination.total }}</span>
            </button>

            <button 
                v-for="status in ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']"
                :key="status"
                @click="activeStatusFilter = status"
                :class="activeStatusFilter === status ? 
                    (status === 'pending' ? 'bg-orange-500 text-white shadow-orange-100' : 
                     status === 'confirmed' ? 'bg-blue-600 text-white shadow-blue-100' :
                     status === 'processing' ? 'bg-indigo-600 text-white shadow-indigo-100' :
                     status === 'shipped' ? 'bg-purple-600 text-white shadow-purple-100' :
                     status === 'delivered' ? 'bg-green-600 text-white shadow-green-100' :
                     'bg-red-500 text-white shadow-red-100') + ' shadow-lg' 
                    : 'bg-white text-gray-500 border border-gray-200'"
                class="whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all snap-center capitalize flex items-center gap-2"
            >
                {{ 
                    status === 'pending' ? 'En attente' : 
                    status === 'confirmed' ? 'Confirmé' : 
                    status === 'processing' ? 'En préparation' : 
                    status === 'shipped' ? 'Expédié' : 
                    status === 'delivered' ? 'Livré' : 'Annulé' 
                }}
                <span :class="activeStatusFilter === status ? 'bg-white/20' : 'bg-gray-100 text-gray-400'" class="px-1.5 rounded-full text-xs">{{ countByStatus(status) }}</span>
            </button>
        </div>
    </div>

    <!-- Active Filter Label -->
    <div class="px-4 py-4 flex justify-between items-end">
        <div>
            <h2 class="font-bold text-gray-800 text-lg capitalize">{{ activeStatusFilter === 'all' ? 'Toutes les commandes' : (
                activeStatusFilter === 'pending' ? 'En attente' : 
                activeStatusFilter === 'confirmed' ? 'Confirmé' : 
                activeStatusFilter === 'processing' ? 'En préparation' : 
                activeStatusFilter
            ) }}</h2>
        </div>
    </div>

    <!-- Orders List (Redesigned) -->
    <div class="px-4 space-y-4">
        <div v-if="loading" class="py-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
        </div>

        <div v-else-if="orders.length === 0" class="py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
             <i class="fas fa-inbox text-4xl text-gray-200 mb-3"></i>
             <p class="text-gray-400 text-sm">Aucune commande {{ activeStatusFilter !== 'all' ? 'dans cette catégorie' : '' }}</p>
        </div>

        <div v-else v-for="order in orders" :key="order.id" class="bg-white rounded-2xl p-0 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <!-- New Card Header -->
            <div class="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        :class="{
                            'bg-orange-100 text-orange-600': order.status === 'pending',
                            'bg-blue-100 text-blue-600': order.status === 'confirmed',
                            'bg-indigo-100 text-indigo-600': order.status === 'processing',
                            'bg-purple-100 text-purple-600': order.status === 'shipped',
                            'bg-green-100 text-green-600': order.status === 'delivered',
                            'bg-red-100 text-red-600': order.status === 'cancelled'
                        }">
                        <i class="fas" :class="{
                            'fa-clock': order.status === 'pending',
                            'fa-check': order.status === 'confirmed',
                            'fa-boxes': order.status === 'processing',
                            'fa-truck': order.status === 'shipped',
                            'fa-box': order.status === 'delivered',
                            'fa-times': order.status === 'cancelled'
                        }"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">#{{ order.order_number }}</p>
                        <h3 class="text-sm font-bold text-gray-900">{{ order.user?.name || 'Client Invité' }}</h3>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</p>
                </div>
            </div>

            <!-- Items -->
            <div class="p-5">
                 <div class="flex -space-x-3 mb-4 overflow-hidden py-1 pl-1">
                     <template v-for="(item, idx) in order.items.slice(0, 4)" :key="item.id">
                         <img :src="item.product?.image_url" class="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-100" />
                     </template>
                     <div v-if="order.items.length > 4" class="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                         +{{ order.items.length - 4 }}
                     </div>
                 </div>
                 
                 <div class="flex justify-between items-end mt-2">
                     <div>
                         <p class="text-xs text-gray-400 font-medium">Total Commande</p>
                         <p class="text-lg font-bold text-gray-900">{{ formatPrice(order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0)) }}</p>
                     </div>
                     <button @click="router.push(`/seller/orders/${order.id}`)" class="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform">
                         Gérer Commande
                     </button>
                 </div>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="px-4 pt-4 flex justify-center items-center gap-3">
        <button 
            @click="changePage(pagination.page - 1)" 
            :disabled="pagination.page === 1"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-left text-xs"></i>
        </button>
        
        <div class="flex items-center gap-2 mx-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page</span>
            <div class="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold shadow-md shadow-gray-200 min-w-[32px] text-center">
                {{ pagination.page }}
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">sur {{ pagination.totalPages }}</span>
        </div>

        <button 
            @click="changePage(pagination.page + 1)" 
            :disabled="pagination.page === pagination.totalPages"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-right text-xs"></i>
        </button>
    </div>

  </div>
  </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router'; // Add router import
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter(); // Initialize router

interface OrderItem {
    id: number;
    price: number;
    quantity: number;
    status: string;
    product: {
        name: string;
        image_url: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    created_at: string;
    status: string;
    user: {
        name: string;
    };
    items: OrderItem[];
}

const orders = ref<Order[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const searchTimeout = ref<any>(null);
const activeStatusFilter = ref('all'); // State for active filter

const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
});

// React to filter changes
watch(activeStatusFilter, () => {
    pagination.value.page = 1;
    fetchOrders(1);
});

// Helper to count orders by status (kept for the UI badges but might be inaccurate with pagination)
// Ideally, we'd need a separate endpoint for status counts or get them in each fetch.
// For now, we will count what's in the current list or keep previous logic.
const countByStatus = (status: string) => {
    return orders.value.filter(o => o.status === status).length;
};

const fetchOrders = async (page = 1) => {
    try {
        loading.value = true;
        // In a real app we might filter on backend, but for now fetching all for client-side filtering demo
        const res = await api.get(`/vendors/me/orders`, {
            params: {
                page,
                limit: pagination.value.limit,
                search: searchQuery.value || undefined,
                status: activeStatusFilter.value
            }
        });
        orders.value = res.data.orders;
        pagination.value = res.data.pagination;
    } catch (e) {
        console.error("Failed to load orders", e);
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
        pagination.value.page = 1;
        fetchOrders(1);
    }, 500);
};

const clearSearch = () => {
    searchQuery.value = '';
    handleSearch();
};

const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.value.totalPages) {
        fetchOrders(newPage);
    }
};

onMounted(() => fetchOrders());

const updateItemStatus = async (orderId: number, itemId: number, newStatus: string) => {
    let message = 'Mettre à jour le statut ?';
    if (newStatus === 'confirmed') message = 'Accepter cette commande ?';
    if (newStatus === 'cancelled') message = 'Refuser cette commande ?';
    if (newStatus === 'shipped') message = 'Confirmer expédition ?';
    if (newStatus === 'delivered') message = 'Confirmer la livraison au client ?';

    if (!confirm(message)) return;

    try {
        await api.patch(`/vendors/me/orders/${orderId}/items/${itemId}`, { status: newStatus });
        // Optimistic update or reload
        await fetchOrders(pagination.value.page); 
    } catch (e) {
        console.error("Error updating status", e);
        alert("Erreur lors de la mise à jour");
    }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
