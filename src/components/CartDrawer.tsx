import React from 'react';
import { useApp } from '../context/AppContext.js';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Truck, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    setIsCheckoutOpen,
    language,
    theme,
    setIsClearanceView,
    setCurrentCategory,
  } = useApp();

  if (!isCartOpen) return null;

  const isAr = language === 'ar';
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-stretch sm:justify-end transition-opacity duration-300 animate-fade-in"
    >
      <div
        id="cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[#f8f9fa] text-[#111111] border-t sm:border-t-0 sm:border-l border-[#e0e0e0] rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col justify-between max-h-[88vh] sm:max-h-full h-auto sm:h-full animate-slide-up-sheet sm:animate-slide-in-right overflow-hidden"
      >
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e0e0e0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white border border-[#111111]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-luxury font-bold text-base sm:text-lg text-[#111111]">
                {isAr ? 'سلة المشتريات' : 'Your Shopping Bag'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                {isAr ? 'قطع مختارة من دار حكاية' : 'Curated HKAYA pieces'}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#111111] text-white border border-[#111111] mr-1 rtl:ml-1">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>

          <button
            id="btn-close-cart"
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-[#f8f9fa] hover:bg-[#2A2A2A] flex items-center justify-center text-neutral-500 hover:text-[#111111] transition-colors cursor-pointer border border-[#2A2A2A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#f8f9fa] border border-[#2A2A2A] flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-luxury font-bold text-base text-[#111111]">
                  {isAr ? 'سلتك لسا فاضية يا كشخة!' : 'Your bag is empty'}
                </p>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  {isAr
                    ? 'استنقِ من تشكيلة حكاية الفاخرة أو صمم قطعتك الخاصة واستمتع بتوصيل سريع'
                    : 'Explore HKAYA luxury collections and add your favorite pieces.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsClearanceView(false);
                  setCurrentCategory('all');
                  setTimeout(() => {
                    const el = document.getElementById('products-section') || document.getElementById('featured');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else window.scrollTo({ top: 450, behavior: 'smooth' });
                  }, 50);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold transition-all cursor-pointer shadow-lg"
              >
                {isAr ? 'تصفح الكولكشن الآن' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#e0e0e0] bg-neutral-50 hover:border-[#111111]/60 transition-colors"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 bg-[#f8f9fa] border border-[#e0e0e0]">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-luxury font-bold text-xs sm:text-sm line-clamp-1 text-[#111111]">
                    {isAr ? item.product.title : item.product.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#222222] border border-[#333333] text-neutral-600 font-mono text-[10px]">
                      {item.selectedSize}
                    </span>
                    <span className="font-mono font-bold text-xs text-neutral-800">
                      {item.product.price} {isAr ? 'د.أ' : 'JOD'}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex items-center rounded-xl border border-[#333333] bg-[#f8f9fa]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-[#282828] text-xs font-bold text-neutral-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-[#111111]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-[#282828] text-xs font-bold text-neutral-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                      title={isAr ? 'حذف' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-end font-mono font-bold text-xs sm:text-sm text-[#111111] shrink-0">
                  {(item.product.price * item.quantity).toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#e0e0e0] bg-[#f8f9fa] space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 font-medium">{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span className="font-mono font-bold text-base sm:text-lg text-[#111111]">
                {subtotal.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
              </span>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              id="btn-drawer-checkout"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-6 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer border border-[#111111]"
            >
              <span>{isAr ? 'إتمام الطلب وتحديد العنوان' : 'Proceed to Checkout'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
