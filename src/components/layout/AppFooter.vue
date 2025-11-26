<template>
  <footer class="bg-gray-900 text-white mt-auto">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <i class="las la-store text-white text-xl"></i>
            </div>
            <span class="text-xl font-bold">GadgetZone</span>
          </div>
          <p class="text-gray-400 mb-4">
            Votre destination pour les meilleurs gadgets et électroniques en Haïti.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="lab la-facebook text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="lab la-instagram text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="lab la-twitter text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="lab la-whatsapp text-xl"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Liens Rapides</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
                Accueil
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="text-gray-400 hover:text-white transition-colors">
                Produits
              </router-link>
            </li>
            <li>
              <router-link
                to="/promotions"
                class="text-gray-400 hover:text-white transition-colors"
              >
                Promotions
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-gray-400 hover:text-white transition-colors">
                À Propos
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-400 hover:text-white transition-colors">
                Contact
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Service Client</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/faq" class="text-gray-400 hover:text-white transition-colors">
                FAQ
              </router-link>
            </li>
            <li>
              <router-link to="/shipping" class="text-gray-400 hover:text-white transition-colors">
                Livraison
              </router-link>
            </li>
            <li>
              <router-link to="/returns" class="text-gray-400 hover:text-white transition-colors">
                Retours
              </router-link>
            </li>
            <li>
              <router-link to="/warranty" class="text-gray-400 hover:text-white transition-colors">
                Garantie
              </router-link>
            </li>
            <li>
              <router-link to="/support" class="text-gray-400 hover:text-white transition-colors">
                Support
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <i class="las la-phone text-primary-500"></i>
              <span class="text-gray-400">+509 34 56 78 90</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="las la-envelope text-primary-500"></i>
              <span class="text-gray-400">contact@gadgetzone.ht</span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="las la-map-marker-alt text-primary-500"></i>
              <span class="text-gray-400">
                Port-au-Prince, Haïti<br />
                Delmas 32, #45
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <i class="las la-clock text-primary-500"></i>
              <span class="text-gray-400">
                Lun-Ven: 9h-18h<br />
                Sam: 9h-15h
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h4 class="text-sm font-semibold mb-2">Méthodes de Paiement</h4>
            <div class="flex space-x-4">
              <div class="w-12 h-8 bg-white rounded flex items-center justify-center">
                <span class="text-xs font-bold text-gray-800">Visa</span>
              </div>
              <div class="w-12 h-8 bg-white rounded flex items-center justify-center">
                <span class="text-xs font-bold text-gray-800">Natcash</span>
              </div>
              <div class="w-12 h-8 bg-white rounded flex items-center justify-center">
                <span class="text-xs font-bold text-gray-800">MonCash</span>
              </div>
              <div class="w-12 h-8 bg-white rounded flex items-center justify-center">
                <span class="text-xs font-bold text-gray-800">Zelle</span>
              </div>
            </div>
          </div>

          <div class="text-center md:text-right">
            <p class="text-gray-400 text-sm">© 2024 GadgetZone. Tous droits réservés.</p>
            <div class="mt-2 space-x-4">
              <router-link
                to="/privacy"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Confidentialité
              </router-link>
              <router-link
                to="/terms"
                class="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Conditions
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component - no additional logic needed
</script>
