<template>
  <div 
    :class="{ 
      'sticky top-[-60px] z-[100]': isMobile && !isProductPage,
      'fixed top-0 left-0 right-0 z-[100] w-full bg-white shadow-sm': isMobile && isProductPage,
      'relative': !(isMobile && isProductPage)
    }"
  >
    <!-- MOBILE HEADER -->
    <div 
      v-if="isMobile" 
      class="mobile-header bg-transparent transition-all duration-300"
    >
      <!-- Unauth Banner Removed -->

      <!-- Product Page View -->
      <template v-if="isProductPage">
        <div class="flex items-center gap-3 p-3 bg-white shadow-sm">
          <!-- Back Button -->
          <button 
            @click="router.back()" 
            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors"
          >
            <i class="fas fa-arrow-left text-gray-700"></i>
          </button>
          
          <!-- Search Bar -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="search"
              placeholder="Rechercher..."
              class="w-full bg-gray-100 border-none rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            <button @click="handleSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
               <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Filter Chips Row -->
        <div class="flex overflow-x-auto px-3 pb-3 gap-2 no-scrollbar">
          <!-- Main Filter Button -->
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-200">
            <i class="fas fa-sliders-h"></i>
            Filtrer
          </button>
          
          <!-- Brand -->
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50">
            Marque
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>
          
          <!-- Price -->
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50">
            Prix
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>

           <!-- Rating -->
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50">
            Note
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>
          
          <!-- Sort -->
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50">
            Trier
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>
        </div>
      </template>

      <!-- Authenticated View -->
      <template v-else-if="authStore.isAuthenticated && authStore.customer">
        <!-- Line 1: Avatar, Greeting, Cart -->
        <div class="mobile-top-bar">
          <div class="flex items-center gap-3">
             <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.customer.firstName || authStore.customer.email)}&background=random`"
                  alt="Avatar"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Bon retour</span>
                <div class="flex items-center">
                  <span class="font-semibold text-gray-900 text-sm leading-tight">
                    {{ authStore.customer.firstName || authStore.customer.email }}
                  </span>
                  <i class="fas fa-thumbtack text-red-600 ml-1 text-xs"></i>
                </div>
              </div>
          </div>
          
          <router-link to="/wishlist" class="text-gray-700 hover:text-red-600 transition-colors relative p-1">
            <i class="fas fa-heart text-xl"></i>
            <span v-if="wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ wishlistStore.itemCount }}</span>
          </router-link>
        </div>

        <!-- Line 2: Search + Settings -->
        <div class="mobile-search-bar">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="search"
            placeholder="Rechercher des produits..."
            class="mobile-search-input"
          />
          <button @click="isMobileMenuOpen = true" class="p-2 text-gray-600 hover:text-primary-600">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </template>

      <!-- Guest View -->
      <template v-else>
        <!-- Top bar mobile -->
        <div class="mobile-top-bar">
          <router-link to="/" class="flex items-center gap-2">
            <img src="/images/logo.png" alt="GadgetZone" class="h-8 w-auto" />
          </router-link>
          <router-link to="/wishlist" class="text-gray-700 hover:text-red-600 transition-colors relative p-1">
            <i class="fas fa-heart text-xl"></i>
            <span v-if="wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ wishlistStore.itemCount }}</span>
          </router-link>
        </div>

        <!-- Search bar mobile -->
        <div class="mobile-search-bar border-b border-gray-100">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="search"
            placeholder="Rechercher des produits..."
            class="mobile-search-input"
          />
          <button @click="isMobileMenuOpen = true" class="p-2 text-gray-600 hover:text-primary-600">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </template>


    </div>

    <!-- CATEGORIES (Mobile) -->
    <div v-if="isMobile && !route.path.includes('/cart') && !route.path.includes('/checkout') && !route.path.includes('/account') && !route.path.includes('/orders')" class="bg-transparent pb-2 pt-0">
      <!-- Categories Scroll (Common) -->
      <!-- Vertical Card Style (Product Pages Only) -->
      <div v-if="isProductPage && !route.path.includes('/cart')" class="flex overflow-x-auto pb-4 px-4 gap-3 no-scrollbar mt-2">
        <router-link to="/products" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200" active-class="ring-2 ring-offset-2 ring-blue-500">
          <i class="fas fa-th-large text-xl sm:text-2xl mb-1"></i>
          <span class="text-[10px] font-medium">Tous</span>
        </router-link>

        <router-link to="/products?category=smartphone" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i class="fas fa-mobile-alt text-xl sm:text-2xl mb-1 text-gray-600"></i>
          <span class="text-[10px] font-medium text-gray-600">Phones</span>
        </router-link>

        <router-link to="/products?category=laptop" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i class="fas fa-laptop text-xl sm:text-2xl mb-1 text-gray-600"></i>
          <span class="text-[10px] font-medium text-gray-600">Laptops</span>
        </router-link>

        <router-link to="/products?category=gaming" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i class="fas fa-gamepad text-xl sm:text-2xl mb-1 text-gray-600"></i>
          <span class="text-[10px] font-medium text-gray-600">Gaming</span>
        </router-link>
        
        <router-link to="/products?category=audio" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i class="fas fa-headphones text-xl sm:text-2xl mb-1 text-gray-600"></i>
          <span class="text-[10px] font-medium text-gray-600">Audio</span>
        </router-link>

        <router-link to="/products?category=photo" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i class="fas fa-camera text-xl sm:text-2xl mb-1 text-gray-600"></i>
          <span class="text-[10px] font-medium text-gray-600">Photo</span>
        </router-link>

        <router-link to="/products?category=accessories" class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <i class="fas fa-tools text-xl sm:text-2xl mb-1 text-gray-600"></i>
          <span class="text-[10px] font-medium text-gray-600">Access.</span>
        </router-link>
      </div>

      <!-- Horizontal Chip Style (Home & Other Pages) -->
      <div v-else-if="!route.path.includes('/cart') && !route.path.includes('/checkout') && !route.path.includes('/account') && !route.path.includes('/orders')" class="flex overflow-x-auto pb-2 px-4 gap-2 no-scrollbar mt-2">
        <router-link to="/products" class="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm">
          <i class="fas fa-th-large"></i>
          Tous
        </router-link>
        <router-link to="/products?category=smartphone" class="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50">
          <i class="fas fa-mobile-alt"></i>
          Smartphones
        </router-link>
        <router-link to="/products?category=laptop" class="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50">
          <i class="fas fa-laptop"></i>
          Laptops
        </router-link>
        <router-link to="/products?category=gaming" class="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50">
          <i class="fas fa-gamepad"></i>
          Gaming
        </router-link>
        <router-link to="/products?category=audio" class="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50">
          <i class="fas fa-headphones"></i>
          Audio
        </router-link>
        <router-link to="/products?category=photo" class="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50">
          <i class="fas fa-camera"></i>
          Photo
        </router-link>
        <router-link to="/products?category=accessories" class="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50">
          <i class="fas fa-tools"></i>
          Access.
        </router-link>
      </div>
    </div>

    <!-- DESKTOP HEADER -->
    <div v-else-if="!isMobile">
    <!-- Top Bar -->
    <div
      class="bg-gray-100 text-gray-700 text-xs border-b border-gray-300 transition-all duration-300 ease-in-out"
      :class="{
        'transform -translate-y-full opacity-0': !props.transparent,
        'transform translate-y-0 opacity-100': props.transparent,
      }"
    >
      <div class="container mx-auto px-4 flex items-center justify-between">
        <!-- Left side -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <i class="fas fa-map-marker-alt text-xs"></i>
            <span class="text-xs">Livraison en Haïti</span>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-3">
          <a href="#" class="hover:underline cursor-pointer text-xs">Aide & Contact</a>
          <a href="#" class="hover:underline cursor-pointer text-xs">Offres du jour</a>
          <a href="#" class="hover:underline cursor-pointer text-xs">Vendre</a>
          <div class="flex items-center space-x-1">
            <i class="fas fa-user-circle text-xs"></i>
            <span class="text-xs">GadgetZone</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Bar -->
    <div
      class="bg-white border-b border-gray-200 py-2 transition-all duration-300 ease-in-out relative z-50"
      :class="{
        'transform -translate-y-full opacity-0': !props.transparent,
        'transform translate-y-0 opacity-100': props.transparent,
      }"
    >
      <div class="container mx-auto px-4 flex items-center">
        <!-- Logo -->
        <div class="flex items-center mr-6">
          <router-link to="/" class="flex items-center">
            <img src="/images/logo.png" alt="GadgetZone Logo" class="h-6 w-auto" />
          </router-link>
        </div>

        <!-- Search Section -->
        <div class="flex-1 flex items-center max-w-4xl">
          <div class="relative flex-1">
            <!-- Search Input -->
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              :placeholder="$t('products.search')"
              class="w-full border border-gray-300 pl-4 pr-16 py-2 text-sm focus:outline-none focus:border-orange-400 rounded-full"
            />

            <!-- Search Button -->
            <button
              @click="handleSearch"
              class="absolute right-0 top-0 bottom-0 bg-orange-400 hover:bg-orange-500 text-white px-6 rounded-r-full transition-colors"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="flex items-center ml-4">
          <select 
            v-model="currentLocale"
            @change="changeLanguage"
            class="border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer hover:border-blue-500 transition-colors"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="ht">🇭🇹 HT</option>
            <option value="en">🇬🇧 EN</option>
            <option value="es">🇪🇸 ES</option>
          </select>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center ml-6 space-x-4">
          <!-- Account -->
          <div 
            class="relative z-50"
            @mouseenter="showAccountMenu = true"
            @mouseleave="showAccountMenu = false"
          >
            <div
              class="flex flex-col cursor-pointer hover:text-blue-600 transition-colors"
            >
              <span class="text-xs">
                {{
                  authStore.isAuthenticated && authStore.customer
                    ? `${$t('common.hello')}, ${authStore.customer.firstName || authStore.customer.email}`
                    : $t('common.hello')
                }}
              </span>
              <div class="flex items-center">
                <span class="text-sm font-semibold">
                  {{ $t('nav.account') }}
                </span>
                <i class="fas fa-chevron-down text-xs ml-1"></i>
              </div>
            </div>

            <!-- Account Dropdown Menu - Dans le container Account avec z-index élevé -->
            <div
              v-if="showAccountMenu"
              class="absolute top-full right-0 mt-0 w-64 bg-white border border-gray-300 rounded-lg shadow-xl p-4"
              style="z-index: 99999999"
              @click.stop
            >
              <div class="border-b border-gray-200 pb-3 mb-3">
                <div class="text-sm font-semibold mb-1">Votre Compte</div>
                <router-link to="/account" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-gray-700">
                  <i class="fas fa-user mr-2"></i>Votre Compte
                </router-link>
              </div>

              <div class="space-y-1">
                <router-link to="/orders" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-box mr-2"></i>Vos Commandes
                </router-link>
                <router-link to="/wishlist" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-heart mr-2"></i>Votre Liste d'envies
                </router-link>
                <router-link to="/notifications" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-bell mr-2"></i>Vos Notifications
                </router-link>
                <router-link to="/addresses" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-cog mr-2"></i>Vos Adresses
                </router-link>
              </div>

              <div class="border-t border-gray-200 mt-3 pt-3">
                <router-link
                  v-if="!authStore.isAuthenticated"
                  to="/login"
                  class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-blue-600 font-semibold"
                >
                  <i class="fas fa-sign-in-alt mr-2"></i>Connexion
                </router-link>
                <button
                  v-else
                  @click="handleLogout"
                  class="w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-blue-600 font-semibold"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
                </button>
              </div>
            </div>
          </div>

          <!-- Orders -->
          <router-link to="/orders" class="flex flex-col cursor-pointer hover:text-blue-600 transition-colors">
            <i class="fas fa-shopping-cart text-sm"></i>
            <span class="text-sm font-semibold">Commandes</span>
          </router-link>

          <!-- Cart -->
          <!-- Cart -->
          <router-link
            to="/cart"
            class="flex items-center cursor-pointer hover:text-blue-600 transition-colors relative"
          >
            <i class="fas fa-shopping-cart text-2xl"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Sign In Button -->
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors inline-block"
          >
            Connexion
          </router-link>
        </div>
      </div>
    </div>

    <!-- Categories Menu -->
    <div
      class="bg-gray-100 border-b border-gray-200 py-2 shadow-sm"
      :class="{
        'fixed top-0 left-0 right-0 z-40 shadow-lg bg-opacity-95 backdrop-blur-sm':
          !props.transparent,
        relative: props.transparent,
      }"
    >
      <div class="container mx-auto px-4 relative">
        <div class="flex items-center justify-center space-x-8 text-sm">
          <!-- Tous les produits -->
          <div class="group">
            <router-link
              to="/products"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-th-large text-gray-600"></i>
              <span>Tous les produits</span>
              <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Promo</span>
            </router-link>
          </div>

          <!-- Smartphone -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'smartphone'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=smartphone"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-mobile-alt text-gray-600"></i>
              <span>Smartphone</span>
            </router-link>

            <!-- Dropdown pour Smartphone -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'smartphone'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'smartphone'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=smartphone" class="block hover:text-blue-600 py-1">• Smartphones</router-link>
                  <router-link to="/products?category=smartphone&search=ecran" class="block hover:text-blue-600 py-1">
                    • Écrans téléphone (réparation)
                  </router-link>
                  <router-link to="/products?category=smartphone&search=batterie" class="block hover:text-blue-600 py-1">• Batteries smartphone</router-link>
                  <router-link to="/products?category=smartphone&search=chargeur" class="block hover:text-blue-600 py-1">• Chargeurs & câbles</router-link>
                  <router-link to="/products?category=smartphone&search=coque" class="block hover:text-blue-600 py-1">• Coques & protections</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Laptop -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'laptop'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=laptop"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-laptop text-gray-600"></i>
              <span>Laptop</span>
            </router-link>

            <!-- Dropdown pour Laptop -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'laptop'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'laptop'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=laptop" class="block hover:text-blue-600 py-1">• Laptops</router-link>
                  <router-link to="/products?category=laptop&search=ecran" class="block hover:text-blue-600 py-1">
                    • Écran laptop (réparation)
                  </router-link>
                  <router-link to="/products?category=laptop&search=batterie" class="block hover:text-blue-600 py-1">• Batteries laptop</router-link>
                  <router-link to="/products?category=laptop&search=chargeur" class="block hover:text-blue-600 py-1">• Chargeurs laptop</router-link>
                  <router-link to="/products?category=laptop&search=ram" class="block hover:text-blue-600 py-1">• RAM</router-link>
                  <router-link to="/products?category=laptop&search=ssd" class="block hover:text-blue-600 py-1">• Disques durs / SSD</router-link>
                  <router-link to="/products?category=laptop&search=usb" class="block hover:text-blue-600 py-1">• Clé USB</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Casque -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'casque'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=audio"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-headphones text-gray-600"></i>
              <span>Casque</span>
            </router-link>

            <!-- Dropdown pour Casque -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'casque'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'casque'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=audio&search=bluetooth" class="block hover:text-blue-600 py-1">• Casques Bluetooth</router-link>
                  <router-link to="/products?category=audio&search=gaming" class="block hover:text-blue-600 py-1">• Casques gaming</router-link>
                  <router-link to="/products?category=audio&search=ecouteur" class="block hover:text-blue-600 py-1">• Écouteurs</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Appareil photo -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'photo'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=photo"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-camera text-gray-600"></i>
              <span>Appareil photo</span>
            </router-link>

            <!-- Dropdown pour Appareil photo -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'photo'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'photo'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=photo" class="block hover:text-blue-600 py-1">• Appareils photo numériques</router-link>
                  <router-link to="/products?category=photo&search=objectif" class="block hover:text-blue-600 py-1">• Objectifs</router-link>
                  <router-link to="/products?category=photo&search=accessoire" class="block hover:text-blue-600 py-1">• Accessoires photo</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Gaming -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'gaming'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=gaming"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-gamepad text-gray-600"></i>
              <span>Gaming</span>
              <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Promo</span>
            </router-link>

            <!-- Dropdown pour Gaming -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'gaming'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'gaming'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=gaming" class="block hover:text-blue-600 py-1">• Consoles</router-link>
                  <router-link to="/products?category=gaming&search=manette" class="block hover:text-blue-600 py-1">• Manettes</router-link>
                  <router-link to="/products?category=gaming&search=accessoire" class="block hover:text-blue-600 py-1">• Accessoires gaming</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Speaker -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'speaker'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=audio"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-volume-up text-gray-600"></i>
              <span>Speaker</span>
            </router-link>

            <!-- Dropdown pour Speaker -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'speaker'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'speaker'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=audio" class="block hover:text-blue-600 py-1">• Enceintes Bluetooth</router-link>
                  <router-link to="/products?category=audio&search=soundbar" class="block hover:text-blue-600 py-1">• Soundbars</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Accessoires -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'accessoires'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=accessories"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-tools text-gray-600"></i>
              <span>Accessoires</span>
            </router-link>

            <!-- Dropdown pour Accessoires -->
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'accessoires'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-64"
                style="z-index: 99999"
                @mouseenter="showCategoriesMenu = 'accessoires'"
                @mouseleave="showCategoriesMenu = ''"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=accessories&search=led" class="block hover:text-blue-600 py-1">
                    • Lumière LED pour chambre
                  </router-link>
                  <router-link to="/products?category=accessories&search=gadget" class="block hover:text-blue-600 py-1">• Lunettes, gadgets</router-link>
                  <router-link to="/products?category=accessories&search=adaptateur" class="block hover:text-blue-600 py-1">
                    • Adaptateurs, multiprises
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Sticky Cart -->
        <div
          v-if="!props.transparent"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center"
        >
          <div
            class="flex items-center cursor-pointer hover:text-blue-600 transition-colors relative"
            @click="router.push('/cart')"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </div>
        </div>
      </div>

    </div>

    </div>
    <!-- END DESKTOP HEADER -->


    <!-- Mobile Menu Drawer (opened from bottom nav) -->
    <div v-if="isMobileMenuOpen" class="md:hidden fixed inset-0 bg-white z-40 pt-16">
      <div class="p-4">
        <button
          @click="closeMobileMenu"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <i class="fas fa-times text-xl"></i>
        </button>

        <!-- Mobile Search -->
        <div class="mb-6">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Rechercher ..."
            class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <MobileMenuLinks @close="closeMobileMenu" />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useDevice } from '@/composables/useDevice'
import MobileMenuLinks from './MobileMenuLinks.vue'

const { locale } = useI18n()
const { isMobile } = useDevice()

// Props
interface Props {
  transparent?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  transparent: false,
})

// Router
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isProductPage = computed(() => {
  // On considère la page panier et checkout comme une page produit pour avoir le header spécifique
  return route.path.includes('/products') || route.path.includes('/cart') || route.name === 'cart' || route.path.includes('/checkout') || route.path.includes('/account') || route.path.includes('/orders')
})

// State
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const showAccountMenu = ref(false)
const showCategoriesMenu = ref('')
const currentLocale = ref(locale.value)

// Methods
const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`)
    closeMobileMenu()
  }
}

const handleLogout = async () => {
  await authStore.logout()
  showAccountMenu.value = false
  router.push('/')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.8);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

/* Mobile Header Styles */
.mobile-header {
  z-index: 50;
}

.mobile-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
}

.cart-icon-mobile {
  position: relative;
  color: #374151;
}

.badge-mobile {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #fb923c;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 9999px;
  font-weight: 600;
}

.mobile-search-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 0.25rem;
}

.mobile-search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  outline: none;
  background: #f3f4f6;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.mobile-search-input:focus {
  border-color: #fb923c;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
