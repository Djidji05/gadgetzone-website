<template>
  <div class="container mx-auto px-4 py-8 pb-24">
      <div class="flex items-center gap-3 mb-8">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div>
              <h1 class="text-2xl font-bold text-gray-900">Académie Vendeur</h1>
              <p class="text-sm text-gray-500">Formez-vous pour vendre plus et mieux</p>
          </div>
      </div>

      <!-- Featured Course -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
          <div class="relative z-10">
              <span class="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">Nouveau</span>
              <h2 class="text-3xl font-bold mb-2">Maîtriser la photo produit</h2>
              <p class="text-blue-100 mb-6 max-w-md">Apprenez à prendre des photos professionnelles avec votre smartphone pour attirer plus de clients.</p>
              <button class="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">
                  Commencer le cours
              </button>
          </div>
          <i class="fas fa-camera absolute -right-4 -bottom-8 text-[180px] text-white/10 rotate-12"></i>
      </div>

      <!-- Course Categories -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Parcourir par thème</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div v-for="cat in categories" :key="cat.name" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2 hover:border-blue-200 transition-colors cursor-pointer group">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform" :class="cat.bg + ' ' + cat.color">
                  <i :class="cat.icon"></i>
              </div>
              <span class="font-bold text-sm text-gray-700">{{ cat.name }}</span>
          </div>
      </div>

      <!-- Recent Articles -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Articles récents</h3>
      <div class="space-y-4">
          <div v-for="article in articles" :key="article.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
              <div class="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 bg-cover bg-center" :style="{ backgroundImage: `url(${article.image})` }"></div>
              <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                      <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{{ article.category }}</span>
                      <span class="text-[10px] text-gray-400">{{ article.readTime }} min</span>
                  </div>
                  <h4 class="font-bold text-gray-900 leading-tight mb-1">{{ article.title }}</h4>
                  <p class="text-xs text-gray-500 line-clamp-2">{{ article.excerpt }}</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const categories = [
    { name: 'Débuter', icon: 'fas fa-flag', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Marketing', icon: 'fas fa-bullhorn', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Expédition', icon: 'fas fa-box', color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Règles', icon: 'fas fa-gavel', color: 'text-red-600', bg: 'bg-red-50' }
];

const articles = ref([
    {
        id: 1,
        title: "Comment fixer le bon prix pour vos articles ?",
        excerpt: "Découvrez les stratégies pour être compétitif tout en préservant vos marges.",
        category: "Vente",
        readTime: 5,
        image: "https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&q=80"
    },
    {
        id: 2,
        title: "5 astuces pour emballer vos colis comme un pro",
        excerpt: "Un bon emballage réduit les retours et améliore la satisfaction client.",
        category: "Expédition",
        readTime: 3,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80"
    },
    {
        id: 3,
        title: "Comprendre les commissions GadgetZone",
        excerpt: "Tout savoir sur les frais de vente et quand ils sont prélevés.",
        category: "Finance",
        readTime: 4,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80"
    }
]);
</script>
