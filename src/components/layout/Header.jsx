import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Calendar,
  Activity,
  Users
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const publicNavigation = [
    { name: 'Home', href: '/', internal: true },
    { name: 'Features', href: '/features.html', internal: false },
    { name: 'Solutions', href: '/solutions/', internal: false },
    { name: 'Resources', href: '/resources.html', internal: false },
    { name: 'Contact', href: '/contact.html', internal: false },
  ]

  const appNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Telemedicine', href: '/telemedicine', icon: Users },
    { name: 'Portal', href: '/portal', icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const isActive = (href) => location.pathname === href || (href !== '/' && location.pathname.startsWith(href))

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SelNexa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {publicNavigation.map((item) => {
              const active = item.internal && isActive(item.href)
              const className = `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`

              return item.internal ? (
                <Link key={item.name} to={item.href} className={className}>
                  {item.name}
                </Link>
              ) : (
                <a key={item.name} href={item.href} className={className}>
                  {item.name}
                </a>
              )
            })}

            {isAuthenticated && <span className="mx-2 h-6 w-px bg-gray-200" />}

            {isAuthenticated && appNavigation.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    >
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/contact.html"
                  className="hidden sm:inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Book a demo
                </a>
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  Sign In
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <nav className="flex flex-col space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Explore
              </p>
              {publicNavigation.map((item) => {
                const active = item.internal && isActive(item.href)
                const className = `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`

                return item.internal ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={className}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className={className}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </a>
                )
              })}

              {isAuthenticated && (
                <>
                  <div className="pt-2" />
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Platform
                  </p>
                  {appNavigation.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header
