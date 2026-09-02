import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from './slices/authSlice'
import { clearCart } from './slices/cartSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/login')
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    logout: handleLogout,
  }
}

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state) => state.cart)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price
    return sum + (price * item.quantity)
  }, 0)

  return {
    items,
    loading,
    totalItems,
    totalPrice,
  }
      }
