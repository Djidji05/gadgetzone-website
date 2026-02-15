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
            <h1 class="text-xl font-bold text-gray-900">Mes Produits</h1>
            <div class="flex-1"></div>
            <button @click="navigateToAddProduct" class="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-all">
                <i class="fas fa-plus text-sm"></i>
            </button>
        </div>

        <!-- Search -->
        <div class="relative mb-2">
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input 
              v-model="productSearch" 
              @input="handleProductSearch"
              type="text" 
              placeholder="Rechercher un produit..." 
              class="w-full bg-gray-100 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder-gray-500"
            />
        </div>
    </div>

    <!-- Stats Summary (Optional/Quick view) -->
    <div class="px-4 py-4 flex justify-between items-center">
        <h2 class="font-bold text-gray-800 text-lg">Catalogue</h2>
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ productPagination.total }} Articles</span>
    </div>

    <!-- Products List (Card Design) -->
    <div class="px-4 space-y-4">
        <div v-if="loading" class="py-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
        </div>

        <div v-else-if="products.length === 0" class="py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
             <i class="fas fa-box-open text-4xl text-gray-200 mb-3"></i>
             <p class="text-gray-400 text-sm">Aucun produit {{ productSearch ? 'trouvé' : 'dans votre boutique' }}</p>
             <button v-if="!productSearch" @click="navigateToAddProduct" class="mt-4 text-blue-600 text-sm font-bold">Ajouter mon premier produit</button>
        </div>

        <div v-else v-for="product in products" :key="product.id" :class="{'opacity-75 bg-gray-50': product.status === 'deleted'}" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow relative">
            <!-- Product Image -->
            <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <img :src="product.image_url || 'https://via.placeholder.com/100'" class="w-full h-full object-cover" />
                <div v-if="product.status === 'deleted'" class="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                    <i class="fas fa-eye-slash text-red-500 text-lg opacity-50"></i>
                </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                    <h3 class="font-bold text-gray-900 text-sm truncate leading-tight mb-1">{{ product.name }}</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-blue-900 font-black text-base">{{ formatPrice(product.price) }}</span>
                    </div>

                    <!-- Admin Note if deleted -->
                    <div v-if="product.status === 'deleted'" class="mt-2 p-2 bg-red-50 rounded-xl border border-red-100">
                        <p class="text-[10px] text-red-700 leading-normal">
                            <span class="font-black">SUPPRIMÉ PAR L'ADMIN :</span><br>
                            {{ product.admin_note || 'Aucun motif spécifié.' }}
                        </p>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-2">
                    <span 
                      v-if="product.status !== 'deleted'"
                      :class="product.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'" 
                      class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider"
                    >
                        Stock: {{ product.stock }}
                    </span>
                    <span 
                      v-else
                      class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-600 text-white"
                    >
                        Inactif
                    </span>
                    
                    <div class="flex gap-2">
                        <button 
                          @click="router.push(`/seller/products/edit/${product.id}`)" 
                          :disabled="product.status === 'deleted'"
                          :class="{'opacity-30': product.status === 'deleted'}"
                          class="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button 
                          @click="handleDelete(product.id)" 
                          class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pagination (Matched with Orders) -->
    <div v-if="productPagination.total > 0" class="px-4 pt-4 flex justify-center items-center gap-3">
        <button 
            @click="changeProductPage(productPagination.page - 1)" 
            :disabled="productPagination.page === 1"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-left text-xs"></i>
        </button>
        
        <div class="flex items-center gap-2 mx-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page</span>
            <div class="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold shadow-md shadow-gray-200 min-w-[32px] text-center">
                {{ productPagination.page }}
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">sur {{ productPagination.totalPages }}</span>
        </div>

        <button 
            @click="changeProductPage(productPagination.page + 1)" 
            :disabled="productPagination.page === productPagination.totalPages"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter();
const loading = ref(false);
const products = ref<any[]>([]);
const productSearch = ref('');
const productSearchTimeout = ref<any>(null);
const productPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
});

const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
        await api.delete(`/vendors/me/products/${id}`);
        fetchProducts(productPagination.value.page);
    } catch (e) {
        console.error("Delete failed", e);
        alert("Erreur lors de la suppression");
    }
};

const fetchProducts = async (page = 1) => {
    loading.value = true;
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
            products.value = productsRes.data;
        }
    } catch (e) {
        console.error("Error fetching products", e);
    } finally {
        loading.value = false;
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
    fetchProducts();
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(price);
};

const navigateToAddProduct = () => {
    router.push('/seller/products/new');
};
</script>
