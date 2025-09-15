import { useState } from 'react'
import { useContracts, useContract, useExpiringContracts } from '../../hooks/useContracts'

export default function ContractsDashboard() {
  const { contracts, loading: contractsLoading, error: contractsError } = useContracts()
  const { contracts: expiringContracts, loading: expiringLoading } = useExpiringContracts(60) // 60 days
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const { contract: selectedContract, loading: contractLoading } = useContract(selectedContractId)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100'
      case 'Renewal Due': return 'text-orange-600 bg-orange-100'
      case 'Expired': return 'text-red-600 bg-red-100'
      case 'Draft': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (contractsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contracts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (contractsError) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-red-600 mb-4">❌</div>
            <p className="text-red-600">{contractsError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Dashboard</h1>
          <p className="text-gray-600">Manage and monitor your contracts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Contracts</h3>
            <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl font-bold text-green-600">
              {contracts.filter(c => c.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Renewal Due</h3>
            <p className="text-2xl font-bold text-orange-600">
              {contracts.filter(c => c.status === 'Renewal Due').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
            <p className="text-2xl font-bold text-red-600">
              {expiringLoading ? '...' : expiringContracts.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contracts List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Contracts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContractId === contract.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedContractId(contract.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{contract.name}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(contract.risk)}`}>
                          {contract.risk}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{contract.parties}</p>
                    <p className="text-sm text-gray-500">Expires: {formatDate(contract.expiry)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Contract Details</h2>
            </div>
            <div className="p-6">
              {!selectedContractId ? (
                <div className="text-center text-gray-500 py-8">
                  Select a contract to view details
                </div>
              ) : contractLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading contract details...</p>
                </div>
              ) : selectedContract ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{selectedContract.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Parties:</span>
                        <p className="text-gray-600">{selectedContract.parties}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedContract.status)}`}>
                          {selectedContract.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Start Date:</span>
                        <p className="text-gray-600">{selectedContract.start ? formatDate(selectedContract.start) : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Expiry Date:</span>
                        <p className="text-gray-600">{formatDate(selectedContract.expiry)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Clauses */}
                  {selectedContract.clauses && selectedContract.clauses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Clauses</h4>
                      <div className="space-y-2">
                        {selectedContract.clauses.map((clause, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-medium text-sm text-gray-900">{clause.title}</h5>
                              <span className="text-xs text-gray-500">
                                {Math.round(clause.confidence * 100)}% confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{clause.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Insights */}
                  {selectedContract.insights && selectedContract.insights.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Risk Insights</h4>
                      <div className="space-y-2">
                        {selectedContract.insights.map((insight, index) => (
                          <div key={index} className={`p-3 rounded-lg border-l-4 ${
                            insight.risk === 'High' ? 'bg-red-50 border-red-400' :
                            insight.risk === 'Medium' ? 'bg-yellow-50 border-yellow-400' :
                            'bg-green-50 border-green-400'
                          }`}>
                            <div className="flex items-center mb-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(insight.risk)}`}>
                                {insight.risk} Risk
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{insight.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Contract not found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}