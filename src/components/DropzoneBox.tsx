import React, { useState, useRef } from 'react';
import { PortfolioImage } from './PortfolioImage';
import { Upload, Plus, Loader2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { uploadImageFile } from '../utils/imageUpload';

interface DropzoneBoxProps {
  imageSrc?: string;
  alt?: string;
  label?: string;
  aspectClass?: string;
  backgroundColor?: string;
  zoom?: number;
  positionX?: number;
  positionY?: number;
  objectFit?: 'cover' | 'contain';
  isLightText?: boolean;
  padding?: string;
  onImageDrop: (url: string) => void;
  onClickEdit?: () => void;
  className?: string;
  imgStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export const DropzoneBox: React.FC<DropzoneBoxProps> = ({
  imageSrc,
  alt = '',
  label = 'photo',
  aspectClass = 'aspect-video',
  backgroundColor = '#F5F5F5',
  zoom = 1,
  positionX = 50,
  positionY = 50,
  objectFit = 'contain',
  isLightText = false,
  padding,
  onImageDrop,
  onClickEdit,
  className = '',
  imgStyle,
  children,
}) => {
  const { isAllowedToEdit, isEditMode, isPreviewMode } = useEditor();
  const canEdit = isAllowedToEdit && isEditMode && !isPreviewMode;

  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.match(/^image\//i)) {
      alert('Please upload an image file (JPG, PNG, WebP, SVG, GIF).');
      return;
    }

    setIsUploading(true);
    try {
      // Save permanently to server disk via /api/upload
      const savedUrl = await uploadImageFile(file);
      onImageDrop(savedUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canEdit) return;
    // If empty and in edit mode, clicking triggers file selection
    if (!imageSrc) {
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const textColorClass = isLightText ? 'text-white' : 'text-black';
  const mutedTextClass = isLightText ? 'text-white/40' : 'text-black/40';
  const borderColorClass = isLightText ? 'border-white/30' : 'border-black/20';

  return (
    <div
      onDragOver={canEdit ? handleDragOver : undefined}
      onDragLeave={canEdit ? handleDragLeave : undefined}
      onDrop={canEdit ? handleDrop : undefined}
      onClick={canEdit ? handleClick : undefined}
      className={`group relative w-full ${aspectClass} overflow-hidden transition-all duration-300 ${
        canEdit && !imageSrc ? 'cursor-pointer hover:opacity-95' : ''
      } ${className}`}
      style={{
        backgroundColor,
      }}
    >
      {/* Hidden file input for direct file browsing (only when editing is active) */}
      {canEdit && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      )}

      {/* Case 1: Image exists -> render image */}
      {imageSrc ? (
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.01]"
          style={{ padding: padding || undefined }}
        >
          <PortfolioImage
            src={imageSrc}
            alt={alt}
            zoom={zoom}
            positionX={positionX}
            positionY={positionY}
            style={imgStyle}
            className={`w-full h-full ${
              objectFit === 'cover' ? 'object-cover' : 'object-contain'
            }`}
          />
        </div>
      ) : canEdit ? (
        /* Case 2: Empty Box in EDIT MODE -> Minimal Scandinavian placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 select-none pointer-events-none">
          <div
            className={`flex flex-col items-center gap-1.5 transition-transform duration-200 ${
              isDraggingOver ? 'scale-110' : 'group-hover:scale-105'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full border border-dashed ${borderColorClass} flex items-center justify-center ${mutedTextClass}`}
            >
              <Plus className="w-4 h-4" />
            </div>
            <span
              className={`text-[11px] sm:text-[12px] font-normal tracking-tight text-center ${mutedTextClass}`}
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              {isDraggingOver
                ? 'drop photo here'
                : 'drag & drop photo or click to upload'}
            </span>
          </div>
        </div>
      ) : (
        /* Case 3: Empty Box for VISITORS / PUBLIC SITE -> Clean neutral empty frame with no editor UI */
        <div className="absolute inset-0 select-none pointer-events-none" />
      )}

      {/* Uploading progress indicator */}
      {isUploading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-white pointer-events-none animate-fadeIn">
          <Loader2 className="w-6 h-6 mb-2 animate-spin text-white" />
          <span className="text-xs font-medium tracking-tight">Saving to disk...</span>
        </div>
      )}

      {/* Active Drag Overlay (shown whenever a file is dragged over the box during edit mode) */}
      {canEdit && isDraggingOver && !isUploading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs p-4 border-2 border-dashed border-white text-white pointer-events-none animate-fadeIn">
          <Upload className="w-6 h-6 mb-1 animate-bounce" />
          <span className="text-xs font-medium">Release to upload photo</span>
        </div>
      )}

      {/* Any child overlays (hover titles, edit action buttons, etc.) */}
      {children}
    </div>
  );
};
