<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Vos Adresses</h1>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <i class="fas fa-plus"></i>
          Ajouter une adresse
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Example Address Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group">
          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="text-gray-400 hover:text-blue-600 transition-colors" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-gray-400 hover:text-red-600 transition-colors" title="Supprimer">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">Par défaut</span>
            <h3 class="font-bold text-gray-900">Maison</h3>
          </div>
          
          <div class="text-gray-600 space-y-1 text-sm">
            <p class="font-semibold text-gray-900">Jean Dupont</p>
            <p>123 Rue de la République</p>
            <p>Delmas 32</p>
            <p>Port-au-Prince, Ouest</p>
            <p>Haïti</p>
            <p class="mt-2 text-gray-500">Tél: +509 34 56 78 90</p>
          </div>
        </div>

        <!-- Add Address Card (Empty State style) -->
        <button class="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all min-h-[200px]">
          <i class="fas fa-plus text-3xl mb-2"></i>
          <span class="font-semibold">Ajouter une nouvelle adresse</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic to fetch and manage addresses would go here
</script>
