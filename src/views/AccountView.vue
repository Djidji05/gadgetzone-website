<template>
  <div class="container mx-auto px-4 pt-4 pb-24 lg:py-12">
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
           <button @click="openPasswordChange" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Changer le mot de passe</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
           <button @click="openConnections" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Méthodes de connexion</span>
              <span class="text-xs text-gray-500">Email, Google</span>
           </button>
           <button @click="open2FA" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Double authentification (2FA)</span>
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
           <router-link to="/orders" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Mes commandes</span>
              <span class="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold" v-if="ordersCount > 0">{{ ordersCount }}</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs" v-else></i>
           </router-link>
           <button @click="openTracking" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Suivi de livraison</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
           <button @click="openPaymentHistory" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Historique des paiements</span>
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
           <div class="p-3 border border-gray-100 rounded-lg mb-2 bg-gray-50 flex items-center gap-3">
              <i class="fab fa-cc-visa text-2xl text-blue-800"></i>
              <div class="flex-1">
                 <div class="text-sm font-medium">Visa terminant par 4242</div>
                 <div class="text-xs text-gray-500">Expire 12/26</div>
              </div>
           </div>
           <div class="p-3 border border-gray-100 rounded-lg mb-2 bg-gray-50 flex items-center gap-3">
              <div class="font-bold text-red-600 text-lg">M</div>
              <div class="flex-1">
                 <div class="text-sm font-medium">MonCash</div>
                 <div class="text-xs text-gray-500">509 3XXX-XXXX</div>
              </div>
           </div>
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
           <router-link to="/addresses" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Adresse de livraison</span>
              <span class="text-xs text-gray-500">Principal</span>
           </router-link>
           <router-link to="/addresses" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Adresse de facturation</span>
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
           <div class="flex items-center justify-between p-3">
              <span class="text-gray-700 text-sm">Mode sombre</span>
              <button class="w-10 h-5 bg-gray-200 rounded-full relative transition-colors duration-200 focus:outline-none">
                 <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
              </button>
           </div>
           <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Langue</span>
              <span class="text-sm font-medium text-gray-900">Français <i class="fas fa-chevron-right text-xs ml-1"></i></span>
           </button>
           <button @click="openNotifications" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Notifications</span>
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
           <router-link to="/faq" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Centre d’aide / FAQ</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <router-link to="/contact" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Contacter le support</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Signaler un problème</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </button>
        </div>
      </div>

       <!-- 8. Informations légales -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
             <i class="fas fa-file-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900">Informations légales</h2>
        </div>
        <div class="p-2">
           <router-link to="/terms" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Conditions d’utilisation</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <router-link to="/privacy" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span class="text-gray-700">Politique de confidentialité</span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
           </router-link>
           <div class="p-2 mt-2 border-t border-gray-50">
             <button class="w-full py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                Supprimer le compte
             </button>
           </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Profile Modal -->
    <Modal
      v-model:isOpen="showProfileModal"
      title="Modifier le profil"
    >
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
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <Input v-model="profileForm.phone" type="tel" />
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showProfileModal = false" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
          <button @click="saveProfile" :disabled="isSavingProfile" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ isSavingProfile ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Payment Modal -->
    <Modal
      v-model:isOpen="showPaymentModal"
      title="Ajouter un moyen de paiement"
    >
      <form @submit.prevent="savePayment" class="space-y-4">
        <!-- Type Selection -->
        <div class="flex gap-4 p-1 bg-gray-100 rounded-lg mb-4">
          <button type="button" @click="paymentForm.type = 'card'" :class="['flex-1 py-2 text-sm font-medium rounded-md transition-all', paymentForm.type === 'card' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700']">
            Carte Bancaire
          </button>
          <button type="button" @click="paymentForm.type = 'moncash'" :class="['flex-1 py-2 text-sm font-medium rounded-md transition-all', paymentForm.type === 'moncash' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700']">
            MonCash
          </button>
        </div>

        <div v-if="paymentForm.type === 'card'" class="space-y-4">
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
             <div class="relative">
                <Input v-model="paymentForm.cardNumber" placeholder="0000 0000 0000 0000" />
                <i class="fab fa-cc-visa absolute right-3 top-3 text-gray-400 text-lg"></i>
             </div>
           </div>
           <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
               <Input v-model="paymentForm.expiry" placeholder="MM/YY" />
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
               <Input v-model="paymentForm.cvv" placeholder="123" />
             </div>
           </div>
        </div>

        <div v-else class="space-y-4">
           <div class="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-800 mb-4">
              <span class="font-bold text-xl">M</span>
              <p class="text-sm">Paiement mobile rapide et sécurisé avec MonCash.</p>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Numéro MonCash</label>
             <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500">+509</span>
                <Input v-model="paymentForm.monCashNumber" placeholder="3XXX-XXXX" class="pl-14 !pl-14" />
             </div>
           </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showPaymentModal = false" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
          <button @click="savePayment" :disabled="isSavingPayment" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ isSavingPayment ? 'Ajout...' : 'Ajouter' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Password Modal -->
    <Modal v-model:isOpen="showPasswordModal" title="Changer le mot de passe">
       <form @submit.prevent="savePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <Input v-model="passwordForm.current" type="password" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <Input v-model="passwordForm.new" type="password" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
            <Input v-model="passwordForm.confirm" type="password" required />
          </div>
       </form>
       <template #footer>
          <div class="flex justify-end gap-3">
             <button @click="showPasswordModal = false" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
             <button @click="savePassword" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Modifier</button>
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
          <div class="bg-gray-50 p-4 rounded-lg">
             <h4 class="font-medium mb-2">Dernières commandes</h4>
             <div class="text-sm text-gray-500">Aucune commande récente en transit.</div>
          </div>
       </div>
    </Modal>
    
    <!-- Payment History Modal -->
    <Modal v-model:isOpen="showPaymentHistoryModal" title="Historique des paiements">
       <div class="space-y-2">
          <div v-for="payment in paymentHistory" :key="payment.id" class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
             <div>
                <div class="font-medium text-gray-900">{{ payment.amount }} HTG</div>
                <div class="text-xs text-gray-500">{{ payment.date }} • {{ payment.method }}</div>
             </div>
             <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{{ payment.status }}</span>
          </div>
       </div>
    </Modal>

    <!-- Notifications Modal -->
    <Modal v-model:isOpen="showNotificationsModal" title="Préférences de notifications">
       <div class="space-y-4">
          <div class="flex items-center justify-between">
             <div>
                <div class="font-medium">Emails promotionnels</div>
                <div class="text-xs text-gray-500">Offres spéciales et nouveautés</div>
             </div>
             <input type="checkbox" v-model="notificationsForm.emailPromos" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </div>
          <div class="flex items-center justify-between">
             <div>
                <div class="font-medium">SMS promotionnels</div>
                <div class="text-xs text-gray-500">Alertes flash et codes promo</div>
             </div>
             <input type="checkbox" v-model="notificationsForm.smsPromos" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </div>
          <hr />
          <div class="flex items-center justify-between">
             <div>
                <div class="font-medium">Suivi de commande</div>
                <div class="text-xs text-gray-500">Notifications d'expédition et livraison</div>
             </div>
             <input type="checkbox" v-model="notificationsForm.orderUpdates" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </div>
          <div class="flex items-center justify-between">
             <div>
                <div class="font-medium">Alertes de sécurité</div>
                <div class="text-xs text-gray-500">Connexions suspectes et changements de mot de passe</div>
             </div>
             <input type="checkbox" v-model="notificationsForm.securityAlerts" disabled checked class="w-5 h-5 text-gray-400 rounded focus:ring-gray-400 cursor-not-allowed" />
          </div>
       </div>
       <template #footer>
          <div class="flex justify-end gap-3">
             <button @click="showNotificationsModal = false" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Fermer</button>
             <button @click="saveNotifications" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Enregistrer</button>
          </div>
       </template>
    </Modal>
    
    <!-- 2FA Modal -->
    <Modal v-model:isOpen="show2FAModal" title="Authentification à deux facteurs">
        <div class="space-y-6 text-center py-4">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 text-2xl">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div>
                <h3 class="font-medium text-lg">Sécurisez votre compte</h3>
                <p class="text-gray-500 text-sm mt-1">L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire.</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-left">
                <div class="flex items-start gap-3">
                    <i class="fas fa-info-circle text-blue-600 mt-0.5"></i>
                    <p class="text-sm text-gray-600">Cette fonctionnalité nécessitera une application d'authentification (comme Google Authenticator) ou la validation par SMS.</p>
                </div>
            </div>

            <button @click="toggle2FA" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                Configurer maintenant
            </button>
        </div>
    </Modal>

    <!-- Connections Modal -->
    <Modal v-model:isOpen="showConnectionsModal" title="Méthodes de connexion">
       <div class="space-y-4">
          <div class="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
             <div class="flex items-center gap-3">
                <i class="fab fa-google text-red-500 text-xl"></i>
                <div>
                   <div class="font-medium text-gray-900">Google</div>
                   <div class="text-xs text-gray-500">Connecté en tant que {{ authStore.customer?.email }}</div>
                </div>
             </div>
             <button class="text-sm text-red-600 font-medium hover:underline">Déconnecter</button>
          </div>
          <div class="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
             <div class="flex items-center gap-3">
                <i class="fab fa-facebook text-blue-600 text-xl"></i>
                <div class="text-gray-500">Facebook</div>
             </div>
             <button class="text-sm text-blue-600 font-medium hover:underline">Connecter</button>
          </div>
       </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import { useUiStore } from '@/stores/ui'
import { ordersService } from '@/services/orders'
import { onMounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const ordersCount = ref(0) // Start at 0

onMounted(async () => {
  try {
    const orders = await ordersService.getCustomerOrders()
    ordersCount.value = orders.length
  } catch (error) {
    console.error('Error fetching orders count:', error)
  }
})

// Modal State
const showProfileModal = ref(false)
const showPaymentModal = ref(false)
const showPasswordModal = ref(false)
const showNotificationsModal = ref(false)
const showTrackingModal = ref(false)
const showPaymentHistoryModal = ref(false)
const show2FAModal = ref(false)
const showConnectionsModal = ref(false)

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const trackingId = ref('')
const notificationsForm = ref({
  emailPromos: true,
  smsPromos: false,
  orderUpdates: true,
  securityAlerts: true
})

// Missing Refs
const isSavingProfile = ref(false)
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const isSavingPayment = ref(false)
const paymentForm = ref({
  type: 'card',
  cardNumber: '',
  expiry: '',
  cvv: '',
  monCashNumber: ''
})

// Mock Data
const paymentHistory = ref([
  { id: 1, date: '2024-03-15', amount: 1500, status: 'Completed', method: 'Visa •• 4242' },
  { id: 2, date: '2024-02-28', amount: 3200, status: 'Completed', method: 'MonCash' },
])

// Handlers
const openPasswordChange = () => showPasswordModal.value = true
const openNotifications = () => showNotificationsModal.value = true
const openTracking = () => showTrackingModal.value = true
const openPaymentHistory = () => showPaymentHistoryModal.value = true
const open2FA = () => show2FAModal.value = true
const openConnections = () => showConnectionsModal.value = true

const savePassword = async () => {
  // Simulate API
  await new Promise(r => setTimeout(r, 1000))
  showPasswordModal.value = false
  passwordForm.value = { current: '', new: '', confirm: '' }
}

const saveNotifications = async () => {
  await new Promise(r => setTimeout(r, 500))
  showNotificationsModal.value = false
}

const trackOrder = () => {
  // Simulate tracking check
  uiStore.showToast(`Recherche du colis #${trackingId.value}... (Simulation: En transit)`, 'info')
}

const toggle2FA = async () => {
   // Logic to enable/disable
   show2FAModal.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const openProfileEdit = () => {
    if (authStore.customer) {
        profileForm.value = {
            firstName: authStore.customer.firstName,
            lastName: authStore.customer.lastName,
            email: authStore.customer.email,
            phone: authStore.customer.phone || ''
        }
    }
    showProfileModal.value = true
}

const saveProfile = async () => {
    try {
        isSavingProfile.value = true
        await authStore.updateProfile(profileForm.value)
        showProfileModal.value = false
        // Refresh or show success? AuthStore updates state automatically.
        uiStore.showToast("Profil mis à jour avec succès !", 'success')
    } catch (e: any) {
        console.error(e)
        uiStore.showToast("Erreur: " + (e.response?.data?.error || e.message), 'error')
    } finally {
        isSavingProfile.value = false
    }
}

const openPaymentAdd = () => {
    paymentForm.value = {
        type: 'card',
        cardNumber: '',
        expiry: '',
        cvv: '',
        monCashNumber: ''
    }
    showPaymentModal.value = true
}

const savePayment = async () => {
    try {
        isSavingPayment.value = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Payment added:', paymentForm.value)
        showPaymentModal.value = false
    } catch (e) {
        console.error(e)
    } finally {
        isSavingPayment.value = false
    }
}
</script>

<style scoped>
/* Custom grid layout tweaks if needed */
</style>
