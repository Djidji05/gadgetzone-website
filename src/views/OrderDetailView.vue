  <div class="bg-gray-50 min-h-screen pt-[125px] pb-12">
    <div class="container mx-auto px-4 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse max-w-6xl mx-auto">
        <div class="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
          <div class="space-y-4">
             <div class="h-16 bg-gray-100 rounded"></div>
             <div class="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Order Content -->
      <div v-else-if="order" class="max-w-6xl mx-auto">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
               <router-link to="/orders" class="hover:text-blue-600 transition-colors">Mes Commandes</router-link>
               <i class="las la-angle-right text-xs"></i>
               <span>Détails</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              Commande <span class="text-blue-600">#{{ order.orderNumber || order.id }}</span>
            </h1>
            <p class="text-gray-500 mt-1">Passée le {{ formatDate(order.createdAt) }}</p>
          </div>

          <div class="flex items-center gap-3">
             <span :class="getStatusBadgeClass(order.status)" class="px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2">
                <i :class="getStatusIcon(order.status)"></i>
                {{ getStatusLabel(order.status) }}
             </span>
             <button v-if="order.status === 'pending'" @click="cancelOrder" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm">
                Annuler
             </button>
             <a href="#" class="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-all text-sm flex items-center gap-2 shadow-lg shadow-gray-200">
                <i class="las la-download"></i> Facture
             </a>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           <!-- Main Content: Products Table -->
           <div class="lg:col-span-2 space-y-8">
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div class="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 class="font-bold text-lg text-gray-900">Articles commandés</h2>
                    <span class="text-sm text-gray-500">{{ order.items.length }} article(s)</span>
                 </div>
                 
                 <div class="overflow-x-auto">
                   <table class="w-full">
                     <thead class="bg-gray-50 text-left text-xs uppercase text-gray-500 font-semibold">
                       <tr>
                         <th class="px-6 py-4">Produit</th>
                         <th class="px-6 py-4 text-center">Prix</th>
                         <th class="px-6 py-4 text-center">Qté</th>
                         <th class="px-6 py-4 text-right">Total</th>
                       </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-50">
                       <tr v-for="item in order.items" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
                         <td class="px-6 py-4">
                           <div class="flex items-center gap-4">
                             <div class="w-16 h-16 bg-white rounded-lg border border-gray-100 p-1 flex-shrink-0">
                               <img :src="item.product.image_url || '/placeholder-product.jpg'" class="w-full h-full object-contain" :alt="item.product.name">
                             </div>
                             <div>
                               <p class="font-bold text-gray-900 text-sm line-clamp-2 max-w-[200px]">{{ item.product.name }}</p>
                               <!-- <p class="text-xs text-gray-500 mt-0.5">Ref: {{ item.product.id }}</p> -->
                             </div>
                           </div>
                         </td>
                         <td class="px-6 py-4 text-center text-sm text-gray-600 font-medium">
                           {{ formatPrice(item.unitPrice) }}
                         </td>
                         <td class="px-6 py-4 text-center text-sm text-gray-900 font-bold">
                           x{{ item.quantity }}
                         </td>
                         <td class="px-6 py-4 text-right text-sm font-bold text-gray-900">
                           {{ formatPrice(item.unitPrice * item.quantity) }}
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>

                 <!-- Mobile List View (Hidden on Desktop) -->
                 <!-- Only keeping table for "Professional" look as requested, assuming PC usage primarily or responsive table above works -->
              </div>

              <!-- Timeline (Simplified Horizontal) -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                 <h3 class="font-bold text-lg text-gray-900 mb-8">Statut de la livraison</h3>
                 <div class="relative">
                    <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                    <div class="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full z-0 transition-all duration-1000" :style="{ width: getProgressWidth(order.status) }"></div>
                    
                    <div class="relative z-10 flex justify-between w-full">
                       <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center gap-3">
                          <div :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300',
                            isStepActive(order.status, step.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                          ]">
                             <i :class="step.icon" class="text-xs"></i>
                          </div>
                          <span :class="[
                            'text-xs font-medium',
                            isStepActive(order.status, step.id) ? 'text-blue-700 font-bold' : 'text-gray-400'
                          ]">{{ step.label }}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Sidebar Info -->
           <div class="space-y-6">
              <!-- Summary Card -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 class="font-bold text-gray-900 mb-6 text-lg">Récapitulatif</h3>
                 <div class="space-y-4 text-sm">
                    <div class="flex justify-between text-gray-500">
                       <span>Sous-total</span>
                       <span class="font-medium text-gray-900">{{ formatPrice(order.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-500">
                       <span>Livraison</span>
                       <span class="text-green-600 font-medium">{{ order.shipping === 0 ? 'Offerte' : formatPrice(order.shipping) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-500">
                       <span>Taxes</span>
                       <span class="font-medium text-gray-900">{{ formatPrice(0) }}</span> <!-- Placeholder if no tax data -->
                    </div>
                    
                    <div class="border-t border-gray-100 pt-4 mt-4">
                       <div class="flex justify-between items-center">
                          <span class="font-bold text-gray-900 text-lg">Total</span>
                          <span class="font-bold text-blue-600 text-xl">{{ formatPrice(order.total) }}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Shipping Info -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 class="font-bold text-gray-900 mb-4 text-lg">Adresse de livraison</h3>
                 <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                       <i class="las la-map-marker text-xl"></i>
                    </div>
                    <div>
                       <p class="font-bold text-gray-900 text-sm">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
                       <p class="text-gray-500 text-sm mt-1 leading-relaxed">
                         {{ order.shippingAddress.street }}<br>
                         {{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}<br>
                         {{ order.shippingAddress.country }}
                       </p>
                       <p class="text-gray-500 text-sm mt-2 flex items-center gap-2">
                         <i class="las la-phone"></i> {{ order.shippingAddress.phone || 'Non renseigné' }}
                       </p>
                    </div>
                 </div>
              </div>

              <!-- Support -->
              <div class="bg-gray-900 rounded-2xl p-6 text-center text-white relative overflow-hidden group">
                 <div class="relative z-10">
                    <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                       <i class="las la-headset text-2xl"></i>
                    </div>
                    <h4 class="font-bold mb-2">Besoin d'assistance ?</h4>
                    <p class="text-gray-400 text-sm mb-4">Notre équipe support est disponible 24/7 pour vous aider.</p>
                    <router-link to="/contact" class="inline-block w-full py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm">
                       Contacter le support
                    </router-link>
                 </div>
                 
                 <!-- Decor -->
                 <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-30 transition-opacity"></div>
              </div>
           </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-32">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="las la-search text-4xl text-gray-300"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h3>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">Nous n'avons pas trouvé la commande que vous recherchez. Elle a peut-être été supprimée ou n'existe pas.</p>
        <router-link to="/orders" class="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
          <i class="las la-arrow-left mr-2"></i>
          Retour aux commandes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersService } from '@/services/orders'
import type { Order } from '@/services/orders'

const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(false)
const order = ref<Order | null>(null)

// Methods
const loadOrder = async () => {
  try {
    isLoading.value = true
    const orderId = Number(route.params.id)
    order.value = await ordersService.getOrder(orderId)
  } catch (error) {
    console.error('Error loading order:', error)
    router.push('/orders')
  } finally {
    isLoading.value = false
  }
}

const cancelOrder = async () => {
  if (!order.value) return

  if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    try {
      await ordersService.cancelOrder(order.value.id)
      await loadOrder()
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-HT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

// Stepper Logic


// Status Helpers
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  }
  return classes[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: 'las la-clock',
    confirmed: 'las la-check',
    processing: 'las la-box-open',
    shipped: 'las la-shipping-fast',
    delivered: 'las la-check-circle',
    cancelled: 'las la-times-circle'
  }
  return icons[status] || 'las la-info-circle'
}

// Timeline Steps
const steps = [
  { id: 1, label: 'Validée', icon: 'las la-clipboard-check' },
  { id: 2, label: 'Préparation', icon: 'las la-box' },
  { id: 3, label: 'Expédiée', icon: 'las la-shipping-fast' },
  { id: 4, label: 'Livrée', icon: 'las la-check-circle' }
]

const getProgressWidth = (status: string) => {
   const statusMap: Record<string, number> = {
    'pending': 1,
    'confirmed': 2,
    'processing': 2,
    'shipped': 3,
    'delivered': 4,
    'cancelled': 0
  }
  const currentStep = statusMap[status] || 0
  if (currentStep === 0) return '0%'
  const percentage = ((currentStep - 1) / 3) * 100
  return `${percentage}%`
}

const isStepActive = (status: string, stepId: number) => {
  const statusMap: Record<string, number> = {
    'pending': 1,
    'confirmed': 2,
    'processing': 2,
    'shipped': 3,
    'delivered': 4,
    'cancelled': 0
  }
  return (statusMap[status] || 0) >= stepId
}

onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
