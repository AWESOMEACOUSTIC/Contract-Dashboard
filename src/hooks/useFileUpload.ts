import { useState, useCallback } from 'react'

export interface FileUpload {
    file: File
    id: string
    status: 'uploading' | 'success' | 'error'
    progress: number
}

export const useFileUpload = () => {
    const [files, setFiles] = useState<FileUpload[]>([])

    const simulateUpload = useCallback((fileUpload: FileUpload) => {
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
    }, [])

    const addFiles = useCallback((acceptedFiles: File[]) => {
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
    }, [simulateUpload])

    const retryUpload = useCallback((fileId: string) => {
        const fileUpload = files.find(f => f.id === fileId)
        if (fileUpload) {
            simulateUpload(fileUpload)
        }
    }, [files, simulateUpload])

    const removeFile = useCallback((fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
    }, [])

    const clearAllFiles = useCallback(() => {
        setFiles([])
    }, [])

    // Statistics
    const successCount = files.filter(f => f.status === 'success').length
    const errorCount = files.filter(f => f.status === 'error').length
    const uploadingCount = files.filter(f => f.status === 'uploading').length

    return {
        files,
        addFiles,
        retryUpload,
        removeFile,
        clearAllFiles,
        stats: {
            total: files.length,
            uploading: uploadingCount,
            success: successCount,
            error: errorCount
        }
    }
}