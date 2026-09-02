import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../store/hooks'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-green-700">گیاه دارو</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">
              خانه
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600 transition">
              محصولات
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
              درباره ما
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">
              تماس با ما
            </Link>
          </nav>

          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-green-600"
                >
                  <span className="text-sm">{user?.name}</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      پروفایل
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        پنل مدیریت
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                ورود
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">🌿 گیاه دارو</h3>
            <p className="text-gray-400 text-sm">
              فروشگاه اینترنتی گیاهان دارویی با هدف ترویج طب سنتی و ارائه محصولات ارگانیک
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white">محصولات</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">درباره ما</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">تماس با ما</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">اطلاعات تماس</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 021-12345678</li>
              <li>📧 info@herbalshop.com</li>
              <li>📍 تهران، خیابان انقلاب</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © 2024 گیاه دارو. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  )
}

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
