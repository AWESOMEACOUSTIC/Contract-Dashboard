import { useParams, Link } from "react-router-dom";
import { useContract, useContracts, useInsights } from "../../hooks";
import { StatCard, ContractCard, InsightCard, ActionCard } from "../ui";

export default function InsightsPage() {
  const { contractId } = useParams();
  
  if (contractId) {
    return <ContractInsights contractId={contractId} />;
  }
  
  return <InsightsSelection />;
}

function InsightsSelection() {
  const { contracts, loading, error } = useContracts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Contract Insights</h1>
          <p className="text-gray-400 mt-2">AI-powered contract analysis and risk insights</p>
        </div>
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Contract Insights</h1>
          <p className="text-gray-400 mt-2">AI-powered contract analysis and risk insights</p>
        </div>
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Contracts</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Get high priority contracts (High risk or expiring soon)
  const highPriorityContracts = contracts.filter(contract => {
    const daysUntilExpiry = Math.ceil((new Date(contract.expiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return contract.risk === 'High' || daysUntilExpiry <= 30;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Contract Insights</h1>
        <p className="text-gray-400 mt-2">AI-powered contract analysis and risk insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Contracts"
          value={contracts.length}
          description="Active portfolio"
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        <StatCard
          title="High Risk"
          value={contracts.filter(c => c.risk === 'High').length}
          description="Require attention"
          color="red"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
        />

        <StatCard
          title="Expiring Soon"
          value={contracts.filter(c => {
            const days = Math.ceil((new Date(c.expiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            return days <= 30 && days > 0;
          }).length}
          description="Next 30 days"
          color="orange"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatCard
          title="Priority Items"
          value={highPriorityContracts.length}
          description="Need immediate action"
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Contracts List for Insights */}
      <div className="bg-[#181820] border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Select Contract for Detailed Insights</h2>
        
        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Contracts Found</h3>
            <p className="text-gray-400 mb-4">Upload contracts to start generating insights</p>
            <Link 
              to="/upload"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Contract</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContractInsights({ contractId }: { contractId: string }) {
  const { contract, loading, error } = useContract(contractId);
  const insights = useInsights(contract);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link 
            to="/insights" 
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Contract Insights</h1>
            <p className="text-gray-400 mt-2">Loading contract analysis...</p>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4">Loading contract insights...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link 
            to="/insights" 
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Contract Insights</h1>
            <p className="text-gray-400 mt-2">Contract not found</p>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Contract Not Found</h2>
          <p className="text-gray-400 mb-4">The contract you're looking for doesn't exist.</p>
          <Link 
            to="/insights"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/insights" 
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Contract Insights</h1>
          <p className="text-gray-400 mt-2">AI-powered analysis for {contract.name}</p>
        </div>
      </div>

      {/* Contract Overview */}
      <div className="bg-[#181820] border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Contract Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Contract Name</p>
            <p className="text-white font-semibold text-lg">{contract.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Parties</p>
            <p className="text-white font-semibold">{contract.parties}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-700/50 text-blue-100 border border-blue-700/30 mt-1">
              {contract.status}
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Risk Level</p>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border border-opacity-20 mt-1 ${
              contract.risk === 'High' ? 'bg-red-700/50 text-red-100 border-red-700/30' :
              contract.risk === 'Medium' ? 'bg-yellow-700/50 text-yellow-100 border-yellow-700/30' :
              'bg-green-700/50 text-green-100 border-green-700/30'
            }`}>
              {contract.risk} Risk
            </span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-[#181820] border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">AI-Powered Insights</h2>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-[#181820] border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recommended Actions</h2>
        <div className="space-y-3">
          <ActionCard
            title="Review Contract Terms"
            description="Detailed analysis of clauses and conditions"
            actionType="link"
            action={`/contracts/${contract.id}`}
            actionText="Review"
            color="blue"
            icon={
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <ActionCard
            title="Generate Report"
            description="Download comprehensive contract analysis"
            actionType="button"
            action={() => console.log('Generate report for', contract.name)}
            actionText="Generate"
            color="green"
            icon={
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
