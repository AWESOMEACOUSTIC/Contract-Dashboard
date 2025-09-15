interface FileUploadStatsProps {
    stats: {
        total: number
        uploading: number
        success: number
        error: number
    }
    compact?: boolean
}

export default function FileUploadStats({ stats, compact = false }: FileUploadStatsProps) {
    const statItems = [
        {
            label: 'Total',
            value: stats.total,
            color: 'text-white',
            bgColor: 'bg-blue-500/20',
            icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            label: 'Uploading',
            value: stats.uploading,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            icon: (
                <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            )
        },
        {
            label: 'Success',
            value: stats.success,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20',
            icon: (
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            label: 'Failed',
            value: stats.error,
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            icon: (
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )
        }
    ]

    if (stats.total === 0) {
        return null
    }

    return (
        <div className={`grid gap-4 ${compact ? 'grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
            {statItems.map((item) => (
                <div 
                    key={item.label}
                    className="bg-[#1e1f25] border border-[#2a2d47] rounded-xl p-3 md:p-4"
                >
                    <div className={`flex items-center ${compact ? 'justify-center' : 'justify-between'}`}>
                        <div className={compact ? 'text-center' : ''}>
                            <p className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                                {item.label}
                            </p>
                            <p className={`font-bold ${item.color} ${compact ? 'text-lg' : 'text-2xl'}`}>
                                {item.value}
                            </p>
                        </div>
                        {!compact && (
                            <div className={`p-3 ${item.bgColor} rounded-lg`}>
                                {item.icon}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}