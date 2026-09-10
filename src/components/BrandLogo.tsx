import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  isLink?: boolean;
  onClick?: () => void;
  subText?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  isLink = false,
  onClick,
  subText,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  const logoImage = (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-md border border-[#e0e0e0] ${sizeClasses[size]} ${className}`}
    >
      {!imgError ? (
        <img
          src="/logo.png"
          alt="شعار حكاية الرسمي - HKAYA Official Brand Logo"
          className="w-full h-full object-cover rounded-full bg-[#f8f9fa]"
          onError={() => setImgError(true)}
          loading="eager"
        />
      ) : (
        <div className="w-full h-full bg-[#F8F9FA] text-[#111111] flex flex-col items-center justify-center rounded-full p-1 border border-[#e0e0e0]">
          <span className="font-serif font-black text-xs sm:text-sm text-[#111111]">حكاية</span>
        </div>
      )}
    </div>
  );

  if (!showText) {
    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="group inline-flex items-center focus:outline-hidden cursor-pointer"
          title="حكاية للتصفية"
        >
          {logoImage}
        </button>
      );
    }
    return logoImage;
  }

  const content = (
    <div className="flex items-center gap-3">
      {logoImage}
      <div className="flex flex-col text-start">
        <div className="flex items-center gap-1.5">
          <span className="font-italic-luxury font-bold text-xl sm:text-2xl tracking-wide text-[#111111] group-hover:text-[#111111] transition-colors leading-none">
            حكاية
          </span>
        </div>
        <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase opacity-60 font-mono text-neutral-500 mt-0.5">
          {subText || 'HKAYA COUTURE'}
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center text-start focus:outline-hidden cursor-pointer"
      >
        {content}
      </button>
    );
  }

  return content;
};
