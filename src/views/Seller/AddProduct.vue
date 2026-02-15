<template>
  <div class="container mx-auto px-4 pt-2 md:pt-8 pb-24 md:pb-0">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">

      <div class="flex items-center gap-4 mb-8">
        <button @click="router.back()" class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm active:scale-90 transition-all">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ isEdit ? 'Modifier le produit' : 'Nouveau produit' }}</h1>
      </div>

      <form @submit.prevent="submitProduct" class="space-y-6">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du produit</label>
          <input v-model="form.name" type="text" required class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Prix -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (HTG)</label>
            <input v-model.number="form.price" type="number" min="0" required class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
            <input v-model.number="form.stock" type="number" min="0" required class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>

        <!-- Catégorie -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
          <select v-model="form.category_id" class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option :value="null">Sélectionner une catégorie</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Images du produit (Max 5)</label>
          
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600 relative">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Ajouter des images</span>
                  <!-- Enable multiple file selection -->
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" accept="image/*" multiple />
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, max 5MB par fichier</p>
            </div>
          </div>

          <!-- Preview Grid -->
          <div v-if="filePreviews.length > 0" class="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
             <div v-for="(preview, index) in filePreviews" :key="index" class="relative group">
                <img :src="preview.url || preview" class="w-full h-24 object-cover rounded-lg border border-gray-200" />
                <button type="button" @click="removeImage(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
          </div>
          
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit Button (Desktop Only) -->
        <button type="submit" :disabled="loading" class="hidden md:flex w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
          {{ loading ? (isEdit ? 'Mise à jour...' : 'Création en cours...') : (isEdit ? 'Enregistrer les modifications' : 'Créer le produit') }}
        </button>
      </form>
    </div>
  </div>

  <!-- Mobile Sticky Bottom Action Bar -->
  <div class="md:hidden fixed bottom-[65px] left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
    <button @click="submitProduct" :disabled="loading" class="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
      <i class="fas fa-save mr-2 mt-0.5"></i>
      {{ loading ? (isEdit ? 'Mise à jour...' : 'Création...') : (isEdit ? 'Enregistrer les modifications' : 'Créer le produit') }}
    </button>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const error = ref('');
const categories = ref<any[]>([]);

const isEdit = computed(() => !!route.params.id);
const productId = computed(() => route.params.id as string);

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 1,
  category_id: null,
  image_url: '',
  images: [] as string[]
});

onMounted(async () => {
    try {
        const res = await api.get('/categories');
        categories.value = res.data;

        if (isEdit.value) {
            fetchProduct();
        }
    } catch (e) {
        console.error("Failed to load categories", e);
    }
});

const fetchProduct = async () => {
    try {
        loading.value = true;
        const res = await api.get(`/products/${productId.value}`);
        const product = res.data;
        
        form.name = product.name;
        form.description = product.description;
        form.price = product.price;
        form.stock = product.stock;
        form.category_id = product.category_id;
        form.image_url = product.image_url;
        form.images = product.images || [];
        
        // Populate previews with existing images
        if (product.image_url) {
            filePreviews.value.push({
                url: product.image_url,
                isNew: false
            });
        }
        if (product.images && product.images.length > 0) {
            product.images.forEach((img: string) => {
                if (img !== product.image_url) {
                    filePreviews.value.push({
                        url: img,
                        isNew: false
                    });
                }
            });
        }
    } catch (err: any) {
        console.error("Failed to fetch product", err);
        error.value = "Erreur lors de la récupération du produit.";
    } finally {
        loading.value = false;
    }
};

const submitProduct = async () => {
  loading.value = true;
  error.value = '';

  try {
     const productData = { ...form };
     
     // If we have NEW files selected, upload them first
     if (selectedFiles.value.length > 0) {
         const formData = new FormData();
         selectedFiles.value.forEach(file => {
             formData.append('images', file);
         });
         
         const uploadRes = await api.post('/upload', formData, {
             headers: {
                 'Content-Type': 'multipart/form-data'
             }
         });
         
         const uploadedUrls = uploadRes.data.urls.map((url: string) => `http://localhost:3003${url}`);
         
         // Combine existing images with new ones
         const allImages = [...form.images, ...uploadedUrls];
         productData.image_url = allImages[0];
         productData.images = allImages;
     }

     if (isEdit.value) {
         // Data already contains updated existing images
         await api.put(`/products/${productId.value}`, productData);
         alert('Produit mis à jour avec succès !');
     } else {
         await api.post('/products', productData);
         alert('Produit créé avec succès !');
     }
     router.push('/seller/products'); 
  } catch (err: any) {
    console.error(err);
    error.value = err.response?.data?.message || err.response?.data?.error || "Erreur lors de la création.";
  } finally {
    loading.value = false;
  }
};

const selectedFiles = ref<File[]>([]);
const filePreviews = ref<any[]>([]); // Can be string URL or File preview

const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const files = Array.from(input.files);
        
        if (filePreviews.value.length + files.length > 5) {
            alert("Maximum 5 images autorisées.");
            return;
        }

        files.forEach(file => {
             if (file.size > 5 * 1024 * 1024) {
                alert(`Fichier ${file.name} trop volumineux (max 5MB)`);
                return;
             }
             selectedFiles.value.push(file);
             
             const reader = new FileReader();
             reader.onload = (e) => {
                 if (e.target?.result) {
                     filePreviews.value.push({
                         url: e.target.result as string,
                         file: file,
                         isNew: true
                     });
                 }
             };
             reader.readAsDataURL(file);
        });
    }
    input.value = '';
};

const removeImage = (index: number) => {
    const preview = filePreviews.value[index];
    if (preview.isNew) {
        const fileIndex = selectedFiles.value.indexOf(preview.file);
        if (fileIndex > -1) selectedFiles.value.splice(fileIndex, 1);
    } else {
        // Remove from existing images
        form.images = form.images.filter(img => img !== preview.url);
        if (form.image_url === preview.url) {
            form.image_url = form.images[0] || '';
        }
    }
    filePreviews.value.splice(index, 1);
};
</script>
