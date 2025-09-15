import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ContractsPage from '../pages/ContractsPage'
import InsightsPage from '../pages/InsightsPage'
import ReportsPage from '../pages/ReportsPage'
import SettingsPage from '../pages/SettingsPage'

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('contracts')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'contracts':
        return <ContractsPage searchQuery={searchQuery} />
      case 'insights':
        return <InsightsPage />
      case 'reports':
        return <ReportsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <ContractsPage searchQuery={searchQuery} />
    }
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          success: {
            duration: 3000,
            style: {
              background: '#065f46',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#991b1b',
              color: '#fff',
            },
          },
        }}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab)
          setSidebarOpen(false) // Close sidebar on mobile after selection
        }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar with mobile menu button */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Bar for Contracts Page */}
            {activeTab === 'contracts' && (
              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <Topbar />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}