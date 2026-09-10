import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.js';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product } from '../types.js';

export const WishlistDrawer: React.FC = () => {
  const {
    language,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    clearWishlist,
    addToCart,
    setQuickViewProduct,
    setIsClearanceView,
    setCurrentCategory,
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isAr = language === 'ar';

  // Fetch product metadata whenever the drawer opens or wishlist items are added
  useEffect(() => {
    if (isWishlistOpen && wishlist.length > 0) {
      setLoading(true);
      fetch(`/api/products?ids=${wishlist.join(',')}&limit=100`)
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : (data.items || data.products || []);
          setProducts(Array.isArray(list) ? list : []);
          setLoading(false);
        })
        .catch(() => {
          setProducts([]);
          setLoading(false);
        });
    } else if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
    }
  }, [isWishlistOpen, wishlist.length]);

  // Derived list guarantees instant synchronization when items are removed
  const activeProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  const totalWishlistValue = useMemo(() => {
    return activeProducts.reduce((sum, p) => sum + p.price, 0);
  }, [activeProducts]);

  const handleRemoveItem = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    // Optimistic instantaneous state purge
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toggleWishlist(productId);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.inStock) return;
    const sizesList = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? (product.sizes as any).split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []));
    const defaultSize = sizesList[0] || 'Standard';
    const colorsList = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? (product.colors as any).split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []));
    const defaultColor = colorsList[0] || '#111111';
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleAddAllToCart = () => {
    activeProducts.forEach((product) => {
      if (product.inStock) {
        const sizesList = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? (product.sizes as any).split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []));
    const defaultSize = sizesList[0] || 'Standard';
        const colorsList = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? (product.colors as any).split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []));
    const defaultColor = colorsList[0] || '#111111';
        addToCart(product, defaultSize, defaultColor, 1);
      }
    });
  };

  const handleOpenProduct = (product: Product) => {
    setQuickViewProduct(product);
    setIsWishlistOpen(false);
  };

  if (!isWishlistOpen) return null;

  return (
    <div
      id="wishlist-drawer-backdrop"
      onClick={() => setIsWishlistOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-stretch sm:justify-end transition-opacity duration-300 animate-fade-in"
    >
      <div
        id="wishlist-drawer-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[#f8f9fa] text-[#111111] border-t sm:border-t-0 sm:border-l border-[#e0e0e0] rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col justify-between max-h-[90vh] sm:max-h-full h-auto sm:h-full animate-slide-up-sheet sm:animate-slide-in-right overflow-hidden"
      >
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#e0e0e0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white border border-[#111111] shadow-xs">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2 className="font-luxury font-bold text-base sm:text-lg text-[#111111]">
                {isAr ? 'المفضلة' : 'Wishlist'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                {isAr ? 'قطعك المختارة بعناية' : 'Your saved favorites'}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#111111] text-white border border-[#111111] mr-1 rtl:ml-1">
              {wishlist.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-[11px] font-bold text-neutral-500 hover:text-[#111111] px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                title={isAr ? 'تفريغ المفضلة' : 'Clear All'}
              >
                {isAr ? 'تفريغ' : 'Clear'}
              </button>
            )}
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-[#111111] transition-colors cursor-pointer border border-[#e0e0e0]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 border border-[#e0e0e0] flex items-center justify-center text-neutral-400">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-luxury font-bold text-base text-[#111111]">
                  {isAr ? 'المفضلة فاضية!' : 'Your wishlist is empty'}
                </p>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  {isAr
                    ? 'استنقِ من تشكيلة حكاية الفاخرة وضيف قطعك المفضلة لتلاقيها بأي وقت'
                    : 'Explore HKAYA luxury collections and save your favorite pieces.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setIsClearanceView(false);
                  setCurrentCategory('all');
                  setTimeout(() => {
                    const el = document.getElementById('products-section') || document.getElementById('featured');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else window.scrollTo({ top: 450, behavior: 'smooth' });
                  }, 50);
                }}
                className="px-6 py-2.5 rounded-xl bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                {isAr ? 'تصفح الكولكشن الآن' : 'Start Shopping'}
              </button>
            </div>
          ) : loading && activeProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full py-16">
              <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            activeProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleOpenProduct(product)}
                className="group relative flex items-center gap-3.5 p-3 rounded-2xl border border-[#e0e0e0] bg-neutral-50/80 hover:bg-neutral-100/70 hover:border-[#e0e0e0] transition-all cursor-pointer shadow-2xs"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 bg-[#f8f9fa] border border-[#e0e0e0]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-luxury font-bold text-xs sm:text-sm line-clamp-1 text-[#111111]">
                    {isAr ? product.title : product.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono font-bold text-xs text-[#111111]">
                      {product.price} {isAr ? 'د.أ' : 'JOD'}
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="line-through text-neutral-400 font-mono text-[10px]">
                        {product.oldPrice} {isAr ? 'د.أ' : 'JOD'}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold ${product.inStock ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {product.inStock ? (isAr ? 'متوفر بالمخزون' : 'In Stock') : (isAr ? 'نفذت الكمية' : 'Sold Out')}
                  </span>
                </div>

                {/* Actions: Add to Cart & Remove */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {product.inStock && (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-8 h-8 rounded-xl bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title={isAr ? 'أضف للسلة' : 'Add to Bag'}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleRemoveItem(e, product.id)}
                    className="w-8 h-8 rounded-xl text-neutral-400 hover:text-[#111111] hover:bg-neutral-50 flex items-center justify-center transition-colors cursor-pointer"
                    title={isAr ? 'حذف من المفضلة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary and Add All button */}
        {activeProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#e0e0e0] bg-neutral-50/90 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
              <span className="text-neutral-500 font-normal">
                {isAr ? 'القيمة التقديرية للمفضلة:' : 'Total Wishlist Value:'}
              </span>
              <span className="font-mono text-sm text-[#111111]">
                {totalWishlistValue} {isAr ? 'د.أ' : 'JOD'}
              </span>
            </div>

            <button
              onClick={handleAddAllToCart}
              className="w-full py-3 px-4 rounded-xl bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAr ? 'إضافة جميع القطع المتوفرة للسلة' : 'Add All Available to Bag'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

