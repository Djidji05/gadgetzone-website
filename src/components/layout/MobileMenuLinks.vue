<template>
  <div class="space-y-2 overflow-y-auto max-h-[70vh]">
    
    <!-- Tous les produits -->
    <router-link
      to="/products"
      class="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-gray-700 font-medium"
      @click="$emit('close')"
    >
      <span class="flex items-center gap-2"><i class="fas fa-th-large text-gray-500"></i> Tous les produits</span>
    </router-link>

    <!-- Smartphones -->
    <div class="border rounded-lg overflow-hidden">
      <button @click="toggleCategory('smartphone')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-mobile-alt text-gray-500 w-5 text-center"></i> Smartphone</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'smartphone' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'smartphone'" class="bg-gray-50 p-2 space-y-1">
        <router-link to="/products?category=smartphone" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Smartphones</router-link>
        <router-link to="/products?category=smartphone&search=ecran" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Écrans téléphone</router-link>
        <router-link to="/products?category=smartphone&search=batterie" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Batteries smartphone</router-link>
        <router-link to="/products?category=smartphone&search=chargeur" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Chargeurs & câbles</router-link>
        <router-link to="/products?category=smartphone&search=coque" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Coques & protections</router-link>
      </div>
    </div>

    <!-- Laptop -->
    <div class="border rounded-lg overflow-hidden">
       <button @click="toggleCategory('laptop')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-laptop text-gray-500 w-5 text-center"></i> Laptop</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'laptop' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'laptop'" class="bg-gray-50 p-2 space-y-1">
        <router-link to="/products?category=laptop" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Laptops</router-link>
        <router-link to="/products?category=laptop&search=ecran" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Écran laptop</router-link>
        <router-link to="/products?category=laptop&search=batterie" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Batteries laptop</router-link>
        <router-link to="/products?category=laptop&search=chargeur" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Chargeurs laptop</router-link>
        <router-link to="/products?category=laptop&search=ram" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• RAM</router-link>
        <router-link to="/products?category=laptop&search=ssd" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Disques durs / SSD</router-link>
        <router-link to="/products?category=laptop&search=usb" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Clé USB</router-link>
      </div>
    </div>

    <!-- Casque -->
    <div class="border rounded-lg overflow-hidden">
       <button @click="toggleCategory('casque')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-headphones text-gray-500 w-5 text-center"></i> Casque</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'casque' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'casque'" class="bg-gray-50 p-2 space-y-1">
         <router-link to="/products?category=audio&search=bluetooth" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Casques Bluetooth</router-link>
         <router-link to="/products?category=audio&search=gaming" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Casques gaming</router-link>
         <router-link to="/products?category=audio&search=ecouteur" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Écouteurs</router-link>
      </div>
    </div>

    <!-- Appareil photo -->
    <div class="border rounded-lg overflow-hidden">
       <button @click="toggleCategory('photo')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-camera text-gray-500 w-5 text-center"></i> Appareil photo</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'photo' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'photo'" class="bg-gray-50 p-2 space-y-1">
         <router-link to="/products?category=photo" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Appareils photo numériques</router-link>
         <router-link to="/products?category=photo&search=objectif" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Objectifs</router-link>
         <router-link to="/products?category=photo&search=accessoire" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Accessoires photo</router-link>
      </div>
    </div>

    <!-- Gaming -->
    <div class="border rounded-lg overflow-hidden">
       <button @click="toggleCategory('gaming')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-gamepad text-gray-500 w-5 text-center"></i> Gaming</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'gaming' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'gaming'" class="bg-gray-50 p-2 space-y-1">
         <router-link to="/products?category=gaming" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Consoles</router-link>
         <router-link to="/products?category=gaming&search=manette" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Manettes</router-link>
         <router-link to="/products?category=gaming&search=accessoire" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Accessoires gaming</router-link>
      </div>
    </div>

    <!-- Speaker -->
    <div class="border rounded-lg overflow-hidden">
       <button @click="toggleCategory('speaker')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-volume-up text-gray-600 w-5 text-center"></i> Speaker</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'speaker' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'speaker'" class="bg-gray-50 p-2 space-y-1">
         <router-link to="/products?category=audio" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Enceintes Bluetooth</router-link>
         <router-link to="/products?category=audio&search=soundbar" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Soundbars</router-link>
      </div>
    </div>
    
     <!-- Accessoires -->
    <div class="border rounded-lg overflow-hidden">
       <button @click="toggleCategory('accessoires')" class="w-full flex items-center justify-between p-3 bg-white text-gray-700 font-medium hover:bg-gray-50">
        <span class="flex items-center gap-2"><i class="fas fa-tools text-gray-500 w-5 text-center"></i> Accessoires</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'accessoires' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'accessoires'" class="bg-gray-50 p-2 space-y-1">
         <router-link to="/products?category=accessories&search=led" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Lumière LED pour chambre</router-link>
         <router-link to="/products?category=accessories&search=gadget" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Lunettes, gadgets</router-link>
         <router-link to="/products?category=accessories&search=adaptateur" @click="$emit('close')" class="block p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded pl-9">• Adaptateurs, multiprises</router-link>
      </div>
    </div>

     <!-- Offres du jour -->
    <router-link to="/products?promotions=true" class="flex items-center justify-center p-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors mt-4">
       Offres du jour
    </router-link>

    <!-- Logout Button -->
    <div v-if="authStore.isAuthenticated" class="pt-4 border-t border-gray-100 mt-4">
       <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">
         <i class="fas fa-sign-out-alt"></i> Se déconnecter
       </button>
    </div>
    <div v-else class="pt-4 border-t border-gray-100 mt-4">
       <router-link to="/login" class="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors">
         <i class="fas fa-sign-in-alt"></i> Se connecter
       </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const expandedCategory = ref('')

const toggleCategory = (category: string) => {
  if (expandedCategory.value === category) {
    expandedCategory.value = ''
  } else {
    expandedCategory.value = category
  }
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        router.push('/')
        /* emit close event not needed as router push and reactivity will likely close it, 
           but to be safe we can emit close */
    } catch (error) {
        console.error("Logout failed", error)
    }
}
</script>
