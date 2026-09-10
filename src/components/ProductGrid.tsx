import React, { useState, useEffect } from 'react';
import { Product, SubCategory } from '../types.js';
import { ProductCard } from './ProductCard.js';
import { useApp } from '../context/AppContext.js';
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Filter,
  Check,
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    language,
    theme,
    currentCategory,
    setCurrentCategory,
    currentSubCategory,
    setCurrentSubCategory,
    searchQuery,
    setIsClearanceView,
  } = useApp();
  const { settings } = useApp();

  const isAr = language === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<string>('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const officialCategories = [
    'الكل',
    'القسم النسائي',
    'القسم الرجالي',
    'العائلة والطفل',
    'اللانجيري',
    'الميك أب والعناية',
    'العطور الشرقية والغربية',
    'قسم التصفية والعروض (1-5 د.أ)'
  ];

  const handleSelectOfficialCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'قسم التصفية والعروض (1-5 د.أ)') {
      setIsClearanceView?.(true);
      setCurrentCategory?.('clearance');
      setCurrentSubCategory?.('clearance_all');
    } else {
      setIsClearanceView?.(false);
      if (cat === 'القسم النسائي') {
        setCurrentCategory?.('women');
        setCurrentSubCategory?.('all');
      } else if (cat === 'القسم الرجالي') {
        setCurrentCategory?.('men');
        setCurrentSubCategory?.('all');
      } else if (cat === 'العائلة والطفل') {
        setCurrentCategory?.('family');
        setCurrentSubCategory?.('all');
      } else if (cat === 'اللانجيري') {
        setCurrentCategory?.('lingerie');
        setCurrentSubCategory?.('all');
      } else if (cat === 'الميك أب والعناية') {
        setCurrentCategory?.('beauty');
        setCurrentSubCategory?.('all');
      } else if (cat === 'العطور الشرقية والغربية') {
        setCurrentCategory?.('perfumes');
        setCurrentSubCategory?.('all');
      } else {
        setCurrentCategory?.('all');
        setCurrentSubCategory?.('all');
      }
    }
  };

  // Sub-categories definition based on active main category
  const subCategoryTabs: { id: SubCategory | 'all'; nameAr: string; nameEn: string }[] =
    currentCategory === 'women'
      ? [
          { id: 'all', nameAr: 'كل القسم النسائي', nameEn: 'All Women' },
          { id: 'women_clothing', nameAr: 'الملابس النسائية', nameEn: 'Clothing' },
          { id: 'women_shoes', nameAr: 'الأحذية النسائية', nameEn: 'Shoes' },
          { id: 'hijab', nameAr: 'الحجاب والشيلات', nameEn: 'Hijab' },
        ]
      : currentCategory === 'men'
      ? [
          { id: 'all', nameAr: 'كل القسم الرجالي', nameEn: 'All Men' },
          { id: 'men_clothing', nameAr: 'الملابس الرجالية', nameEn: 'Clothing' },
          { id: 'men_shoes', nameAr: 'الأحذية الرجالية', nameEn: 'Shoes' },
        ]
      : currentCategory === 'family'
      ? [
          { id: 'all', nameAr: 'كل عائلة وطفل', nameEn: 'All Family & Kids' },
          { id: 'kids', nameAr: 'الأطفال', nameEn: 'Kids' },
          { id: 'kids_shoes', nameAr: 'أحذية الأطفال', nameEn: 'Kids Shoes' },
          { id: 'baby', nameAr: 'البيبي والمواليد', nameEn: 'Baby & Newborn' },
        ]
      : [];

  useEffect(() => {
    setPage(1);
  }, [currentCategory, currentSubCategory, searchQuery, sortBy, inStockOnly]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory && currentCategory !== 'all') {
          params.append('category', currentCategory);
        }
        if (currentSubCategory && currentSubCategory !== 'all') {
          params.append('subCategory', currentSubCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (sortBy !== 'default') {
          params.append('sort', sortBy);
        }
        if (inStockOnly) {
          params.append('inStockOnly', 'true');
        }
        params.append('page', page.toString());
        params.append('limit', '20');

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setProducts(items);
        setTotalPages(data?.totalPages || 1);
        setTotalItems(data?.total || items.length);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSubCategory, searchQuery, sortBy, inStockOnly, page]);

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filter and Sorting Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e0e0e0]">
        <div>
          <h2 className="font-italic-luxury font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-[#111111]">{settings?.cms?.sectionFeaturedTitleAr || 'التشكيلة الرئيسية'} - 
            {searchQuery
              ? isAr
                ? `نتائج البحث عن: "${searchQuery}"`
                : `Search results for: "${searchQuery}"`
              : currentCategory === 'women'
              ? isAr
                ? 'كولكشن القسم النسائي الفاخر'
                : 'Women Couture Collection'
              : currentCategory === 'men'
              ? isAr
                ? 'كولكشن القسم الرجالي الأنيق'
                : 'Men Couture Collection'
              : currentCategory === 'family'
              ? isAr
                ? 'كولكشن العائلة والطفل والبيبي'
                : 'Family, Kids & Baby'
              : currentCategory === 'lingerie'
              ? isAr
                ? 'كولكشن اللانجري والبيجامات الحريرية'
                : 'Luxury Lingerie & Silk'
              : currentCategory === 'beauty'
              ? isAr
                ? 'الميكأب والمستحضرات التجميلية'
                : 'Beauty & Skincare'
              : currentCategory === 'perfumes'
              ? isAr
                ? 'العطور النيش والزيوت الشرقية'
                : 'Artisanal Perfumes'
              : isAr
              ? 'أحدث المعروضات وكولكشن الموسم'
              : 'Featured Season Collection'}
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* In Stock Toggle */}
          <button
            id="btn-filter-instock"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              inStockOnly
                ? 'bg-emerald-950/40 border-neutral-900 text-emerald-300'
                : 'bg-[#f8f9fa] border-[#e0e0e0] text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                inStockOnly ? 'bg-[#F8F9FA] border-neutral-900' : 'border-neutral-500'
              }`}
            >
              {inStockOnly && <Check className="w-2.5 h-2.5 text-[#111111]" />}
            </div>
            <span>{isAr ? 'المتوفر فقط' : 'In Stock'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <style>{`
              #select-sort-products {
                color: #111827 !important;
                background-color: #ffffff;
                border: 1px solid #d1d5db;
                font-weight: 600;
                opacity: 1 !important;
              }
            `}</style>
            <select
              id="select-sort-products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-1.5 rounded-full text-xs focus:outline-none cursor-pointer"
            >
              <option value="default">{isAr ? 'الترتيب: الافتراضي' : 'Sort: Default'}</option>
              <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              <option value="reviews">{isAr ? 'الأكثر طلباً' : 'Most Popular'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Category Navigation Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 0',
        marginTop: '12px',
        marginBottom: '16px',
        width: '100%',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        whiteSpace: 'nowrap'
      }}>
        {officialCategories.map((cat) => (
          <button
            key={cat}
            id={`cat-btn-${encodeURIComponent(cat)}`}
            onClick={() => handleSelectOfficialCategory(cat)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              backgroundColor: selectedCategory === cat ? '#111111' : '#f3f4f6',
              color: selectedCategory === cat ? '#ffffff' : '#1f2937',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sub-category Filter Tabs */}
      {subCategoryTabs.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '6px 0', marginBottom: '16px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', width: '100%', whiteSpace: 'nowrap' }}>
          {subCategoryTabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-subcat-${tab.id}`}
              onClick={() => setCurrentSubCategory(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: currentSubCategory === tab.id ? '#111827' : '#f3f4f6',
                color: currentSubCategory === tab.id ? '#ffffff' : '#1f2937',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {isAr ? tab.nameAr : tab.nameEn}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid: Strict 2 columns on mobile, 3 on tablet, 4 on desktop, 5 on wide screens */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-neutral-500 font-medium font-luxury">
            {isAr ? 'جاري تحميل القطع الفاخرة...' : 'Loading luxury pieces...'}
          </span>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="text-base text-neutral-500 font-luxury">
            {isAr ? 'ما لقينا قطع بتطابق بحثك يا غالي، جرب كلمة ثانية' : 'No items match your search'}
          </p>
        </div>
      ) : (
        <div
          id="products-grid"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6 pt-6"
        >
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-12 pb-4 flex-wrap max-w-full px-2">
          <button
            id="btn-prev-page"
            disabled={page === 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2.5 rounded-full border border-[#e0e0e0] disabled:opacity-20 hover:bg-[#f8f9fa]/10 text-[#111111] transition-all cursor-pointer shrink-0"
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className="flex items-center justify-center flex-wrap gap-1.5 max-w-full">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => {
                  setPage(pNum);
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                  page === pNum
                    ? 'bg-[#111111] text-white shadow-md border border-[#e0e0e0]'
                    : 'hover:bg-[#f8f9fa]/10 text-neutral-500 hover:text-[#111111] border border-transparent'
                }`}
              >
                {pNum}
              </button>
            ))}
          </div>

          <button
            id="btn-next-page"
            disabled={page === totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2.5 rounded-full border border-[#e0e0e0] disabled:opacity-20 hover:bg-[#f8f9fa]/10 text-[#111111] transition-all cursor-pointer shrink-0"
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </section>
  );
};
