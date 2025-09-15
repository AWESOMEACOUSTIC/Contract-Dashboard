import { createPortal } from 'react-dom'
import { useFileUpload } from '../../hooks/useFileUpload'
import FileUploadDropzone from './FileUploadDropzone'
import FileUploadStats from './FileUploadStats'
import FileUploadList from './FileUploadList'

interface FileUploadModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
    const { files, addFiles, retryUpload, removeFile, clearAllFiles, stats } = useFileUpload()

    const handleClose = () => {
        clearAllFiles()
        onClose()
    }

    if (!isOpen) return null

    const modalContent = (
        <>
            {/* Backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="bg-[#17181e] border border-[#3e415d] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#2a2d47]">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Upload Files</h2>
                            <p className="text-gray-400 text-sm mt-1">Drag and drop or select files to upload</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {files.length > 0 && (
                                <button
                                    onClick={clearAllFiles}
                                    className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Upload Statistics */}
                        <FileUploadStats stats={stats} compact />

                        {/* Drag and Drop Zone */}
                        <FileUploadDropzone onDrop={addFiles} compact />

                        {/* File List */}
                        <FileUploadList
                            files={files}
                            onRetry={retryUpload}
                            onRemove={removeFile}
                            compact
                            maxHeight="max-h-80"
                        />
                    </div>
                </div>
            </div>
        </>
    )

    return createPortal(modalContent, document.body)
}