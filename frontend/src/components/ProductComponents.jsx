import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import cartService from '../services/cartService'
import { formatPrice } from '../utils/utils'
import { Button, PlaceholderImage, Loading } from './ui'
import { toast } from 'react-toastify'

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const response = await cartService.addToCart(product._id, 1)
      dispatch(addToCart({
        product: product,
        quantity: 1,
        _id: response.data.items[response.data.items.length - 1]._id,
      }))
      toast.success('به سبد خرید اضافه شد')
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطا در افزودن به سبد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <div className="h-48">
          <PlaceholderImage text="🌿" />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-green-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.discountPrice > 0 ? (
              <div>
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm text-gray-400 line-through mr-2">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600">موجود</span>
          ) : (
            <span className="text-xs text-red-600">ناموجود</span>
          )}
        </div>
        <Button
          onClick={handleAddToCart}
          loading={loading}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          افزودن به سبد
        </Button>
      </div>
    </div>
  )
}

export const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return <Loading />
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">محصولی یافت نشد</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export const ProductFilter = ({ categories, filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  const handleSearch = (e) => {
    e.preventDefault()
    onFilterChange({ ...filters, search: searchTerm, page: 1 })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی محصول..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value, page: 1 })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value, page: 1 })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="newest">جدیدترین</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="rating">محبوب‌ترین</option>
        </select>
        <Button type="submit" size="sm">
          جستجو
        </Button>
      </form>
    </div>
  )
}

export const ProductDetails = ({ product, loading }) => {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  if (loading) {
    return <Loading />
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">محصول یافت نشد</p>
      </div>
    )
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      const response = await cartService.addToCart(product._id, quantity)
      dispatch(addToCart({
        product: product,
        quantity: quantity,
        _id: response.data.items[response.data.items.length - 1]._id,
      }))
      toast.success('به سبد خرید اضافه شد')
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطا در افزودن به سبد')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="h-96">
        <PlaceholderImage text="🌿" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>
        
        <div className="mb-6">
          {product.discountPrice > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">خواص درمانی:</h3>
          <ul className="space-y-1">
            {product.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="ml-2 text-green-600">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">طریقه مصرف:</h3>
          <p className="text-gray-700">{product.usage}</p>
        </div>

        {product.sideEffects && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-yellow-700">عوارض جانبی:</h3>
            <p className="text-gray-700">{product.sideEffects}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4 py-2">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-600">
            موجودی: {product.stock}
          </span>
        </div>

        <Button
          onClick={handleAddToCart}
          loading={addingToCart}
          disabled={product.stock === 0}
          className="w-full"
          size="lg"
        >
          {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
        </Button>
      </div>
    </div>
  )
            }
