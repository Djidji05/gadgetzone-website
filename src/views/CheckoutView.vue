<template>
  <div class="container mx-auto px-4 pt-4 pb-8 lg:py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Checkout Form -->
      <div class="space-y-6">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Adresse de livraison</h3>

          <!-- Selected Address Summary -->
          <div v-if="selectedAddressId !== 'new'" class="bg-gray-50 rounded-xl p-4 border border-gray-200">
             <div class="flex justify-between items-start">
               <div>
                 <h4 class="font-bold text-gray-900">{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</h4>
                 <p class="text-gray-600 text-sm mt-1">
                   {{ shippingInfo.street }}<br>
                   {{ shippingInfo.quartier ? shippingInfo.quartier + ', ' : '' }}{{ shippingInfo.city }}<br>
                   {{ shippingInfo.country }}
                 </p>
                 <p class="text-gray-600 text-sm mt-2 flex items-center gap-2">
                   <i class="las la-phone"></i>
                   {{ shippingInfo.phone || 'Non renseigné' }}
                 </p>
               </div>
               <button 
                 @click="selectedAddressId = 'new'"
                 class="text-blue-600 text-sm font-bold hover:underline"
               >
                 Ajouter une nouvelle adresse
               </button>
             </div>
             
             <!-- Dropdown to switch between *other* saved addresses -->
             <div class="mt-4 pt-4 border-t border-gray-200">
                <label class="text-xs text-gray-500 font-medium mb-1 block">Changer d'adresse :</label>
                <select 
                  v-model="selectedAddressId" 
                  class="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option v-for="addr in savedAddresses" :key="addr.id" :value="addr.id">
                    {{ addr.street }} ({{ addr.city }}) {{ addr.is_default ? '★' : '' }}
                  </option>
                  <option value="new">+ Ajouter une nouvelle adresse</option>
                </select>
             </div>
          </div>

          <!-- New Address Form -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <!-- Header for New Address Mode -->
            <div class="md:col-span-2 flex justify-between items-center mb-2" v-if="savedAddresses.length > 0">
               <h4 class="text-sm font-bold text-gray-700">Nouvelle adresse</h4>
               <button 
                 @click="selectedAddressId = savedAddresses[0].id"
                 class="text-gray-500 text-xs hover:text-gray-700 underline"
               >
                 Annuler / Retourner à mes adresses
               </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Prénom </label>
              <input
                v-model="shippingInfo.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
            <!-- ... Rest of inputs ... -->
             <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Nom </label>
              <input
                v-model="shippingInfo.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Adresse </label>
              <input
                v-model="shippingInfo.street"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <!-- Quartier Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Quartier </label>
              <input
                v-model="shippingInfo.quartier"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Ville </label>
              <input
                v-model="shippingInfo.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Pays </label>
              <input
                v-model="shippingInfo.country"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Téléphone </label>
              <input
                v-model="shippingInfo.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
            
            <!-- Checkbox to save address (optional, logic not implemented yet in submit but good for UX) -->
             <div class="md:col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" id="saveAddr" class="rounded text-primary-600 focus:ring-primary-500">
                <label for="saveAddr" class="text-sm text-gray-600">Enregistrer cette adresse pour la prochaine fois</label>
             </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Méthode de paiement</h3>

          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                value="visa"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center space-x-2">
                <i class="lab la-cc-visa text-2xl text-blue-600"></i>
                <span>Visa</span>
              </div>
            </label>

            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                value="moncashwise"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center space-x-2">
                <i class="las la-wallet text-2xl text-red-600"></i>
                <span>Mon Cash</span>
              </div>
            </label>
          </div>
          
          <!-- MonCash Hint -->
          <div v-if="paymentMethod === 'moncashwise'" class="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
            <i class="las la-info-circle text-lg mt-0.5"></i>
            <p>Vous serez redirigé vers la plateforme sécurisée de MonCash pour finaliser votre paiement.</p>
          </div>

          <!-- Payment Details Form -->
          <div v-if="paymentMethod && paymentMethod !== 'moncashwise'" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-4">Informations de paiement</h4>

            <!-- Credit Card Fields (Visa) -->
            <div v-if="paymentMethod === 'visa'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                <input
                  v-model="paymentDetails.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                  <input
                    v-model="paymentDetails.cardExpiry"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    v-model="paymentDetails.cardCvc"
                    type="text"
                    placeholder="123"
                    maxlength="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom du titulaire</label>
                <input
                  v-model="paymentDetails.cardHolder"
                  type="text"
                  placeholder="JEAN DUPONT"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 class="text-lg font-semibold mb-4">Récapitulatif de la commande</h3>

          <!-- Cart Items -->
          <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
            <div v-for="item in items" :key="item.id" class="flex items-center space-x-3">
              <img
                :src="item.product.image || '/placeholder-product.jpg'"
                :alt="item.product.name"
                class="w-12 h-12 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="font-medium text-sm">{{ item.product.name }}</h4>
                <p class="text-gray-600 text-xs">Qté: {{ item.quantity }}</p>
              </div>
              <span class="font-medium">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-2 border-t pt-4">
            <div class="flex justify-between">
              <span>Sous-total</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Taxes</span>
              <span>{{ formatPrice(subtotal * 0.1) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Livraison</span>
              <span>{{ formatPrice(subtotal > 5000 ? 0 : 250) }}</span>
            </div>
            <hr class="my-2" />
            <div class="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Place Order Button -->
          <button
            @click="placeOrder"
            :disabled="isPlacingOrder"
            class="w-full btn-primary mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <i v-if="isPlacingOrder" class="las la-spinner la-spin mr-2"></i>
            {{ isPlacingOrder ? 'Traitement...' : 'Passer la commande' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { ordersService } from '@/services/orders'
import api, { addressService, type Address } from '@/services/api'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

// State
const savedAddresses = ref<Address[]>([])
const selectedAddressId = ref<number | 'new'>('new')
const isPlacingOrder = ref(false)

const selectedPaymentMethod = ref({
  type: 'moncashwise' as 'moncashwise' | 'visa',
  name: 'Mon Cash',
  description: 'Payer avec MonCash',
  icon: 'las la-wallet',
  isActive: true,
})
const paymentMethod = ref('moncashwise')
const shippingInfo = ref({
  firstName: '',
  lastName: '',
  street: '',
  quartier: '',
  city: '',
  country: 'Haïti',
  phone: '',
})

const paymentDetails = ref({
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardHolder: '',
  mobileNumber: '',
})

// Computed
const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)

const total = computed(() => {
  const subtotalValue = subtotal.value
  const tax = subtotalValue * 0.1
  const shipping = subtotalValue > 5000 ? 0 : 250
  return subtotalValue + tax + shipping
})

const isValidForm = computed(() => {
  const hasShippingInfo = 
    shippingInfo.value.firstName &&
    shippingInfo.value.lastName &&
    shippingInfo.value.street &&
    shippingInfo.value.city &&
    shippingInfo.value.country &&
    items.value.length > 0

  // Pour le moment, on valide seulement les informations de livraison
  // Les détails de paiement seront validés plus tard
  return hasShippingInfo
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

const placeOrder = async () => {
  if (isPlacingOrder.value) return

  // Validation manuelle avec feedback
  if (!shippingInfo.value.street || !shippingInfo.value.city) {
    uiStore.showToast("Veuillez remplir votre adresse de livraison complète (Rue, Ville).", 'warning')
    return
  }
  
  if (items.value.length === 0) {
    uiStore.showToast("Votre panier est vide.", 'error')
    router.push('/cart')
    return
  }

  try {
    isPlacingOrder.value = true

    // Aggregate items by productId to prevent duplicates
    const aggregatedItems = items.value.reduce((acc, item) => {
      const existing = acc.find(i => i.productId === item.productId)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        acc.push({ productId: item.productId, quantity: item.quantity })
      }
      return acc
    }, [] as { productId: number; quantity: number }[])

    const orderData: CreateOrderData = {
      userId: authStore.customer?.id || 0,
      items: aggregatedItems,
      shippingAddress: shippingInfo.value,
      paymentMethod: {
        type: paymentMethod.value as 'moncashwise' | 'visa',
        details: paymentDetails.value,
      },
    }

    const order = await ordersService.createOrder(orderData)

    if (paymentMethod.value === 'moncashwise') {
      try {
        const response = await api.post('/paiements/init-moncash', {
          orderId: order.id,
          amount: total.value
        })
        
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl
          return // Stop execution here to allow redirect
        }
      } catch (err: any) {
        console.error('MonCash Init Error:', err)
        const msg = err.response?.data?.error || err.message || "Erreur inconnue"
        uiStore.showToast(`Erreur MonCash: ${msg}`, 'error')
        isPlacingOrder.value = false
        return
      }
    }

    // Clear cart and redirect to payment success (Visa or fallback)
    await cartStore.clearCart()
    router.push(`/payment/success?orderId=${order.id}`)
  } catch (error: any) {
    console.error('Error placing order:', error)
    const msg = error.response?.data?.error || error.message || "Erreur inconnue"
    uiStore.showToast(`Erreur: ${msg}. Veuillez réessayer.`, 'error')
  } finally {
    isPlacingOrder.value = false
  }
}

// Initialize with customer data
onMounted(async () => {
  // Pre-fill user info
  if (authStore.customer) {
    const customer = authStore.customer
    shippingInfo.value = {
      ...shippingInfo.value,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone || '',
    }
    
    // Fetch saved addresses
    try {
      const addresses = await addressService.getAll()
      savedAddresses.value = addresses
      
      // Auto-select default address
      const defaultAddr = addresses.find(a => a.is_default)
      if (defaultAddr) {
        selectedAddressId.value = defaultAddr.id
        fillAddress(defaultAddr)
      } else if (addresses.length > 0) {
        // If no default but has addresses, maybe select first? Or let user choose.
        // Let's keep 'new' unless default exists, to avoid confusion.
      }
    } catch (e) {
      console.error("Failed to load addresses", e)
    }
  }
})

const fillAddress = (addr: Address) => {
  shippingInfo.value.street = addr.street
  shippingInfo.value.quartier = addr.quartier
  shippingInfo.value.city = addr.city
  shippingInfo.value.country = addr.country || 'Haïti'
  if (addr.whatsapp) shippingInfo.value.phone = addr.whatsapp
}

watch(selectedAddressId, (newId) => {
  if (newId === 'new') {
    // Clear address fields but keep name/phone
    shippingInfo.value.street = ''
    shippingInfo.value.quartier = ''
    shippingInfo.value.city = ''
  } else {
    const addr = savedAddresses.value.find(a => a.id === newId)
    if (addr) fillAddress(addr)
  }
})
</script>
```
