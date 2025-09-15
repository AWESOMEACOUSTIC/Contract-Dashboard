import { type ContractClause } from '../../services/contractService'

interface ClauseCardProps {
  clause: ContractClause
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400'
    if (confidence >= 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500/20 border-green-500/30'
    if (confidence >= 0.7) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="bg-[#1a1d35] border border-[#2a2d47] rounded-xl p-6 hover:border-[#3a3d57] transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{clause.title}</h3>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getConfidenceBgColor(clause.confidence)}`}>
          <span className={getConfidenceColor(clause.confidence)}>
            {Math.round(clause.confidence * 100)}% confidence
          </span>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed">
        {clause.summary}
      </p>
      
      {/* Confidence Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">AI Confidence Level</span>
          <span className={`text-xs font-medium ${getConfidenceColor(clause.confidence)}`}>
            {Math.round(clause.confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              clause.confidence >= 0.9 
                ? 'bg-green-500' 
                : clause.confidence >= 0.7 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${clause.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}