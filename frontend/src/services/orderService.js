import api from './api'

const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders')
  return response.data
}

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
}

export default orderService
