import api from './api'

export interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  country?: string
  isActive: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface AuthResponse {
  customer: Customer
  token: string
}

export const authService = {
  // Inscription
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Déconnexion
  logout: async () => {
    try {
      // Tenter l'appel API mais ignorer l'erreur si l'API n'existe pas
      try {
        await api.post('/auth/logout')
      } catch (apiError) {
        console.log('API logout not available, clearing local data only')
      }
    } finally {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_data')
    }
  },

  // Obtenir le profil client
  getProfile: async (): Promise<Customer> => {
    const response = await api.get('/customers/profile')
    return response.data
  },

  // Mettre à jour le profil
  updateProfile: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put('/customers/profile', data)
    return response.data
  },

  // Vérifier si le token est valide
  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/verify')
      return true
    } catch {
      return false
    }
  },

  // Sauvegarder les données dans localStorage
  saveAuthData: (authData: AuthResponse) => {
    localStorage.setItem('customer_token', authData.token)
    localStorage.setItem('customer_data', JSON.stringify(authData.customer))
  },

  // Obtenir les données depuis localStorage
  getStoredAuthData: (): AuthResponse | null => {
    const token = localStorage.getItem('customer_token')
    const customerData = localStorage.getItem('customer_data')

    if (token && customerData) {
      try {
        return {
          token,
          customer: JSON.parse(customerData),
        }
      } catch {
        return null
      }
    }
    return null
  },
}
