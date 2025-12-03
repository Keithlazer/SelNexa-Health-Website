import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  // Log access for security audit
  useEffect(() => {
    console.log(`[SECURITY] Accessed protected route: ${location.pathname} by user: ${user?.email}`)
  }, [location.pathname, user?.email])

  return children
}

export default ProtectedRoute