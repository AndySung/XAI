import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  files: File[];
  onFileSelect: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
}

export function FileUpload({ files, onFileSelect, onRemoveFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-blue-600"
        >
          <Upload className="h-5 w-5" />
          <span>Drop files here or click to upload</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && onFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
            >
              <span className="text-sm truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => onRemoveFile(index)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}