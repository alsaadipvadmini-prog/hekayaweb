import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types.js';
import { Truck, Palette, Save, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

interface ThemeDeliveryTabProps {
  settings: SiteSettings | null;
  token: string;
  onSaveSettings: (updated: SiteSettings) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const JORDAN_GOVERNORATES = [
  { key: 'عمان', name: 'محافظة العاصمة (عمان)', defaultFee: 1.0 },
  { key: 'إربد', name: 'محافظة إربد وعروس الشمال', defaultFee: 2.0 },
  { key: 'الزرقاء', name: 'محافظة الزرقاء', defaultFee: 2.0 },
  { key: 'البلقاء', name: 'محافظة البلقاء (السلط)', defaultFee: 2.0 },
  { key: 'العقبة', name: 'محافظة العقبة وثغر الأردن الباسم', defaultFee: 2.0 },
  { key: 'مادبا', name: 'محافظة مادبا', defaultFee: 2.0 },
  { key: 'جرش', name: 'محافظة جرش', defaultFee: 2.0 },
  { key: 'عجلون', name: 'محافظة عجلون', defaultFee: 2.0 },
  { key: 'الكرك', name: 'محافظة الكرك', defaultFee: 2.0 },
  { key: 'الطفيلة', name: 'محافظة الطفيلة الهاشمية', defaultFee: 2.0 },
  { key: 'معان', name: 'محافظة معان والبتراء', defaultFee: 2.0 },
  { key: 'المفرق', name: 'محافظة المفرق والبادية', defaultFee: 2.0 },
];

export const ThemeDeliveryTab: React.FC<ThemeDeliveryTabProps> = ({
  settings,
  token,
  onSaveSettings,
  showToast,
}) => {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      const copy = JSON.parse(JSON.stringify(settings));
      if (!copy.deliveryFees) {
        copy.deliveryFees = {};
        JORDAN_GOVERNORATES.forEach((g) => {
          copy.deliveryFees[g.key] = g.defaultFee;
        });
      }
      setForm(copy);
    }
  }, [settings]);

  if (!form) return null;

  const handleFeeChange = (govKey: string, val: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        deliveryFees: {
          ...(prev.deliveryFees || {}),
          [govKey]: val,
        },
      };
    });
  };

  const handleApplyStandardPricing = () => {
    const standard: Record<string, number> = {};
    JORDAN_GOVERNORATES.forEach((g) => {
      standard[g.key] = g.defaultFee;
    });
    setForm((prev) => (prev ? { ...prev, deliveryFees: standard } : prev));
    showToast('تم تطبيق التسعيرة الموحدة (عمان 1 د.أ / باقي المحافظات 2 د.أ)', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSaving(true);
    try {
      await onSaveSettings(form);
    } catch {
      showToast('تعذر حفظ الإعدادات', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-[#111111] text-white p-6 rounded-2xl border border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-white" />
            <h2 className="font-bold text-base text-white">محرك أجور التوصيل ومنظومة الألوان الفاخرة</h2>
          </div>
          <p className="text-xs text-neutral-300">
            تخصيص تسعيرة الشحن لكل محافظة من محافظات المملكة الـ 12 وضبط باليتة الألوان المعتمدة.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#f8f9fa] text-[#111111] hover:bg-neutral-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ ونشر التعديلات'}</span>
        </button>
      </div>

      {/* 1. Jordan Governorate Delivery Engine */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e0e0e0] pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#111111]" />
            <h3 className="font-bold text-sm text-[#111111]">
              جدول تسعيرة التوصيل لمحافظات المملكة الـ 12 (بالدينار الأردني)
            </h3>
          </div>

          <button
            type="button"
            onClick={handleApplyStandardPricing}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            تطبيق التسعيرة الموحدة للمملكة
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {JORDAN_GOVERNORATES.map((gov) => {
            const currentFee = form.deliveryFees?.[gov.key] ?? gov.defaultFee;
            return (
              <div
                key={gov.key}
                className="p-3 rounded-xl border border-[#e0e0e0] bg-neutral-50/70 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-bold text-[#000000]">{gov.name}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={currentFee}
                    onChange={(e) => handleFeeChange(gov.key, Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs font-mono font-bold text-center border border-[#e0e0e0] rounded-lg bg-[#f8f9fa] focus:outline-hidden focus:border-[#111111]"
                  />
                  <span className="text-xs text-neutral-500 font-bold">د.أ</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Strict Luxury Theme Palette (Burgundy / Black / White) */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] pb-3">
          <Palette className="w-4 h-4 text-[#111111]" />
          <h3 className="font-bold text-sm text-[#111111]">
            منظومة الهوية البصرية الصارمة (Strict Luxury Palette)
          </h3>
        </div>

        <p className="text-xs text-neutral-600">
          تعتمد المنصة منظومة ألوان معتمدة خالية من أي عناصر ملونة عشوائية، مرتكزة على البورغندي الفاخر والأسود الملكي.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#e0e0e0] bg-[#f8f9fa] space-y-2">
            <div className="w-full h-12 rounded-lg bg-[#111111] border border-neutral-400 shadow-2xs" />
            <div>
              <span className="text-xs font-bold text-[#000000] block">البورغندي الملكي الأساسي</span>
              <span className="text-[11px] font-mono text-neutral-500">#111111</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e0e0e0] bg-[#f8f9fa] space-y-2">
            <div className="w-full h-12 rounded-lg bg-[#3a080d] border border-neutral-400 shadow-2xs" />
            <div>
              <span className="text-xs font-bold text-[#000000] block">البورغندي الداكن المتفاعل (Hover)</span>
              <span className="text-[11px] font-mono text-neutral-500">#3a080d</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e0e0e0] bg-[#f8f9fa] space-y-2">
            <div className="w-full h-12 rounded-lg bg-[#000000] border border-neutral-400 shadow-2xs" />
            <div>
              <span className="text-xs font-bold text-[#000000] block">الأسود الفاحم المعتمد</span>
              <span className="text-[11px] font-mono text-neutral-500">#000000</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e0e0e0] bg-[#f8f9fa] space-y-2">
            <div className="w-full h-12 rounded-lg bg-[#3a080d] border border-neutral-400 shadow-2xs" />
            <div>
              <span className="text-xs font-bold text-[#000000] block">عنابي العروض والتصفية</span>
              <span className="text-[11px] font-mono text-neutral-500">#3a080d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات والتسعيرة'}</span>
        </button>
      </div>
    </form>
  );
};
