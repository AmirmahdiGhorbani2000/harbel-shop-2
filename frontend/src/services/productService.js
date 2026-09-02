import api from './api'

const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params })
  return response.data
}

const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

const getProductsByCategory = async (categoryId) => {
  const response = await api.get(`/products/category/${categoryId}`)
  return response.data
}

const searchProducts = async (query) => {
  const response = await api.get('/products/search', { params: { q: query } })
  return response.data
}

const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

const productService = {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getCategories,
}

export default productService
