import { useState } from 'react'
import { type ContractListItem } from '../../services/contractService'

interface NewContractModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contractData: Omit<ContractListItem, 'id'>) => void
}

interface FormData {
  name: string
  parties: string
  expiry: string
  status: ContractListItem['status']
  risk: ContractListItem['risk']
}

const initialFormData: FormData = {
  name: '',
  parties: '',
  expiry: '',
  status: 'Draft',
  risk: 'Low'
}

export default function NewContractModal({ isOpen, onClose, onSubmit }: NewContractModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Contract name is required'
    }

    if (!formData.parties.trim()) {
      newErrors.parties = 'Parties are required'
    }

    if (!formData.expiry) {
      newErrors.expiry = 'Expiry date is required'
    } else {
      const expiryDate = new Date(formData.expiry)
      const today = new Date()
      if (expiryDate <= today) {
        newErrors.expiry = 'Expiry date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      setFormData(initialFormData)
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error creating contract:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    onClose()
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1d35] border border-[#2a2d47] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2a2d47]">
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Contract</h2>
              <p className="text-gray-400 text-sm mt-1">Fill in the contract details below</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Contract Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Contract Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-[#151629] border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-[#2a2d47]'
                }`}
                placeholder="Enter contract name (e.g., MSA 2025)"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Parties */}
            <div>
              <label htmlFor="parties" className="block text-sm font-medium text-gray-300 mb-2">
                Parties *
              </label>
              <input
                type="text"
                id="parties"
                value={formData.parties}
                onChange={(e) => handleInputChange('parties', e.target.value)}
                className={`w-full px-4 py-3 bg-[#151629] border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.parties ? 'border-red-500' : 'border-[#2a2d47]'
                }`}
                placeholder="Enter parties (e.g., Microsoft & ABC Corp)"
              />
              {errors.parties && (
                <p className="text-red-400 text-sm mt-1">{errors.parties}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-2">
                Expiry Date *
              </label>
              <input
                type="date"
                id="expiry"
                value={formData.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
                className={`w-full px-4 py-3 bg-[#151629] border rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.expiry ? 'border-red-500' : 'border-[#2a2d47]'
                }`}
              />
              {errors.expiry && (
                <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>
              )}
            </div>

            {/* Status and Risk - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as ContractListItem['status'])}
                  className="w-full px-4 py-3 bg-[#151629] border border-[#2a2d47] rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Renewal Due">Renewal Due</option>
                  <option value="Expired">Expired</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(formData.status)}`}>
                    {formData.status}
                  </span>
                </div>
              </div>

              {/* Risk Level */}
              <div>
                <label htmlFor="risk" className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Level
                </label>
                <select
                  id="risk"
                  value={formData.risk}
                  onChange={(e) => handleInputChange('risk', e.target.value as ContractListItem['risk'])}
                  className="w-full px-4 py-3 bg-[#151629] border border-[#2a2d47] rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(formData.risk)}`}>
                    {formData.risk} Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#2a2d47]">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Contract</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}