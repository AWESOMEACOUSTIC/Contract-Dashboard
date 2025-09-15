import { type FileUpload } from '../../hooks/useFileUpload'

interface FileUploadListProps {
    files: FileUpload[]
    onRetry: (fileId: string) => void
    onRemove: (fileId: string) => void
    compact?: boolean
    maxHeight?: string
}

export default function FileUploadList({ 
    files, 
    onRetry, 
    onRemove, 
    compact = false,
    maxHeight = 'max-h-80'
}: FileUploadListProps) {
    const getStatusIcon = (status: FileUpload['status']) => {
        const iconSize = compact ? 'w-3 h-3' : 'w-4 h-4'
        
        switch (status) {
            case 'uploading':
                return (
                    <div className={`border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin ${iconSize}`} />
                )
            case 'success':
                return (
                    <svg className={`text-green-500 ${iconSize}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )
            case 'error':
                return (
                    <svg className={`text-red-500 ${iconSize}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileTypeIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()
        switch (extension) {
            case 'pdf':
                return '📄'
            case 'doc':
            case 'docx':
                return '📝'
            case 'xls':
            case 'xlsx':
                return '📊'
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️'
            case 'zip':
            case 'rar':
                return '🗜️'
            default:
                return '📄'
        }
    }

    if (files.length === 0) {
        return null
    }

    return (
        <div className="bg-[#1e1f25] border border-[#2a2d47] rounded-xl overflow-hidden">
            <div className={`border-b border-[#2a2d47] ${compact ? 'p-3' : 'p-4 md:p-6'}`}>
                <h3 className={`font-semibold text-white ${compact ? 'text-base' : 'text-lg'}`}>
                    Files ({files.length})
                </h3>
                {!compact && (
                    <p className="text-gray-400 text-sm">Manage your uploaded files</p>
                )}
            </div>
            
            <div className={`divide-y divide-[#2a2d47] overflow-y-auto ${maxHeight}`}>
                {files.map((fileUpload) => (
                    <div 
                        key={fileUpload.id} 
                        className={`hover:bg-[#27283f]/50 transition-colors ${compact ? 'p-3' : 'p-4'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className={compact ? 'text-base' : 'text-lg md:text-2xl'}>
                                    {getFileTypeIcon(fileUpload.file.name)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-white font-medium truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                                        {fileUpload.file.name}
                                    </h4>
                                    <p className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                                        {formatFileSize(fileUpload.file.size)}
                                    </p>
                                    
                                    {/* Progress Bar */}
                                    {fileUpload.status === 'uploading' && (
                                        <div className="mt-1 md:mt-2">
                                            <div className={`bg-[#2a2d47] rounded-full overflow-hidden ${compact ? 'h-1' : 'h-1.5 md:h-2'}`}>
                                                <div
                                                    className="bg-blue-500 h-full transition-all duration-300"
                                                    style={{ width: `${fileUpload.progress}%` }}
                                                />
                                            </div>
                                            <p className={`text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-xs'}`}>
                                                {Math.round(fileUpload.progress)}% {compact ? '' : 'uploaded'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {/* Status */}
                                <div className="flex items-center space-x-1">
                                    {getStatusIcon(fileUpload.status)}
                                    <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} ${
                                        fileUpload.status === 'success' ? 'text-green-400' :
                                        fileUpload.status === 'error' ? 'text-red-400' :
                                        'text-blue-400'
                                    }`}>
                                        {compact ? '' : (
                                            fileUpload.status === 'uploading' ? 'Uploading...' :
                                            fileUpload.status === 'success' ? 'Success' :
                                            'Failed'
                                        )}
                                    </span>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center space-x-1">
                                    {fileUpload.status === 'error' && (
                                        <button
                                            onClick={() => onRetry(fileUpload.id)}
                                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                            title="Retry upload"
                                        >
                                            <svg className={compact ? 'w-3 h-3' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => onRemove(fileUpload.id)}
                                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                        title="Remove file"
                                    >
                                        <svg className={compact ? 'w-3 h-3' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}