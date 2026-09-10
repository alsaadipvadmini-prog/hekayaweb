import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { BrandLogo } from './BrandLogo.js';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss.js';
import { X, User, Lock, Mail, Phone, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { JORDAN_GOVERNORATES } from '../data/jordanLocations.js';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthOpen,
    setIsCustomerAuthOpen,
    customerAuthTab,
    setCustomerAuthTab,
    loginCustomer,
    registerCustomer,
    showToast,
    language,
  } = useApp();

  const { touchHandlers, style } = useSwipeToDismiss(() => setIsCustomerAuthOpen(false));

  const isAr = language === 'ar';

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGovernorate, setRegGovernorate] = useState('عمان');
  const [regStreet, setRegStreet] = useState('');
  const [regBuilding, setRegBuilding] = useState('');

  // Forgot password form
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isCustomerAuthOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier || !loginPassword) {
      setErrorMessage(isAr ? 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور' : 'Please enter identifier and password');
      return;
    }

    setLoading(true);
    const res = await loginCustomer(loginIdentifier, loginPassword);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.message || (isAr ? 'فشل تسجيل الدخول' : 'Login failed'));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regFullName.trim().split(/\s+/).length < 2) {
      setErrorMessage(isAr ? 'يرجى كتابة الاسم الكامل (كلمتان على الأقل)' : 'Please enter your full name');
      return;
    }

    const cleanPhone = regPhone.replace(/\s+/g, '');
    if (!cleanPhone.match(/^(077|078|079|07)\d{7,8}$/)) {
      setErrorMessage(isAr ? 'يرجى إدخال رقم هاتف أردني صحيح (077/078/079)' : 'Valid Jordanian phone number required (07X)');
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMessage(isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage(isAr ? 'كلمة المرور يجب أن لا تقل عن 6 خانات' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await registerCustomer({
      fullName: regFullName,
      email: regEmail,
      phoneNumber: cleanPhone,
      password: regPassword,
      governorate: regGovernorate,
      streetName: regStreet,
      buildingNumber: regBuilding,
    });
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message || (isAr ? 'فشل التسجيل' : 'Registration failed'));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetIdentifier || resetNewPass.length < 6) {
      setErrorMessage(isAr ? 'يرجى ملء الحقول وكلمة مرور جديدة 6 خانات على الأقل' : 'Please provide all details');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: resetIdentifier, newPassword: resetNewPass }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.success) {
        setResetSuccess(true);
        showToast(isAr ? 'تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن' : 'Password updated successfully', 'success');
        setTimeout(() => {
          setCustomerAuthTab('login');
          setResetSuccess(false);
          setLoginIdentifier(resetIdentifier);
        }, 1800);
      } else {
        setErrorMessage(data.message || (isAr ? 'فشل إعادة التعيين' : 'Reset failed'));
      }
    } catch {
      setLoading(false);
      setErrorMessage(isAr ? 'حدث خطأ في الاتصال' : 'Connection error');
    }
  };

  // Quick autofill demo account
  const autofillDemo = () => {
    setLoginIdentifier('0798123456');
    setLoginPassword('12345678');
  };

  return (
    <div
      id="customer-auth-overlay"
      className="modal-backdrop-overlay bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCustomerAuthOpen(false);
      }}
    >
      {/* Container: Bottom sheet on mobile, rounded modal on desktop */}
      <div
        id="customer-auth-modal"
        style={style}
        className="modal-content-wrapper modal-body-scroll w-full sm:max-w-md bg-[#f8f9fa] text-[#111111] border-t sm:border border-[#e0e0e0] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up-sheet sm:animate-scale-in flex flex-col"
      >
        {/* Interactive Top Drag Handle */}
        <div 
          className="w-full flex justify-center items-center pt-3 pb-2 cursor-pointer select-none touch-none hover:opacity-80 transition-opacity"
          onClick={() => setIsCustomerAuthOpen(false)}
          role="button"
          aria-label={isAr ? 'إغلاق تسجيل الدخول' : 'Close login'}
          {...touchHandlers}
        >
          <div className="w-12 h-1.5 bg-neutral-400 hover:bg-neutral-600 rounded-full transition-colors pointer-events-none" />
        </div>

        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0] cursor-pointer sm:cursor-default"
          {...touchHandlers}
        >
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <h3 className="font-luxury font-bold text-lg text-[#111111]">
                {customerAuthTab === 'login' && (isAr ? 'تسجيل دخول العملاء' : 'Customer Sign In')}
                {customerAuthTab === 'register' && (isAr ? 'إنشاء حساب كشخة جديد' : 'Create New Account')}
                {customerAuthTab === 'forgot' && (isAr ? 'استعادة كلمة المرور' : 'Reset Password')}
              </h3>
              <p className="text-xs text-neutral-500">
                {isAr ? 'متجر حكاية للتصفية والأزياء الفاخرة' : 'HKAYA Luxury Clearance House'}
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={() => setIsCustomerAuthOpen(false)}
            className="p-2 text-neutral-500 hover:text-[#111111] rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Tabs */}
        {customerAuthTab !== 'forgot' && (
          <div className="flex border-b border-[#e0e0e0] bg-[#F8F9FA]">
            <button
              id="tab-login-btn"
              onClick={() => {
                setCustomerAuthTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                customerAuthTab === 'login'
                  ? 'text-[#111111] bg-neutral-50'
                  : 'text-neutral-500 hover:text-[#111111]'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
              {customerAuthTab === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />
              )}
            </button>
            <button
              id="tab-register-btn"
              onClick={() => {
                setCustomerAuthTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                customerAuthTab === 'register'
                  ? 'text-[#111111] bg-neutral-50'
                  : 'text-neutral-500 hover:text-[#111111]'
              }`}
            >
              {isAr ? 'حساب جديد' : 'New Account'}
              {customerAuthTab === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />
              )}
            </button>
          </div>
        )}

        {/* Body content with scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4 no-scrollbar">
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              {errorMessage}
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {customerAuthTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-600 mb-1.5 font-medium">
                  {isAr ? 'رقم الهاتف أو البريد الإلكتروني' : 'Phone number or Email'}
                </label>
                <div className="relative">
                  <input
                    id="login-identifier-input"
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: 0798123456 أو user@gmail.com' : '0798123456 or email@domain.com'}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  />
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 rtl:right-auto rtl:left-3 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-neutral-600 font-medium">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerAuthTab('forgot');
                      setErrorMessage('');
                    }}
                    className="text-xs text-neutral-500 hover:text-[#111111] underline"
                  >
                    {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 rtl:right-auto rtl:left-3 top-3.5 text-neutral-500 hover:text-[#111111]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Fill Helper */}
              <div className="p-3 bg-[#181818] border border-[#e0e0e0] rounded-xl flex items-center justify-between">
                <div className="text-[11px] text-neutral-500">
                  <span className="text-[#111111] font-medium block">
                    {isAr ? 'حساب تجريبي سريع جاهز' : 'Instant Demo Account'}
                  </span>
                  0798123456 / 12345678
                </div>
                <button
                  type="button"
                  onClick={autofillDemo}
                  className="px-2.5 py-1 text-xs bg-[#242424] hover:bg-[#333333] border border-[#3A3A3A] rounded-lg text-neutral-200 transition-colors"
                >
                  {isAr ? 'تعبئة تلقائية' : 'Autofill'}
                </button>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-[#111111]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isAr ? 'دخول لحسابي' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {customerAuthTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs text-neutral-600 mb-1 font-medium">
                  {isAr ? 'الاسم الكامل (رباعي أو ثنائي على الأقل)' : 'Full Name'} *
                </label>
                <div className="relative">
                  <input
                    id="reg-fullname-input"
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: طارق عبد الله العجارمة' : 'e.g. Tareq Al-Ajarmeh'}
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 rtl:right-auto rtl:left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1 font-medium">
                    {isAr ? 'رقم الهاتف الأردني' : 'Phone (07X)'} *
                  </label>
                  <input
                    id="reg-phone-input"
                    type="tel"
                    required
                    placeholder="079XXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1 font-medium">
                    {isAr ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input
                    id="reg-email-input"
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-600 mb-1 font-medium">
                  {isAr ? 'كلمة المرور (6 خانات على الأقل)' : 'Password'} *
                </label>
                <div className="relative">
                  <input
                    id="reg-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 rtl:right-auto rtl:left-3 top-3 text-neutral-500 hover:text-[#111111]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional Shipping defaults */}
              <div className="pt-2 border-t border-[#e0e0e0]">
                <p className="text-xs text-neutral-500 mb-2">
                  {isAr ? 'عنوان التوصيل الافتراضي (اختياري للتوصيل السريع):' : 'Default Delivery Address (Optional):'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      value={regGovernorate}
                      onChange={(e) => setRegGovernorate(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-2.5 py-2 text-xs text-[#111111] focus:outline-none"
                    >
                      {JORDAN_GOVERNORATES.map((gov) => (
                        <option key={gov.id} value={gov.nameAr}>
                          {isAr ? gov.nameAr : gov.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={isAr ? 'الشارع / المنطقة' : 'Street / Area'}
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isAr ? 'إنشاء الحساب والانضمام لحكاية' : 'Create Account'}</span>
                    <Sparkles className="w-4 h-4 text-neutral-800" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {customerAuthTab === 'forgot' && (
            <div className="space-y-4">
              {resetSuccess ? (
                <div className="p-5 text-center bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-[#111111] text-sm">
                    {isAr ? 'تم استعادة كلمة المرور بنجاح!' : 'Password Reset Successfully!'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {isAr ? 'جاري تحويلك لتسجيل الدخول...' : 'Redirecting to login...'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {isAr
                      ? 'أدخل رقم هاتفك أو بريدك الإلكتروني المسجل وكلمة المرور الجديدة لاستعادة حسابك فوراً.'
                      : 'Enter your phone number or email and your new password to reset.'}
                  </p>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1 font-medium">
                      {isAr ? 'رقم الهاتف أو البريد الإلكتروني' : 'Phone / Email'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="079XXXXXXX"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1 font-medium">
                      {isAr ? 'كلمة المرور الجديدة (6 خانات على الأقل)' : 'New Password (min 6)'}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={resetNewPass}
                      onChange={(e) => setResetNewPass(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerAuthTab('login')}
                      className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition-colors"
                    >
                      {isAr ? 'رجوع لتسجيل الدخول' : 'Back to Login'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {loading ? 'جاري التحديث...' : (isAr ? 'تأكيد التغيير' : 'Reset')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Trust badges */}
          <div className="pt-3 border-t border-[#e0e0e0] flex items-center justify-center gap-4 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              {isAr ? 'بياناتك مشفرة ومحمية' : 'Encrypted & Safe'}
            </span>
            <span>•</span>
            <span>{isAr ? 'توصيل لجميع محافظات المملكة' : 'Jordan-wide Delivery'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
