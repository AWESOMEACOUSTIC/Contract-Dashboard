export default function InsightsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Insights Dashboard</h1>
          <p className="text-gray-400 mt-2">AI-powered contract analysis and risk insights</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Insights Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          AI-powered insights, risk analysis, and contract intelligence will be available here soon.
        </p>
      </div>
    </div>
  )
}