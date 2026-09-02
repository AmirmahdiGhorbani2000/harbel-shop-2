import api from './api'

const getCart = async () => {
  const response = await api.get('/cart')
  return response.data
}

const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart/add', { productId, quantity })
  return response.data
}

const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/update/${itemId}`, { quantity })
  return response.data
}

const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/remove/${itemId}`)
  return response.data
}

const clearCart = async () => {
  const response = await api.delete('/cart/clear')
  return response.data
}

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
}

export default cartService
