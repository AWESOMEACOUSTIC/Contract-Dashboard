import { type ContractInsight } from '../../services/contractService'

interface InsightItemProps {
  insight: ContractInsight
  index: number
}

export default function InsightItem({ insight, index }: InsightItemProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': 
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          text: 'text-red-400',
          icon: 'text-red-500',
          label: 'bg-red-500/20 text-red-300 border-red-500/30'
        }
      case 'Medium': 
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/30',
          text: 'text-yellow-400',
          icon: 'text-yellow-500',
          label: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
        }
      case 'Low': 
        return {
          bg: 'bg-green-500/10 border-green-500/30',
          text: 'text-green-400',
          icon: 'text-green-500',
          label: 'bg-green-500/20 text-green-300 border-green-500/30'
        }
      default: 
        return {
          bg: 'bg-gray-500/10 border-gray-500/30',
          text: 'text-gray-400',
          icon: 'text-gray-500',
          label: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        }
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'Medium':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'Low':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const colors = getRiskColor(insight.risk)

  return (
    <div className={`border rounded-xl p-5 transition-all duration-200 hover:border-opacity-50 ${colors.bg}`}>
      <div className="flex items-start space-x-4">
        {/* Risk Icon */}
        <div className={`flex-shrink-0 ${colors.icon} mt-0.5`}>
          {getRiskIcon(insight.risk)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm font-medium">Insight #{index + 1}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors.label}`}>
                {insight.risk} Risk
              </span>
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed ${colors.text}`}>
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  )
}