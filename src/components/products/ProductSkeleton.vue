<template>
  <div 
    class="bg-white rounded-2xl p-2 md:p-3 shadow-sm border border-gray-100 h-full flex flex-col animate-pulse"
  >
    <!-- Image Skeleton -->
    <div class="w-full aspect-square bg-gray-200 rounded-xl mb-3"></div>

    <!-- Content Skeleton -->
    <div class="flex-1 space-y-3 px-1">
      <!-- Title -->
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      
      <!-- Vendor -->
      <div class="flex items-center gap-2 py-1">
        <div class="w-4 h-4 rounded-full bg-gray-100"></div>
        <div class="h-3 bg-gray-100 rounded w-1/3"></div>
      </div>

      <!-- Price & Badge -->
      <div class="mt-auto pt-4 flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-6 bg-gray-200 rounded w-20"></div>
          <div class="h-3 bg-gray-100 rounded w-16"></div>
        </div>
        <!-- cart button -->
        <div class="w-10 h-10 rounded-full bg-gray-100"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple static skeleton
</script>
