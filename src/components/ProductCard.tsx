import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types.js';
import { useApp } from '../context/AppContext.js';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { language, theme, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useApp();
  const isAr = language === 'ar';
  const isWish = isInWishlist(product.id);

  const safeSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? product.sizes.split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []));
  const [selectedSize, setSelectedSize] = useState<string>(safeSizes[0] || 'Standard');
  const safeColors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? product.colors.split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []));
  const [selectedColor, setSelectedColor] = useState<string>(safeColors[0] || '#111111');
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, selectedSize, selectedColor, 1);
  };

  const handleCardClick = () => {
    setQuickViewProduct(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 cursor-pointer border shadow-xl ${
        'bg-[#f8f9fa] border-[#e0e0e0]/90 hover:border-[#e0e0e0] hover:shadow-xl hover:shadow-neutral-200/50'
      }`}
    >
      {/* Primary Cover Image Viewport */}
      <motion.div
        className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center p-0 transition-transform duration-300 select-none"
        whileHover={{ scale: 1.01 }}
        style={{
          backgroundColor: product.bgTint || 'var(--brand-cream)',
        }}
      >
        <img
          src={product.image}
          alt={isAr ? product.title : product.titleEn}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 w-full px-3 flex justify-between items-start pointer-events-none z-10">
          <div className="flex flex-col gap-1.5">
            {product.isClearance && (
              <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest text-white bg-[#111111] rounded-sm shadow-sm uppercase font-mono">
                تصفية 1-5 د.أ
              </span>
            )}
            {product.badge && !product.isClearance && (
              <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest text-white bg-[#111111] rounded-sm shadow-sm uppercase font-mono">
                {product.badge}
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md shadow-xs transition-colors ${
              isWish ? 'bg-[#111111] text-white' : 'bg-[#f8f9fa]/80 text-neutral-400 hover:text-[#111111]'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col flex-grow gap-2 px-1 text-center">
        <h3 className="font-bold text-sm md:text-base text-[#111111] line-clamp-2 leading-snug">
          {isAr ? product.title : product.titleEn}
        </h3>
        
        <div className="flex items-center justify-center gap-2 mt-auto">
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through font-mono">
              {product.oldPrice} د.أ
            </span>
          )}
          <span className="text-base md:text-lg font-bold text-[#111111] font-mono">
            {product.price} د.أ
          </span>
        </div>
      </div>

      {/* Hover Action */}
      <div className="mt-4">
        {product.inStock ? (
          <button
            onClick={handleAddToCart}
            className="w-full py-3 rounded-xl text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAr ? 'إضافة للسلة' : 'Add to Cart'}</span>
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl text-xs font-bold bg-neutral-200 text-neutral-500 flex items-center justify-center cursor-not-allowed">
            <span>{isAr ? 'نفذت الكمية' : 'Out of Stock'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
