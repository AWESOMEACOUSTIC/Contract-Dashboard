import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContractDetail } from '../../hooks/useContractDetail'
import ClauseCard from '../ui/ClauseCard'
import InsightItem from '../ui/InsightItem'
import EvidenceDrawer from '../ui/EvidenceDrawer'
import toast from 'react-hot-toast'

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { contract, loading, error } = useContractDetail(id)
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false)

  if (error) {
    toast.error(error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Renewal Due': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'Expired': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070d] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Contract</h2>
          <p className="text-gray-400">Fetching contract details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !contract) {
    return (
      <div className="min-h-screen bg-[#06070d] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Contract Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || 'The contract you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link
            to="/contracts"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06070d] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link to="/contracts" className="hover:text-white transition-colors">
              Contracts
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{contract.name}</span>
          </nav>

          {/* Contract Header */}
          <div className="bg-[#1a1d35] border border-[#2a2d47] rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-3xl font-bold text-white">{contract.name}</h1>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getRiskColor(contract.risk)}`}>
                      {contract.risk} Risk
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Parties</p>
                    <p className="text-white font-medium">{contract.parties}</p>
                  </div>
                  {contract.start && (
                    <div>
                      <p className="text-gray-400 mb-1">Start Date</p>
                      <p className="text-white font-medium">{formatDate(contract.start)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 mb-1">Expiry Date</p>
                    <p className="text-white font-medium">{formatDate(contract.expiry)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6 lg:mt-0">
                <button
                  onClick={() => setIsEvidenceDrawerOpen(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Open Evidence</span>
                </button>
                <Link
                  to="/contracts"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Clauses Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Contract Clauses</h2>
              <span className="text-gray-400 text-sm">
                {contract.clauses?.length || 0} clause{(contract.clauses?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            
            {contract.clauses && contract.clauses.length > 0 ? (
              <div className="space-y-6">
                {contract.clauses.map((clause, index) => (
                  <ClauseCard key={index} clause={clause} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1d35] border border-[#2a2d47] rounded-xl p-12 text-center">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">No Clauses Available</h3>
                <p className="text-gray-400">Contract analysis is still in progress.</p>
              </div>
            )}
          </div>

          {/* AI Insights Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">AI Insights</h2>
              <span className="text-gray-400 text-sm">
                {contract.insights?.length || 0} insight{(contract.insights?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            
            {contract.insights && contract.insights.length > 0 ? (
              <div className="space-y-4">
                {contract.insights.map((insight, index) => (
                  <InsightItem key={index} insight={insight} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1d35] border border-[#2a2d47] rounded-xl p-12 text-center">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">No Insights Available</h3>
                <p className="text-gray-400">AI analysis is still processing this contract.</p>
              </div>
            )}
          </div>
        </div>

        {/* Evidence Drawer */}
        <EvidenceDrawer
          evidence={contract.evidence || []}
          isOpen={isEvidenceDrawerOpen}
          onClose={() => setIsEvidenceDrawerOpen(false)}
        />
      </div>
    </div>
  )
}