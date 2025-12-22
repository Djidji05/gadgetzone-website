import axios from 'axios'

// Configuration de l'API pour se connecter au backend de GadgetZone Admin
const API_BASE_URL = 'http://localhost:3003/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// === SERVICES ADRESSES ===
export interface Address {
  id: number
  street: string
  quartier: string
  city: string
  country: string
  whatsapp?: string
  note?: string
  is_default: boolean
}

export const addressService = {
  getAll: async () => {
    const response = await api.get('/addresses')
    return response.data
  },
  create: async (data: Partial<Address>) => {
    const response = await api.post('/addresses', data)
    return response.data
  },
  update: async (id: number, data: Partial<Address>) => {
    const response = await api.put(`/addresses/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/addresses/${id}`)
    return response.data
  }
}

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
