import api from './api'

const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

const updateProfile = async (userData) => {
  const response = await api.put('/auth/updateprofile', userData)
  return response.data
}

const changePassword = async (passwordData) => {
  const response = await api.put('/auth/changepassword', passwordData)
  return response.data
}

const authService = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
}

export default authService
