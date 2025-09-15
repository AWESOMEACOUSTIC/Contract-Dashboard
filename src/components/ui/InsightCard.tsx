interface InsightCardProps {
  insight: {
    type: 'error' | 'warning' | 'success' | 'info';
    title: string;
    description: string;
    action: string;
  };
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-900/20 border-red-700/50',
          icon: 'bg-red-500/20',
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          container: 'bg-orange-900/20 border-orange-700/50',
          icon: 'bg-orange-500/20',
          iconColor: 'text-orange-400'
        };
      case 'success':
        return {
          container: 'bg-green-900/20 border-green-700/50',
          icon: 'bg-green-500/20',
          iconColor: 'text-green-400'
        };
      default:
        return {
          container: 'bg-blue-900/20 border-blue-700/50',
          icon: 'bg-blue-500/20',
          iconColor: 'text-blue-400'
        };
    }
  };

  const styles = getInsightStyles(insight.type);

  const getIcon = () => {
    if (insight.type === 'error' || insight.type === 'warning') {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      );
    } else if (insight.type === 'success') {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      );
    } else {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      );
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${styles.container}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${styles.icon}`}>
          <svg className={`w-5 h-5 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIcon()}
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
          <p className="text-gray-400 text-xs">Recommended action: {insight.action}</p>
        </div>
      </div>
    </div>
  );
}