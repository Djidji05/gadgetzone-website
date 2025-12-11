<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Vos Notifications</h1>
      
      <div class="space-y-4">
        <!-- Example Notification -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start gap-4">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-info-circle text-blue-600"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Bienvenue sur GadgetZone !</h3>
            <p class="text-gray-600 text-sm mt-1">Nous sommes ravis de vous compter parmi nous. Profitez de nos offres exclusives.</p>
            <span class="text-xs text-gray-400 mt-2 block">Il y a 2 heures</span>
          </div>
        </div>

        <!-- Empty State (hidden for now as we show example) -->
        <!--
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-bell-slash text-2xl text-gray-400"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h2>
          <p class="text-gray-500">Vous n'avez pas de nouvelles notifications pour le moment.</p>
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic to fetch notifications would go here
</script>
