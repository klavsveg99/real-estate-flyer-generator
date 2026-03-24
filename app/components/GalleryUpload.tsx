'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageFile } from '@/app/types';
import { fileToBase64 } from '@/app/lib/utils';

interface GalleryUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  label: string;
}

export default function GalleryUpload({ images, onImagesChange, maxImages = 6, label }: GalleryUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    const newImages = await Promise.all(
      filesToAdd.map(async (file) => ({ id: Math.random().toString(36).substring(7), file, preview: await fileToBase64(file), name: file.name }))
    );
    onImagesChange([...images, ...newImages]);
  }, [images, maxImages, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  const removeImage = (id: string) => onImagesChange(images.filter((img) => img.id !== id));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-500">Upload 4-6 images. {images.length}/{maxImages} uploaded.</p>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img src={image.preview} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded transition-colors">
                Replace
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) fileToBase64(file).then(preview => {
                    onImagesChange(images.map((img) => img.id === image.id ? { ...img, preview, file, name: file.name } : img));
                  });
                }} />
              </label>
              <button type="button" onClick={() => removeImage(image.id)} className="bg-red-500/90 hover:bg-red-600 text-white text-xs font-medium px-2 py-1 rounded transition-colors">Remove</button>
            </div>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">{index + 1}</div>
          </div>
        ))}
        {images.length < maxImages && (
          <div {...getRootProps()} className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'}`}>
            <input {...getInputProps()} />
            <div className="text-center p-2">
              <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-500">Add</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
