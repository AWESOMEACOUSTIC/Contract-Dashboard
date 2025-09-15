import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useContracts } from '../../hooks/useContracts'
import toast from 'react-hot-toast'

interface OutletContext {
  searchQuery: string
}

export default function ContractsPage() {
  const { searchQuery = '' } = useOutletContext<OutletContext>()
  const { contracts, loading, error } = useContracts()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'expiry' | 'status' | 'risk'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const rowsPerPage = 10

  // Show error toast when error occurs
  if (error) {
    toast.error(error)
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = contracts.length
    const active = contracts.filter(c => c.status === 'Active').length
    const expired = contracts.filter(c => c.status === 'Expired').length
    const renewalDue = contracts.filter(c => c.status === 'Renewal Due').length
    const highRisk = contracts.filter(c => c.risk === 'High').length
    const lowRisk = contracts.filter(c => c.risk === 'Low').length
    const mediumRisk = contracts.filter(c => c.risk === 'Medium').length
    
    // Calculate percentages
    const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0
    const renewalPercentage = total > 0 ? Math.round((renewalDue / total) * 100) : 0
    const highRiskPercentage = total > 0 ? Math.round((highRisk / total) * 100) : 0
    const totalGrowthPercentage = 75 // This could be calculated based on historical data
    
    return { 
      total, 
      active, 
      expired, 
      renewalDue, 
      highRisk, 
      lowRisk, 
      mediumRisk,
      activePercentage,
      renewalPercentage,
      highRiskPercentage,
      totalGrowthPercentage
    }
  }, [contracts])

  // Filter and sort contracts
  const filteredAndSortedContracts = useMemo(() => {
    let filtered = contracts.filter(contract => {
      const matchesSearch = 
        contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.parties.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
      const matchesRisk = riskFilter === 'all' || contract.risk === riskFilter

      return matchesSearch && matchesStatus && matchesRisk
    })

    // Sort contracts
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'expiry':
          comparison = new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'risk':
          const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 }
          comparison = (riskOrder[a.risk as keyof typeof riskOrder] || 0) - (riskOrder[b.risk as keyof typeof riskOrder] || 0)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [contracts, searchQuery, statusFilter, riskFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedContracts.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedContracts = filteredAndSortedContracts.slice(startIndex, startIndex + rowsPerPage)

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-700/50 text-red-100 border-red-700/30'
      case 'Medium': return 'bg-yellow-700/50 text-yellow-100 border-yellow-700/30'
      case 'Low': return 'bg-green-700/50 text-green-100 border-green-700/30'
      default: return 'bg-gray-700 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-700/50 text-green-100 border-green-700/30'
      case 'Renewal Due': return 'bg-orange-700/50 text-orange-100 border-orange-700/30'
      case 'Expired': return 'bg-red-700/50 text-red-100 border-red-700/30'
      case 'Draft': return 'bg-gray-700 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-700 text-gray-300 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome Back! 👋</h1>
          <p className="text-gray-400 mt-2">
            {stats.total} Total Contracts, {stats.active} Active, {stats.renewalDue} Renewal Due
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New Contract</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Contracts Card */}
        <div className="relative bg-gradient-to-br from-[#1a1d35] to-[#151629] rounded-2xl p-6 overflow-hidden border border-[#2a2d47]">
          {/* Curved Background Pattern */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="cardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,100 Q100,20 200,80 T400,60 L400,200 L0,200 Z" 
              fill="url(#cardGradient1)" 
              opacity="0.8"
            />
            <path 
              d="M0,120 Q150,40 300,90 T400,70 L400,200 L0,200 Z" 
              fill="#8b5cf6" 
              opacity="0.05"
            />
          </svg>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Total Contracts</p>
                <p className="text-4xl font-bold text-white mt-2" style={{fontFamily: 'Monument Grotesk, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'}}>{stats.total}</p>
              </div>
              <div className="text-green-400 text-sm flex items-center">
                <span className="text-green-400">+12%</span>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Growth Rate</span>
                <span className="text-orange-400 text-xs font-medium">{stats.totalGrowthPercentage}% maturity</span>
              </div>
              <div className="flex space-x-1 mb-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-2 rounded-sm ${
                      i < Math.round((stats.totalGrowthPercentage / 100) * 20) ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-orange-400 text-sm">
                <span>Unlock at</span>
                <br />
                <span className="text-orange-300">December 20, 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Contracts Card */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 overflow-hidden">
          {/* Curved Background Pattern */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="cardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#047857" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,80 Q120,10 240,50 T400,40 L400,200 L0,200 Z" 
              fill="url(#cardGradient2)" 
              opacity="0.6"
            />
            <path 
              d="M0,100 Q160,30 320,70 T400,50 L400,200 L0,200 Z" 
              fill="#10B981" 
              opacity="0.05"
            />
          </svg>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Active Contracts</p>
                <p className="text-4xl font-bold text-white mt-2" style={{fontFamily: 'Monument Grotesk, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'}}>{stats.active}</p>
              </div>
              <div className="text-green-400 text-sm flex items-center">
                <span className="text-green-400">+8%</span>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Active Rate</span>
                <span className="text-green-400 text-xs font-medium">{stats.activePercentage}% active</span>
              </div>
              <div className="flex space-x-1 mb-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-2 rounded-sm ${
                      i < Math.round((stats.activePercentage / 100) * 20) ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-green-400 text-sm">
                <span>Performance</span>
                <br />
                <span className="text-green-300">Excellent Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Renewal Due Card */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 overflow-hidden">
          {/* Curved Background Pattern */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="cardGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#B45309" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,90 Q100,25 200,65 T400,55 L400,200 L0,200 Z" 
              fill="url(#cardGradient3)" 
              opacity="0.6"
            />
            <path 
              d="M0,110 Q140,35 280,75 T400,65 L400,200 L0,200 Z" 
              fill="#F59E0B" 
              opacity="0.05"
            />
          </svg>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Renewal Due</p>
                <p className="text-4xl font-bold text-white mt-2" style={{fontFamily: 'Monument Grotesk, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'}}>{stats.renewalDue}</p>
              </div>
              <div className="text-orange-400 text-sm flex items-center">
                <span className="text-orange-400">Alert</span>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Renewal Status</span>
                <span className="text-orange-400 text-xs font-medium">{stats.renewalPercentage}% pending</span>
              </div>
              <div className="flex space-x-1 mb-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-2 rounded-sm ${
                      i < Math.round((stats.renewalPercentage / 100) * 20) ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-orange-400 text-sm">
                <span>Action Required</span>
                <br />
                <span className="text-orange-300">Next 30 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk Card */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 overflow-hidden">
          {/* Curved Background Pattern */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="cardGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path 
              d="M0,85 Q110,15 220,55 T400,45 L400,200 L0,200 Z" 
              fill="url(#cardGradient4)" 
              opacity="0.6"
            />
            <path 
              d="M0,105 Q150,25 300,65 T400,55 L400,200 L0,200 Z" 
              fill="#EF4444" 
              opacity="0.05"
            />
          </svg>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">High Risk</p>
                <p className="text-4xl font-bold text-white mt-2" style={{fontFamily: 'Monument Grotesk, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'}}>{stats.highRisk}</p>
              </div>
              <div className="text-red-400 text-sm flex items-center">
                <span className="text-red-400">Critical</span>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Risk Level</span>
                <span className="text-red-400 text-xs font-medium">{stats.highRiskPercentage}% high risk</span>
              </div>
              <div className="flex space-x-1 mb-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-2 rounded-sm ${
                      i < Math.round((stats.highRiskPercentage / 100) * 20) ? 'bg-red-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-red-400 text-sm">
                <span>Review Required</span>
                <br />
                <span className="text-red-300">Immediate Action</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-[#181820] border border-gray-700 rounded-xl overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-white">All Contracts</h2>
              <p className="text-gray-400 text-sm mt-1">Monitor and manage your contract portfolio</p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#323137cc] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Renewal Due">Renewal Due</option>
                <option value="Draft">Draft</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2 bg-[#323137cc] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading contracts...</p>
          </div>
        ) : filteredAndSortedContracts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">No contracts found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all' || riskFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first contract'}
            </p>
            {(!searchQuery && statusFilter === 'all' && riskFilter === 'all') && (
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                Create Contract
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#323137cc] border-b border-gray-600">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Contract Name</span>
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Parties
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50 transition-colors"
                      onClick={() => handleSort('expiry')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Expiry Date</span>
                        <SortIcon column="expiry" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <SortIcon column="status" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600/50 transition-colors"
                      onClick={() => handleSort('risk')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Risk Score</span>
                        <SortIcon column="risk" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">{contract.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{contract.parties}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(contract.expiry)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)} border border-opacity-20`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRiskColor(contract.risk)} border border-opacity-20`}>
                          {contract.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredAndSortedContracts.length)} of {filteredAndSortedContracts.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}