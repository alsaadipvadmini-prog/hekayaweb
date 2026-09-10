import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { BrandLogo } from './BrandLogo.js';
import { Phone, MapPin, ShieldCheck, Truck, RefreshCw, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, theme, settings, setCurrentCategory, setIsClearanceView } = useApp();
  const isAr = language === 'ar';
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterInput, setNewsletterInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterInput.trim()) return;
    setSubscribed(true);
    setNewsletterInput('');
  };

  return (
    <footer
      id="main-footer"
      className="w-full border-t transition-colors duration-200 mt-16 bg-[#F8F9FA] border-[#e0e0e0] text-neutral-600"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div id="about" className="space-y-4">
            <BrandLogo
              size="lg"
              showText={true}
              subText={isAr ? 'أزياء الموضة الفاخرة' : 'LUXURY COUTURE'}
            />

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
              {isAr
                ? settings?.cms?.footerDescriptionAr || 'متجر حكاية الأردني للأزياء والموضة الفاخرة.'
                : 'HKAYA Luxury Jordanian Fashion Boutique. Curated international fashion, luxury fabrics, and bespoke lifestyle pieces.'}
            </p>

            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <MapPin className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>{isAr ? settings?.cms?.contactLocationAr || 'المملكة الأردنية الهاشمية - عمان' : 'Amman, Hashemite Kingdom of Jordan'}</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-italic-luxury font-bold text-sm text-[#111111] uppercase tracking-wider">
              {isAr ? 'أقسام المتجر' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setIsClearanceView(false);
                    setCurrentCategory('women');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'القسم النسائي (ملابس، أحذية، شيلات)' : 'Women Fashion'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsClearanceView(false);
                    setCurrentCategory('men');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'القسم الرجالي (بدلات، قمصان، أحذية)' : 'Men Fashion'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsClearanceView(false);
                    setCurrentCategory('family');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'العائلة والطفل والبيبي' : 'Family, Kids & Baby'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsClearanceView(false);
                    setCurrentCategory('perfumes');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'العطور النيش والخلطات' : 'Artisanal Perfumes'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsClearanceView(true);
                    setCurrentCategory('clearance');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-bold text-neutral-900 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'قسم التصفية والعروض (1-5 د.أ)' : 'Clearance (1-5 JOD)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Guarantees */}
          <div className="space-y-3">
            <h4 className="font-italic-luxury font-bold text-sm text-[#111111] uppercase tracking-wider">
              {isAr ? 'خدمة العملاء والضمان' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>{isAr ? 'توصيل دينار لعمان ودينارين للمحافظات' : '1 JOD Amman / 2 JOD Jordan'}</span>
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>{isAr ? 'استبدال واسترجاع خلال 3 أيام' : '3 Days Easy Return'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>{isAr ? 'معاينة الطلب عند الاستلام قبل الدفع' : 'Inspect before COD payment'}</span>
              </li>
              <li className="flex items-center gap-2 font-mono">
                <Phone className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>{settings?.cms?.contactPhone || '079 812 3456'}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Dialect CTA */}
          <div className="space-y-3">
            <h4 className="font-italic-luxury font-bold text-sm text-[#111111] uppercase tracking-wider">
              {isAr ? 'انضم لنخبة حكاية' : 'Join HKAYA Elite'}
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {isAr
                ? 'اشترك لتوصلك العروض الحصرية وصفقات التصفية أول بأول على الواتساب والإيميل.'
                : 'Stay updated with new couture drops and exclusive clearance deals.'}
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#f8f9fa] border border-neutral-900/30 text-neutral-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'أهلاً بك في عائلة حكاية الفاخرة!' : 'Subscribed successfully to HKAYA Elite!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newsletterInput}
                  onChange={(e) => setNewsletterInput(e.target.value)}
                  placeholder={isAr ? 'رقم الهاتف أو البريد...' : 'Your phone or email...'}
                  className="w-full px-3.5 py-2.5 rounded-full border border-[#e0e0e0] bg-[#f8f9fa] text-xs text-[#111111] placeholder-white/30 focus:outline-hidden focus:border-white/30 font-sans"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wider shrink-0 hover:brightness-125 transition-all cursor-pointer shadow-md"
                >
                  {isAr ? 'اشتراك' : 'Join'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} {isAr ? settings?.cms?.footerCopyrightText || 'متجر حكاية للأزياء. جميع الحقوق محفوظة.' : 'HKAYA Luxury Couture. All rights reserved.'}
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span>{isAr ? 'عمان، الأردن' : 'Amman, Jordan'}</span>
            <span>•</span>
            <span>{isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
