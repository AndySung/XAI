import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface ChatInputProps {
  onSendMessage: (message: string, files: File[]) => void;
  disabled: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || files.length > 0) && !disabled) {
      onSendMessage(input.trim(), files);
      setInput('');
      setFiles([]);
      setShowUpload(false);
    }
  };

  const handleFileSelect = (fileList: FileList) => {
    setFiles([...files, ...Array.from(fileList)]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {showUpload && (
        <FileUpload
          files={files}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
        />
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
        />
        
        <button
          type="submit"
          disabled={disabled || (!input.trim() && files.length === 0)}
          className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}