import { Link } from 'react-router-dom';

interface ContractCardProps {
  contract: {
    id: string;
    name: string;
    parties: string;
    status: string;
    risk: string;
    expiry: string;
  };
}

export default function ContractCard({ contract }: ContractCardProps) {
  const daysUntilExpiry = Math.ceil((new Date(contract.expiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isHighPriority = contract.risk === 'High' || daysUntilExpiry <= 30;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-700/50 text-blue-100 border-blue-700/30';
      case 'Renewal Due': return 'bg-purple-700/50 text-purple-100 border-purple-700/30';
      case 'Expired': return 'bg-rose-700/50 text-rose-100 border-rose-700/30';
      case 'Draft': return 'bg-slate-700/50 text-slate-300 border-slate-500/30';
      default: return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-700/50 text-red-100 border-red-700/30';
      case 'Medium': return 'bg-yellow-700/50 text-yellow-100 border-yellow-700/30';
      case 'Low': return 'bg-green-700/50 text-green-100 border-green-700/30';
      default: return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
  };

  const getExpiryColor = (days: number) => {
    if (days < 0) return 'text-red-400';
    if (days <= 30) return 'text-orange-400';
    return 'text-gray-300';
  };

  const getExpiryText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days <= 30) return `${days} days left`;
    return new Date(contract.expiry).toLocaleDateString();
  };

  return (
    <Link
      to={`/insights/${contract.id}`}
      className={`block p-6 border rounded-xl hover:bg-gray-800/50 transition-all duration-200 group ${
        isHighPriority 
          ? 'bg-red-900/10 border-red-700/30 hover:border-red-600/50' 
          : 'bg-[#181820] border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
          {contract.name}
        </h3>
        {isHighPriority && (
          <div className="p-1 bg-red-500/20 rounded-full">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        )}
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{contract.parties}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)} border border-opacity-20`}>
          {contract.status}
        </span>
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(contract.risk)} border border-opacity-20`}>
          {contract.risk} Risk
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Expires:</span>
        <span className={`font-medium ${getExpiryColor(daysUntilExpiry)}`}>
          {getExpiryText(daysUntilExpiry)}
        </span>
      </div>
      
      <div className="mt-4 flex items-center space-x-2 text-blue-400 group-hover:text-blue-300 transition-colors">
        <span className="text-sm font-medium">View Insights</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}