<template>
  <div class="container mx-auto px-4 py-8 pb-24">
      <div class="flex items-center gap-3 mb-8">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div>
              <h1 class="text-2xl font-bold text-gray-900">Communauté</h1>
              <p class="text-sm text-gray-500">Échangez avec les autres vendeurs</p>
          </div>
      </div>

      <!-- Main Group CTA -->
      <div class="bg-green-600 rounded-3xl p-6 text-white mb-8 shadow-lg shadow-green-100 relative overflow-hidden">
          <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-2">Rejoindre le Club VIP</h2>
              <p class="text-sm text-green-100 mb-6">Accédez au groupe WhatsApp officiel des vendeurs certifiés GadgetZone.</p>
              <button class="bg-white text-green-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-50 transition-colors shadow-sm">
                  <i class="fab fa-whatsapp text-lg"></i>
                  Intégrer le groupe
              </button>
          </div>
          <i class="fas fa-users-cog absolute -right-6 -bottom-6 text-[150px] text-white/10 rotate-12"></i>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="bg-white p-3 rounded-2xl border border-gray-100 text-center">
              <p class="text-lg font-black text-gray-900 line-none">1.2k</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase">Membres</p>
          </div>
          <div class="bg-white p-3 rounded-2xl border border-gray-100 text-center">
              <p class="text-lg font-black text-gray-900 line-none">45</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase">Actifs</p>
          </div>
          <div class="bg-white p-3 rounded-2xl border border-gray-100 text-center">
              <p class="text-lg font-black text-gray-900 line-none">12</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase">Experts</p>
          </div>
      </div>

      <!-- Forum Preview -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Discussions du jour</h3>
      <div class="space-y-4">
          <div v-for="post in forumPosts" :key="post.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-green-200 transition-colors">
              <div class="flex items-center gap-2 mb-3">
                  <img :src="post.avatar" class="w-6 h-6 rounded-full bg-gray-100" />
                  <span class="text-xs font-bold text-gray-700">{{ post.author }}</span>
                  <span class="text-[10px] text-gray-400 ml-auto">{{ post.time }}</span>
              </div>
              <h4 class="font-bold text-sm text-gray-900 mb-1">{{ post.title }}</h4>
              <p class="text-xs text-gray-500 line-clamp-2 mb-3">{{ post.content }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-400 font-bold">
                  <span class="flex items-center gap-1"><i class="far fa-comment"></i> {{ post.comments }}</span>
                  <span class="flex items-center gap-1"><i class="far fa-heart"></i> {{ post.likes }}</span>
              </div>
          </div>
      </div>

      <!-- Create Post FAB -->
      <button class="fixed bottom-24 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-xl active:scale-95 transition-all z-50">
          <i class="fas fa-plus"></i>
      </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const forumPosts = ref([
    {
        id: 1,
        author: "Jean-Pierre G.",
        avatar: "https://i.pravatar.cc/150?u=jp",
        time: "Il y a 10 min",
        title: "Retard de livraison avec Natcom ?",
        content: "Est-ce que d'autres vendeurs rencontrent des délais plus longs cette semaine sur Pétion-Ville ?",
        comments: 12,
        likes: 5
    },
    {
        id: 2,
        author: "Sarah L.",
        avatar: "https://i.pravatar.cc/150?u=sl",
        time: "Il y a 1h",
        title: "Nouveau stock d'iPhone 16 dispo !",
        content: "Si quelqu'un cherche un fournisseur fiable, je viens de recevoir un gros lot. Mp pour les tarifs pro.",
        comments: 45,
        likes: 28
    },
    {
        id: 3,
        author: "GadgetZone Team",
        avatar: "/logo_mini.png",
        time: "Il y a 3h",
        title: "Badge 'Vendeur de Confiance'",
        content: "Nous lançons un nouveau système de vérification pour récompenser les meilleurs d'entre vous. Plus d'infos ici.",
        comments: 8,
        likes: 102
    }
]);
</script>
