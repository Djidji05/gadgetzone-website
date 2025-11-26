import type { Banner, Promotion } from './promotions'
import type { Product, Category } from './products'

// Données de fallback pour les bannières
export const fallbackBanners: Banner[] = [
  {
    id: 1,
    title: 'Bienvenue sur GadgetZone',
    subtitle: 'Découvrez nos derniers produits technologiques',
    image: 'https://via.placeholder.com/1200x500/3B82F6/FFFFFF?text=Bannière+GadgetZone',
    link: '/products',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
  },
  {
    id: 2,
    title: 'Promotions Spéciales',
    subtitle: '-20% sur tous les produits sélectionnés',
    image: 'https://via.placeholder.com/1200x500/10B981/FFFFFF?text=Promotions+-20%25',
    link: '/products?promotion=special',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
  },
]

// Données de fallback pour les promotions
export const fallbackPromotions: Promotion[] = [
  {
    id: 1,
    title: 'Été 2024',
    description: "Profitez de nos offres spéciales pour l'été",
    code: 'ETE2024',
    discount: 15,
    discountType: 'percentage',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    isActive: true,
    image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Été+2024',
    applicableProducts: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    title: 'Black Friday',
    description: "Les meilleures offres de l'année",
    code: 'BLACK2024',
    discount: 30,
    discountType: 'percentage',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    isActive: true,
    image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Black+Friday',
    applicableProducts: [1, 3, 5, 7, 8],
  },
]

// Données de fallback pour les catégories
export const fallbackCategories: Category[] = [
  { id: 1, name: 'Smartphones', description: 'Téléphones intelligents et accessoires' },
  { id: 2, name: 'Ordinateurs', description: 'Ordinateurs portables et de bureau' },
  { id: 3, name: 'Tablettes', description: 'Tablettes et e-readers' },
  { id: 4, name: 'Accessoires', description: 'Accessoires électroniques et gadgets' },
  { id: 5, name: 'Audio', description: 'Écouteurs, haut-parleurs et équipements audio' },
  { id: 6, name: 'Gaming', description: 'Consoles de jeux et accessoires gaming' },
]

// Données de fallback pour les produits vedettes
export const fallbackFeaturedProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: 'Le dernier iPhone avec processeur A17 Pro et système de caméras avancé',
    price: 1299.99,
    stock: 25,
    category_id: 1,
    category: 'Smartphones',
    image_url: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=iPhone+15+Pro+Max',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    description: 'Ordinateur portable puissant avec puce M3 Max',
    price: 2499.99,
    stock: 15,
    category_id: 2,
    category: 'Ordinateurs',
    image_url: 'https://via.placeholder.com/300x300/6366F1/FFFFFF?text=MacBook+Pro+16',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    name: 'iPad Pro 12.9"',
    description: 'Tablette professionnelle avec écran Liquid Retina XDR',
    price: 1099.99,
    stock: 20,
    category_id: 3,
    category: 'Tablettes',
    image_url: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=iPad+Pro+12.9',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    description: 'Écouteurs sans fil avec réduction de bruit active',
    price: 249.99,
    stock: 50,
    category_id: 5,
    category: 'Audio',
    image_url: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=AirPods+Pro+2',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 5,
    name: 'PlayStation 5',
    description: 'Console de jeux nouvelle génération',
    price: 499.99,
    stock: 30,
    category_id: 6,
    category: 'Gaming',
    image_url: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=PlayStation+5',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Service de validation de code promo fallback
export const validateFallbackPromoCode = (
  code: string,
  cartTotal: number,
): {
  valid: boolean
  promotion?: Promotion
  discountAmount?: number
  newTotal?: number
} => {
  const promotion = fallbackPromotions.find(
    (promo) => promo.code === code.toUpperCase() && promo.isActive,
  )

  if (!promotion) {
    return { valid: false }
  }

  let discountAmount = 0
  if (promotion.discountType === 'percentage') {
    discountAmount = (cartTotal * promotion.discount) / 100
  } else {
    discountAmount = promotion.discount
  }

  return {
    valid: true,
    promotion,
    discountAmount,
    newTotal: cartTotal - discountAmount,
  }
}

// Fonction utilitaire pour obtenir les données de fallback
export const getFallbackData = (type: 'banners' | 'promotions' | 'categories' | 'products') => {
  switch (type) {
    case 'banners':
      return fallbackBanners
    case 'promotions':
      return fallbackPromotions
    case 'categories':
      return fallbackCategories
    case 'products':
      return fallbackFeaturedProducts
    default:
      return []
  }
}

// Fonction utilitaire pour vérifier si une réponse API est valide
export const isValidApiResponse = (response: any): boolean => {
  if (!response) return false
  if (typeof response === 'string') return false
  if (response.message && typeof response.message === 'string' && !Array.isArray(response)) {
    return false // C'est probablement un message d'erreur
  }
  return true
}
