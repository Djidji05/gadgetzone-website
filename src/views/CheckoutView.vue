<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Checkout Form -->
      <div class="space-y-6">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Adresse de livraison</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Prénom </label>
              <input
                v-model="shippingInfo.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Nom </label>
              <input
                v-model="shippingInfo.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Adresse </label>
              <input
                v-model="shippingInfo.street"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Ville </label>
              <input
                v-model="shippingInfo.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Code Postal </label>
              <input
                v-model="shippingInfo.postalCode"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Pays </label>
              <input
                v-model="shippingInfo.country"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> Téléphone </label>
              <input
                v-model="shippingInfo.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
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
                value="natcash"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center space-x-2">
                <i class="las la-mobile-alt text-2xl text-green-600"></i>
                <span>Natcash</span>
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
                <i class="las la-wallet text-2xl text-purple-600"></i>
                <span>Mon Cash Wise</span>
              </div>
            </label>

            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                value="zelle"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center space-x-2">
                <i class="las la-university text-2xl text-gray-600"></i>
                <span>Zelle</span>
              </div>
            </label>
          </div>

          <!-- Payment Details Form -->
          <div v-if="paymentMethod" class="mt-6 p-4 bg-gray-50 rounded-lg">
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

            <!-- Mobile Money Fields (NatCash/MonCash) -->
            <div v-else-if="paymentMethod === 'natcash' || paymentMethod === 'moncashwise'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                <input
                  v-model="paymentDetails.mobileNumber"
                  type="tel"
                  placeholder="+509 1234 5678"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <!-- Zelle Fields -->
            <div v-else-if="paymentMethod === 'zelle'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email ou Téléphone Zelle</label>
                <input
                  v-model="paymentDetails.zelleEmail"
                  type="text"
                  placeholder="email@example.com ou +1234567890"
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
                <p class="text-gray-600 text-xs">Qty: {{ item.quantity }}</p>
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
            :disabled="isPlacingOrder || !isValidForm"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { ordersService } from '@/services/orders'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// State
const isPlacingOrder = ref(false)
const selectedPaymentMethod = ref({
  type: 'visa' as 'natcash' | 'moncashwise' | 'visa' | 'zelle',
  name: 'Visa',
  description: 'Payer avec votre carte Visa',
  icon: 'las la-credit-card',
  isActive: true,
})
const paymentMethod = ref('visa')
const shippingInfo = ref({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  postalCode: '',
  country: 'Haïti',
  phone: '',
})

const paymentDetails = ref({
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardHolder: '',
  mobileNumber: '',
  zelleEmail: ''
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
    shippingInfo.value.postalCode &&
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
  if (!isValidForm.value || isPlacingOrder.value) return

  try {
    isPlacingOrder.value = true

    const orderData = {
      items: items.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: shippingInfo.value,
      paymentMethod: {
        type: paymentMethod.value as 'natcash' | 'moncashwise' | 'visa' | 'zelle',
        details: paymentDetails.value,
      },
    }

    const order = await ordersService.createOrder(orderData)

    // Clear cart and redirect to payment success
    await cartStore.clearCart()
    router.push(`/payment/success?orderId=${order.id}`)
  } catch (error) {
    console.error('Error placing order:', error)
  } finally {
    isPlacingOrder.value = false
  }
}

// Initialize with customer data
onMounted(() => {
  if (authStore.customer) {
    const customer = authStore.customer
    shippingInfo.value = {
      ...shippingInfo.value,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone || '',
    }
  }
})
</script>
