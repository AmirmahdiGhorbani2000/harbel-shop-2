import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../services/api'
import { Button, Input, TextArea, Modal, Loading, Alert } from '../components/ui'
import { formatPrice } from '../utils/utils'
import { useAuth } from '../store/hooks'

const AdminSidebar = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/admin', label: 'داشبورد', icon: '📊' },
    { path: '/admin/products', label: 'محصولات', icon: '🌿' },
    { path: '/admin/orders', label: 'سفارشات', icon: '📦' },
    { path: '/admin/users', label: 'کاربران', icon: '👥' },
    { path: '/admin/categories', label: 'دسته‌بندی‌ها', icon: '📁' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <Link to="/admin" className="flex items-center space-x-2 space-x-reverse">
          <span className="text-2xl">🌿</span>
          <span className="text-lg font-bold">مدیریت گیاه دارو</span>
        </Link>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg mb-2 transition ${
              location.pathname === item.path
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg mb-2 text-red-400 hover:bg-gray-700 w-full"
        >
          <span>🚪</span>
          <span>خروج</span>
        </button>
      </nav>
    </aside>
  )
}

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  )
}

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats')
        setStats(response.data.data)
      } catch (error) {
        toast.error('خطا در بارگذاری آمار')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <Loading />
  }

  const statCards = [
    { label: 'کل کاربران', value: stats?.totalUsers || 0, color: 'bg-blue-500' },
    { label: 'کل محصولات', value: stats?.totalProducts || 0, color: 'bg-green-500' },
    { label: 'کل سفارشات', value: stats?.totalOrders || 0, color: 'bg-yellow-500' },
    { label: 'درآمد کل', value: formatPrice(stats?.totalRevenue || 0), color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className={`${card.color} text-white rounded-lg p-3 mb-3 text-center text-sm`}>
              {card.label}
            </div>
            <p className="text-2xl font-bold text-center">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">آخرین سفارشات</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-2">شماره سفارش</th>
                <th className="text-right py-2">کاربر</th>
                <th className="text-right py-2">مبلغ</th>
                <th className="text-right py-2">وضعیت</th>
                <th className="text-right py-2">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2">{order._id.slice(-6)}</td>
                  <td className="py-2">{order.user?.name}</td>
                  <td className="py-2">{formatPrice(order.totalAmount)}</td>
                  <td className="py-2">{order.status}</td>
                  <td className="py-2">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || 0,
    stock: product?.stock || 0,
    category: product?.category?._id || '',
    benefits: product?.benefits?.join(', ') || '',
    usage: product?.usage || '',
    sideEffects: product?.sideEffects || '',
    isActive: product?.isActive ?? true,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: parseFloat(formData.discountPrice) || 0,
        stock: parseInt(formData.stock),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
      }
      
      if (product) {
        await api.put(`/admin/products/${product._id}`, data)
        toast.success('محصول به‌روزرسانی شد')
      } else {
        await api.post('/admin/products', data)
        toast.success('محصول ایجاد شد')
      }
      onSave()
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطا در ذخیره محصول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="نام محصول"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <TextArea
        label="توضیحات"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="قیمت (تومان)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <Input
          label="قیمت با تخفیف (تومان)"
          type="number"
          value={formData.discountPrice}
          onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="موجودی"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="خواص درمانی (با کاما جدا کنید)"
        value={formData.benefits}
        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
      />
      <TextArea
        label="طریقه مصرف"
        value={formData.usage}
        onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
        required
      />
      <TextArea
        label="عوارض جانبی"
        value={formData.sideEffects}
        onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
      />
      <label className="flex items-center space-x-2 space-x-reverse">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-green-600"
        />
        <span>فعال</span>
      </label>
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          ذخیره
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          انصراف
        </Button>
      </div>
    </form>
  )
}

const AdminDashboard = () => {
  return <Dashboard />
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get('/products', { params: { limit: 100 } })
      setProducts(response.data.data.products)
    } catch (error) {
      toast.error('خطا در بارگذاری محصولات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return
    try {
      await api.delete(`/admin/products/${id}`)
      toast.success('محصول حذف شد')
      fetchProducts()
    } catch (error) {
      toast.error('خطا در حذف محصول')
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Button onClick={() => {
          setEditingProduct(null)
          setShowForm(true)
        }}>
          افزودن محصول
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right py-3 px-4">نام</th>
              <th className="text-right py-3 px-4">دسته‌بندی</th>
              <th className="text-right py-3 px-4">قیمت</th>
              <th className="text-right py-3 px-4">موجودی</th>
              <th className="text-right py-3 px-4">وضعیت</th>
              <th className="text-right py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.category?.name}</td>
                <td className="py-3 px-4">{formatPrice(product.price)}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setShowForm(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingProduct ? 'ویرایش محصول' : 'افزودن محصول'}
      >
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            fetchProducts()
          }}
        />
      </Modal>
    </div>
  )
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data.data)
    } catch (error) {
      toast.error('خطا در بارگذاری سفارشات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status })
      toast.success('وضعیت سفارش به‌روزرسانی شد')
      fetchOrders()
    } catch (error) {
      toast.error('خطا در به‌روزرسانی وضعیت')
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت سفارشات</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right py-3 px-4">شماره سفارش</th>
              <th className="text-right py-3 px-4">کاربر</th>
              <th className="text-right py-3 px-4">مبلغ</th>
              <th className="text-right py-3 px-4">وضعیت</th>
              <th className="text-right py-3 px-4">تاریخ</th>
              <th className="text-right py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 px-4">{order._id.slice(-6)}</td>
                <td className="py-3 px-4">{order.user?.name}</td>
                <td className="py-3 px-4">{formatPrice(order.totalAmount)}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">در انتظار پرداخت</option>
                    <option value="paid">پرداخت شده</option>
                    <option value="processing">در حال پردازش</option>
                    <option value="shipped">ارسال شده</option>
                    <option value="delivered">تحویل شده</option>
                    <option value="cancelled">لغو شده</option>
                  </select>
                </td>
                <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      const items = order.items.map(item => `${item.name} x ${item.quantity}`).join('\n')
                      alert(`آدرس: ${order.shippingAddress.street}, ${order.shippingAddress.city}\n\nاقلام:\n${items}`)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    جزئیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data.data)
    } catch (error) {
      toast.error('خطا در بارگذاری کاربران')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('کاربر حذف شد')
      fetchUsers()
    } catch (error) {
      toast.error('خطا در حذف کاربر')
    }
  }

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role })
      toast.success('نقش کاربر به‌روزرسانی شد')
      fetchUsers()
    } catch (error) {
      toast.error('خطا در به‌روزرسانی نقش')
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت کاربران</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right py-3 px-4">نام</th>
              <th className="text-right py-3 px-4">ایمیل</th>
              <th className="text-right py-3 px-4">تلفن</th>
              <th className="text-right py-3 px-4">نقش</th>
              <th className="text-right py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phone}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="user">کاربر</option>
                    <option value="admin">ادمین</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data)
    } catch (error) {
      toast.error('خطا در بارگذاری دسته‌بندی‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/categories', formData)
      toast.success('دسته‌بندی ایجاد شد')
      setFormData({ name: '', description: '' })
      setShowForm(false)
      fetchCategories()
    } catch (error) {
      toast.error('خطا در ایجاد دسته‌بندی')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این دسته‌بندی مطمئن هستید؟')) return
    try {
      await api.delete(`/admin/categories/${id}`)
      toast.success('دسته‌بندی حذف شد')
      fetchCategories()
    } catch (error) {
      toast.error('خطا در حذف دسته‌بندی')
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <Button onClick={() => setShowForm(true)}>
          افزودن دسته‌بندی
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right py-3 px-4">نام</th>
              <th className="text-right py-3 px-4">توضیحات</th>
              <th className="text-right py-3 px-4">تاریخ ایجاد</th>
              <th className="text-right py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b">
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">{category.description}</td>
                <td className="py-3 px-4">{new Date(category.createdAt).toLocaleDateString('fa-IR')}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="افزودن دسته‌بندی"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام دسته‌بندی"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextArea
            label="توضیحات"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit">ذخیره</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              انصراف
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export {
  AdminLayout,
  AdminDashboard,
  AdminProducts,
  AdminOrders,
  AdminUsers,
  AdminCategories,
}
