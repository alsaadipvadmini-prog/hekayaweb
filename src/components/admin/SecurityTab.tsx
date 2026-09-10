import React, { useState } from 'react';
import { AdminAccount } from '../../types.js';
import { Shield, KeyRound, Lock, User, Clock, CheckCircle2, AlertTriangle, LogOut, Download, Upload as UploadIcon, Trash2, RefreshCcw } from 'lucide-react';
import storage from '../../utils/storage.js';
import { defaultSettings } from '../../utils/defaultSettings.js';

interface SecurityTabProps {
  currentAdmin: AdminAccount | null;
  token: string;
  onLogout: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  currentAdmin,
  token,
  onLogout,
  showToast,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('يرجى تعبئة كافة حقول كلمة المرور', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('كلمة المرور الجديدة غير متطابقة مع التأكيد', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/change-admin-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم تحديث كلمة المرور بنجاح', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message || 'تعذر تغيير كلمة المرور، تأكد من كلمة المرور الحالية', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Account Info Card */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] pb-3">
          <User className="w-4 h-4 text-[#111111]" />
          <h3 className="font-bold text-sm text-[#111111]">بيانات الحساب والجلسة الإدارية الحالية</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-[#e0e0e0] space-y-1">
            <span className="text-neutral-500 font-medium block">الاسم التعريفي:</span>
            <p className="font-bold text-sm text-[#000000]">{currentAdmin?.displayName || 'المسؤول'}</p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-[#e0e0e0] space-y-1">
            <span className="text-neutral-500 font-medium block">البريد الإلكتروني:</span>
            <p className="font-bold font-mono text-sm text-[#000000]">{currentAdmin?.email || '-'}</p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-[#e0e0e0] space-y-1">
            <span className="text-neutral-500 font-medium block">الرتبة والصلاحية:</span>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                currentAdmin?.role === 'owner'
                  ? 'bg-[#111111] text-white'
                  : 'bg-neutral-200 text-neutral-800'
              }`}
            >
              {currentAdmin?.role === 'owner' ? 'المالك العام (Super Owner)' : 'مسؤول إداري (Admin)'}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-4 max-w-xl">
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] pb-3">
          <KeyRound className="w-4 h-4 text-[#111111]" />
          <h3 className="font-bold text-sm text-[#111111]">تغيير كلمة المرور الخاصة بحسابك</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الحالية"
              className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="6 خانات على الأقل"
              className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد كتابة كلمة المرور الجديدة"
              className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-neutral-50 hover:bg-rose-100 text-[#111111] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'جاري التحديث...' : 'تحديث كلمة المرور'}</span>
            </button>
          </div>
        </form>
      </div>
      
      {/* System & Utility Controls */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] pb-3">
          <Shield className="w-4 h-4 text-[#111111]" />
          <h3 className="font-bold text-sm text-[#111111]">إدارة النظام والبيانات (System Controls)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              try {
                const settingsData = storage.get('hkaya_admin_settings', defaultSettings);
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsData));
                const dlAnchorElem = document.createElement('a');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", "hkaya_backup.json");
                dlAnchorElem.click();
                showToast('تم تصدير النسخة الاحتياطية بنجاح', 'success');
              } catch (e) {
                showToast('تعذر تصدير البيانات', 'error');
              }
            }}
            className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-xl hover:bg-neutral-50 transition-colors text-right group"
          >
            <div className="p-2 bg-emerald-50 text-neutral-900 rounded-lg group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">تصدير الإعدادات</h4>
              <p className="text-xs text-neutral-500">تحميل نسخة احتياطية (JSON)</p>
            </div>
          </button>

          <label className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-xl hover:bg-neutral-50 transition-colors text-right group cursor-pointer">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <UploadIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">استيراد الإعدادات</h4>
              <p className="text-xs text-neutral-500">رفع نسخة احتياطية (JSON)</p>
            </div>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target?.result as string);
                    storage.set('hkaya_admin_settings', parsed);
                    showToast('تم استيراد الإعدادات بنجاح. يرجى إعادة تحميل الصفحة.', 'success');
                    setTimeout(() => window.location.reload(), 2000);
                  } catch(err) {
                    showToast('ملف غير صالح', 'error');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من إعادة ضبط الموقع للوضع الافتراضي؟ ستفقد كافة التعديلات.')) {
                storage.set('hkaya_admin_settings', defaultSettings);
                showToast('تمت استعادة الوضع الافتراضي.', 'success');
                setTimeout(() => window.location.reload(), 1500);
              }
            }}
            className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-xl hover:bg-neutral-50 transition-colors text-right group"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">الوضع الافتراضي</h4>
              <p className="text-xs text-neutral-500">إلغاء التعديلات (Reset)</p>
            </div>
          </button>

          <button
            onClick={() => {
              try {
                // Clear all except token and essential state
                const token = storage.get('hkaya_admin_token', '');
                storage.clearPlatformData();
                if(token) storage.set('hkaya_admin_token', token);
                showToast('تم مسح ذاكرة التخزين المؤقت بنجاح', 'success');
                setTimeout(() => window.location.reload(), 1000);
              } catch (e) {
                showToast('حدث خطأ أثناء المسح', 'error');
              }
            }}
            className="flex items-center gap-3 p-4 border border-[#e0e0e0] rounded-xl hover:bg-neutral-50 transition-colors text-right group"
          >
            <div className="p-2 bg-neutral-50 text-[#111111] rounded-lg group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">مسح الذاكرة</h4>
              <p className="text-xs text-neutral-500">إفراغ التخزين (Clear Cache)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
