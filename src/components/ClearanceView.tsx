import React, { useState, useEffect } from 'react';
import { Product } from '../types.js';
import { ProductCard } from './ProductCard.js';
import { useApp } from '../context/AppContext.js';
import { Percent, Flame, Tag, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const ClearanceView: React.FC = () => {
  const { language, theme, setIsClearanceView, setCurrentCategory } = useApp();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClearance = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products?isClearance=true&limit=100');
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setProducts(items);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClearance();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedPriceFilter === 'all') return true;
    return Math.floor(p.price) === selectedPriceFilter;
  });

  return (
    <div id="clearance-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      {/* Clearance Exclusive Luxury Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#1A1A1A] via-neutral-100 to-[#111111] text-[#111111] shadow-2xl border border-[#e0e0e0]">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#111111]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f9fa]/5 backdrop-blur-md border border-[#e0e0e0] text-xs font-bold text-neutral-800 font-serif italic">
            <Flame className="w-4 h-4 text-neutral-900 animate-pulse" />
            <span>{isAr ? 'عروض وتصفية المواسم النارية (1 - 5 دنانير)' : 'Exclusive 1 - 5 JOD Clearance'}</span>
          </div>

          <h1 className="font-italic-luxury font-bold text-3xl sm:text-4xl text-[#111111]">
            {isAr ? 'قسم التصفية والعروض الاستثنائية' : 'Curated Clearance Vault'}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
            {isAr
              ? 'قطع مختارة من الإكسسوارات، الشالات، مستلزمات العناية، والأساسيات بأسعار رمزية تبدأ من دينار أردني واحد فقط. الكميات محدودة، استنقِ على كيفك يا كشخة قبل النفاذ!'
              : 'Handpicked accessories, scarves, beauty essentials, and classics starting strictly from 1 JOD to 5 JOD. Limited quantities available.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-rose-200">
            <Tag className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأسعار تشمل ضريبة المبيعات وتطبق نفس رسوم التوصيل المخفضة' : 'Flat rate shipping applies to all clearance orders'}</span>
          </div>
        </div>
      </div>

      {/* Price Filter Badges */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase font-mono tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>{isAr ? 'فلترة حسب السعر المباشر:' : 'Filter by exact price:'}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedPriceFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              selectedPriceFilter === 'all'
                ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
            }`}
          >
            {isAr ? 'جميع عروض التصفية (1-5 د.أ)' : 'All Clearance (1-5 JOD)'}
          </button>

          {[1, 2, 3, 4, 5].map((price) => (
            <button
              key={price}
              onClick={() => setSelectedPriceFilter(price)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all shrink-0 cursor-pointer border ${
                selectedPriceFilter === price
                  ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              {isAr ? `فئة ${price} د.أ` : `${price} JOD Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-neutral-500 font-luxury">
            {isAr ? 'جاري تجهيز صفقات التصفية...' : 'Loading clearance deals...'}
          </span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-neutral-500">
          <p>{isAr ? 'لا توجد قطع تصفية بهذه الفئة السعرية حالياً' : 'No clearance items found in this price bucket'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((p, idx) => (
            <ProductCard key={p.id} product={p} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
