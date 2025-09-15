import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import App from './App'
import Login_Signup from './components/auth/Login_SIgnup'
import DashboardLayout from './components/layout/DashboardLayout'
import ContractsPage from './components/pages/ContractsPage'
import InsightsPage from './components/pages/InsightsPage'
import ReportsPage from './components/pages/ReportsPage'
import SettingsPage from './components/pages/SettingsPage'
import { ProtectedRoute } from './components/auth'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'auth',
        element: (
          <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Login_Signup />
          </main>
        )
      },
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <ContractsPage />
              },
              {
                path: 'contracts',
                element: <ContractsPage />
              },
              {
                path: 'insights',
                element: <InsightsPage />
              },
              {
                path: 'reports',
                element: <ReportsPage />
              },
              {
                path: 'settings',
                element: <SettingsPage />
              }
            ]
          }
        ]
      }
    ]
  }
]

export const router = createBrowserRouter(routes)