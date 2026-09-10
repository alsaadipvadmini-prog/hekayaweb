import React, { useState } from 'react';
import { Product, MainCategory, SubCategory } from '../../types.js';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  CheckCircle,
  XCircle,
  Percent,
  Upload,
  Image as ImageIcon,
  Tag,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProductsTabProps {
  products: Product[];
  token: string;
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  token,
  onRefresh,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [clearanceFilter, setClearanceFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Form State
  const [form, setForm] = useState({
    title: '',
    titleEn: '',
    category: 'women' as MainCategory,
    subCategory: 'women_clothing' as SubCategory,
    price: 25,
    oldPrice: 35,
    inStock: true,
    isClearance: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111111', '#FFFFFF', '#000000'],
    image: '',
    images: ['', '', '', ''] as [string, string, string, string],
    description: '',
    descriptionEn: '',
  });

  const openNewProductModal = () => {
    setEditingProductId(null);
    setForm({
      title: '',
      titleEn: '',
      category: 'women',
      subCategory: 'women_clothing',
      price: 25,
      oldPrice: 35,
      inStock: true,
      isClearance: false,
      sizes: 'S, M, L, XL',
      colors: '#111111, #FFFFFF, #000000',
      image: 'prod-1.jpg',
      images: ['prod-1.jpg', 'prod-2.jpg', 'prod-3.jpg', 'hero-embroidery.jpg'],
      description: 'قطعة راقية مصممة بأعلى معايير الفخامة والراحة وخامات أصلية.',
      descriptionEn: 'Luxury fashion piece crafted with high attention to detail and premium fabrics.',
    });
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    const existingImages: [string, string, string, string] = [
      product.images?.[0] || product.image || '',
      product.images?.[1] || '',
      product.images?.[2] || '',
      product.images?.[3] || '',
    ];

    setForm({
      title: product.title,
      titleEn: product.titleEn || '',
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      oldPrice: product.oldPrice || product.price,
      inStock: product.inStock !== false,
      isClearance: Boolean(product.isClearance),
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      colors: product.colors || ['#111111', '#FFFFFF'],
      image: product.image,
      images: existingImages,
      description: product.description || '',
      descriptionEn: product.descriptionEn || '',
    });
    setIsModalOpen(true);
  };

  const handleSlotImageChange = (slotIndex: number, url: string) => {
    const updated: [string, string, string, string] = [
      slotIndex === 0 ? url : form.images[0],
      slotIndex === 1 ? url : form.images[1],
      slotIndex === 2 ? url : form.images[2],
      slotIndex === 3 ? url : form.images[3],
    ];
    setForm((prev) => ({
      ...prev,
      images: updated,
      image: slotIndex === 0 ? url : prev.image || url,
    }));
  };

  const handleSlotFileUpload = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { compressImage } = await import('../../utils/imageOptimizer.js');
      const compressedUrl = await compressImage(file);
      handleSlotImageChange(slotIndex, compressedUrl);
    } catch (err) {
      showToast('تعذر ضغط ورفع الصورة', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      showToast('يرجى كتابة اسم المنتج', 'error');
      return;
    }

    const sizesArr = typeof form.sizes === "string" ? form.sizes.split(",").map(s => s.trim()).filter(Boolean) : form.sizes;
    const colorsArr = typeof form.colors === "string" ? form.colors.split(",").map(c => c.trim()).filter(Boolean) : form.colors;

    const payload = {
      title: form.title,
      titleEn: form.titleEn,
      category: form.category,
      subCategory: form.subCategory,
      price: Number(form.price) || 1,
      oldPrice: Number(form.oldPrice) || Number(form.price),
      inStock: form.inStock,
      isClearance: form.isClearance,
      sizes: sizesArr,
      colors: colorsArr,
      image: form.images[0] || form.image || 'prod-1.jpg',
      images: form.images.filter(Boolean),
      description: form.description,
      descriptionEn: form.descriptionEn,
    };

    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingProductId ? 'تم تحديث بيانات المنتج بنجاح' : 'تمت إضافة المنتج الجديد للمتجر', 'success');
        setIsModalOpen(false);
        onRefresh();
      } else {
        const err = await res.json();
        showToast(err.error || 'تعذر حفظ المنتج', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  
  const handleBulkAction = async (action: 'delete' | 'inStock' | 'outOfStock' | 'clearanceOn' | 'clearanceOff') => {
    if (selectedProducts.length === 0) return;
    
    if (action === 'delete' && !window.confirm(`هل أنت متأكد من حذف ${selectedProducts.length} منتج نهائياً؟`)) return;

    try {
      // In a real app we'd have a bulk endpoint, but here we can loop or use a custom backend logic.
      // Assuming no bulk endpoint, we will execute sequentially.
      let successCount = 0;
      for (const id of selectedProducts) {
        if (action === 'delete') {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) successCount++;
        } else {
          const product = products.find(p => p.id === id);
          if (product) {
            let payload: any = {};
            if (action === 'inStock') payload.inStock = true;
            if (action === 'outOfStock') payload.inStock = false;
            if (action === 'clearanceOn') payload.isClearance = true;
            if (action === 'clearanceOff') payload.isClearance = false;
            
            const res = await fetch(`/api/products/${id}`, { 
              method: 'PUT', 
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(payload)
            });
            if (res.ok) successCount++;
          }
        }
      }
      showToast(`تم تنفيذ الإجراء المجمع بنجاح لـ ${successCount} منتجات`, 'success');
      setSelectedProducts([]);
      onRefresh();
    } catch {
      showToast('خطأ أثناء تنفيذ الإجراء المجمع', 'error');
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newStock = !product.inStock;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inStock: newStock }),
      });

      if (res.ok) {
        showToast(newStock ? 'تم تفعيل توفر المنتج في المخزون' : 'تم تعيين المنتج كنافد من المخزون', 'info');
        onRefresh();
      }
    } catch {
      showToast('تعذر تحديث حالة المخزون', 'error');
    }
  };

  
  const handleDuplicateProduct = async (product: Product) => {
    const payload = {
      ...product,
      title: product.title + ' (نسخة)',
      id: undefined // Backend should generate new ID
    };
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('تم استنساخ المنتج بنجاح', 'success');
        onRefresh();
      } else {
        showToast('تعذر استنساخ المنتج', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج (${product.title}) نهائياً؟`)) return;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showToast('تم حذف المنتج بنجاح', 'success');
        onRefresh();
      } else {
        showToast('تعذر حذف المنتج', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.titleEn && prod.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'all' || prod.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'inStock' && prod.inStock !== false) ||
      (stockFilter === 'outOfStock' && prod.inStock === false);
    const matchesClearance =
      clearanceFilter === 'all' ||
      (clearanceFilter === 'clearance' && prod.isClearance) ||
      (clearanceFilter === 'regular' && !prod.isClearance);

    return matchesSearch && matchesCat && matchesStock && matchesClearance;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Search Bar */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-[#000000]">إدارة المنتجات والمخزون</h2>
            <p className="text-xs text-neutral-500">
              إجمالي المنتجات المسجلة: {products.length} منتج | معروض حالياً: {filteredProducts.length}
            </p>
          </div>

          <button
            onClick={openNewProductModal}
            className="px-4 py-2.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#e0e0e0]">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو المعرف..."
              className="w-full pr-10 pl-3 py-2 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] font-medium cursor-pointer"
          >
            <option value="all">جميع الأقسام</option>
            <option value="women">القسم النسائي</option>
            <option value="men">القسم الرجالي</option>
            <option value="family">العائلة والطفل</option>
            <option value="lingerie">اللانجري والحرير</option>
            <option value="beauty">الميكأب والعناية</option>
            <option value="perfumes">العطور النيش</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] font-medium cursor-pointer"
          >
            <option value="all">جميع حالات المخزون</option>
            <option value="inStock">متوفر بالمستودع</option>
            <option value="outOfStock">نفدت الكمية</option>
          </select>

          <select
            value={clearanceFilter}
            onChange={(e) => setClearanceFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] font-medium cursor-pointer"
          >
            <option value="all">كافة الكولكشنات</option>
            <option value="clearance">قسم التصفية فقط (1-5 د.أ)</option>
            <option value="regular">الكولكشن الأساسي</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl overflow-hidden shadow-xs">
        
        {selectedProducts.length > 0 && (
          <div className="bg-[#111111] text-white p-3 rounded-xl flex items-center justify-between shadow-lg mb-4 animate-in slide-in-from-bottom-4">
            <span className="text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-neutral-800" />
              تم تحديد {selectedProducts.length} منتج
            </span>
            <div className="flex gap-2">
              <select 
                className="bg-black/50 text-white text-xs border border-white/20 rounded-lg px-2 py-1 outline-hidden"
                onChange={(e) => {
                  const val = e.target.value;
                  if(val) {
                    handleBulkAction(val as any);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">إجراء مجمع (Bulk Edit)...</option>
                <option value="inStock">تعيين كمتوفر (In Stock)</option>
                <option value="outOfStock">تعيين كنافد (Out of Stock)</option>
                <option value="clearanceOn">تفعيل التصفية (Clearance)</option>
                <option value="clearanceOff">إلغاء التصفية</option>
                <option value="delete">حذف المحدد</option>
              </select>
              <button 
                onClick={() => setSelectedProducts([])}
                className="p-1 hover:bg-[#f8f9fa]/10 rounded-lg transition-colors"
                title="إلغاء التحديد"
              >
                <XCircle className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">

          <table className="w-full text-xs text-start">
            <thead className="bg-[#111111] text-white border-b border-[#111111]">
              <tr>
                <th className="py-3.5 px-4 text-start font-bold">المنتج والصورة</th>
                <th className="py-3.5 px-4 text-start font-bold">القسم والتصنيف</th>
                <th className="py-3.5 px-4 text-center font-bold">السعر (د.أ)</th>
                <th className="py-3.5 px-4 text-center font-bold">المقاسات المتاحة</th>
                <th className="py-3.5 px-4 text-center font-bold">حالة المخزون</th>
                <th className="py-3.5 px-4 text-center font-bold">شارة التصفية</th>
                <th className="py-3.5 px-4 text-end font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-50/70 transition-colors">
                  {/* Product Title & Thumbnail */}
                  <td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedProducts.includes(prod.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProducts([...selectedProducts, prod.id]);
                          else setSelectedProducts(selectedProducts.filter(id => id !== prod.id));
                        }}
                      />
                    </td>
<td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image || prod.images?.[0] || 'prod-1.jpg'}
                        alt={prod.title}
                        className="w-12 h-14 object-cover rounded-lg border border-[#e0e0e0] shrink-0 bg-neutral-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#000000]">{prod.title}</p>
                        {prod.titleEn && (
                          <p className="text-[10px] text-neutral-500 font-mono">{prod.titleEn}</p>
                        )}
                        <span className="text-[9px] text-neutral-400 font-mono">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-sm font-medium">
                      {prod.category} / {prod.subCategory}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-center">
                    <div className="space-y-0.5">
                      <span className="font-mono font-extrabold text-sm text-[#111111]">
                        {prod.price.toFixed(2)} د.أ
                      </span>
                      {prod.oldPrice && prod.oldPrice > prod.price && (
                        <span className="block text-[10px] text-neutral-400 line-through font-mono">
                          {prod.oldPrice.toFixed(2)} د.أ
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Sizes */}
                  <td className="py-3 px-4 text-center font-mono text-neutral-700">
                    {Array.isArray(prod.sizes) ? prod.sizes.join(", ") : (prod.sizes && typeof prod.sizes === "object" ? Object.values(prod.sizes).join(", ") : (prod.sizes || "-"))}
                  </td>

                  {/* Stock Status Controller */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStock(prod)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                        prod.inStock !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-neutral-50 text-[#111111] border border-[#e0e0e0] hover:bg-rose-100'
                      }`}
                      title="انقر لتبديل حالة التوفر"
                    >
                      {prod.inStock !== false ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>متوفر</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>نفدت الكمية</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Clearance Badge */}
                  <td className="py-3 px-4 text-center">
                    {prod.isClearance ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#111111] text-white text-[10px] font-bold rounded-sm shadow-2xs">
                        <Percent className="w-2.5 h-2.5" />
                        <span>تصفية (1-5)</span>
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="p-2 text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="تعديل المنتج"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(prod)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="استنساخ المنتج"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-1.5 text-[#111111] hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with 4-Slot Dedicated Gallery */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#f8f9fa] rounded-2xl p-6 space-y-6 border border-[#e0e0e0] shadow-2xl text-[#000000] my-8 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#111111]" />
                <h3 className="font-bold text-base text-[#111111]">
                  {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">اسم المنتج (بالعربي)</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="مثال: فستان سهرة مخملي مطرز"
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Product Title (English)</label>
                  <input
                    type="text"
                    value={form.titleEn}
                    onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                    placeholder="e.g. Velvet Embroidered Evening Dress"
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Categories & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">القسم الرئيسي</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as MainCategory })}
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden"
                  >
                    <option value="women">القسم النسائي</option>
                    <option value="men">القسم الرجالي</option>
                    <option value="family">العائلة والطفل</option>
                    <option value="lingerie">اللانجري والحرير</option>
                    <option value="beauty">الميكأب والعناية</option>
                    <option value="perfumes">العطور النيش</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">التصنيف الفرعي</label>
                  <input
                    type="text"
                    value={form.subCategory}
                    onChange={(e) => setForm({ ...form, subCategory: e.target.value as SubCategory })}
                    placeholder="e.g. women_clothing"
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">سعر البيع (د.أ)</label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">السعر الأصلي قبل الخصم (د.أ)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المقاسات المتاحة (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(form.sizes) ? form.sizes.join(", ") : form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="S, M, L, XL, XXL أو 37, 38, 39, 40"
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    أكواد الألوان (HEX codes مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(form.colors) ? form.colors.join(", ") : form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    placeholder="#111111, #FFFFFF, #000000"
                    className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3.5 bg-neutral-50 rounded-xl border border-[#e0e0e0]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-[#111111] focus:ring-0"
                  />
                  <span>متوفر في المستودع وجاهز للشحن الفوري</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#111111]">
                  <input
                    type="checkbox"
                    checked={form.isClearance}
                    onChange={(e) => setForm({ ...form, isClearance: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-[#111111] focus:ring-0"
                  />
                  <span>إدراج في قسم التصفية والعروض النارية (1-5 د.أ)</span>
                </label>
              </div>

              {/* 4 Dedicated Image Gallery Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 block">
                    معرض الصور المخصص (4 زوايا وعينات تفصيلية للمنتج):
                  </span>
                  <span className="text-[11px] text-neutral-500">يدعم رفع ملفات محلية أو كتابة مسار الصورة مباشرة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: '1. الواجهة الأمامية (الأساسية)', placeholder: 'prod-1.jpg' },
                    { label: '2. الجهة الخلفية', placeholder: 'prod-2.jpg' },
                    { label: '3. تفاصيل القماش والخامة', placeholder: 'prod-3.jpg' },
                    { label: '4. التطريز واللمسات الدقيقة', placeholder: 'hero-embroidery.jpg' },
                  ].map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-[#e0e0e0] rounded-xl bg-neutral-50/60 space-y-2"
                    >
                      <span className="text-[11px] font-bold text-neutral-700 block truncate">{slot.label}</span>

                      {/* Image Preview Box */}
                      <div className="h-28 rounded-lg border border-[#e0e0e0] bg-[#f8f9fa] overflow-hidden flex items-center justify-center relative group">
                        {form.images[idx] ? (
                          <img
                            src={form.images[idx]}
                            alt={slot.label}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center text-neutral-400 space-y-1">
                            <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
                            <span className="text-[10px] block">خانة فارغة</span>
                          </div>
                        )}
                      </div>

                      {/* Text Input for Path or URL */}
                      <input
                        type="text"
                        value={form.images[idx]}
                        onChange={(e) => handleSlotImageChange(idx, e.target.value)}
                        placeholder={slot.placeholder}
                        className="w-full px-2 py-1 text-[11px] font-mono border border-[#e0e0e0] rounded-lg focus:outline-hidden bg-[#f8f9fa]"
                      />

                      {/* File Upload Button */}
                      <label className="w-full py-1 px-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>رفع صورة</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotFileUpload(idx, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">وصف المنتج (عربي)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="اكتب وصفاً مفصلاً للمنتج ومميزات الخامة..."
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e0e0e0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  {editingProductId ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
