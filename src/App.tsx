import { Outlet, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { useEffect } from 'react'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // If authenticated and on root or auth route, redirect to contracts
        if (location.pathname === '/' || location.pathname === '/auth') {
          navigate('/contracts', { replace: true })
        }
      } else {
        // If not authenticated, redirect to auth
        navigate('/auth', { replace: true })
      }
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return <Outlet />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;