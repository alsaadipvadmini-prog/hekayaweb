import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Home,
  LayoutGrid,
  Percent,
  ShoppingBag,
  Heart,
  X,
} from 'lucide-react';
import { MainCategory } from '../types.js';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss.js';

export const MobileBottomNav: React.FC = () => {
  const {
    currentCategory,
    setCurrentCategory,
    setCurrentSubCategory,
    isClearanceView,
    setIsClearanceView,
    cart,
    setIsCartOpen,
    language,
    wishlist,
    setIsWishlistOpen,
  } = useApp();

  const isAr = language === 'ar';
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { touchHandlers: catTouchHandlers, style: catSheetStyle } = useSwipeToDismiss(() => setShowCategorySheet(false));

  const handleHomeClick = () => {
    setIsClearanceView(false);
    setCurrentCategory('all');
    setCurrentSubCategory('all');
    setShowCategorySheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearanceClick = () => {
    setIsClearanceView(true);
    setCurrentCategory('clearance');
    setCurrentSubCategory('clearance_all');
    setShowCategorySheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: MainCategory, sub?: string) => {
    setIsClearanceView(false);
    setCurrentCategory(cat);
    setCurrentSubCategory((sub as any) || 'all');
    setShowCategorySheet(false);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <>
      {/* Categories Slide-up Sheet for Mobile */}
      {showCategorySheet && (
        <div
          id="mobile-cat-sheet-overlay"
          className="modal-backdrop-overlay bg-black/50 backdrop-blur-sm sm:hidden animate-fade-in"
          onClick={() => setShowCategorySheet(false)}
        >
          <div
            id="mobile-cat-sheet"
            onClick={(e) => e.stopPropagation()}
            style={catSheetStyle}
            className="modal-content-wrapper modal-body-scroll w-full bg-[#f8f9fa] text-[#111111] border-t border-[#e0e0e0] rounded-t-3xl p-5 space-y-4 animate-slide-up-sheet pb-20 no-scrollbar flex flex-col"
          >
            {/* Interactive Top Drag Handle */}
            <div 
              className="w-full flex justify-center items-center pt-1 pb-2 cursor-pointer select-none touch-none hover:opacity-80 transition-opacity"
              onClick={() => setShowCategorySheet(false)}
              role="button"
              aria-label={isAr ? 'إغلاق الأقسام' : 'Close departments'}
              {...catTouchHandlers}
            >
              <div className="w-12 h-1.5 bg-neutral-400 hover:bg-neutral-600 rounded-full transition-colors pointer-events-none" />
            </div>
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <h3 className="font-luxury font-bold text-base text-[#111111]">
                {isAr ? 'أقسام متجر حكاية' : 'HKAYA Departments'}
              </h3>
              <button
                onClick={() => setShowCategorySheet(false)}
                className="p-1 text-neutral-500 hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleCategorySelect('women')}
                className="p-3 bg-[#ffffff] hover:bg-neutral-100 border border-[#e0e0e0] rounded-2xl text-start transition-colors"
              >
                <span className="text-xs font-bold text-[#111111] block">{isAr ? 'القسم النسائي' : 'Women'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'فساتين، أحذية، شيلات' : 'Dresses, Shoes'}</span>
              </button>

              <button
                onClick={() => handleCategorySelect('men')}
                className="p-3 bg-[#ffffff] hover:bg-neutral-100 border border-[#e0e0e0] rounded-2xl text-start transition-colors"
              >
                <span className="text-xs font-bold text-[#111111] block">{isAr ? 'القسم الرجالي' : 'Men'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'ستريت وير، أحذية' : 'Streetwear & Shoes'}</span>
              </button>

              <button
                onClick={() => handleCategorySelect('family')}
                className="p-3 bg-[#ffffff] hover:bg-neutral-100 border border-[#e0e0e0] rounded-2xl text-start transition-colors"
              >
                <span className="text-xs font-bold text-[#111111] block">{isAr ? 'العائلة والطفل' : 'Family & Kids'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'بيبي، أطفال، مواليد' : 'Kids & Newborn'}</span>
              </button>

              <button
                onClick={() => handleCategorySelect('lingerie')}
                className="p-3 bg-[#ffffff] hover:bg-neutral-100 border border-[#e0e0e0] rounded-2xl text-start transition-colors"
              >
                <span className="text-xs font-bold text-[#111111] block">{isAr ? 'اللانجري' : 'Lingerie'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'أطقم نوم وحرير' : 'Sleepwear'}</span>
              </button>

              <button
                onClick={() => handleCategorySelect('beauty')}
                className="p-3 bg-[#ffffff] hover:bg-neutral-100 border border-[#e0e0e0] rounded-2xl text-start transition-colors"
              >
                <span className="text-xs font-bold text-[#111111] block">{isAr ? 'الميكأب والعناية' : 'Beauty & Makeup'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'مستحضرات تجميل' : 'Cosmetics'}</span>
              </button>

              <button
                onClick={() => handleCategorySelect('perfumes')}
                className="p-3 bg-[#ffffff] hover:bg-neutral-100 border border-[#e0e0e0] rounded-2xl text-start transition-colors"
              >
                <span className="text-xs font-bold text-[#111111] block">{isAr ? 'العطور الشرقية والغربية' : 'Perfumes'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'روائح فاخرة' : 'Fragrances'}</span>
              </button>
            </div>

            <button
              onClick={handleClearanceClick}
              className="w-full py-3 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Percent className="w-4 h-4 text-neutral-800" />
              <span>{isAr ? 'تصفح قسم التصفية والعروض (1-5 د.أ)' : 'View Clearance (1-5 JOD)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar (Smartphones only) */}
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#F8F9FA]/95 backdrop-blur-md border-t border-[#e0e0e0] px-2 py-1.5 pb-safe text-[#111111] shadow-2xl flex items-center justify-around"
      >
        {/* 1. Home */}
        <button
          id="m-nav-home"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentCategory === 'all' && !isClearanceView
              ? 'text-[#111111]'
              : 'text-neutral-500 hover:text-[#111111]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {currentCategory === 'all' && !isClearanceView && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#111111] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* 2. Categories */}
        <button
          id="m-nav-categories"
          onClick={() => setShowCategorySheet(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            showCategorySheet || (currentCategory !== 'all' && !isClearanceView)
              ? 'text-[#111111]'
              : 'text-neutral-500 hover:text-[#111111]'
          }`}
        >
          <div className="relative">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 font-medium">{isAr ? 'الأقسام' : 'Categories'}</span>
        </button>

        {/* 3. Clearance Offers (Center Highlighted) */}
        <button
          id="m-nav-clearance"
          onClick={handleClearanceClick}
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-transform active:scale-95 ${
              isClearanceView
                ? 'bg-[#111111] text-[#111111] border-neutral-900 ring-2 ring-neutral-900'
                : 'bg-[#111111] text-white border-[#111111]'
            }`}
          >
            <Percent className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 font-bold text-neutral-800">{isAr ? 'عروض 1-5' : 'Offers'}</span>
        </button>

        {/* 4. Cart */}
        <button
          id="m-nav-cart"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-neutral-500 hover:text-[#111111] transition-all relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold font-mono bg-[#111111] text-white rounded-full border border-[#e0e0e0]">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">{isAr ? 'السلة' : 'Bag'}</span>
        </button>

        {/* 5. Wishlist */}
        <button
          id="m-nav-wishlist"
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-neutral-500 hover:text-[#111111] transition-all relative"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#111111] fill-[#111111]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold font-mono bg-[#111111] text-white rounded-full border border-[#111111] shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">
            {isAr ? 'المفضلة' : 'Wishlist'}
          </span>
        </button>
      </nav>
    </>
  );
};
