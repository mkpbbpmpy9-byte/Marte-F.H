import React, { useState } from 'react';

interface PortfolioImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  zoom?: number;
  positionX?: number;
  positionY?: number;
}

const DEFAULT_FALLBACK_COLLECTION = [
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
];

export const PortfolioImage: React.FC<PortfolioImageProps> = ({
  src,
  alt,
  fallbackSrc,
  zoom = 1,
  positionX = 50,
  positionY = 50,
  className = '',
  style,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  // If prop src changes (e.g. user replaces image), update state
  React.useEffect(() => {
    setImgSrc(src);
    setHasFailed(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasFailed(true);
    }
  };

  if (hasFailed || !imgSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-[#F2F2F2] text-black/35 text-xs select-none p-4 ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <span className="truncate">{alt || 'Image'}</span>
      </div>
    );
  }

  const effectiveZoom = typeof zoom === 'number' && zoom > 0 ? zoom : 1;
  const effectivePosX = typeof positionX === 'number' ? positionX : 50;
  const effectivePosY = typeof positionY === 'number' ? positionY : 50;

  const combinedStyle: React.CSSProperties = {
    ...style,
    objectPosition: `${effectivePosX}% ${effectivePosY}%`,
    transform: effectiveZoom !== 1 ? `scale(${effectiveZoom})` : style?.transform,
    transformOrigin: `${effectivePosX}% ${effectivePosY}%`,
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
      style={combinedStyle}
      {...rest}
    />
  );
};
