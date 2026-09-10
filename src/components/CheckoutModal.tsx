import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { Order, CartItem, PaymentMethod } from '../types.js';
import { BrandLogo } from './BrandLogo.js';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss.js';
import {
  X,
  MapPin,
  Phone,
  User,
  Building,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Truck,
  Printer,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Barcode,
  CreditCard,
  Zap,
  Smartphone,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { JORDAN_GOVERNORATES } from '../data/jordanLocations.js';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    language,
    theme,
    savedGPSLocation,
    setSavedGPSLocation,
    customer,
    setIsCustomerAuthOpen,
    showToast,
    settings,
  } = useApp();

  const { touchHandlers, style } = useSwipeToDismiss(() => setIsCheckoutOpen(false));

  const isAr = language === 'ar';

  // Dynamic Payment Settings
  const activeCliqPhone = settings?.paymentConfig?.cliqPhone || '0778535159';
  const activeCliqAlias = settings?.paymentConfig?.cliqAlias || '0778535159';
  const activeBeneficiary = settings?.paymentConfig?.accountName || 'عبد الرزاق السعدي';
  const activeServiceName = settings?.paymentConfig?.serviceName || 'Orange Money Wallet / CliQ (محفظة أورنج ماني)';
  const activeInstructions =
    settings?.paymentConfig?.instructionsAr ||
    'قم بتحويل مبلغ الطلب إلى رقم المحفظة أعلاه من أي تطبيق بنكي أو محفظة إلكترونية، ثم أدخل رقم المرجع وأرفق صورة الإشعار لإتمام الطلب.';

  // Form Fields
  const [fullName, setFullName] = useState(customer?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber || '');
  const [governorate, setGovernorate] = useState(
    customer?.savedAddresses?.find((a) => a.isDefault)?.governorate || 'عمان'
  );
  const [streetName, setStreetName] = useState(
    customer?.savedAddresses?.find((a) => a.isDefault)?.streetName || ''
  );
  const [buildingNumber, setBuildingNumber] = useState(
    customer?.savedAddresses?.find((a) => a.isDefault)?.buildingNumber || ''
  );
  const [gpsLocation, setGpsLocation] = useState(
    customer?.savedAddresses?.find((a) => a.isDefault)?.gpsLocation || savedGPSLocation || ''
  );
  const [notes, setNotes] = useState('');

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Credit Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(customer?.fullName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'Visa' | 'MasterCard' | 'Amex' | 'Generic'>('Generic');

  // CliQ State
  const [cliqRef, setCliqRef] = useState('');
  const [copiedCliq, setCopiedCliq] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string>('');

  // E-Wallet State
  const [walletProvider, setWalletProvider] = useState<'zain' | 'orange' | 'umniah'>('orange');
  const [walletPhone, setWalletPhone] = useState(customer?.phoneNumber || '');

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Sync with customer when customer changes
  useEffect(() => {
    if (customer) {
      if (!fullName) setFullName(customer.fullName);
      if (!phoneNumber) setPhoneNumber(customer.phoneNumber);
      if (!cardHolder) setCardHolder(customer.fullName);
      if (!walletPhone) setWalletPhone(customer.phoneNumber);
      const defAddr = customer.savedAddresses?.find((a) => a.isDefault) || customer.savedAddresses?.[0];
      if (defAddr && !streetName) {
        setGovernorate(defAddr.governorate);
        setStreetName(defAddr.streetName);
        setBuildingNumber(defAddr.buildingNumber);
        if (defAddr.gpsLocation) setGpsLocation(defAddr.gpsLocation);
      }
    }
  }, [customer]);

  if (!isCheckoutOpen) return null;

  // Format Card Number (XXXX XXXX XXXX XXXX) & Detect Brand
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    if (raw.startsWith('4')) setCardBrand('Visa');
    else if (raw.startsWith('5') || raw.startsWith('2')) setCardBrand('MasterCard');
    else if (raw.startsWith('3')) setCardBrand('Amex');
    else setCardBrand('Generic');

    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const selectedGovObj = JORDAN_GOVERNORATES.find((g) => g.id === governorate) || JORDAN_GOVERNORATES[0];
  const deliveryFee = selectedGovObj.fee;
  const grandTotal = Number((subtotal + deliveryFee).toFixed(2));

  // Geolocation Auto-detect
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      showToast(isAr ? 'متصفحك لا يدعم تحديد الموقع' : 'Geolocation is not supported', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
        setGpsLocation(url);
        setSavedGPSLocation(url);
        setIsLocating(false);
        showToast(isAr ? 'تم تحديد موقعك بدقة وحفظه' : 'Location captured and saved', 'success');
      },
      () => {
        setIsLocating(false);
        showToast(
          isAr
            ? 'تعذر الوصول للموقع الجغرافي، يمكنك لصق رابط خرائط جوجل يدوياً'
            : 'Could not access GPS. You can paste Google Maps link manually.',
          'info'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const copyCliq = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedCliq(true);
    showToast(isAr ? `تم نسخ الرقم (${textToCopy}) بنجاح` : `Copied (${textToCopy})`, 'success');
    setTimeout(() => setCopiedCliq(false), 2500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(isAr ? 'حجم الصورة يجب أن لا يتجاوز 5 ميغابايت' : 'Image size must be under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const res = loadEvt.target?.result as string;
      if (res) {
        setReceiptImage(res);
        showToast(isAr ? 'تم إرفاق صورة إشعار التحويل بنجاح' : 'Receipt uploaded successfully', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const selectSavedAddress = (addr: any) => {
    setGovernorate(addr.governorate);
    setStreetName(addr.streetName);
    setBuildingNumber(addr.buildingNumber || '1');
    if (addr.gpsLocation) setGpsLocation(addr.gpsLocation);
    showToast(isAr ? `تم تطبيق عنوان "${addr.label}"` : `Applied "${addr.label}"`, 'info');
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. Flexible Name Entry Requirement
    // Accepts a single word (e.g. "محمد") or any number of names as valid input
    if (!fullName.trim()) {
      errs.fullName = isAr ? 'الاسم مطلوب يا نشمي' : 'Name is required';
    }

    // 2. Jordanian Phone Number: starts with 07, 10 digits
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!cleanPhone) {
      errs.phoneNumber = isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    } else if (!cleanPhone.match(/^(077|078|079|07)\d{7,8}$/)) {
      errs.phoneNumber = isAr
        ? 'حط رقم أردني صح يبدأ بـ 07، بدنا نرن عليك'
        : 'Valid Jordan phone required (07X XXX XXXX)';
    }

    // 3. Street & Building
    if (!streetName.trim()) {
      errs.streetName = isAr ? 'اسم الشارع مطلوب، وين ساكن؟' : 'Street name is required';
    }
    if (!buildingNumber.trim()) {
      errs.buildingNumber = isAr ? 'رقم العمارة مطلوب' : 'Building number is required';
    }

    // 4. Payment specific validation
    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        errs.card = isAr ? 'رقم البطاقة غير مكتمل' : 'Invalid card number';
      }
      if (!cardHolder.trim()) {
        errs.cardHolder = isAr ? 'اسم حامل البطاقة مطلوب' : 'Cardholder name required';
      }
      if (cardExpiry.length < 5) {
        errs.cardExpiry = isAr ? 'تاريخ الانتهاء غير مكتمل' : 'Invalid expiry';
      }
      if (cardCvv.length < 3) {
        errs.cardCvv = isAr ? 'رمز الأمان (CVV) غير صالح' : 'Invalid CVV';
      }
    } else if (paymentMethod === 'cliq') {
      if (!cliqRef.trim()) {
        errs.cliqRef = isAr ? 'يرجى إدخال الرقم المرجعي لحوالة كليك بعد إرسالها' : 'CliQ reference required';
      }
    } else if (paymentMethod === 'wallet') {
      const cleanWPhone = walletPhone.replace(/\s+/g, '');
      if (!cleanWPhone.match(/^(077|078|079|07)\d{7,8}$/)) {
        errs.walletPhone = isAr ? 'رقم المحفظة غير صحيح' : 'Invalid wallet phone number';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (cart.length === 0) {
      showToast(isAr ? 'السلة فارغة' : 'Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let transactionRef = '';
      let paymentStatus: 'paid' | 'pending' | 'cod' = paymentMethod === 'cod' ? 'cod' : 'paid';

      // 1. Process Gateway if online payment
      if (paymentMethod === 'card') {
        const payRes = await fetch('/api/payment/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: grandTotal,
            cardNumber: cardNumber.replace(/\s+/g, ''),
            cardholderName: cardHolder,
            expiryMonth: cardExpiry.split('/')[0],
            expiryYear: cardExpiry.split('/')[1],
            cvv: cardCvv,
          }),
        });
        const payData = await payRes.json();
        if (!payRes.ok || !payData.success) {
          throw new Error(payData.error || (isAr ? 'فشلت عملية الدفع بالبطاقة' : 'Card payment failed'));
        }
        transactionRef = payData.transactionRef;
      } else if (paymentMethod === 'cliq' || paymentMethod === 'wallet') {
        const cliqRes = await fetch('/api/payment/cliq-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            alias: activeCliqAlias,
            phone: activeCliqPhone,
            accountName: activeBeneficiary,
            transactionRef: cliqRef,
            amount: grandTotal,
            receiptImage: receiptImage || undefined,
          }),
        });
        const cliqData = await cliqRes.json();
        transactionRef = cliqData.transactionRef || cliqRef;
      } else if (paymentMethod === 'applepay') {
        const aplRes = await fetch('/api/payment/apple-pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: grandTotal }),
        });
        const aplData = await aplRes.json();
        transactionRef = aplData.transactionRef;
      }

      // 2. Create Order in Database
      const orderPayload = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        governorate,
        streetName: streetName.trim(),
        buildingNumber: buildingNumber.trim(),
        gpsLocation: gpsLocation.trim(),
        notes: notes.trim(),
        customerId: customer?.id,
        paymentMethod,
        paymentStatus,
        transactionRef,
        receiptImage: receiptImage || undefined,
        items: cart.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
          image: i.product.image,
        })),
        subtotal,
        deliveryFee,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit order');
      }

      const createdOrder: Order = await res.json();
      setCompletedOrder(createdOrder);
      clearCart();
      showToast(isAr ? 'ألف مبروك! استلمنا طلبك وبنتصل فيك قريباً يا كشخة' : 'Order placed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || (isAr ? 'حدث خطأ أثناء إتمام الطلب' : 'Error submitting order'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="modal-backdrop-overlay bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutOpen(false);
      }}
    >
      {/* Container: Native Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div
        id="checkout-modal-container"
        style={style}
        className="modal-content-wrapper modal-body-scroll w-full sm:max-w-2xl bg-[#f8f9fa] text-[#111111] border-t sm:border border-[#e0e0e0] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up-sheet sm:animate-scale-in flex flex-col"
      >
        {/* Interactive Top Drag Handle */}
        <div 
          className="w-full flex justify-center items-center pt-3 pb-2 cursor-pointer select-none touch-none hover:opacity-80 transition-opacity"
          onClick={() => setIsCheckoutOpen(false)}
          role="button"
          aria-label={isAr ? 'إغلاق نافذة الطلب' : 'Close checkout'}
          {...touchHandlers}
        >
          <div className="w-12 h-1.5 bg-neutral-400 hover:bg-neutral-600 rounded-full transition-colors pointer-events-none" />
        </div>

        {/* Modal Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0] bg-[#F8F9FA] cursor-pointer sm:cursor-default"
          {...touchHandlers}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white border border-[#111111]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-luxury font-bold text-base sm:text-lg text-[#111111]">
                {completedOrder
                  ? isAr ? 'إيصال تأكيد الطلب الملكي' : 'Royal Order Receipt'
                  : isAr ? 'إتمام الطلب وبوابات الدفع' : 'Secure Checkout & Delivery'}
              </h2>
            </div>
          </div>
          <button
            id="btn-close-checkout"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-neutral-500 hover:text-[#111111] rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-130px)] space-y-5 no-scrollbar">
          {completedOrder ? (
            /* Order Confirmation Receipt */
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#F8F9FA]/20 text-neutral-800 flex items-center justify-center mx-auto border border-neutral-900/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <h2 className="font-luxury font-bold text-xl sm:text-2xl text-neutral-800">
                  {isAr ? 'تم تأكيد طلبك بنجاح واستلمناه يا كشخة!' : 'Order Placed Successfully!'}
                </h2>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  {isAr
                    ? `شكراً لاختيارك حكاية. رقم طلبك هو (${completedOrder.orderNumber}). سنتواصل معك هاتفياً على رقم ${completedOrder.phoneNumber} لتسليم الشحنة.`
                    : `Thank you for choosing HKAYA. Your order number is ${completedOrder.orderNumber}.`}
                </p>
              </div>

              {/* Printable Invoice & AWB Card */}
              <div
                id="printable-awb-modal"
                className="p-5 rounded-2xl bg-neutral-50 border border-[#e0e0e0] text-start space-y-4 text-xs text-neutral-600"
              >
                <div className="flex items-center justify-between border-b pb-3 border-[#e0e0e0]">
                  <div className="flex items-center gap-3">
                    <BrandLogo size="xs" />
                    <div>
                      <div className="font-bold text-sm font-mono text-[#111111]">{completedOrder.orderNumber}</div>
                      <div className="text-neutral-500 text-[11px]">
                        {new Date(completedOrder.createdAt).toLocaleString(isAr ? 'ar-JO' : 'en-US')}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#111111] text-white border border-[#111111]">
                    {completedOrder.statusAr}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'المستلم:' : 'Recipient:'}</span>
                    <span className="font-bold text-[#111111]">{completedOrder.fullName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'رقم الهاتف:' : 'Phone:'}</span>
                    <span className="font-bold font-mono text-[#111111]">{completedOrder.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'المحافظة:' : 'Governorate:'}</span>
                    <span className="font-bold text-[#111111]">{completedOrder.governorate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'طريقة الدفع:' : 'Payment:'}</span>
                    <span className="font-bold text-neutral-800">
                      {completedOrder.paymentMethod === 'card' && (isAr ? 'بطاقة ائتمان (مدفوع)' : 'Credit Card (Paid)')}
                      {completedOrder.paymentMethod === 'cliq' && (isAr ? 'كليك CliQ (مدفوع)' : 'CliQ Transfer')}
                      {completedOrder.paymentMethod === 'wallet' && (isAr ? 'محفظة إلكترونية' : 'E-Wallet')}
                      {completedOrder.paymentMethod === 'applepay' && 'Apple Pay'}
                      {(!completedOrder.paymentMethod || completedOrder.paymentMethod === 'cod') &&
                        (isAr ? 'دفع عند الاستلام (COD)' : 'Cash on Delivery')}
                    </span>
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="border-t border-b border-[#e0e0e0] py-3 space-y-2">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-[#111111]">
                        {item.title} <span className="text-neutral-500 font-mono">({item.selectedSize}) × {item.quantity}</span>
                      </span>
                      <span className="font-bold font-mono text-neutral-800">
                        {(item.price * item.quantity).toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span className="font-mono">{completedOrder.subtotal.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>{isAr ? 'أجور التوصيل المعتمدة:' : 'Delivery Fee:'}</span>
                    <span className="font-mono">{completedOrder.deliveryFee.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#111111] pt-1 border-t border-[#e0e0e0]">
                    <span>{isAr ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                    <span className="font-mono text-neutral-800 text-base">
                      {completedOrder.total.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}
                    </span>
                  </div>
                </div>

                {/* AWB Code128 Mock Barcode Display */}
                <div className="pt-3 border-t border-[#e0e0e0] flex flex-col items-center justify-center space-y-1">
                  <div className="font-mono tracking-widest text-[11px] text-neutral-500">
                    {completedOrder.awbBarcode}
                  </div>
                  <svg className="w-52 h-10" viewBox="0 0 200 40">
                    {Array.from({ length: 45 }).map((_, i) => (
                      <rect
                        key={i}
                        x={i * 4.4 + 2}
                        y="2"
                        width={i % 3 === 0 ? 3 : 1.5}
                        height="36"
                        fill="#E5E5E5"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl border border-[#333333] text-xs font-semibold flex items-center gap-2 hover:bg-neutral-800 text-[#111111] cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isAr ? 'طباعة الفاتورة والباركود' : 'Print Invoice'}</span>
                </button>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    setIsCheckoutOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  {isAr ? 'العودة للتسوق' : 'Back to Store'}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {/* Customer quick sign in banner */}
              {!customer ? (
                <div className="p-3 bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsCustomerAuthOpen(true)}
                    className="px-6 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs rounded-xl font-medium transition-colors"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                </div>
              ) : (
                customer.savedAddresses && customer.savedAddresses.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-600 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                      <span>{isAr ? 'اختر من عناويني المحفوظة سريعاً:' : 'Quick select saved address:'}</span>
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {customer.savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => selectSavedAddress(addr)}
                          className={`px-3 py-1.5 rounded-xl border text-xs text-start shrink-0 transition-all ${
                            streetName === addr.streetName
                              ? 'bg-[#111111] border-[#111111] text-white'
                              : 'bg-[#f8f9fa] border-[#e0e0e0] text-neutral-600 hover:border-neutral-500'
                          }`}
                        >
                          <span className="font-bold block">{addr.label}</span>
                          <span className="text-[10px] text-neutral-500">{addr.governorate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* 1. Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-900" />
                  <span>{isAr ? 'الاسم*' : 'Name*'}</span>
                </label>
                <input
                  id="input-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#111111] focus:outline-none ${
                    errors.fullName ? 'border-neutral-900 bg-neutral-50' : 'border-[#e0e0e0] bg-[#f8f9fa] focus:border-[#111111]'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-neutral-900">{errors.fullName}</p>}
              </div>

              {/* 2. Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-900" />
                  <span>{isAr ? 'رقم الهاتف الخلوي (أردني)*' : 'Jordan Phone*'}</span>
                </label>
                <input
                  id="input-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono text-[#111111] focus:outline-none ${
                    errors.phoneNumber ? 'border-neutral-900 bg-neutral-50' : 'border-[#e0e0e0] bg-[#f8f9fa] focus:border-[#111111]'
                  }`}
                />
                {errors.phoneNumber && <p className="text-[11px] text-neutral-900">{errors.phoneNumber}</p>}
              </div>

              {/* 3. Governorate */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-900" />
                  <span>{isAr ? 'المحافظة*' : 'Governorate*'}</span>
                </label>
                <select
                  id="select-governorate"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e0e0e0] bg-[#f8f9fa] text-xs text-[#111111] focus:outline-none cursor-pointer"
                >
                  {JORDAN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {isAr ? gov.nameAr : gov.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Street & Building */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-900" />
                    <span>{isAr ? 'اسم الشارع والحي*' : 'Street Name & Area*'}</span>
                  </label>
                  <input
                    id="input-street"
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder={isAr ? 'مثال: شارع المدينة المنورة - حي التلاع' : 'e.g. Madina St. - Tlaa Al Ali'}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#111111] focus:outline-none ${
                      errors.streetName ? 'border-neutral-900 bg-neutral-50' : 'border-[#e0e0e0] bg-[#f8f9fa] focus:border-[#111111]'
                    }`}
                  />
                  {errors.streetName && <p className="text-[11px] text-neutral-900">{errors.streetName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-900" />
                    <span>{isAr ? 'رقم العمارة / الشقة*' : 'Building / Apt Number*'}</span>
                  </label>
                  <input
                    id="input-building"
                    type="text"
                    value={buildingNumber}
                    onChange={(e) => setBuildingNumber(e.target.value)}
                    placeholder={isAr ? 'مثال: عمارة 12 - الطابق الثاني' : 'e.g. Building 12 - 2nd Floor'}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#111111] focus:outline-none ${
                      errors.buildingNumber ? 'border-neutral-900 bg-neutral-50' : 'border-[#e0e0e0] bg-[#f8f9fa] focus:border-[#111111]'
                    }`}
                  />
                  {errors.buildingNumber && <p className="text-[11px] text-neutral-900">{errors.buildingNumber}</p>}
                </div>
              </div>

              {/* 5. GPS Location with Auto-Detect */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-neutral-900" />
                    <span>{isAr ? 'رابط الموقع الجغرافي (GPS)' : 'Google Maps GPS Link'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoLocate}
                    disabled={isLocating}
                    className="text-xs font-bold text-neutral-800 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? (isAr ? 'جاري التحديد...' : 'Locating...') : (isAr ? 'تحديد موقعي الآن' : 'Auto-Locate')}</span>
                  </button>
                </div>
                <input
                  id="input-gps"
                  type="url"
                  value={gpsLocation}
                  onChange={(e) => setGpsLocation(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e0e0e0] bg-[#f8f9fa] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* 6. PAYMENT GATEWAY SELECTION */}
              <div className="pt-2 border-t border-[#e0e0e0] space-y-3">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', width: '100%', fontWeight: 600, textAlign: 'center', marginBottom: '12px', fontSize: '0.95rem' }} className="text-[#111111]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? 'معاملات مشفرة 100%' : '100% Encrypted Transactions'}</span>
                </div>

                
                {/* Method Options Info Strip */}
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#e0e0e0] text-[#111111] text-center shadow-inner">
                  <p className="text-xs font-bold leading-relaxed">
                    {isAr ? 'جميع طرق الدفع متوفرة عند التوصيل (نقداً، بطاقة بنكية POS، كليك CliQ، أو محفظة إلكترونية مع الكابتن).' : 'All payment methods are available on delivery (Cash, POS Card, CliQ, or E-Wallet with the driver).'}
                  </p>
                </div>
              </div>
              {/* Order Cost Summary Box */}
              <div className="p-4 rounded-2xl bg-neutral-50 space-y-2 border border-[#e0e0e0]">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{isAr ? 'المجموع الفرعي للقطع:' : 'Items Subtotal:'}</span>
                  <span className="font-mono">{subtotal.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{isAr ? `أجور التوصيل (${governorate}):` : `Delivery Fee (${governorate}):`}</span>
                  <span className="font-bold text-[#111111] font-mono">{deliveryFee.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#e0e0e0]">
                  <span>{isAr ? 'المجموع الكلي للطلب:' : 'Grand Total:'}</span>
                  <span className="font-mono text-neutral-800 text-base">{grandTotal.toFixed(2)} {isAr ? 'د.أ' : 'JOD'}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-order"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-widest active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xl border border-[#111111] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? `تأكيد وإتمام الطلب (${grandTotal.toFixed(2)} د.أ)` : `Place Order (${grandTotal.toFixed(2)} JOD)`}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
