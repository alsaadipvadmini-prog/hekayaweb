import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { storage, safeStorage } from '../utils/storage.js';
import { Order, Product, SiteSettings, OrderStatus, AdminAccount } from '../types.js';
import { BrandLogo } from './BrandLogo.js';
import { AWBBarcodeModal } from './admin/AWBBarcodeModal.js';
import { AdminManagementTab } from './admin/AdminManagementTab.js';
import { OrdersTab } from './admin/OrdersTab.js';
import { ProductsTab } from './admin/ProductsTab.js';
import { CmsTab } from './admin/CmsTab.js';
import { ThemeDeliveryTab } from './admin/ThemeDeliveryTab.js';
import { SecurityTab } from './admin/SecurityTab.js';
import { AdminErrorBoundary } from './AdminErrorBoundary.js';
import {
  Lock,
  LogOut, FileText, Package, ShoppingBag, Truck, Users, Shield, ShieldCheck, ExternalLink, RefreshCw, KeyRound, UserPlus, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AdminPanelInner: React.FC = () => {
  const { settings, updateSettings, showToast, setIsAdminView, toast } = useApp();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  const [token, setToken] = useState<string>('');

  // Login & Request Form State
  const [authMode, setAuthMode] = useState<'pin' | 'login' | 'request'>('pin');
  const [loginPin, setLoginPin] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Request Access Form State
  const [reqEmail, setReqEmail] = useState('');
  const [reqDisplayName, setReqDisplayName] = useState('');
  const [reqPassword, setReqPassword] = useState('');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'admins' | 'orders' | 'products' | 'cms' | 'theme' | 'security'
  >('orders');

  // Core Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedAWBOrder, setSelectedAWBOrder] = useState<Order | null>(null);

  // Check stored token on load
  useEffect(() => {
    
    const savedToken = storage.get<string>('hkaya_admin_token', '');

    if (savedToken) {
      setToken(savedToken);
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.admin) {
            setIsAuthenticated(true);
            setCurrentAdmin(data.admin);
            loadData(savedToken);
          } else {
            storage.remove('hkaya_admin_token');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          storage.remove('hkaya_admin_token');
          setIsAuthenticated(false);
        });
    }
  }, []);

  const loadData = async (authToken?: string) => {
    const activeTok = authToken || token || storage.get<string>('hkaya_admin_token', '');
    if (!activeTok) return;

    try {
      const [ordRes, prodRes] = await Promise.all([
        fetch('/api/orders', { headers: { Authorization: `Bearer ${activeTok}` } }),
        fetch('/api/products?limit=300'),
      ]);

      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(Array.isArray(ordData) ? ordData : []);
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        const items = Array.isArray(prodData?.items) ? prodData.items : Array.isArray(prodData) ? prodData : [];
        setProducts(items);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handlePinLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    const cleanPin = loginPin.trim();
    if (!cleanPin) {
      setLoginError('يرجى إدخال رمز المرور أو PIN الخاص بالمسؤول');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        storage.set('hkaya_admin_token', data.token);
        setToken(data.token);
        setCurrentAdmin(data.admin || null);
        setIsAuthenticated(true);
        loadData(data.token);
        showToast('تم التحقق بنجاح والدخول إلى لوحة التحكم', 'success');
      } else {
        setLoginError(data.message || 'رمز المرور غير صحيح. يمكنك استخدام الرمز الافتراضي 1234');
      }
    } catch {
      setLoginError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        storage.set('hkaya_admin_token', data.token);
        setToken(data.token);
        setCurrentAdmin(data.admin || null);
        setIsAuthenticated(true);
        loadData(data.token);
        showToast('تم تسجيل الدخول إلى لوحة التحكم بنجاح', 'success');
      } else {
        setLoginError(data.message || 'بيانات الدخول غير صحيحة، تأكد من البريد وكلمة المرور');
      }
    } catch {
      setLoginError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setReqSuccessMsg('');
    setIsRequesting(true);

    try {
      const res = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: reqEmail.trim(),
          displayName: reqDisplayName.trim(),
          password: reqPassword,
          notes: reqNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReqSuccessMsg(data.message || 'تم إرسال طلب الانضمام بنجاح! بانتظار موافقة المالك العام لتفعيل حسابك.');
        setReqEmail('');
        setReqDisplayName('');
        setReqPassword('');
        setReqNotes('');
      } else {
        setLoginError(data.message || 'تعذر إرسال الطلب، يرجى مراجعة البيانات');
      }
    } catch {
      setLoginError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLogout = () => {
    storage.remove('hkaya_admin_token');
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setToken('');
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast('تم تحديث حالة الطلب بنجاح', 'success');
      } else {
        showToast('تعذر تحديث حالة الطلب', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showToast('تم حذف الطلب بنجاح', 'success');
      } else {
        showToast('تعذر حذف الطلب', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleSaveSettings = async (updatedSettings: SiteSettings) => {
    await updateSettings(updatedSettings);
  };

  // If Not Authenticated -> Render Login / Access Request Screen
  if (!isAuthenticated) {
    return (
      <div
        id="admin-login-screen"
        className="min-h-screen bg-[#ffffff] text-[#000000] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-[#f8f9fa] rounded-3xl p-8 border border-[#e0e0e0] shadow-xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <BrandLogo height={36} />
            </div>
            <h1 className="font-bold text-lg text-[#111111]">لوحة التحكم الإدارية المركزية</h1>
            <p className="text-xs text-neutral-500">
              منصة حكاية للأزياء والموضة | بوابة الإدارة والمالك العام
            </p>
          </div>

          {/* Toggle Modes */}
          <div className="flex border border-[#e0e0e0] rounded-xl p-1 bg-neutral-100 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('pin');
                setLoginError('');
                setReqSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'pin'
                  ? 'bg-[#ffffff] text-[#111111] shadow-xs'
                  : 'text-neutral-600 hover:text-[#000000]'
              }`}
            >
              رمز المرور (PIN)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError('');
                setReqSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#ffffff] text-[#111111] shadow-xs'
                  : 'text-neutral-600 hover:text-[#000000]'
              }`}
            >
              البريد الإلكتروني
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('request');
                setLoginError('');
                setReqSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'request'
                  ? 'bg-[#ffffff] text-[#111111] shadow-xs'
                  : 'text-neutral-600 hover:text-[#000000]'
              }`}
            >
              طلب انضمام
            </button>
          </div>

          {/* Feedback Messages */}
          {loginError && (
            <div className="p-3 bg-neutral-50 border border-rose-200 rounded-xl text-[#111111] text-xs font-medium text-start">
              {loginError}
            </div>
          )}

          {reqSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium text-start">
              {reqSuccessMsg}
            </div>
          )}

          {/* PIN Form (Default) */}
          {authMode === 'pin' && (
            <form onSubmit={handlePinLogin} className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  رمز المرور أو PIN الخاص بالمسؤول
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="أدخل رمز المرور (مثال: 1234)"
                    className="w-full px-4 py-3 bg-[#ffffff] border border-[#e0e0e0] rounded-xl text-sm font-mono text-[#111111] focus:outline-hidden focus:border-[#111111] transition-colors tracking-widest text-center"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 text-center">
                  الرمز الافتراضي السريع: 1234 أو كلمة مرور المالك العام
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoggingIn ? 'جاري التحقق...' : 'تأكيد ودخول لوحة التحكم'}</span>
              </button>
            </form>
          )}

          {/* Login Form */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="provalueweb@gmail.com أو admin@hkaya.store"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111] bg-neutral-50"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">كلمة المرور السرية</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111] bg-neutral-50 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoggingIn ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
              </button>
            </form>
          )}

          {/* Request Access Form */}
          {authMode === 'request' && (
            <form onSubmit={handleRequestAccess} className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">البريد الإلكتروني المهني</label>
                <input
                  type="email"
                  required
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111] bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">الاسم الرباعي أو الاسم التعريفي</label>
                <input
                  type="text"
                  required
                  value={reqDisplayName}
                  onChange={(e) => setReqDisplayName(e.target.value)}
                  placeholder="مثال: طارق المجالي (قسم المبيعات)"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111] bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">كلمة المرور المطلوبة</label>
                <input
                  type="password"
                  required
                  value={reqPassword}
                  onChange={(e) => setReqPassword(e.target.value)}
                  placeholder="6 خانات على الأقل"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111] bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">ملاحظات أو سبب الانضمام</label>
                <textarea
                  rows={2}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="مثال: مسؤول الشحن والتغليف للمستودع..."
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden bg-neutral-50"
                />
              </div>

              <button
                type="submit"
                disabled={isRequesting}
                className="w-full py-3 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isRequesting ? 'جاري الإرسال...' : 'إرسال طلب الانضمام للمالك'}</span>
              </button>
            </form>
          )}

          {/* Return to Public Storefront */}
          <div className="pt-2 border-t border-[#e0e0e0] text-center">
            <button
              onClick={() => {
                setIsAdminView(false);
                if (window.location.pathname === '/admin') {
                  window.history.pushState({}, '', '/');
                }
              }}
              className="text-xs text-neutral-500 hover:text-[#111111] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>العودة إلى واجهة المتجر الرئيسية</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Main Layout
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] flex flex-col font-sans">
      {/* Toast Notification Banner inside Admin */}
      {toast && (
        <div
          id="toast-notification-admin"
          className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md bg-[#ffffff]/95 text-[#111111] border border-[#e0e0e0] text-xs font-semibold animate-in fade-in slide-in-from-bottom-4"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-500 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Fixed Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white border-b border-[#111111] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <BrandLogo height={28} />
            <div className="hidden sm:block">
              <span className="font-bold text-sm text-white tracking-wide block">
                لوحة الإدارة المركزية
              </span>
              <span className="text-[10px] text-neutral-300 font-mono">HKAYA Control Core</span>
            </div>
          </div>

          {/* Profile Badge & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f8f9fa]/10 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#f8f9fa] text-[#111111] flex items-center justify-center font-bold text-xs">
                {currentAdmin?.displayName?.charAt(0) || 'A'}
              </div>
              <div className="text-start">
                <span className="text-xs font-bold text-white block truncate max-w-[140px]">
                  {currentAdmin?.displayName || 'المسؤول'}
                </span>
                <span className="text-[10px] text-neutral-300 font-mono block">
                  {currentAdmin?.role === 'owner' ? 'المالك العام (Owner)' : 'مسؤول (Admin)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAdminView(false);
                if (window.location.pathname === '/admin') {
                  window.history.pushState({}, '', '/');
                }
              }}
              className="px-3 py-2 bg-[#f8f9fa]/10 hover:bg-[#f8f9fa]/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="معاينة المتجر"
            >
              <span className="hidden sm:inline">معاينة المتجر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-neutral-100/60 hover:bg-[#111111] text-rose-200 rounded-xl transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#111111]/60 pt-1">
          {/* 1. Admin Management Tab - Only for Owner */}
          {currentAdmin?.role === 'owner' && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'admins'
                  ? 'border-white text-white bg-[#f8f9fa]/10'
                  : 'border-transparent text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>إدارة المسؤولين</span>
            </button>
          )}

          {/* 2. Orders Tab */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'border-white text-white bg-[#f8f9fa]/10'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبات والشحن</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#f8f9fa] text-[#111111] text-[10px] font-mono font-bold rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          {/* 3. Products Tab */}
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'border-white text-white bg-[#f8f9fa]/10'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات والمخزون</span>
            {products.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#f8f9fa]/20 text-white text-[10px] font-mono font-bold rounded-full">
                {products.length}
              </span>
            )}
          </button>

          {/* 4. Storefront CMS Tab */}
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'cms'
                ? 'border-white text-white bg-[#f8f9fa]/10'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>المحتوى والنصوص (CMS)</span>
          </button>

          {/* 5. Theme & Delivery Tab */}
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'theme'
                ? 'border-white text-white bg-[#f8f9fa]/10'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/5'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>المظهر وأجور التوصيل</span>
          </button>

          {/* 6. Security Tab */}
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'security'
                ? 'border-white text-white bg-[#f8f9fa]/10'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/5'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>حسابي والأمان</span>
          </button>
        </div>
      </header>

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'admins' && currentAdmin?.role === 'owner' && (
          <AdminManagementTab token={token} showToast={showToast} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            token={token}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onOpenAWB={(ord) => setSelectedAWBOrder(ord)}
            onRefresh={() => loadData(token)}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            token={token}
            onRefresh={() => loadData(token)}
            showToast={showToast}
          />
        )}

        {activeTab === 'cms' && (
          <CmsTab
            settings={settings}
            token={token}
            onSaveSettings={handleSaveSettings}
            showToast={showToast}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeDeliveryTab
            settings={settings}
            token={token}
            onSaveSettings={handleSaveSettings}
            showToast={showToast}
          />
        )}

        {activeTab === 'security' && (
          <SecurityTab
            currentAdmin={currentAdmin}
            token={token}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
      </main>

      {/* Printable AWB Waybill & Barcode Modal */}
      {selectedAWBOrder && (
        <AWBBarcodeModal
          order={selectedAWBOrder}
          onClose={() => setSelectedAWBOrder(null)}
        />
      )}
    </div>
  );
};


export const AdminPanel: React.FC = () => (
  <AdminErrorBoundary>
    <AdminPanelInner />
  </AdminErrorBoundary>
);
