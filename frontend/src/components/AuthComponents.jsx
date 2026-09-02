import React, { useState } from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import authService from '../services/authService'
import { Button, Input, Alert } from './ui'
import { validateEmail, validatePassword } from '../utils/utils'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('ایمیل معتبر نیست')
      return
    }

    if (!validatePassword(password)) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
      return
    }

    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      dispatch(setCredentials({
        user: response.data,
        token: response.data.token,
      }))
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ورود')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">ورود به حساب کاربری</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Input
          label="ایمیل"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
        />
        <Input
          label="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          ورود
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        حساب کاربری ندارید؟{' '}
        <Link to="/register" className="text-green-600 hover:underline">
          ثبت نام کنید
        </Link>
      </p>
    </div>
  )
}

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || formData.name.length < 2) {
      setError('نام باید حداقل ۲ کاراکتر باشد')
      return
    }

    if (!validateEmail(formData.email)) {
      setError('ایمیل معتبر نیست')
      return
    }

    if (!validatePassword(formData.password)) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
      return
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      setError('شماره موبایل معتبر نیست')
      return
    }

    setLoading(true)

    try {
      const response = await authService.register(formData)
      dispatch(setCredentials({
        user: response.data,
        token: response.data.token,
      }))
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ثبت نام')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">ثبت نام</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Input
          label="نام و نام خانوادگی"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="نام شما"
          required
        />
        <Input
          label="ایمیل"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
        />
        <Input
          label="شماره موبایل"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="09123456789"
          required
        />
        <Input
          label="رمز عبور"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="حداقل ۶ کاراکتر"
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          ثبت نام
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        قبلا ثبت نام کرده اید؟{' '}
        <Link to="/login" className="text-green-600 hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  )
}

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, token } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
    }
