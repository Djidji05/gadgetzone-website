import api from './api'

export interface Banner {
  id: number
  title: string
  subtitle: string
  image: string
  link?: string
  isActive: boolean
  startDate: string
  endDate: string
  textAlign?: string
  verticalAlign?: string
  titleSize?: string
  titleWeight?: string
  titleColor?: string
  subtitleColor?: string
  buttonText?: string
}

export interface Promotion {
  id: number
  title: string
  description: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  minAmount?: number
  startDate: string
  endDate: string
  isActive: boolean
  applicableProducts?: number[]
  image?: string
}

export const promotionsService = {
  // Obtenir les bannières actives
  getActiveBanners: async (): Promise<Banner[]> => {
    const response = await api.get('/promotions/banners')
    return response.data
  },

  // Obtenir les promotions actives
  getActivePromotions: async (): Promise<Promotion[]> => {
    const response = await api.get('/promotions')
    return response.data
  },

  // Vérifier un code promo
  validatePromoCode: async (
    code: string,
    cartTotal: number,
  ): Promise<{
    valid: boolean
    promotion?: Promotion
    discountAmount?: number
    newTotal?: number
  }> => {
    const response = await api.post('/promotions/validate', { code, cartTotal })
    return response.data
  },

  // Obtenir les promotions par produit
  getProductPromotions: async (productId: number): Promise<Promotion[]> => {
    const response = await api.get(`/promotions/product/${productId}`)
    return response.data
  },
}
