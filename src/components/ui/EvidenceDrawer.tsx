import { type ContractEvidence } from '../../services/contractService'

interface EvidenceDrawerProps {
  evidence: ContractEvidence[]
  isOpen: boolean
  onClose: () => void
}

export default function EvidenceDrawer({ evidence, isOpen, onClose }: EvidenceDrawerProps) {
  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.9) return 'text-green-400'
    if (relevance >= 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRelevanceBgColor = (relevance: number) => {
    if (relevance >= 0.9) return 'bg-green-500'
    if (relevance >= 0.7) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-[#06070d] border-l border-[#2a2d47] z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2d47]">
          <div>
            <h2 className="text-xl font-semibold text-white">Evidence Panel</h2>
            <p className="text-gray-400 text-sm mt-1">
              {evidence.length} evidence item{evidence.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {evidence.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">No Evidence Found</h3>
              <p className="text-gray-400">No supporting evidence is available for this contract.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {evidence.map((item, index) => (
                <div key={index} className="bg-[#1a1d35] border border-[#2a2d47] rounded-xl p-6 hover:border-[#3a3d57] transition-colors">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Evidence #{index + 1}</h3>
                        <p className="text-xs text-gray-400 mt-1">{item.source}</p>
                      </div>
                    </div>
                    
                    {/* Relevance Score */}
                    <div className="text-right">
                      <div className={`text-xs font-medium ${getRelevanceColor(item.relevance)}`}>
                        {Math.round(item.relevance * 100)}% relevance
                      </div>
                      <div className="w-16 bg-gray-700 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${getRelevanceBgColor(item.relevance)}`}
                          style={{ width: `${item.relevance * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Snippet */}
                  <div className="bg-[#151629] border border-[#2a2d47] rounded-lg p-4">
                    <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                      Document Excerpt
                    </h4>
                    <blockquote className="text-sm text-gray-300 italic leading-relaxed">
                      "{item.snippet}"
                    </blockquote>
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2d47]">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Source: {item.source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getRelevanceBgColor(item.relevance)}`} />
                      <span className={`text-xs font-medium ${getRelevanceColor(item.relevance)}`}>
                        {item.relevance >= 0.9 ? 'High' : item.relevance >= 0.7 ? 'Medium' : 'Low'} Relevance
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}