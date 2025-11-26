<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Envoyez-nous un message</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
                Sujet *
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="order">Question sur une commande</option>
                <option value="product">Information sur un produit</option>
                <option value="payment">Problème de paiement</option>
                <option value="return">Retour ou échange</option>
                <option value="technical">Support technique</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Décrivez votre demande en détail..."
              ></textarea>
            </div>

            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg"
            >
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
            >
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary disabled:opacity-50"
            >
              <i v-if="isSubmitting" class="las la-spinner la-spin mr-2"></i>
              {{ isSubmitting ? 'Envoi...' : 'Envoyer le message' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Contact Details -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Nos coordonnées</h2>

          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <i class="las la-phone text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Téléphone</h3>
                <p class="text-gray-600">+509 34 56 78 90</p>
                <p class="text-gray-600">+509 29 87 65 43</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <i class="las la-envelope text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Email</h3>
                <p class="text-gray-600">contact@gadgetzone.ht</p>
                <p class="text-gray-600">support@gadgetzone.ht</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <i class="las la-map-marker-alt text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Adresse</h3>
                <p class="text-gray-600">
                  Delmas 32, #45<br />
                  Port-au-Prince, Haïti
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <i class="las la-clock text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Heures d'ouverture</h3>
                <p class="text-gray-600">
                  Lun-Ven: 9h-18h<br />
                  Sam: 9h-15h<br />
                  Dim: Fermé
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Suivez-nous</h2>

          <div class="flex space-x-4">
            <a
              href="#"
              class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <i class="lab la-facebook-f"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
            >
              <i class="lab la-instagram"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <i class="lab la-twitter"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              <i class="lab la-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- FAQ Link -->
        <div class="bg-primary-50 rounded-lg p-6">
          <h3 class="font-semibold text-primary-900 mb-2">Questions fréquentes?</h3>
          <p class="text-primary-700 mb-4">
            Consultez notre FAQ pour trouver rapidement des réponses à vos questions.
          </p>
          <router-link to="/faq" class="text-primary-600 hover:text-primary-700 font-medium">
            Voir la FAQ →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// State
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

// Methods
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // TODO: Implement contact form submission API
    console.log('Contact form submission:', form.value)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    successMessage.value =
      'Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.'

    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    errorMessage.value = 'Une erreur est survenue. Veuillez réessayer plus tard.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
