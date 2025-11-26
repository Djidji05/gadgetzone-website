import api from './api'

export interface OrderItem {
  id: number
  productId: number
  product: {
    id: number
    name: string
    price: number
    image?: string
  }
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface PaymentMethod {
  type: 'natcash' | 'moncashwise' | 'visa' | 'zelle'
  details?: any
}

export interface CreateOrderData {
  items: {
    productId: number
    quantity: number
  }[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  promoCode?: string
}

export interface Order {
  id: number
  orderNumber: string
  customerId: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export const ordersService = {
  // Créer une nouvelle commande
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', data)
    return response.data
  },

  // Obtenir les commandes du client
  getCustomerOrders: async (): Promise<Order[]> => {
    const response = await api.get('/customers/orders')
    return response.data
  },

  // Obtenir une commande par ID
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Annuler une commande
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`)
    return response.data
  },

  // Suivre une commande
  trackOrder: async (trackingNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/track/${trackingNumber}`)
    return response.data
  },

  // Mettre à jour le statut de la commande (admin only)
  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  }
}
