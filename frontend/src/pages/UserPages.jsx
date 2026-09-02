import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import productService from '../services/productService'
import cartService from '../services/cartService'
import orderService from '../services/orderService'
import paymentService from '../services/paymentService'
import { setProducts, setProduct, setCategories } from '../store/slices/productSlice'
import { setCart, removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice'
import { addOrder } from '../store/slices/orderSlice'
import { ProductGrid, ProductFilter, ProductDetails } from '../components/ProductComponents'
import { LoginForm, RegisterForm } from '../components/AuthComponents'
import { Button, Input, Loading, Alert } from '../components/ui'
import { formatPrice } from '../utils/utils'
import { useAuth, useCart } from '../store/hooks'

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts({ limit: 8, sort: 'newest' })
        setFeaturedProducts(response.data.products)
      } catch (error) {
        toast.error('خطا در بارگذاری محصولات')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-l from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🌿 گیاه دارو</h1>
          <p className="text-xl mb-8">فروشگاه اینترنتی گیاهان دارویی ارگانیک</p>
          <a
            href="/products"
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            مشاهده محصولات
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">جدیدترین محصولات</h2>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      <section className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold mb-2">ارسال سریع</h3>
              <p className="text-gray-600">ارسال به سراسر کشور</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2">تضمین کیفیت</h3>
              <p className="text-gray-600">محصولات ارگانیک و با کیفیت</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold mb-2">پشتیبانی</h3>
              <p className="text-gray-600">پاسخگویی ۲۴ ساعته</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { products, categories, loading } = useSelector((state) => state.products)
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  })

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setProducts({ products: [], page: 1, pages: 1, total: 0 }))
      try {
        const response = await productService.getProducts(filters)
        dispatch(setProducts(response.data))
        const params = {}
        if (filters.page > 1) params.page = filters.page
        if (filters.category) params.category = filters.category
        if (filters.search) params.search = filters.search
        if (filters.sort !== 'newest') params.sort = filters.sort
        setSearchParams(params)
      } catch (error) {
        toast.error('خطا در بارگذاری محصولات')
      }
    }
    fetchProducts()
  }, [filters, dispatch, setSearchParams])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories()
        dispatch(setCategories(response.data))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">محصولات</h1>
      <ProductFilter
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
      />
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}

export const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector((state) => state.products)

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(setProduct(null))
      try {
        const response = await productService.getProductById(id)
        dispatch(setProduct(response.data))
      } catch (error) {
        toast.error('خطا در بارگذاری محصول')
      }
    }
    fetchProduct()
  }, [id, dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} loading={loading} />
    </div>
  )
}

export const CartItemComponent = ({ item }) => {
  const dispatch = useDispatch()

  const handleUpdateQuantity = async (newQuantity) => {
    try {
      const response = await cartService.updateCartItem(item._id, newQuantity)
      dispatch(setCart(response.data.items))
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی')
    }
  }

  const handleRemove = async () => {
    try {
      const response = await cartService.removeCartItem(item._id)
      dispatch(setCart(response.data.items))
      toast.success('آیتم حذف شد')
    } catch (error) {
      toast.error('خطا در حذف آیتم')
    }
  }

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow p-4">
      <div className="w-20 h-20 bg-green-100 rounded flex items-center justify-center text-2xl">
        🌿
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-sm text-gray-600">
          {formatPrice(item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="text-red-600 hover:text-red-700"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading, totalPrice } = useCart()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart()
        dispatch(setCart(response.data.items))
      } catch (error) {
        toast.error('خطا در بارگذاری سبد خرید')
      }
    }
    fetchCart()
  }, [dispatch])

  const handleClearCart = async () => {
    try {
      await cartService.clearCart()
      dispatch(clearCart())
      toast.success('سبد خرید خالی شد')
    } catch (error) {
      toast.error('خطا در خالی کردن سبد')
    }
  }

  if (loading && items.length === 0) {
    return <Loading />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">سبد خرید خالی است</h2>
        <p className="text-gray-600 mb-6">محصولات مورد نظر خود را اضافه کنید</p>
        <Button onClick={() => navigate('/products')}>
          مشاهده محصولات
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">سبد خرید</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemComponent key={item._id} item={item} />
          ))}
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            خالی کردن سبد خرید
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>تعداد اقلام:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>مبلغ کل:</span>
              <span className="text-green-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <Button
            onClick={() => navigate('/checkout')}
            className="w-full"
            size="lg"
          >
            ادامه خرید
          </Button>
        </div>
      </div>
    </div>
  )
}

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { totalPrice } = useCart()
  const { user } = useAuth()
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderResponse = await orderService.createOrder({ shippingAddress })
      dispatch(addOrder(orderResponse.data))
      
      const paymentResponse = await paymentService.requestPayment(orderResponse.data._id)
      
      if (paymentResponse.success) {
        window.location.href = paymentResponse.data.url
      } else {
        toast.error('خطا در اتصال به درگاه پرداخت')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطا در ثبت سفارش')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">پرداخت</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">آدرس ارسال</h2>
            <Input
              label="خیابان"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              placeholder="آدرس کامل"
              required
            />
            <Input
              label="شهر"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              placeholder="شهر"
              required
            />
            <Input
              label="کد پستی"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              placeholder="کد پستی"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              پرداخت {formatPrice(totalPrice)}
            </Button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">اطلاعات پرداخت</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>مبلغ قابل پرداخت:</span>
              <span className="font-bold text-green-600">{formatPrice(totalPrice)}</span>
            </div>
            <div className="text-sm text-gray-600">
              پرداخت از طریق درگاه امن زرین‌پال
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <LoginForm />
    </div>
  )
}

export const RegisterPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <RegisterForm />
    </div>
  )
}

export const ProfilePage = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders()
        setOrders(response.data)
      } catch (error) {
        toast.error('خطا در بارگذاری سفارشات')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      })
      dispatch(setCredentials({
        user: response.data,
        token: localStorage.getItem('token'),
      }))
      setEditMode(false)
      toast.success('پروفایل به‌روزرسانی شد')
    } catch (error) {
      toast.error('خطا در به‌روزرسانی پروفایل')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">پروفایل کاربری</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">اطلاعات شخصی</h2>
          {!editMode ? (
            <div className="space-y-3">
              <p><strong>نام:</strong> {user?.name}</p>
              <p><strong>ایمیل:</strong> {user?.email}</p>
              <p><strong>تلفن:</strong> {user?.phone}</p>
              <Button onClick={() => setEditMode(true)} size="sm">
                ویرایش پروفایل
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <Input
                label="نام"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="تلفن"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                label="خیابان"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
              <Input
                label="شهر"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="کد پستی"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm">ذخیره</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setEditMode(false)}>
                  انصراف
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">سفارشات من</h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              سفارشی ثبت نشده است
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">سفارش #{order._id.slice(-6)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status === 'paid' ? 'پرداخت شده' : 'در انتظار پرداخت'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>جمع کل:</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">درباره ما</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <p className="text-gray-700 leading-relaxed mb-4">
          فروشگاه گیاه دارو با هدف ترویج استفاده از گیاهان دارویی و طب سنتی تاسیس شده است.
          ما با همکاری کشاورزان محلی و تولیدکنندگان معتبر، بهترین و با کیفیت‌ترین محصولات
          گیاهی را به دست شما می‌رسانیم.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          تمامی محصولات ما دارای تاییدیه از سازمان غذا و دارو هستند و تحت نظارت
          متخصصان طب سنتی تولید می‌شوند.
        </p>
        <p className="text-gray-700 leading-relaxed">
          هدف ما ارائه محصولات ارگانیک و طبیعی با قیمت مناسب به سراسر کشور است.
        </p>
      </div>
    </div>
  )
}

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('پیام شما ارسال شد')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">تماس با ما</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">اطلاعات تماس</h2>
          <div className="space-y-3">
            <p>📞 تلفن: 021-12345678</p>
            <p>📧 ایمیل: info@herbalshop.com</p>
            <p>📍 آدرس: تهران، خیابان انقلاب</p>
            <p>🕐 ساعات کاری: شنبه تا پنجشنبه ۹ صبح تا ۵ عصر</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">ارسال پیام</h2>
          <Input
            label="نام"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="ایمیل"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <textarea
            label="پیام"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="پیام خود را بنویسید..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="4"
            required
          />
          <Button type="submit">ارسال</Button>
        </form>
      </div>
    </div>
  )
          }
