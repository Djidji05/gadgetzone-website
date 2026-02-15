import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Accueil - GadgetZone' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { title: 'Produits - GadgetZone' },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: { title: 'Détail Produit - GadgetZone' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { title: 'Panier - GadgetZone' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: {
        title: 'Commande - GadgetZone',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { title: 'Connexion - GadgetZone', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { title: 'Inscription - GadgetZone', guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
      meta: { title: 'Mot de passe oublié - GadgetZone', guestOnly: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
      meta: { title: 'Réinitialisation mot de passe - GadgetZone', guestOnly: true },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/auth/AuthCallback.vue'),
      meta: { title: 'Connexion... - GadgetZone', guestOnly: true },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        title: 'Mon Compte - GadgetZone',
        requiresAuth: true,
      },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: {
        title: 'Mes Commandes - GadgetZone',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: () => import('../views/OrderDetailView.vue'),
      meta: {
        title: 'Détail Commande - GadgetZone',
        requiresAuth: true,
      },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/WishlistView.vue'),
      meta: {
        title: "Liste d'envies - GadgetZone",
        requiresAuth: true,
      },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        title: 'Notifications - GadgetZone',
        requiresAuth: true,
      },
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: () => import('../views/AddressesView.vue'),
      meta: {
        title: 'Mes Adresses - GadgetZone',
        requiresAuth: true,
      },
    },
    {
      path: '/promotions',
      name: 'promotions',
      component: () => import('../views/PromotionsView.vue'),
      meta: { title: 'Promotions - GadgetZone' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: { title: 'Contact - GadgetZone' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'À Propos - GadgetZone' },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: { title: 'FAQ - GadgetZone' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: { title: 'Confidentialité - GadgetZone' },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
      meta: { title: 'Conditions - GadgetZone' },
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('../views/payment/PaymentSuccessView.vue'),
      meta: { title: 'Paiement Réussi - GadgetZone' },
    },
    {
      path: '/payment/cancelled',
      name: 'payment-cancelled',
      component: () => import('../views/payment/PaymentCancelledView.vue'),
      meta: { title: 'Paiement Annulé - GadgetZone' },
    },
    {
      path: '/become-seller',
      name: 'become-seller',
      component: () => import('../views/BecomeSeller.vue'),
      meta: {
        title: 'Devenir Vendeur - GadgetZone',
        requiresAuth: true
      },
    },
    {
      path: '/seller/dashboard',
      name: 'seller-dashboard',
      component: () => import('../views/Seller/Dashboard.vue'),
      meta: {
        title: 'Tableau de Bord Vendeur - GadgetZone',
        requiresAuth: true
      },
    },
    {
      path: '/seller/products',
      name: 'seller-products',
      component: () => import('../views/Seller/Products.vue'),
      meta: {
        title: 'Mes Produits - GadgetZone',
        requiresAuth: true
      },
    },
    {
      path: '/seller/products/new',
      name: 'seller-add-product',
      component: () => import('../views/Seller/AddProduct.vue'),
      meta: {
        title: 'Ajouter un Produit - GadgetZone',
        requiresAuth: true
      },
    },
    {
      path: '/seller/products/edit/:id',
      name: 'seller-edit-product',
      component: () => import('../views/Seller/AddProduct.vue'),
      meta: {
        title: 'Modifier un Produit - GadgetZone',
        requiresAuth: true
      },
    },
    {
      path: '/seller/orders',
      name: 'seller-orders',
      component: () => import('../views/Seller/Orders.vue'),
      meta: {
        title: 'Commandes Vendeur - GadgetZone',
        requiresAuth: true
      }
    },
    {
      path: '/seller/orders/:id',
      name: 'seller-order-detail',
      component: () => import('../views/Seller/OrderDetail.vue'),
      meta: {
        title: 'Détail Commande - GadgetZone',
        requiresAuth: true
      }
    },
    {
      path: '/seller/reports',
      name: 'seller-reports',
      component: () => import('../views/Seller/Reports.vue'),
      meta: {
        title: 'Rapports Vendeur - GadgetZone',
        requiresAuth: true
      }
    },
    {
      path: '/seller/payments',
      name: 'seller-payments',
      component: () => import('../views/Seller/Payments.vue'),
      meta: {
        title: 'Paiements Vendeur - GadgetZone',
        requiresAuth: true
      }
    },
    {
      path: '/seller/settings',
      name: 'seller-settings',
      component: () => import('../views/Seller/Settings.vue'),
      meta: {
        title: 'Paramètres Vendeur - GadgetZone',
        requiresAuth: true
      }
    },
    {
      path: '/seller/notifications',
      name: 'seller-notifications',
      component: () => import('../views/Seller/Notifications.vue'),
      meta: {
        title: 'Notifications Vendeur - GadgetZone',
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Page Non Trouvée - GadgetZone' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
