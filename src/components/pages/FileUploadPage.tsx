import { useFileUpload } from '../../hooks/useFileUpload'
import FileUploadDropzone from '../ui/FileUploadDropzone'
import FileUploadStats from '../ui/FileUploadStats'
import FileUploadList from '../ui/FileUploadList'

export default function FileUploadPage() {
    const { files, addFiles, retryUpload, removeFile, stats } = useFileUpload()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">File Upload</h1>
                <p className="text-gray-400">Upload and manage your contract documents</p>
            </div>

            {/* Upload Statistics */}
            <FileUploadStats stats={stats} />

            {/* Drag and Drop Zone */}
            <FileUploadDropzone onDrop={addFiles} />

            {/* File List */}
            <FileUploadList
                files={files}
                onRetry={retryUpload}
                onRemove={removeFile}
            />
        </div>
    )
}