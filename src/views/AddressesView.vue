<template>
  <div class="container mx-auto px-4 pt-4 pb-8 lg:py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Vos Adresses</h1>
      <button 
        @click="openModal()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Ajouter une adresse
      </button>
    </div>
    
    <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Address Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Address Cards -->
        <div 
          v-for="address in addresses" 
          :key="address.id" 
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group"
        >
          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="openModal(address)"
              class="text-gray-400 hover:text-blue-600 transition-colors" 
              title="Modifier"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deleteAddress(address.id)"
              class="text-gray-400 hover:text-red-600 transition-colors" 
              title="Supprimer"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <span v-if="address.is_default" class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">Par défaut</span>
            <h3 class="font-bold text-gray-900">{{ address.name || 'Adresse' }}</h3>
          </div>
          
          <div class="text-gray-600 space-y-1 text-sm">
            <p class="font-semibold text-gray-900">{{ address.quartier }}</p>
            <p>{{ address.street }}</p>
            <p>{{ address.city }}, {{ address.country }}</p>
            <p v-if="address.whatsapp" class="mt-2 text-green-600 flex items-center gap-1">
              <i class="fab fa-whatsapp"></i> {{ address.whatsapp }}
            </p>
            <p v-if="address.note" class="mt-2 text-gray-400 italic text-xs">
              Note: {{ address.note }}
            </p>
          </div>
        </div>

        <!-- Add Address Button (Card Style) -->
        <button 
          @click="openModal()"
          class="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all min-h-[200px]"
        >
          <i class="fas fa-plus text-3xl mb-2"></i>
          <span class="font-semibold">Ajouter une nouvelle adresse</span>
        </button>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Modifier' : 'Ajouter' }} une adresse</h2>
        
        <form @submit.prevent="saveAddress" class="space-y-4">
          
          <!-- Ville & Quartier -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input v-model="form.city" type="text" required class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Port-au-Prince">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
              <input v-model="form.quartier" type="text" required class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Pétion-Ville">
            </div>
          </div>

          <!-- Rue / Adresse -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse (Rue, Numéro)</label>
            <input v-model="form.street" type="text" required class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 12 Rue Louverture">
          </div>

          <!-- Pays (Default Haiti) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <select v-model="form.country" class="w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none">
              <option value="Haïti">Haïti</option>
              <option value="République Dominicaine">République Dominicaine</option>
              <option value="États-Unis">États-Unis</option>
            </select>
          </div>

          <!-- WhatsApp -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
            <input v-model="form.whatsapp" type="tel" class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: +509 3123 4567">
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note (Instructions)</label>
            <textarea v-model="form.note" rows="2" class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Près de l'église..."></textarea>
          </div>

          <!-- Default Checkbox -->
          <div class="flex items-center gap-2">
            <input v-model="form.is_default" type="checkbox" id="is_default" class="w-4 h-4 text-blue-600 rounded">
            <label for="is_default" class="text-sm text-gray-700">Définir comme adresse par défaut</label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-6">
            <button @click="closeModal" type="button" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {{ isEditing ? 'Mettre à jour' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { addressService, type Address } from '@/services/api'
import { useUiStore } from '@/stores/ui'

const addresses = ref<Address[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const uiStore = useUiStore()

const form = reactive({
  street: '',
  quartier: '',
  city: '',
  country: 'Haïti',
  whatsapp: '',
  note: '',
  is_default: false
})

const fetchAddresses = async () => {
  isLoading.value = true
  try {
    addresses.value = await addressService.getAll()
  } catch (err) {
    console.error(err)
    error.value = "Impossible de charger les adresses."
  } finally {
    isLoading.value = false
  }
}

const openModal = (address?: Address) => {
  if (address) {
    isEditing.value = true
    editingId.value = address.id
    form.street = address.street
    form.quartier = address.quartier
    form.city = address.city
    form.country = address.country
    form.whatsapp = address.whatsapp || ''
    form.note = address.note || ''
    form.is_default = address.is_default
  } else {
    isEditing.value = false
    editingId.value = null
    resetForm()
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.street = ''
  form.quartier = ''
  form.city = ''
  form.country = 'Haïti'
  form.whatsapp = ''
  form.note = ''
  form.is_default = false
}

const saveAddress = async () => {
  try {
    const data = { ...form }
    if (isEditing.value && editingId.value) {
      await addressService.update(editingId.value, data)
    } else {
      await addressService.create(data)
    }
    await fetchAddresses() // Reload list
    closeModal()
  } catch (err: any) {
    console.error(err)
    uiStore.showToast("Erreur lors de la sauvegarde: " + (err.response?.data?.error || err.message), 'error')
  }
}

const deleteAddress = async (id: number) => {
  uiStore.confirm({
    title: 'Supprimer l\'adresse',
    message: 'Voulez-vous vraiment supprimer cette adresse ?',
    type: 'danger',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      try {
        await addressService.delete(id)
        addresses.value = addresses.value.filter(a => a.id !== id)
        uiStore.showToast("Adresse supprimée.", 'info')
      } catch (err) {
        console.error(err)
        uiStore.showToast("Erreur lors de la suppression.", 'error')
      }
    }
  })
}

onMounted(() => {
  fetchAddresses()
})
</script>
