import Login_Signup from "./components/auth/Login_SIgnup"
import Dashboard from "./components/pages/Dashboard"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

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

  if (isAuthenticated) {
    return <Dashboard />
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Login_Signup />
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;