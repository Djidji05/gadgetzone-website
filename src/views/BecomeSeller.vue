<template>
  <div class="container mx-auto px-4 py-8 pb-24">
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Devenir Vendeur sur GadgetZone</h1>
      <p class="mb-8 text-center text-gray-600 dark:text-gray-400">
        Rejoignez notre marketplace et commencez à vendre vos produits à des milliers de clients.
        Remplissez le formulaire ci-dessous pour soumettre votre candidature.
      </p>

      <div v-if="existingApplication" class="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              Vous avez déjà une candidature en cours (Statut : <strong>{{ existingApplication.status }}</strong>).
              Vous pouvez modifier les informations ci-dessous et renvoyer votre demande.
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitApplication" class="space-y-6">
        <!-- Informations Boutique -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Informations de la Boutique</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="storeName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de la boutique</label>
              <input
                type="text"
                id="storeName"
                v-model="form.storeName"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ma Super Boutique"
              />
            </div>

            <div>
              <label for="storeDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                id="storeDescription"
                v-model="form.storeDescription"
                rows="4"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Décrivez votre boutique et vos produits..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Informations Légales (Simplifiées) -->
        <!-- "Type d'entreprise" removed by user request -->

        <!-- Informations Propriétaire -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Informations du Propriétaire</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="ownerAddress" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Adresse complète</label>
              <input
                type="text"
                id="ownerAddress"
                v-model="form.address"
                required
                placeholder="Ex: 12 Rue de la Paix, Port-au-Prince"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label for="ownerWhatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Numéro WhatsApp</label>
              <input
                type="tel"
                id="ownerWhatsapp"
                v-model="form.whatsapp"
                required
                placeholder="+509 XXXX XXXX"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pièce d'identité (Carte ID, Passeport...)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                <div class="space-y-1 text-center">
                  <div v-if="!form.identityData" class="flex flex-col items-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600 dark:text-gray-400">
                      <label for="identity-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                        <span>Téléverser un fichier</span>
                        <input id="identity-upload" name="identity-upload" type="file" class="sr-only" @change="handleFileUpload" accept="image/*,.pdf" />
                      </label>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF jusqu'à 5MB</p>
                  </div>
                  <div v-else class="flex flex-col items-center">
                    <p class="text-sm text-green-600 font-medium my-2">✅ Fichier sélectionné</p>
                    <button type="button" @click="form.identityData = '';" class="text-xs text-red-500 hover:underline">Supprimer</button>
                    <img v-if="form.identityData.startsWith('data:image')" :src="form.identityData" class="mt-2 h-24 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations Produits -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Type de Produits</h2>
          <div>
            <label for="productStyle" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quels types de produits comptez-vous vendre ?</label>
            <textarea
              id="productStyle"
              v-model="form.productStyle"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: Électronique, Vêtements, Accessoires fait main..."
            ></textarea>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            J'accepte les <router-link to="/terms" target="_blank" class="text-brand-600 hover:text-brand-500 font-medium">conditions générales de vente</router-link> de la marketplace.
          </label>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="hidden md:flex w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Envoi en cours...' : (existingApplication ? 'Mettre à jour ma candidature' : 'Envoyer ma candidature') }}
        </button>
      </form>
    </div>

    <!-- Mobile Sticky Bottom Action Bar -->
    <div class="md:hidden fixed bottom-[65px] left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
            @click="submitApplication" 
            :disabled="loading"
            class="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
           <i class="fas fa-paper-plane mr-2 mt-0.5"></i>
           {{ loading ? 'Envoi...' : (existingApplication ? 'Mettre à jour' : 'Envoyer candidature') }}
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useAuthStore } from '@/stores/auth'; // Assuming auth store exists
// import api from '@/services/api'; // Assuming api service exists

import api from '@/services/api';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = reactive({
  storeName: '',
  storeDescription: '',
  businessType: 'individual',
  taxId: '',
  address: '',
  whatsapp: '',
  productStyle: '',
  identityData: '', // Base64 string
  acceptTerms: false
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      form.identityData = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const existingApplication = ref<any>(null);

const checkApplicationStatus = async () => {
    try {
        const response = await api.get('/vendors/me');
        if (response.data) {
            const store = response.data;
            
            // Si approuvé ou suspendu, rediriger vers le tableau de bord vendeur interne
            if (store.status === 'active' || store.status === 'suspended') {
                router.push('/seller/dashboard');
                return;
            }

            existingApplication.value = store;
            // Pre-fill form if desired, or just show status
             form.storeName = response.data.name;
             form.storeDescription = response.data.description;
             // settings
             if(response.data.settings) {
                 form.businessType = response.data.settings.businessType || 'individual';
                 form.taxId = response.data.settings.taxId || '';
                 form.address = response.data.settings.address || '';
                 form.whatsapp = response.data.settings.whatsapp || '';
                 form.productStyle = response.data.settings.productStyle || '';
                 // identity is not pre-filled mostly for security/size reasons, but we can set a flag
             }
        }
    } catch (e: any) {
        // 404 means no store, which is fine
        if (e.response?.status !== 404) {
            console.error("Error checking status", e);
        }
    }
};

onMounted(() => {
    checkApplicationStatus();
});

const submitApplication = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (!form.identityData && !existingApplication.value) {
       throw new Error("Veuillez téléverser une pièce d'identité.");
    }
    
    // If updating, identity is optional (keep old one) unless user provides new one
    // But backend might need logic. Let's send what we have.

    let response;
    if (existingApplication.value) {
        const confirmUpdate = confirm("Vous avez déjà une candidature en cours. Voulez-vous vraiment mettre à jour les informations et renvoyer votre demande ?");
        if (!confirmUpdate) {
            loading.value = false;
            return;
        }
        response = await api.put('/vendors/apply', form);
    } else {
        response = await api.post('/vendors/apply', form);
    }
    
    // Redirect to success/confirmation page or Show success message
    const msg = existingApplication.value 
        ? 'Candidature mise à jour avec succès !' 
        : (response.data.message || 'Candidature envoyée avec succès! En attente de validation.');
    
    alert(msg);
    router.push('/account'); // Redirect to Account page
  } catch (err: any) {
    console.error(err);
    if (err.response?.data?.error === 'Application exists') {
        // Should not happen if we check on mount, but just in case
        alert("Une candidature existe déjà. Veuillez recharger la page pour la voir.");
        checkApplicationStatus();
    } else {
        error.value = err.response?.data?.message || err.message || 'Une erreur est survenue.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
