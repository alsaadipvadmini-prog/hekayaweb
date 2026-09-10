const fs = require('fs');

const content = `import React from 'react';
import { useApp } from '../context/AppContext.js';
import { Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { language, settings, setIsClearanceView } = useApp();
  const isAr = language === 'ar';

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bgImage = settings?.cms?.heroBgImageUrl || '/hero-embroidery.jpg';
  const overlayOpacity = settings?.cms?.heroOverlayOpacity ?? 10;
  
  return (
    <section id="hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-4 sm:pb-6">
      {/* Visual Compact Hero Banner matching the Hkaya Light Theme benchmark */}
      <div
        id="hero-banner-container"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[220px] sm:min-h-[280px] flex flex-col justify-between p-4 sm:p-6 bg-white shadow-md border border-neutral-200 group"
      >
        {/* Background Image */}
        <img 
          src={bgImage} 
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: overlayOpacity / 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>

        {/* Hero Top Tag */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-neutral-200 text-[11px] font-semibold tracking-wider text-[#800020] uppercase font-serif italic">
            <Sparkles className="w-3 h-3 text-[#800020]" />
            <span>{isAr ? settings?.cms?.heroSubtitleAr || 'كولكشن الموسم' : settings?.cms?.heroSubtitleAr}</span>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-2xl space-y-2.5 my-auto py-2 sm:py-3">
          <h1 className="font-italic-luxury font-bold text-2xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-[#111111] drop-shadow-sm">
            {isAr
              ? settings?.cms?.heroTitleAr || 'فصّل على كيفك واستنقِ يا كشخة'
              : 'Elegance Redefined In Every Thread'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-600 max-w-xl font-normal leading-relaxed line-clamp-2">
            {isAr
              ? settings?.cms?.heroDescriptionAr ||
                'تشكيلة متكاملة ومختارة بعناية لأحدث صيحات الموضة'
              : 'Discover curated high-fashion couture.'}
          </p>

          <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
            <button
              id="hero-btn-explore"
              onClick={scrollToProducts}
              className="bg-[#111111] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors shadow-sm cursor-pointer"
            >
              {settings?.cms?.heroCtaButtonTextAr || (isAr ? 'استكشف الكولكشن' : 'Shop Collection')}
            </button>

            <button
              onClick={() => {
                setIsClearanceView(true);
              }}
              className="bg-white text-[#111111] border border-neutral-200 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
            >
              {settings?.cms?.clearanceBannerTitleAr || (isAr ? 'قسم التصفية' : 'Clearance')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Promo Banner if Active */}
      {settings?.cms?.promoBannerActive && (
        <div className="mt-4 w-full bg-[#800020] text-white py-3 px-4 rounded-xl text-center text-xs font-bold font-mono tracking-wider animate-pulse shadow-sm">
          {settings.cms.promoBannerText}
        </div>
      )}
    </section>
  );
};
`;

fs.writeFileSync('src/components/HeroBanner.tsx', content);
