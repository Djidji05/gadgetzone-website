<template>
  <div 
    :class="{ 
      'sticky top-[-45px] z-[100]': isMobile && !isProductPage,
      'relative z-[100] w-full bg-white shadow-sm': isMobile && isProductPage,
      'relative': !(isMobile && isProductPage)
    }"
  >
    <!-- Image Search Input (Hidden) - Global -->
    <input
      type="file"
      ref="imageInput"
      accept="image/*"
      class="hidden"
      @change="handleImageSearch"
    />

    <!-- MOBILE HEADER -->
    <div 
      v-if="isMobile" 
      class="mobile-header transition-all duration-300"
      :class="{
        'fixed top-0 left-0 w-full z-[90] bg-white shadow-sm': isProductPage,
        'bg-transparent': !isProductPage
      }"
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
              class="w-full bg-gray-100 border-none rounded-full pl-4 pr-16 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            <button 
              @click="triggerImageSearch"
              class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 p-1"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>
            <button @click="handleSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
               <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Filter Chips Row -->
        <div v-if="isProductListingPage" class="flex overflow-x-auto px-3 pb-3 gap-2 no-scrollbar">
          <!-- Main Filter Button -->
          <button 
            @click="openFilterDrawer('all')"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-200"
          >
            <i class="fas fa-sliders-h"></i>
            Filtrer
          </button>
          
          <!-- Brand -->
          <button 
            @click="openFilterDrawer('brand')"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
          >
            Marque
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>
          
          <!-- Price -->
          <button 
            @click="openFilterDrawer('price')"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
          >
            Prix
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>

           <!-- Category -->
          <button 
            @click="openFilterDrawer('category')"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
          >
            Catégorie
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>
          
          <!-- Sort -->
          <button 
            @click="openFilterDrawer('sort')"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
          >
            Trier
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>
        </div>
      </template>

      <!-- Authenticated View -->
      <template v-else-if="authStore.isAuthenticated && authStore.customer">
        <!-- Line 1: Avatar, Greeting, Cart -->
        <div class="mobile-top-bar">
          <div class="flex flex-col ml-0">
            <span class="text-[10px] text-gray-500 font-medium">Bon retour,</span>
            <span class="font-bold text-gray-900 text-sm leading-tight max-w-[150px] truncate">
              {{ authStore.customer.firstName || authStore.customer.email }}
            </span>
          </div>
          
          <router-link to="/wishlist" class="text-gray-700 hover:text-red-600 transition-colors relative p-1">
            <i class="fas fa-heart text-xl"></i>
            <span v-if="wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ wishlistStore.itemCount }}</span>
          </router-link>
        </div>

        <!-- Line 2: Search + Settings -->
        <div class="mobile-search-bar">
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="search"
              placeholder="Rechercher des produits..."
              class="mobile-search-input w-full pr-10"
            />
            <button 
              @click="triggerImageSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>
          </div>
          <Transition name="fade">
            <button v-if="!isMobileMenuOpen" @click="isMobileMenuOpen = true" class="p-2 text-gray-600 hover:text-primary-600">
               <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H21L19 9H2L4 6Z"/>
                  <path d="M4 12H16L14 15H2L4 12Z"/>
                  <path d="M4 18H21L19 21H2L4 18Z"/>
               </svg>
            </button>
          </Transition>
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
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="search"
              placeholder="Rechercher des produits..."
              class="mobile-search-input w-full pr-10"
            />
             <button 
              @click="triggerImageSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>
          </div>
          <Transition name="fade">
            <button v-if="!isMobileMenuOpen" @click="isMobileMenuOpen = true" class="p-2 text-gray-600 hover:text-primary-600">
               <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H21L19 9H2L4 6Z"/>
                  <path d="M4 12H16L14 15H2L4 12Z"/>
                  <path d="M4 18H21L19 21H2L4 18Z"/>
               </svg>
            </button>
          </Transition>
        </div>
      </template>
    </div>

    <!-- CATEGORIES (Mobile) -->
    <div 
      v-if="isMobile && !route.path.includes('/cart') && !route.path.includes('/checkout') && !route.path.includes('/account') && !route.path.includes('/orders') && !route.path.includes('/wishlist') && !route.path.includes('/addresses') && route.name !== 'product-detail'" 
      class="bg-transparent pb-2 pt-0"
      :class="{'mt-[112px]': isProductPage}"
    >
      <!-- Categories Scroll (Common) -->
      <!-- Vertical Card Style (Product Pages Only) -->
      <div v-if="isProductListingPage" class="flex overflow-x-auto pb-4 px-4 gap-3 no-scrollbar mt-2">
        <router-link 
          to="/products" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="!route.query.category 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-th-large text-xl sm:text-2xl mb-1" :class="!route.query.category ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="!route.query.category ? 'text-white' : 'text-gray-600'">Tous</span>
        </router-link>

        <router-link 
          to="/products?category=smartphone" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="route.query.category === 'smartphone' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-mobile-alt text-xl sm:text-2xl mb-1" :class="route.query.category === 'smartphone' ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="route.query.category === 'smartphone' ? 'text-white' : 'text-gray-600'">Phones</span>
        </router-link>

        <router-link 
          to="/products?category=laptop" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="route.query.category === 'laptop' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-laptop text-xl sm:text-2xl mb-1" :class="route.query.category === 'laptop' ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="route.query.category === 'laptop' ? 'text-white' : 'text-gray-600'">Laptops</span>
        </router-link>

        <router-link 
          to="/products?category=gaming" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="route.query.category === 'gaming' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-gamepad text-xl sm:text-2xl mb-1" :class="route.query.category === 'gaming' ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="route.query.category === 'gaming' ? 'text-white' : 'text-gray-600'">Gaming</span>
        </router-link>
        
        <router-link 
          to="/products?category=audio" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="route.query.category === 'audio' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-headphones text-xl sm:text-2xl mb-1" :class="route.query.category === 'audio' ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="route.query.category === 'audio' ? 'text-white' : 'text-gray-600'">Audio</span>
        </router-link>

        <router-link 
          to="/products?category=photo" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="route.query.category === 'photo' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-camera text-xl sm:text-2xl mb-1" :class="route.query.category === 'photo' ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="route.query.category === 'photo' ? 'text-white' : 'text-gray-600'">Photo</span>
        </router-link>

        <router-link 
          to="/products?category=accessories" 
          class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
          :class="route.query.category === 'accessories' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-offset-2 ring-blue-500' 
            : 'bg-white text-gray-400 border border-gray-100 hover:shadow-md'"
        >
          <i class="fas fa-tools text-xl sm:text-2xl mb-1" :class="route.query.category === 'accessories' ? 'text-white' : 'text-gray-600'"></i>
          <span class="text-[10px] font-medium" :class="route.query.category === 'accessories' ? 'text-white' : 'text-gray-600'">Access.</span>
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
              class="w-full border border-gray-300 pl-4 pr-24 py-2 text-sm focus:outline-none focus:border-blue-400 rounded-full"
            />


             <!-- Camera Button -->
            <button
              @click="triggerImageSearch"
              class="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-2"
              title="Recherche par image"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>

            <!-- Search Button -->
            <button
              @click="handleSearch"
              class="absolute right-0 top-0 bottom-0 bg-blue-400 hover:bg-blue-500 text-white px-6 rounded-r-full transition-colors"
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
              class="absolute -top-2 -right-2 bg-blue-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Sign In Button -->
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors inline-block"
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
              class="absolute -top-2 -right-2 bg-blue-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </div>
        </div>
      </div>

    </div>

    </div>
    <!-- END DESKTOP HEADER -->


    <!-- Mobile Menu Drawer -->
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-[100] backdrop-blur-sm"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition name="slide-left">
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-white z-[101] flex flex-col font-sans"
      >
        <!-- Drawer Header -->
        <div class="px-6 py-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between relative overflow-hidden">
          <!-- Decorative Background Blob -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <!-- User Info or Logo -->
          <div class="relative z-10 flex items-center gap-4 w-full">
             <div v-if="authStore.customer" class="flex-shrink-0">
                 <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-200">
                     {{ authStore.customer.firstName ? authStore.customer.firstName.charAt(0).toUpperCase() : 'U' }}
                 </div>
             </div>
             <div v-if="authStore.customer" class="flex-1 min-w-0">
                 <p class="font-bold text-gray-900 text-lg leading-tight truncate">
                   {{ authStore.customer.firstName }} {{ authStore.customer.lastName }}
                 </p>
                 <router-link to="/account" @click="closeMobileMenu" class="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 mt-1">
                   Mon compte <i class="las la-arrow-right"></i>
                 </router-link>
             </div>
             
             <div v-else class="flex items-center gap-3">
               <img src="/images/logo.png" class="h-10 w-auto" alt="GadgetZone">
             </div>
          </div>
          
          <button 
             @click="closeMobileMenu" 
             class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-600 shadow-md flex items-center justify-center hover:text-red-500 hover:bg-gray-50 transition-colors z-50 ring-1 ring-gray-100"
          >
             <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
           <!-- Search in Drawer -->
           <!-- Search in Drawer Removed -->

           <MobileMenuLinks @close="closeMobileMenu" />
        </div>
        
        <!-- Drawer Footer (Socials or Info) -->
        <div class="p-6 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-400">
          <p>© 2024 GadgetZone. Tous droits réservés.</p>
        </div>
      </div>
    </Transition>
    
    <!-- Filter Drawer -->
    <ProductFilterDrawer 
      :is-open="isFilterDrawerOpen" 
      :active-tab="activeFilterTab"
      @close="isFilterDrawerOpen = false" 
    />
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
import ProductFilterDrawer from '@/components/products/ProductFilterDrawer.vue'
import { api } from '@/services/api'

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
  return route.path.includes('/products') || route.path.includes('/cart') || route.name === 'cart' || route.path.includes('/checkout') || route.path.includes('/account') || route.path.includes('/orders') || route.path.includes('/wishlist') || route.path.includes('/addresses')
})

const isProductListingPage = computed(() => {
  return route.name === 'products'
})

// State
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)
const isFilterDrawerOpen = ref(false)
const activeFilterTab = ref('all')
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

const openFilterDrawer = (tab: string = 'all') => {
  activeFilterTab.value = tab
  isFilterDrawerOpen.value = true
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Image Search
const imageInput = ref<HTMLInputElement | null>(null)
const isImageSearching = ref(false)

const triggerImageSearch = () => {
  if (isImageSearching.value) return
  imageInput.value?.click()
}

const handleImageSearch = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner une image valide.")
        return
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        const base64Image = reader.result;
        
        try {
            isImageSearching.value = true
            
            // Show loading state (optional: could use a toast)
            console.log("Analysant l'image...")
            
            const response = await api.post('/products/search/image', { image: base64Image });
            
            if (response.data && response.data.ids && response.data.ids.length > 0) {
                console.log("Produits trouvés:", response.data.ids)
                // Redirect to filtered results
                await router.push({
                    name: 'products',
                    query: { ids: response.data.ids.join(',') }
                });
                closeMobileMenu();
            } else {
                alert("Aucun produit similaire trouvé.");
            }
        } catch (error: any) {
            console.error("Erreur recherche image:", error);
            const msg = error.response?.data?.error || "Erreur lors de la recherche par image.";
            alert(msg);
        } finally {
            isImageSearching.value = false;
            // Reset input so same file can be selected again
            if (imageInput.value) imageInput.value.value = '';
        }
    };
    
    reader.onerror = () => {
        alert("Erreur lors de la lecture du fichier.");
        isImageSearching.value = false;
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

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
