import api from './api'

const requestPayment = async (orderId) => {
  const response = await api.post('/payment/request', { orderId })
  return response.data
}

const verifyPayment = async (paymentData) => {
  const response = await api.post('/payment/verify', paymentData)
  return response.data
}

const paymentService = {
  requestPayment,
  verifyPayment,
}

export default paymentService
