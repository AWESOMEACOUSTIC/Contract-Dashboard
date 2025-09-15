import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUpload {
    file: File
    id: string
    status: 'uploading' | 'success' | 'error'
    progress: number
}

export default function FileUploadPage() {
    const [files, setFiles] = useState<FileUpload[]>([])

    const simulateUpload = (fileUpload: FileUpload) => {
        // Update to uploading status
        setFiles(prev => prev.map(f => 
            f.id === fileUpload.id 
                ? { ...f, status: 'uploading', progress: 0 }
                : f
        ))

        // Simulate progress
        const progressInterval = setInterval(() => {
            setFiles(prev => prev.map(f => {
                if (f.id === fileUpload.id && f.status === 'uploading') {
                    const newProgress = Math.min(f.progress + Math.random() * 30, 90)
                    return { ...f, progress: newProgress }
                }
                return f
            }))
        }, 200)

        // Simulate upload completion after 1-2 seconds
        setTimeout(() => {
            clearInterval(progressInterval)
            const isSuccess = Math.random() > 0.3 // 70% success rate
            
            setFiles(prev => prev.map(f => 
                f.id === fileUpload.id 
                    ? { 
                        ...f, 
                        status: isSuccess ? 'success' : 'error',
                        progress: isSuccess ? 100 : f.progress
                    }
                    : f
            ))
        }, 1000 + Math.random() * 1000)
    }

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles: FileUpload[] = acceptedFiles.map(file => ({
            file,
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            status: 'uploading' as const,
            progress: 0
        }))

        setFiles(prev => [...prev, ...newFiles])
        
        // Start upload simulation for each file
        newFiles.forEach(fileUpload => {
            simulateUpload(fileUpload)
        })
    }

    const retryUpload = (fileId: string) => {
        const fileUpload = files.find(f => f.id === fileId)
        if (fileUpload) {
            simulateUpload(fileUpload)
        }
    }

    const removeFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
    }

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true
    })

    const getStatusIcon = (status: FileUpload['status']) => {
        switch (status) {
            case 'uploading':
                return (
                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                )
            case 'success':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )
            case 'error':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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

    const successCount = files.filter(f => f.status === 'success').length
    const errorCount = files.filter(f => f.status === 'error').length
    const uploadingCount = files.filter(f => f.status === 'uploading').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">File Upload</h1>
                <p className="text-gray-400">Upload and manage your contract documents</p>
            </div>

            {/* Upload Statistics */}
            {files.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#1e1f25] border border-[#2a2d47] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Files</p>
                                <p className="text-2xl font-bold text-white">{files.length}</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e1f25] border border-[#2a2d47] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Uploading</p>
                                <p className="text-2xl font-bold text-blue-400">{uploadingCount}</p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e1f25] border border-[#2a2d47] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Success</p>
                                <p className="text-2xl font-bold text-green-400">{successCount}</p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e1f25] border border-[#2a2d47] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Failed</p>
                                <p className="text-2xl font-bold text-red-400">{errorCount}</p>
                            </div>
                            <div className="p-3 bg-red-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Drag and Drop Zone */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
                    ${isDragActive 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-[#2a2d47] bg-[#1e1f25] hover:border-blue-500/50 hover:bg-blue-500/5'
                    }
                `}
            >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-blue-500/20 rounded-full">
                        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Support for PDF, DOC, XLS, images and more
                        </p>
                        
                        <button
                            type="button"
                            onClick={open}
                            className="
                                px-6 py-3
                                bg-gradient-to-r from-blue-600 to-blue-700
                                text-white rounded-xl
                                shadow-lg shadow-blue-500/30
                                hover:from-blue-700 hover:to-blue-800
                                transition-all duration-200
                                flex items-center space-x-2 mx-auto
                            "
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Choose Files</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="bg-[#1e1f25] border border-[#2a2d47] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[#2a2d47]">
                        <h3 className="text-lg font-semibold text-white">Uploaded Files</h3>
                        <p className="text-gray-400 text-sm">Manage your uploaded files</p>
                    </div>
                    
                    <div className="divide-y divide-[#2a2d47]">
                        {files.map((fileUpload) => (
                            <div key={fileUpload.id} className="p-4 hover:bg-[#27283f]/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="text-2xl">
                                            {getFileTypeIcon(fileUpload.file.name)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate">
                                                {fileUpload.file.name}
                                            </h4>
                                            <p className="text-gray-400 text-sm">
                                                {formatFileSize(fileUpload.file.size)}
                                            </p>
                                            
                                            {/* Progress Bar */}
                                            {fileUpload.status === 'uploading' && (
                                                <div className="mt-2">
                                                    <div className="bg-[#2a2d47] rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-blue-500 h-full transition-all duration-300"
                                                            style={{ width: `${fileUpload.progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {Math.round(fileUpload.progress)}% uploaded
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        {/* Status Icon */}
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(fileUpload.status)}
                                            <span className={`text-sm font-medium ${
                                                fileUpload.status === 'success' ? 'text-green-400' :
                                                fileUpload.status === 'error' ? 'text-red-400' :
                                                'text-blue-400'
                                            }`}>
                                                {fileUpload.status === 'uploading' ? 'Uploading...' :
                                                 fileUpload.status === 'success' ? 'Success' :
                                                 'Failed'}
                                            </span>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex items-center space-x-2">
                                            {fileUpload.status === 'error' && (
                                                <button
                                                    onClick={() => retryUpload(fileUpload.id)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                    title="Retry upload"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => removeFile(fileUpload.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                title="Remove file"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}