import React, { useState, useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { Upload, X, ZoomIn, Move, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { uploadImageFile } from '../utils/imageUpload';

export const ImageEditModal: React.FC = () => {
  const { activeImageTarget, closeImageEditor } = useEditor();

  const [src, setSrc] = useState<string>('');
  const [alt, setAlt] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(50);
  const [positionY, setPositionY] = useState<number>(50);
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (activeImageTarget) {
      setSrc(activeImageTarget.src || '');
      setAlt(activeImageTarget.alt || '');
      setZoom(activeImageTarget.zoom || 1);
      setPositionX(activeImageTarget.positionX ?? 50);
      setPositionY(activeImageTarget.positionY ?? 50);
      setObjectFit(activeImageTarget.objectFit || 'cover');
      setUrlInput(activeImageTarget.src || '');
    }
  }, [activeImageTarget]);

  if (!activeImageTarget) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.match(/^image\//i)) {
      alert('Please upload an image file (JPG, PNG, WebP, SVG, GIF).');
      return;
    }

    setIsUploading(true);
    try {
      const diskUrl = await uploadImageFile(file);
      setSrc(diskUrl);
      setUrlInput('');
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setSrc(urlInput.trim());
    }
  };

  const handleSave = () => {
    activeImageTarget.onSave({
      src,
      alt,
      zoom,
      positionX,
      positionY,
      objectFit,
    });
    closeImageEditor();
  };

  const handleRemove = () => {
    if (activeImageTarget.onRemove) {
      activeImageTarget.onRemove();
    } else {
      activeImageTarget.onSave({
        src: '',
        alt: '',
        zoom: 1,
        positionX: 50,
        positionY: 50,
        objectFit: 'cover',
      });
    }
    closeImageEditor();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={closeImageEditor}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white border border-black/10 shadow-2xl p-6 text-black select-none max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: 'var(--font-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-black/70" />
            <h2 id="image-modal-title" className="text-base font-medium tracking-tight">
              Edit Image: <span className="text-black/60 font-normal">{activeImageTarget.label}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeImageEditor}
            className="p-1 hover:bg-black/5 text-black/60 hover:text-black rounded transition-colors"
            aria-label="Close image editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Container */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-black/70 uppercase tracking-wider mb-2">
            Container Preview
          </label>
          <div className="relative w-full h-52 bg-[#F5F5F5] overflow-hidden border border-black/10 flex items-center justify-center">
            {src ? (
              <img
                src={src}
                alt={alt}
                className="h-full w-full"
                style={{
                  objectFit,
                  objectPosition: `${positionX}% ${positionY}%`,
                  transform: `scale(${zoom})`,
                  transformOrigin: `${positionX}% ${positionY}%`,
                }}
              />
            ) : (
              <span className="text-xs text-black/40 italic">No image selected</span>
            )}
          </div>
        </div>

        {/* Replace Image: Upload or URL */}
        <div className="mb-5 space-y-3">
          <label className="block text-xs font-medium text-black/70 uppercase tracking-wider">
            Replace Image (JPG, PNG, WebP)
          </label>

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`border border-dashed transition-all p-4 text-center cursor-pointer ${
              isDragging
                ? 'border-black bg-black/5'
                : 'border-black/20 hover:border-black/50 hover:bg-black/[0.02]'
            }`}
          >
            <input
              type="file"
              id="file-upload-input"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="file-upload-input"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-6 h-6 text-black/60 mb-2" />
              <span className="text-xs font-medium text-black">
                Click to upload from computer or drag and drop
              </span>
              <span className="text-[11px] text-black/40 mt-1">
                JPG, PNG, WebP supported
              </span>
            </label>
          </div>

          {/* Or Paste URL */}
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Or paste external image URL..."
              className="flex-1 text-xs border border-black/20 px-3 py-2 text-black focus:outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-2 bg-black text-white text-xs hover:bg-black/80 transition-colors"
            >
              Use URL
            </button>
          </div>
        </div>

        {/* Adjust Image: Reposition & Zoom */}
        <div className="mb-5 border-t border-black/10 pt-4 space-y-4">
          <label className="block text-xs font-medium text-black/70 uppercase tracking-wider">
            Adjust Image
          </label>

          {/* Zoom Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 text-black/80">
                <ZoomIn className="w-3.5 h-3.5" /> Zoom Level
              </span>
              <span className="font-mono text-black/60">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Reposition Horizontal & Vertical */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-black/80">
                  <Move className="w-3.5 h-3.5" /> Position X
                </span>
                <span className="font-mono text-black/60">{positionX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={positionX}
                onChange={(e) => setPositionX(parseInt(e.target.value, 10))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-black/80">
                  <Move className="w-3.5 h-3.5" /> Position Y
                </span>
                <span className="font-mono text-black/60">{positionY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={positionY}
                onChange={(e) => setPositionY(parseInt(e.target.value, 10))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Fit Mode Toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-black/80">Object Fit:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setObjectFit('cover')}
                className={`px-3 py-1 text-xs border ${
                  objectFit === 'cover'
                    ? 'border-black bg-black text-white'
                    : 'border-black/20 text-black hover:border-black'
                }`}
              >
                Cover (Fill)
              </button>
              <button
                type="button"
                onClick={() => setObjectFit('contain')}
                className={`px-3 py-1 text-xs border ${
                  objectFit === 'contain'
                    ? 'border-black bg-black text-white'
                    : 'border-black/20 text-black hover:border-black'
                }`}
              >
                Contain (Fit)
              </button>
            </div>
          </div>
        </div>

        {/* Image Alt Text */}
        <div className="mb-6 border-t border-black/10 pt-4">
          <label className="block text-xs font-medium text-black/70 uppercase tracking-wider mb-1.5">
            Image Alt Text (Accessibility Description)
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Descriptive caption for screen readers and SEO..."
            className="w-full text-xs border border-black/20 px-3 py-2 text-black focus:outline-none focus:border-black"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-black/10 pt-4">
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove Image
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeImageEditor}
              className="px-4 py-2 border border-black/20 text-black text-xs hover:border-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-black text-white text-xs font-medium hover:bg-black/80 transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
