<template>
  <div class="container mx-auto px-4 py-8 pb-24">
      <div class="flex items-center gap-3 mb-8">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div>
              <h1 class="text-2xl font-bold text-gray-900">Booster Visibilité</h1>
              <p class="text-sm text-gray-500">Mettez vos produits en avant</p>
          </div>
      </div>

      <!-- Hero Promo -->
      <div class="bg-gray-900 rounded-3xl p-6 text-white mb-8 relative overflow-hidden shadow-xl">
          <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-2">Vendez 5x plus vite</h2>
              <p class="text-sm text-gray-400 mb-6">En boostant vos produits, ils apparaissent en haut des résultats de recherche et sur la page d'accueil.</p>
              <div class="flex items-center gap-2 text-orange-400 font-bold mb-6">
                  <i class="fas fa-bolt"></i>
                  <span>+450% de vues en moyenne</span>
              </div>
          </div>
          <i class="fas fa-rocket absolute -right-6 -bottom-6 text-[150px] text-white/5 -rotate-12"></i>
      </div>

      <!-- Boost Packages -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Choisissez un pack</h3>
      <div class="space-y-4 mb-8">
          <div v-for="pkg in packages" :key="pkg.name" class="bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group" :class="selectedPackage === pkg.name ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 hover:border-gray-200'" @click="selectedPackage = pkg.name">
              <div v-if="pkg.popular" class="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Populaire</div>
              <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-gray-900">{{ pkg.name }}</span>
                  <span class="text-xl font-black text-gray-900">{{ pkg.price }} <span class="text-xs">HTG</span></span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                  <i class="fas fa-calendar-alt text-orange-400"></i>
                  <span>Durée : {{ pkg.duration }} jours</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <i class="fas fa-eye text-orange-400"></i>
                  <span>Visibilité : {{ pkg.impact }}</span>
              </div>
          </div>
      </div>

      <!-- Product Selection -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Produit à booster</h3>
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 cursor-pointer active:scale-[0.98] transition-all">
          <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <i class="fas fa-shopping-bag"></i>
              </div>
              <div>
                  <p class="text-sm font-bold text-gray-800">Sélectionner un produit</p>
                  <p class="text-[10px] text-gray-400">Appuyez pour choisir dans votre catalogue</p>
              </div>
          </div>
          <i class="fas fa-chevron-right text-xs text-gray-300"></i>
      </div>

      <!-- Footer Action -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 items-center z-50">
          <div class="hidden md:block">
              <p class="text-[10px] text-gray-400 uppercase font-bold">Total à payer</p>
              <p class="text-lg font-bold text-gray-900">0 HTG</p>
          </div>
          <button class="flex-1 bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all">
              Activer le Boost
          </button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedPackage = ref('Standard');

const packages = [
    { name: 'Essentiel', price: 250, duration: 3, impact: 'Basique', popular: false },
    { name: 'Standard', price: 500, duration: 7, impact: 'Élevée', popular: true },
    { name: 'Premium', price: 1500, duration: 30, impact: 'Maximale', popular: false }
];
</script>
