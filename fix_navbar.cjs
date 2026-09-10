const fs = require('fs');
const content = `
import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { BrandLogo } from './BrandLogo.js';
import { Search, ShoppingBag, Heart, User, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthModalOpen,
    customer,
    setIsProfileOpen,
    settings,
  } = useApp();

  const isAr = language === 'ar';
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = settings?.cms?.navLinks || [
    { label: 'الرئيسية', url: '/' },
    { label: 'تسوق الآن', url: '/#products-section' },
    { label: 'عن المتجر', url: '/#about' }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full transition-all duration-200">
      <nav
        id="navbar-container"
        className="w-full backdrop-blur-md border-b transition-colors duration-200 bg-[#ffffff] border-[#E2E8F0] text-[#111111] shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <BrandLogo
                size="md"
                showText={true}
                subText={isAr ? 'أزياء الموضة الفاخرة' : 'LUXURY COUTURE'}
              />
            </div>

            <div className="hidden lg:flex items-center space-x-1 xl:space-x-4 rtl:space-x-reverse text-sm font-bold">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="px-3 py-2 rounded-lg transition-colors hover:bg-neutral-100 text-[#111111]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
                title={isAr ? 'English' : 'عربي'}
              >
                <Globe className="w-4.5 h-4.5 text-neutral-600" />
                <span className="text-[10px] font-bold mx-1">{isAr ? 'EN' : 'AR'}</span>
              </button>

              <button
                onClick={() => {
                  if (customer) setIsProfileOpen(true);
                  else setIsAuthModalOpen(true);
                }}
                className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Profile"
              >
                <User className="w-4.5 h-4.5 text-neutral-600" />
              </button>

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-4.5 h-4.5 text-neutral-600" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#6b1d2f] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Cart"
              >
                <ShoppingBag className="w-4.5 h-4.5 text-neutral-600" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#6b1d2f] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-neutral-600" /> : <Menu className="w-5 h-5 text-neutral-600" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#E2E8F0] bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl hover:bg-neutral-50 text-[#111111] font-bold"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 mt-2 border-t border-neutral-100 flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage(isAr ? 'en' : 'ar');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 py-3 bg-neutral-100 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    {isAr ? 'English' : 'عربي'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
`;
fs.writeFileSync('src/components/Navbar.tsx', content);
