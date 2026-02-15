<template>
  <div class="container mx-auto px-4 pt-2 md:pt-8 pb-24 md:pb-0">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen bg-gray-50 rounded-3xl overflow-hidden shadow-sm md:shadow-md -mx-4 md:mx-0">

    <!-- Top Header -->
    <div class="bg-white sticky top-0 z-30 px-4 pt-2 pb-4 shadow-sm">
        <div class="flex items-center gap-3">
            <button @click="router.back()" class="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <i class="fas fa-arrow-left text-gray-600"></i>
            </button>
            <h1 class="text-xl font-bold text-gray-900">Paramètres</h1>
        </div>
    </div>

    <div class="flex-1 px-4 py-6">
        <form @submit.prevent="saveSettings" class="space-y-6 max-w-lg mx-auto">
            <!-- Profile Photo Section -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                <div class="relative group">
                    <div class="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-50 shadow-inner flex items-center justify-center">
                        <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-cover" />
                        <i v-else class="fas fa-store text-4xl text-gray-200"></i>
                    </div>
                    <!-- Hidden File Input -->
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*" />
                </div>
                
                <button 
                  type="button" 
                  @click="$refs.fileInput.click()" 
                  class="mt-4 px-6 py-2 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm"
                  :class="form.logoUrl ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-900 text-white shadow-blue-200'"
                >
                    <i class="fas" :class="form.logoUrl ? 'fa-sync-alt mr-2' : 'fa-plus mr-2'"></i>
                    {{ form.logoUrl ? 'Changer profil' : 'Ajouter profil' }}
                </button>
                <p class="text-[10px] text-gray-400 mt-2 uppercase font-black tracking-widest">Logo de la boutique</p>
            </div>

            <!-- Form Section -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div>
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-1">Nom de la boutique</label>
                    <input 
                        v-model="form.name" 
                        type="text" 
                        required 
                        placeholder="Ex: Ma Boutique"
                        class="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-bold placeholder-gray-300" 
                    />
                </div>

                <div>
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-1">Description</label>
                    <textarea 
                        v-model="form.description" 
                        rows="4" 
                        placeholder="Parlez-nous de votre commerce..."
                        class="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium placeholder-gray-300 resize-none"
                    ></textarea>
                </div>
            </div>

            <!-- Save Button (Desktop Only) -->
            <button 
                type="submit" 
                :disabled="saving || saveSuccess" 
                :class="saveSuccess ? 'bg-green-600 shadow-green-100' : 'bg-gray-900 shadow-gray-200'"
                class="hidden md:flex w-full text-white rounded-2xl py-4 font-bold text-sm shadow-xl active:scale-[0.98] transition-all items-center justify-center gap-2"
            >
                <i v-if="saving" class="fas fa-circle-notch animate-spin"></i>
                <i v-else-if="saveSuccess" class="fas fa-check"></i>
                {{ saving ? 'Enregistrement...' : (saveSuccess ? 'Modifications enregistrées' : 'Enregistrer les modifications') }}
            </button>
        </form>
    </div>

    <!-- Mobile Sticky Bottom Action Bar -->
    <div class="md:hidden fixed bottom-[65px] left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
            @click="saveSettings" 
            :disabled="saving || saveSuccess"
            :class="saveSuccess ? 'bg-green-600 shadow-green-100' : 'bg-gray-900 shadow-gray-200'"
            class="w-full text-white rounded-2xl py-4 font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            <i v-if="saving" class="fas fa-circle-notch animate-spin"></i>
            <i v-else-if="saveSuccess" class="fas fa-check"></i>
            {{ saving ? 'Enregistrement...' : (saveSuccess ? 'Enregistrer' : 'Enregistrer les modifications') }}
        </button>
    </div>

  </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter();

const fileInput = ref<HTMLInputElement | null>(null);
const saving = ref(false);
const saveSuccess = ref(false);
const form = reactive({
    name: '',
    description: '',
    logoUrl: ''
});

onMounted(async () => {
    try {
        const res = await api.get('/vendors/me');
        const store = res.data;
        form.name = store.name;
        form.description = store.description || '';
        form.logoUrl = store.logoUrl || '';
    } catch (e) {
        console.error("Failed to load settings", e);
    }
});

const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validation basic
        if (file.size > 5 * 1024 * 1024) {
            alert("Image trop volumineuse (max 5MB)");
            return;
        }

        const formData = new FormData();
        formData.append('images', file); // Backend expects 'images' field

        try {
            saving.value = true;
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Assume the backend returns the relative path, prepend base URL
            const url = `http://localhost:3003${uploadRes.data.urls[0]}`;
            form.logoUrl = url;
        } catch (e) {
            console.error("Upload failed", e);
            alert("Erreur lors de l'envoi de l'image");
        } finally {
            saving.value = false;
            input.value = ''; // Reset for next selection
        }
    }
};

const saveSettings = async () => {
    saving.value = true;
    try {
        await api.put('/vendors/me', form);
        saveSuccess.value = true;
        setTimeout(() => {
            saveSuccess.value = false;
        }, 3000);
    } catch (e) {
        console.error("Failed to save settings", e);
        alert('Erreur lors de la sauvegarde.');
    } finally {
        saving.value = false;
    }
};
</script>
