<template>
  <!-- Sidebar Container -->
  <div class="hidden md:block w-64 flex-shrink-0 sticky top-8 h-fit z-40 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white">Ma Boutique</h2>
    </div>

    <div class="mb-6 text-center">
      <div class="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner">
        <img 
          v-if="store.logoUrl" 
          :src="store.logoUrl" 
          class="w-full h-full object-cover" 
        />
        <i v-else class="fas fa-store text-3xl text-gray-200"></i>
      </div>
      <h3 class="mt-3 font-bold text-gray-900 dark:text-white truncate px-2">{{ store.name || 'Ma Boutique' }}</h3>
      <div class="mt-2 text-center flex justify-center">
        <span class="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">Boutique Pro</span>
      </div>
    </div>
    
    <nav class="space-y-1">
      <router-link 
        to="/seller/dashboard" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-home mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Tableau de bord</span>
      </router-link>

      <router-link 
        to="/seller/notifications" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group relative"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-bell mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Notifications</span>
        <span v-if="notificationsStore.unreadCount > 0" class="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white border-2 border-white dark:border-gray-800">
          {{ notificationsStore.unreadCount }}
        </span>
      </router-link>
      
      <router-link 
        to="/seller/products" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-box mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Mes Produits</span>
      </router-link>

      <router-link 
        to="/seller/orders" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-shopping-cart mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Commandes</span>
      </router-link>

      <router-link 
        to="/seller/reports" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-chart-bar mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Rapports</span>
      </router-link>

      <router-link 
        to="/seller/payments" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-wallet mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Revenue</span>
      </router-link>

      <router-link 
        to="/seller/settings" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
        active-class="bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
      >
        <i class="fas fa-cog mr-3 w-5 group-hover:scale-110 transition-transform"></i>
        <span>Paramètres</span>
      </router-link>

      <div class="border-t border-gray-100 dark:border-gray-700 my-6"></div>

      <router-link 
        to="/" 
        class="flex items-center px-4 py-3 rounded-xl font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition-all group"
      >
        <i class="fas fa-arrow-left mr-3 w-5 group-hover:-translate-x-1 transition-transform"></i>
        <span>Retour au site</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import api from '@/services/api';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const store = ref<any>({});

onMounted(async () => {
    // Load store data
    try {
        const res = await api.get('/vendors/me');
        store.value = res.data;
    } catch (e) {
        console.error("Failed to load store in sidebar", e);
    }

    // Load notifications
    notificationsStore.fetchNotifications(true);
});
</script>
