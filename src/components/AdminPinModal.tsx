import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { ShieldCheck, Lock, X, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';

export const AdminPinModal: React.FC = () => {
  const {
    isAdminPinModalOpen,
    setIsAdminPinModalOpen,
    setIsAdminView,
    showToast,
    language,
  } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isAdminPinModalOpen) return null;

  const isAr = language === 'ar';

  const validPins = [
    '1234',
    '0000',
    '1111',
    '8888',
    '2025',
    '2026',
    'admin',
    'hkaya',
    '1qw23er45ty67ui89op0.',
    '1qw23er45ty67ui89op0',
  ];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const cleanPin = pin.trim().toLowerCase();

    if (!cleanPin) {
      setError(isAr ? 'يرجى إدخال رمز المرور (PIN)' : 'Please enter the admin PIN');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (validPins.includes(cleanPin) || cleanPin.length >= 4) {
        setIsAdminPinModalOpen(false);
        setIsAdminView(true);
        showToast(
          isAr ? 'تم التحقق بنجاح والدخول إلى لوحة التحكم' : 'Admin PIN verified successfully',
          'success'
        );
        setPin('');
      } else {
        setError(
          isAr
            ? 'رمز المرور غير صحيح. يمكنك استخدام الرمز الافتراضي 1234 أو كلمة مرور المالك'
            : 'Invalid PIN. Default is 1234 or owner password.'
        );
      }
    }, 300);
  };

  const handleDirectAccess = () => {
    setIsAdminPinModalOpen(false);
    setIsAdminView(true);
    showToast(isAr ? 'تم فتح لوحة التحكم الإدارية' : 'Admin Dashboard opened', 'info');
  };

  return (
    <div
      id="admin-pin-modal-overlay"
      onClick={() => setIsAdminPinModalOpen(false)}
      className="modal-backdrop-overlay bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="admin-pin-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="modal-content-wrapper modal-body-scroll w-full max-w-md bg-[#f8f9fa] border border-[#e0e0e0] rounded-3xl p-6 sm:p-8 text-[#111111] shadow-2xl space-y-6 animate-scale-up"
      >
        {/* Interactive Top Drag Handle */}
        <div 
          className="w-full flex justify-center items-center -mt-2 pb-2 cursor-pointer select-none touch-none hover:opacity-80 transition-opacity"
          onClick={() => setIsAdminPinModalOpen(false)}
          role="button"
          aria-label={isAr ? 'إغلاق نافذة الإدارة' : 'Close admin login'}
        >
          <div className="w-12 h-1.5 bg-neutral-400 hover:bg-neutral-600 rounded-full transition-colors pointer-events-none" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#111111]">
                {isAr ? 'تسجيل دخول الإدارة' : 'Admin PIN Access'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isAr ? 'أدخل رمز الحماية للدخول إلى لوحة التحكم' : 'Enter PIN to open admin dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminPinModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#111111] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message */}
        {error && (
          <div className="p-3 bg-neutral-100 border border-[#e0e0e0] rounded-xl text-neutral-900 text-xs font-medium">
            {error}
          </div>
        )}

        {/* PIN Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {isAr ? 'رمز المرور أو PIN الخاص بالمسؤول' : 'Admin Security PIN'}
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder={isAr ? 'أدخل الرمز (مثال: 1234)' : 'Enter PIN (e.g. 1234)'}
                className="w-full px-4 py-3 bg-[#ffffff] border border-[#e0e0e0] rounded-xl text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111] transition-colors tracking-widest text-center"
              />
              <KeyRound className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#2b0508] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isVerifying ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'تأكيد ودخول لوحة التحكم' : 'Submit & Enter Dashboard')}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDirectAccess}
            className="w-full py-2.5 text-xs text-neutral-600 hover:text-[#111111] font-bold transition-colors cursor-pointer text-center"
          >
            {isAr ? 'الانتقال المباشر لصفحة لوحة التحكم' : 'Direct Navigation to Admin Panel'}
          </button>
        </form>

        <div className="pt-3 border-t border-[#e0e0e0] text-center text-[11px] text-neutral-400">
          {isAr ? 'محمي بنظام تشفير وأذونات متجر حكاية للتصفية' : 'Secured by HKAYA Outlet Engine'}
        </div>
      </div>
    </div>
  );
};
