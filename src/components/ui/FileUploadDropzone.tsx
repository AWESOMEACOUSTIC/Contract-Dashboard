import { useDropzone } from 'react-dropzone'

interface FileUploadDropzoneProps {
    onDrop: (files: File[]) => void
    compact?: boolean
    disabled?: boolean
}

export default function FileUploadDropzone({ 
    onDrop, 
    compact = false, 
    disabled = false 
}: FileUploadDropzoneProps) {
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        disabled
    })

    return (
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-xl text-center transition-all duration-200 cursor-pointer
                ${compact ? 'p-6' : 'p-8 md:p-12'}
                ${disabled 
                    ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed' 
                    : isDragActive 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-[#2a2d47] bg-[#1e1f25] hover:border-blue-500/50 hover:bg-blue-500/5'
                }
            `}
        >
            <input {...getInputProps()} disabled={disabled} />
            
            <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 bg-blue-500/20 rounded-full ${disabled ? 'opacity-50' : ''}`}>
                    <svg 
                        className={`text-blue-400 ${compact ? 'w-6 h-6' : 'w-8 h-8 md:w-12 md:h-12'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                    </svg>
                </div>
                
                <div>
                    <h3 className={`font-semibold text-white mb-1 ${compact ? 'text-base' : 'text-lg md:text-xl'}`}>
                        {disabled 
                            ? 'Upload disabled'
                            : isDragActive 
                                ? 'Drop files here' 
                                : 'Drag & drop files here'
                        }
                    </h3>
                    <p className={`text-gray-400 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
                        Support for PDF, DOC, XLS, images and more
                    </p>
                    
                    <button
                        type="button"
                        onClick={open}
                        disabled={disabled}
                        className={`
                           bg-gradient-to-r from-purple-600 to-violet-700
                            text-white rounded-lg
                            shadow-lg shadow-violet-500/30
                           hover:from-purple-700 hover:to-violet-800
                            transition-all duration-200
                            flex items-center space-x-2 mx-auto
                            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                            ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-2 md:px-6 md:py-3 text-sm'}
                        `}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Choose Files</span>
                    </button>
                </div>
            </div>
        </div>
    )
}