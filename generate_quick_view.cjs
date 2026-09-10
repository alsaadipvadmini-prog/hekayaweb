const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.js';
import {
  X,
  ShoppingBag,
  Heart,
  MessageCircle,
  Ruler,
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    language,
    theme,
    addToCart,
    toggleWishlist,
    isInWishlist,
    settings
  } = useApp();

  const isAr = language === 'ar';
  const product = quickViewProduct;
  const isWish = product ? isInWishlist(product.id) : false;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setSelectedColor(product.colors[0] || '#120205');
      setActiveImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const productImages: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, selectedSize, selectedColor, 1);
    setQuickViewProduct(null);
  };

  const handleWhatsAppOrder = () => {
    const message = \`مرحباً، أود طلب المنتج التالي:
الاسم: \${isAr ? product.title : product.titleEn}
السعر: \${product.price} د.أ
المقاس: \${selectedSize}
رابط المنتج: \${window.location.origin}/#product-\${product.id}\`;
    
    const phone = settings?.cms?.contactWhatsApp || '0798123456'; 
    const waUrl = \`https://wa.me/\${phone.replace(/\\s+/g, '')}?text=\${encodeURIComponent(message)}\`;
    window.open(waUrl, '_blank');
  };

  const SizeGuideModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-4 right-4 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200">
          <X className="w-5 h-5 text-neutral-800" />
        </button>
        <h3 className="text-xl font-bold text-[#120205] mb-4 text-center">دليل المقاسات (سم)</h3>
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-center text-sm border-collapse">
            <thead className="bg-[#F8F9FA] text-[#120205] font-bold">
              <tr>
                <th className="py-3 px-2">المقاس</th>
                <th className="py-3 px-2">الصدر</th>
                <th className="py-3 px-2">الطول</th>
                <th className="py-3 px-2">الكتف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <tr key={size} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-2 font-bold">{size}</td>
                  <td className="py-3 px-2">50 - 52</td>
                  <td className="py-3 px-2">70 - 72</td>
                  <td className="py-3 px-2">44 - 46</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={\`relative w-[95vw] max-w-[500px] max-h-[85vh] rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden \${
              theme === 'dark' ? 'bg-[#121212] border border-white/10' : 'bg-white border border-neutral-200'
            }\`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 z-20 p-2.5 bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Main Crisp Rectangular Image */}
              <div 
                className="relative w-full aspect-[4/5] sm:aspect-square flex-shrink-0"
                style={{ backgroundColor: product.bgTint || 'var(--brand-cream)' }}
              >
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              
              {/* Thumbnail Strip */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto snap-x px-4 py-3 bg-neutral-50 dark:bg-black/40 border-b border-neutral-100 dark:border-white/5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={\`relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 snap-center transition-all \${
                        activeImageIndex === idx ? 'border-[#800020] opacity-100 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }\`}
                      style={{ backgroundColor: product.bgTint || 'var(--brand-cream)' }}
                    >
                      <img src={img} alt={\`Thumbnail \${idx}\`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Details Section */}
              <div className="p-5 flex flex-col gap-5">
                {/* Title & Price */}
                <div>
                  <h2 className={\`font-italic-luxury text-xl sm:text-2xl font-bold leading-snug \${theme === 'dark' ? 'text-white' : 'text-[#120205]'}\`}>
                    {isAr ? product.title : product.titleEn}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-bold text-[#800020] font-mono">{product.price} د.أ</span>
                    {product.oldPrice && (
                      <span className="text-sm text-neutral-400 line-through font-mono">{product.oldPrice} د.أ</span>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2.5">
                  <h4 className={\`text-xs font-bold uppercase tracking-wider \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}\`}>
                    {isAr ? 'اللون (Color)' : 'Available Colors'}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={\`w-9 h-9 rounded-full border-2 transition-transform shadow-sm flex items-center justify-center \${
                          selectedColor === color ? 'border-neutral-400 scale-110' : 'border-neutral-200 hover:scale-105'
                        }\`}
                        style={{ backgroundColor: color }}
                        aria-label={\`Select color \${color}\`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className={\`text-xs font-bold uppercase tracking-wider \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}\`}>
                      {isAr ? 'المقاس (Size)' : 'Size'}
                    </h4>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{isAr ? 'دليل المقاسات' : 'Size Guide'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={\`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all border \${
                          selectedSize === size
                            ? 'bg-[#120205] text-white border-[#120205] shadow-md'
                            : 'bg-transparent text-neutral-500 border-neutral-300 hover:border-[#120205] hover:text-[#120205]'
                        }\`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-1">
                   <p className={\`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap \${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}\`}>
                     {isAr ? product.description : product.descriptionEn}
                   </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full py-3.5 bg-[#120205] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#3B020D] transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.inStock ? (isAr ? 'إضافة للسلة' : 'Add to Cart') : (isAr ? 'نفذت الكمية' : 'Out of Stock')}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3.5 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1EBE59] transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'الطلب السريع عبر واتساب' : 'Quick Order via WhatsApp'}</span>
                  </button>
                </div>
                
              </div>
            </div>
          </motion.div>
          {isSizeGuideOpen && <SizeGuideModal />}
        </div>
      )}
    </AnimatePresence>
  );
};
`;

fs.writeFileSync('src/components/QuickViewModal.tsx', content);
