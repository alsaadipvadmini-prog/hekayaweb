import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { storage } from '../utils/storage.js';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  CreditCard,
  Building,
  Navigation,
  Sparkles,
  Barcode,
  ExternalLink,
} from 'lucide-react';
import { Order, SavedAddress } from '../types.js';
import { JORDAN_GOVERNORATES } from '../data/jordanLocations.js';

export const CustomerProfileDrawer: React.FC = () => {
  const {
    customer,
    isCustomerProfileOpen,
    setIsCustomerProfileOpen,
    logoutCustomer,
    refreshCustomerProfile,
    saveCustomerAddress,
    deleteCustomerAddress,
    showToast,
    language,
  } = useApp();

  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'details'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Add Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('المنزل');
  const [newAddrGov, setNewAddrGov] = useState('عمان');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrBuilding, setNewAddrBuilding] = useState('');
  const [newAddrGPS, setNewAddrGPS] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);
  const [isGettingGPS, setIsGettingGPS] = useState(false);

  // Edit profile state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Load customer orders
  useEffect(() => {
    if (isCustomerProfileOpen && customer) {
      setEditName(customer.fullName);
      setEditPhone(customer.phoneNumber);
      fetchCustomerOrders();
    }
  }, [isCustomerProfileOpen, customer]);

  const fetchCustomerOrders = async () => {
    const token = storage.get<string>('hkaya_customer_token', '');
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/auth/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isCustomerProfileOpen || !customer) return null;

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      showToast(isAr ? 'متصفحك لا يدعم تحديد الموقع' : 'Geolocation not supported', 'error');
      return;
    }
    setIsGettingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingGPS(false);
        const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setNewAddrGPS(link);
        showToast(isAr ? 'تم سحب إحداثيات موقعك بنجاح' : 'GPS location captured', 'success');
      },
      () => {
        setIsGettingGPS(false);
        showToast(isAr ? 'يرجى تفعيل صلاحية الوصول للموقع' : 'Location permission denied', 'error');
      }
    );
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) {
      showToast(isAr ? 'يرجى كتابة اسم الشارع أو المعلم القريب' : 'Street name required', 'error');
      return;
    }

    const success = await saveCustomerAddress({
      label: newAddrLabel || 'عنواني',
      governorate: newAddrGov,
      streetName: newAddrStreet,
      buildingNumber: newAddrBuilding || '1',
      gpsLocation: newAddrGPS,
      isDefault: newAddrIsDefault,
    });

    if (success) {
      setShowAddAddress(false);
      setNewAddrStreet('');
      setNewAddrBuilding('');
      setNewAddrGPS('');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = storage.get<string>('hkaya_customer_token', '');
    if (!token) return;
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: editName, phoneNumber: editPhone }),
      });
      if (res.ok) {
        await refreshCustomerProfile();
        showToast(isAr ? 'تم تحديث بياناتك بنجاح' : 'Profile updated successfully', 'success');
      }
    } catch {
      showToast(isAr ? 'حدث خطأ في الحفظ' : 'Save failed', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-950/40 text-amber-300 border-amber-800',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: isAr ? 'بانتظار التأكيد' : 'Pending Confirmation',
        };
      case 'processing':
        return {
          bg: 'bg-blue-950/40 text-blue-300 border-blue-800',
          icon: <PackageCheck className="w-3.5 h-3.5" />,
          label: isAr ? 'قيد التجهيز والتغليف' : 'Processing & Packing',
        };
      case 'shipped':
        return {
          bg: 'bg-purple-950/40 text-purple-300 border-purple-800',
          icon: <Truck className="w-3.5 h-3.5" />,
          label: isAr ? 'خرج للتوصيل' : 'Out for Delivery',
        };
      case 'completed':
        return {
          bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: isAr ? 'تم التسليم بنجاح' : 'Delivered',
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-600 border-[#e0e0e0]',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: status,
        };
    }
  };

  return (
    <div
      id="customer-profile-overlay"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCustomerProfileOpen(false);
      }}
    >
      {/* Bottom sheet container on mobile / dialog on desktop */}
      <div
        id="customer-profile-drawer"
        className="w-full sm:max-w-2xl bg-[#f8f9fa] text-[#111111] border-t sm:border border-[#e0e0e0] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up-sheet sm:animate-scale-in max-h-[92vh] flex flex-col"
      >
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0] bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111111] to-[#111111] text-[#111111] flex items-center justify-center font-bold text-base shadow-md">
              {customer.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-luxury font-bold text-base sm:text-lg text-[#111111]">
                  {customer.fullName}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-[#111111] text-rose-200 border border-[#111111] rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {isAr ? 'عضو كشخة' : 'VIP Member'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {customer.phoneNumber} • {customer.email}
              </p>
            </div>
          </div>
          <button
            id="close-profile-btn"
            onClick={() => setIsCustomerProfileOpen(false)}
            className="p-2 text-neutral-500 hover:text-[#111111] rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e0e0e0] bg-[#F8F9FA]">
          <button
            id="profile-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === 'orders' ? 'text-[#111111] bg-neutral-50' : 'text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAr ? 'طلباتي ومشترياتي' : 'My Orders'}</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-[#111111] text-white rounded-full">
                {orders.length}
              </span>
            )}
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />}
          </button>

          <button
            id="profile-tab-addresses"
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === 'addresses' ? 'text-[#111111] bg-neutral-50' : 'text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isAr ? 'عناويني المحفوظة' : 'Addresses'}</span>
            {customer.savedAddresses?.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-neutral-700 text-[#111111] rounded-full">
                {customer.savedAddresses.length}
              </span>
            )}
            {activeTab === 'addresses' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />}
          </button>

          <button
            id="profile-tab-details"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === 'details' ? 'text-[#111111] bg-neutral-50' : 'text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isAr ? 'بيانات الحساب' : 'Account'}</span>
            {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-160px)] space-y-4 no-scrollbar">
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral-500">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">{isAr ? 'جاري جلب سجل طلباتك...' : 'Loading your orders...'}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#e0e0e0] rounded-2xl p-6 space-y-3">
                  <div className="w-12 h-12 bg-[#F8F9FA] border border-[#e0e0e0] rounded-full flex items-center justify-center mx-auto text-neutral-500">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#111111] text-sm">
                    {isAr ? 'ما عندك طلبات سابقة لسه يا كشخة' : 'No orders placed yet'}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    {isAr
                      ? 'استكشف كولكشن حكاية الملكي وفصّل طلبك لنوصله لباب بيتك فوراً'
                      : 'Explore HKAYA royal collection and place your first exclusive order.'}
                  </p>
                  <button
                    onClick={() => setIsCustomerProfileOpen(false)}
                    className="px-5 py-2.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white text-xs font-medium rounded-xl transition-colors"
                  >
                    {isAr ? 'تسوق الكولكشن الآن' : 'Start Shopping'}
                  </button>
                </div>
              ) : (
                orders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-neutral-50 border border-[#e0e0e0] rounded-2xl p-4 sm:p-5 space-y-3.5 hover:border-[#111111]/60 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e0e0e0]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#111111] tracking-wide">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-JO' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-900" />
                            <span>{order.governorate} - {order.streetName}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div
                          className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{order.statusAr || badge.label}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 bg-[#f8f9fa] p-2.5 rounded-xl border border-[#1E1E1E]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-10 rounded-lg object-cover bg-[#F8F9FA] border border-[#e0e0e0] shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                                  <ShoppingBag className="w-4 h-4 text-neutral-500" />
                                </div>
                              )}
                              <div className="truncate">
                                <p className="text-xs font-medium text-[#111111] truncate">{item.title}</p>
                                <p className="text-[11px] text-neutral-500">
                                  {isAr ? 'المقاس:' : 'Size:'} {item.selectedSize} • {isAr ? 'الكمية:' : 'Qty:'} {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[#111111] shrink-0">
                              {(item.price * item.quantity).toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Payment Info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e0e0e0] text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500">
                            {isAr ? 'طريقة الدفع:' : 'Payment:'}
                          </span>
                          <span className="text-[#111111] font-medium bg-[#222222] px-2 py-0.5 rounded text-[11px]">
                            {order.paymentMethod === 'card' && (isAr ? 'بطاقة ائتمان (مدفوع)' : 'Credit Card (Paid)')}
                            {order.paymentMethod === 'cliq' && (isAr ? 'كليك CliQ (مدفوع)' : 'CliQ Transfer (Paid)')}
                            {order.paymentMethod === 'wallet' && (isAr ? 'محفظة إلكترونية' : 'E-Wallet')}
                            {order.paymentMethod === 'applepay' && 'Apple Pay'}
                            {(!order.paymentMethod || order.paymentMethod === 'cod') && (isAr ? 'دفع عند الاستلام' : 'Cash on Delivery')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-neutral-500">
                            {isAr ? 'الإجمالي:' : 'Total:'}
                          </span>
                          <span className="text-base font-bold text-[#111111] font-mono">
                            {order.total.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
                          </span>
                        </div>
                      </div>

                      {/* Barcode & Tracking Tag */}
                      <div className="bg-[#F8F9FA] px-3 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Barcode className="w-3.5 h-3.5 text-neutral-600" />
                          {order.awbBarcode}
                        </span>
                        <span className="text-neutral-500">
                          {isAr ? 'تتبع فوري مع كابتن التوصيل' : 'Live Jordan courier track'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 2. SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-neutral-600">
                  {isAr ? 'دفتر العناوين المحفوظة' : 'Saved Delivery Locations'}
                </h4>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="px-3 py-1.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة عنوان جديد' : 'Add Address'}</span>
                  </button>
                )}
              </div>

              {/* Add address sub-form */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddNewAddress}
                  className="bg-[#ffffff] border border-[#e0e0e0] rounded-2xl p-4 space-y-3 animate-fade-in shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#e0e0e0]">
                    <span className="text-xs font-bold text-[#111111]">
                      {isAr ? 'بيانات العنوان الجديد' : 'New Address Details'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="text-neutral-500 hover:text-[#111111]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">
                        {isAr ? 'تسمية العنوان' : 'Label'}
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'مثال: المنزل، المكتب، الشاليه' : 'Home, Office...'}
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">
                        {isAr ? 'المحافظة' : 'Governorate'} *
                      </label>
                      <select
                        value={newAddrGov}
                        onChange={(e) => setNewAddrGov(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none"
                      >
                        {JORDAN_GOVERNORATES.map((gov) => (
                          <option key={gov.id} value={gov.nameAr}>
                            {isAr ? gov.nameAr : gov.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">
                        {isAr ? 'اسم الشارع / الحي / المعلم' : 'Street / Area'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: شارع المدينة المنورة - قرب دوار الواحة' : 'Street name'}
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">
                        {isAr ? 'رقم العمارة / الشقة' : 'Building / Flat'}
                      </label>
                      <input
                        type="text"
                        placeholder="14"
                        value={newAddrBuilding}
                        onChange={(e) => setNewAddrBuilding(e.target.value)}
                        className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* GPS Grabber */}
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {isAr ? 'موقع GPS دقيق للتوصيل (Google Maps)' : 'GPS Pin Link'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://maps.google.com/?q=..."
                        value={newAddrGPS}
                        onChange={(e) => setNewAddrGPS(e.target.value)}
                        className="flex-1 bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleGetGPS}
                        disabled={isGettingGPS}
                        className="px-3 py-2 bg-[#f8f9fa] hover:bg-neutral-100 border border-[#e0e0e0] rounded-xl text-xs text-[#111111] flex items-center gap-1 transition-colors"
                      >
                        <Navigation className={`w-3.5 h-3.5 ${isGettingGPS ? 'animate-spin' : ''}`} />
                        <span>{isAr ? 'موقعي الآن' : 'Locate'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddrIsDefault}
                        onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                        className="accent-[#111111] w-4 h-4 rounded"
                      />
                      <span>{isAr ? 'تعيين كعنوان افتراضي للطلبات القادمة' : 'Set as default address'}</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 text-xs text-neutral-500 hover:text-[#111111]"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-medium"
                      >
                        {isAr ? 'حفظ العنوان' : 'Save Address'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* List saved addresses */}
              {customer.savedAddresses?.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-[#e0e0e0] rounded-xl text-neutral-500 text-xs">
                  {isAr ? 'لم تقم بحفظ أي عناوين بعد. اضغط "إضافة عنوان جديد" بالأعلى.' : 'No saved addresses yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customer.savedAddresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-neutral-50 border border-[#e0e0e0] rounded-xl p-3.5 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-neutral-900" />
                          <span className="font-bold text-xs text-[#111111]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                              {isAr ? 'افتراضي' : 'Default'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteCustomerAddress(addr.id)}
                          className="p-1 text-neutral-500 hover:text-[#111111] rounded transition-colors"
                          title={isAr ? 'حذف العنوان' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {addr.governorate} - {addr.streetName} {addr.buildingNumber ? `(عمارة ${addr.buildingNumber})` : ''}
                      </p>

                      {addr.gpsLocation && (
                        <a
                          href={addr.gpsLocation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-800 hover:text-rose-200"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>{isAr ? 'عرض الموقع على الخريطة' : 'View on Maps'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ACCOUNT DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1 font-medium">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1 font-medium">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1 font-medium">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      disabled
                      value={customer.email}
                      className="w-full bg-[#f0f0f0] border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {savingProfile ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
                </button>
              </form>

              {/* Logout button */}
              <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#111111]">
                    {isAr ? 'تسجيل الخروج من الحساب' : 'Sign Out'}
                  </h5>
                  <p className="text-[11px] text-neutral-500">
                    {isAr ? 'يمكنك العودة وتسجيل الدخول في أي وقت' : 'You can log back in anytime'}
                  </p>
                </div>
                <button
                  id="profile-logout-btn"
                  onClick={logoutCustomer}
                  className="px-4 py-2 bg-red-950/40 hover:bg-[#111111]/60 border border-red-800 text-red-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
