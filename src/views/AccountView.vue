<template>
  <div class="container mx-auto px-4 pt-16 md:pt-20 pb-32">
    <!-- 1. Informations utilisateur (Profil) - En haut de la page -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full transform translate-x-10 -translate-y-10 blur-2xl"></div>
      
      <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <!-- Photo de profil (avatar) -->
        <div class="relative group">
          <div class="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.customer?.firstName || 'U')}&background=random&size=128`"
              alt="Profile"
              class="w-full h-full object-cover"
            />
          </div>
          <button class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors">
            <i class="fas fa-camera text-xs"></i>
          </button>
        </div>

        <div class="text-center md:text-left flex-1">
          <!-- Nom et prénom -->
          <h1 class="text-2xl font-bold text-gray-900">
            {{ authStore.customer?.firstName }} {{ authStore.customer?.lastName }}
          </h1>
          
          <!-- Adresse e-mail -->
          <p class="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
            <i class="far fa-envelope"></i>
            {{ authStore.customer?.email }}
          </p>

          <!-- Bouton Modifier le profil -->
          <div class="mt-4">
             <button @click="openProfileEdit" class="text-blue-600 font-semibold hover:text-blue-700 text-sm flex items-center justify-center md:justify-start gap-1">
                <i class="far fa-edit"></i> Modifier le profil
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- 2. Sécurité & connexion -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
             <i class="fas fa-shield-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900">Sécurité & connexion</h2>
        </div>
        <div class="p-2">
           <button @click="openPasswordChange" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Changer le mot de passe</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
           <button @click="openConnections" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Méthodes de connexion</span>
              <span class="text-xs text-gray-500">Email, Google</span>
           </button>
           <button @click="open2FA" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Double authentification (2FA)</span>
              <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Désactivé</span>
           </button>
           <div class="p-2 mt-2 border-t border-gray-50">
             <button @click="handleLogout" class="w-full py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
             </button>
           </div>
        </div>
      </div>

      <!-- 3. Commandes / Activités -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
             <i class="fas fa-box"></i>
           </div>
           <h2 class="font-bold text-gray-900">Commandes & Activités</h2>
        </div>
        <div class="p-2">
           <router-link to="/orders" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Mes commandes</span>
              <span class="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] flex items-center justify-center font-bold" v-if="ordersCount > 0">{{ ordersCount }}</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs" v-else></i>
           </router-link>
           <button @click="openTracking" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Suivi de livraison</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
           <button @click="openPaymentHistory" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Historique des paiements</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
        </div>
      </div>

      <!-- 4. Paiement -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
             <i class="fas fa-credit-card"></i>
           </div>
           <h2 class="font-bold text-gray-900">Paiement</h2>
        </div>
        <div class="p-2">
           <button @click="openPaymentAdd" class="w-full py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
              <i class="fas fa-plus"></i> Ajouter un moyen de paiement
           </button>
        </div>
      </div>

      <!-- 5. Adresses -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
             <i class="fas fa-map-marker-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900">Adresses</h2>
        </div>
        <div class="p-2">
           <router-link to="/addresses" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Mes adresses</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <router-link to="/addresses" class="w-full py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
              <i class="fas fa-plus"></i> Ajouter une adresse
           </router-link>
        </div>
      </div>

       <!-- 6. Préférences -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
             <i class="fas fa-cog"></i>
           </div>
           <h2 class="font-bold text-gray-900">Préférences</h2>
        </div>
        <div class="p-2 space-y-1">
           <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Langue</span>
              <span class="text-sm font-medium text-gray-900">Français</span>
           </button>
           <button @click="openNotifications" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Notifications</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
        </div>
      </div>

       <!-- 7. Aide & support -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
             <i class="fas fa-life-ring"></i>
           </div>
           <h2 class="font-bold text-gray-900">Aide & support</h2>
        </div>
        <div class="p-2">
           <router-link to="/faq" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Centre d’aide / FAQ</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <router-link to="/contact" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Contacter le support</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <router-link to="/report-issue" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Signaler un problème</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
        </div>
      </div>

       <!-- 8. Informations légales -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
             <i class="fas fa-file-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900">Informations légales</h2>
        </div>
        <div class="p-2">
           <router-link to="/terms" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Conditions d’utilisation</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <router-link to="/privacy" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left text-gray-700">
              <span>Politique de confidentialité</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Profile Modal -->
    <Modal v-model:isOpen="showProfileModal" title="Modifier le profil">
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <Input v-model="profileForm.firstName" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <Input v-model="profileForm.lastName" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input v-model="profileForm.email" type="email" required />
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showProfileModal = false" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
          <button @click="saveProfile" :disabled="isSavingProfile" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">Enregistrer</button>
        </div>
      </template>
    </Modal>

    <!-- Tracking Modal -->
    <Modal v-model:isOpen="showTrackingModal" title="Suivi de livraison">
       <div class="space-y-4">
          <p class="text-gray-600 text-sm">Entrez votre numéro de commande ou de suivi pour voir le statut de votre expédition.</p>
          <div class="flex gap-2">
             <Input v-model="trackingId" placeholder="Ex: GZ-123456" class="flex-1" />
             <button @click="trackOrder" class="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">Suivre</button>
          </div>
          <div v-if="trackedOrder" class="bg-blue-50 p-4 rounded-lg border border-blue-100">
             <div class="flex justify-between items-center mb-2">
                <h4 class="font-bold text-blue-900">Commande {{ trackedOrder.orderNumber }}</h4>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] uppercase font-bold', trackedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700']">
                  {{ trackedOrder.status }}
                </span>
             </div>
             <p class="text-sm text-blue-800">Status: {{ trackedStatus }}</p>
          </div>
          <div v-else-if="isTracking" class="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center">
             <i class="fas fa-spinner fa-spin text-blue-500 text-2xl mb-2"></i>
          </div>
       </div>
    </Modal>

    <!-- Payment History Modal -->
    <Modal v-model:isOpen="showPaymentHistoryModal" title="Historique des paiements">
       <div class="space-y-2">
          <div v-if="paymentHistory.length === 0" class="py-12 text-center text-gray-500">
             <i class="fas fa-receipt text-3xl mb-2 block"></i>
             Aucun historique de paiement.
          </div>
          <div v-for="payment in paymentHistory" :key="payment.id" class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
             <div>
                <div class="font-medium text-gray-900">{{ payment.amount }} HTG</div>
                <div class="text-[10px] text-gray-500">{{ payment.date }} • {{ payment.method }}</div>
             </div>
             <span :class="['px-2 py-1 text-[10px] rounded-full font-bold uppercase', payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700']">{{ payment.status }}</span>
          </div>
       </div>
    </Modal>

    <!-- Other Modals (Omitted for brevity but kept in logic) -->
    <Modal v-model:isOpen="showPasswordModal" title="Changer le mot de passe"></Modal>
    <Modal v-model:isOpen="showNotificationsModal" title="Notifications"></Modal>
    <Modal v-model:isOpen="show2FAModal" title="Sécurité"></Modal>
    <Modal v-model:isOpen="showConnectionsModal" title="Connexions"></Modal>
    <Modal v-model:isOpen="showPaymentModal" title="Moyens de paiement"></Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { ordersService } from '@/services/orders'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const ordersCount = ref(0)
const paymentHistory = ref<any[]>([])
const trackedOrder = ref<any>(null)
const trackedStatus = ref('')
const isTracking = ref(false)
const isSavingProfile = ref(false)
const trackingId = ref('')

const showProfileModal = ref(false)
const showPaymentModal = ref(false)
const showPasswordModal = ref(false)
const showNotificationsModal = ref(false)
const showTrackingModal = ref(false)
const showPaymentHistoryModal = ref(false)
const show2FAModal = ref(false)
const showConnectionsModal = ref(false)

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  try {
    const orders = await ordersService.getCustomerOrders()
    ordersCount.value = orders.length
  } catch (error) {
    console.error('Error fetching orders count:', error)
  }
})

const openProfileEdit = () => {
  if (authStore.customer) {
    profileForm.value = {
      firstName: authStore.customer.firstName || '',
      lastName: authStore.customer.lastName || '',
      email: authStore.customer.email || '',
      phone: authStore.customer.phone || ''
    }
    showProfileModal.value = true
  }
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    await authStore.updateProfile(profileForm.value)
    showProfileModal.value = false
    uiStore.showToast('Profil mis à jour !', 'success')
  } catch (error) {
    uiStore.showToast('Erreur lors de la mise à jour.', 'error')
  } finally {
    isSavingProfile.value = false
  }
}

const openTracking = () => {
  showTrackingModal.value = true
}

const trackOrder = async () => {
  if (!trackingId.value) return
  try {
    isTracking.value = true
    const order = await ordersService.trackOrder(trackingId.value)
    trackedOrder.value = order
    const statuses: any = {
      'pending': 'En attente',
      'confirmed': 'Payée',
      'processing': 'Préparation',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    }
    trackedStatus.value = statuses[order.status] || order.status
  } catch (error) {
    uiStore.showToast('Commande introuvable.', 'error')
  } finally {
    isTracking.value = false
  }
}

const openPaymentHistory = async () => {
  try {
    const orders = await ordersService.getCustomerOrders()
    paymentHistory.value = orders.map(o => ({
      id: o.id,
      date: new Date(o.createdAt).toLocaleDateString(),
      amount: o.total,
      status: ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.status) ? 'completed' : 'pending',
      method: typeof o.paymentMethod === 'string' ? o.paymentMethod : (o.paymentMethod as any)?.type || 'Carte'
    }))
    showPaymentHistoryModal.value = true
  } catch (error) {
    uiStore.showToast('Erreur historique.', 'error')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const openPasswordChange = () => showPasswordModal.value = true
const openNotifications = () => showNotificationsModal.value = true
const open2FA = () => show2FAModal.value = true
const openConnections = () => showConnectionsModal.value = true
const openPaymentAdd = () => showPaymentModal.value = true

</script>
