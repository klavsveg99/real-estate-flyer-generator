'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageFile } from '@/app/types';
import { fileToBase64 } from '@/app/lib/utils';

interface ImageUploadProps {
  image: ImageFile | null;
  onImageChange: (image: ImageFile | null) => void;
  label: string;
}

export default function ImageUpload({ image, onImageChange, label }: ImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const preview = await fileToBase64(file);
    onImageChange({ id: Math.random().toString(36).substring(7), file, preview, name: file.name });
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div {...getRootProps()} className={`dropzone relative ${isDragActive ? 'active' : ''} ${image ? 'h-32' : 'h-40'}`}>
        <input {...getInputProps()} />
        {image ? (
          <div className="relative h-full">
            <img src={image.preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <span className="text-white text-sm font-medium">Click or drag to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">Drop image here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
          </div>
        )}
      </div>
      {image && (
        <button type="button" onClick={() => onImageChange(null)} className="text-sm text-red-600 hover:text-red-700 font-medium">
          Remove image
        </button>
      )}
    </div>
  );
}
