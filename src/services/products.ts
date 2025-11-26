import api from './api'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category?: string
  category_id?: number
  stock: number
  image?: string
  image_url?: string
  images?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
}

export const productsService = {
  // Obtenir tous les produits
  getProducts: async (params?: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    page?: number
    limit?: number
    sortBy?: 'name' | 'price' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
  }) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  // Obtenir un produit par ID
  getProduct: async (id: number) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Obtenir les catégories
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Rechercher des produits
  searchProducts: async (query: string) => {
    const response = await api.get('/products/search', { params: { q: query } })
    return response.data
  },

  // Obtenir les produits vedettes
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured')
    return response.data
  },

  // Obtenir les produits par catégorie
  getProductsByCategory: async (categoryId: number) => {
    const response = await api.get(`/products/category/${categoryId}`)
    return response.data
  },
}
