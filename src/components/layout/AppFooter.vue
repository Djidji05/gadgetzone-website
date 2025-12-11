<template>
  <footer class="bg-gray-900 text-gray-300 mt-auto font-sans">
    <!-- Newsletter Section -->
    <div class="border-b border-gray-800 bg-gray-800/50">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
              <i class="fas fa-envelope text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-white text-lg font-bold">Inscrivez-vous à notre newsletter</h3>
              <p class="text-sm text-gray-400">Recevez nos dernières offres et promotions exclusives</p>
            </div>
          </div>
          <div class="w-full md:w-auto flex-1 max-w-md">
            <div class="relative">
              <input 
                v-model="newsletterEmail"
                type="email" 
                placeholder="Votre adresse email" 
                @keyup.enter="subscribeNewsletter"
                class="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              >
              <button 
                @click="subscribeNewsletter"
                :disabled="isSubscribing"
                class="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubscribing ? 'En cours...' : "S'inscrire" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <i class="fas fa-bolt text-white text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-white tracking-tight">GadgetZone</span>
          </div>
          <p class="text-gray-400 leading-relaxed">
            Votre destination numéro un pour les gadgets high-tech et l'électronique en Haïti. Qualité garantie et service exceptionnel.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group">
              <i class="fab fa-facebook-f text-lg group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group">
              <i class="fab fa-instagram text-lg group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300 group">
              <i class="fab fa-twitter text-lg group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300 group">
              <i class="fab fa-whatsapp text-lg group-hover:scale-110 transition-transform"></i>
            </a>
          </div>
        </div>

        <!-- Shop Links -->
        <div>
          <h4 class="text-white text-lg font-bold mb-6 relative inline-block">
            Boutique
            <span class="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500 rounded-full"></span>
          </h4>
          <ul class="space-y-3">
            <li>
              <router-link to="/products?category=smartphone" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Smartphones
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=laptop" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Laptops & Ordinateurs
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=gaming" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Gaming & Consoles
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=audio" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Audio & Son
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=accessories" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Accessoires
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support Links -->
        <div>
          <h4 class="text-white text-lg font-bold mb-6 relative inline-block">
            Service Client
            <span class="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500 rounded-full"></span>
          </h4>
          <ul class="space-y-3">
            <li>
              <router-link to="/account" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Votre compte
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Vos Commandes
              </router-link>
            </li>
            <li>
              <router-link to="/wishlist" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Votre Liste d'envies
              </router-link>
            </li>
            <li>
              <router-link to="/notifications" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Vos Notifications
              </router-link>
            </li>
            <li>
              <router-link to="/addresses" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Vos Adresses
              </router-link>
            </li>
            <li>
              <router-link to="/faq" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                FAQ
              </router-link>
            </li>
            <li>
              <router-link to="/shipping" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Livraison & Suivi
              </router-link>
            </li>
            <li>
              <router-link to="/returns" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Retours & Remboursements
              </router-link>
            </li>
            <li>
              <router-link to="/warranty" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Garantie
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-orange-500 transition-colors"></i>
                Nous Contacter
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-white text-lg font-bold mb-6 relative inline-block">
            Contactez-nous
            <span class="absolute -bottom-2 left-0 w-1/2 h-1 bg-orange-500 rounded-full"></span>
          </h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-orange-500">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <span>Delmas 32, #45<br>Port-au-Prince, Haïti</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-orange-500">
                <i class="fas fa-phone-alt"></i>
              </div>
              <span class="font-semibold text-white">+509 34 56 78 90</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-orange-500">
                <i class="fas fa-envelope"></i>
              </div>
              <span class="hover:text-orange-400 transition-colors cursor-pointer">contact@gadgetzone.ht</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-orange-500">
                <i class="fas fa-clock"></i>
              </div>
              <span class="text-sm">
                Lun - Ven: 9h - 18h<br>
                Sam: 9h - 15h
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800 bg-gray-950">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500">
            &copy; 2024 GadgetZone. Tous droits réservés.
          </p>
          
          <!-- Payment Icons -->
          <div class="flex items-center gap-3">
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" class="h-3 w-auto">
            </div>
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" class="h-4 w-auto">
            </div>
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center">
              <span class="text-xs font-bold text-gray-800">MonCash</span>
            </div>
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center">
              <span class="text-xs font-bold text-gray-800">NatCash</span>
            </div>
          </div>

          <div class="flex gap-6 text-sm">
            <router-link to="/privacy" class="text-gray-500 hover:text-white transition-colors">Confidentialité</router-link>
            <router-link to="/terms" class="text-gray-500 hover:text-white transition-colors">Conditions</router-link>
            <router-link to="/sitemap" class="text-gray-500 hover:text-white transition-colors">Plan du site</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { newsletterService } from '@/services/newsletter'

const newsletterEmail = ref('')
const isSubscribing = ref(false)

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    alert('Veuillez entrer une adresse email valide')
    return
  }

  try {
    isSubscribing.value = true
    
    const response = await newsletterService.subscribe(newsletterEmail.value)
    alert(response.message)
    newsletterEmail.value = ''
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error)
    const message = error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    alert(message)
  } finally {
    isSubscribing.value = false
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
