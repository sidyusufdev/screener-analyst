'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFileSelect: (file: File, preview: string) => void;
  disabled?: boolean;
}

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPEG, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Read file as base64 for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onFileSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-2 border-green-500 bg-green-500/5 scale-[1.02]'
            : 'dashed-animated'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/10 to-cyan-500/10 flex items-center justify-center transition-all duration-500 ${
            isDragOver ? 'scale-110 rotate-6 bg-green-500/20' : isHovered ? 'scale-105' : ''
          }`}>
            <Upload className={`w-8 h-8 transition-all duration-300 ${
              isDragOver ? 'text-green-400 -translate-y-1' : isHovered ? 'text-green-400' : 'text-zinc-400'
            }`} />
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-100">
              {isDragOver ? 'Drop your file here' : 'Upload Chartink Screener'}
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              Drag and drop your screenshot or click to browse
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:shadow-green-500/20 hover:scale-105 active:scale-95"
          >
            Select Image
          </Button>
          <p className="text-xs text-zinc-600">PNG, JPEG or WebP • Max 10MB</p>
        </div>
      </div>
    </div>
  );
}
