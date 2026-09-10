import React from 'react';
import { Order } from '../../types.js';
import { Printer, X, MapPin, Phone, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../BrandLogo.js';
import { printShippingLabel } from '../../utils/printShippingLabel.js';

interface AWBBarcodeModalProps {
  order: Order | null;
  onClose: () => void;
}

// Inline pure SVG Barcode generator (Code128 style representation)
const BarcodeSVG: React.FC<{ text: string; height?: number }> = ({ text, height = 48 }) => {
  // Deterministic pattern generator based on string chars
  const bars: { width: number; isBlack: boolean }[] = [];
  const clean = text.toUpperCase().replace(/[^A-Z0-9-]/g, '') || 'AWB-1001';

  // Start guard
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 2, isBlack: false });

  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    const pattern = [(code % 3) + 1, ((code >> 1) % 3) + 1, ((code >> 2) % 3) + 1, ((code >> 3) % 2) + 1];
    pattern.forEach((w, idx) => {
      bars.push({ width: w, isBlack: idx % 2 === 0 });
    });
    bars.push({ width: 1, isBlack: false });
  }

  // Stop guard
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });

  const totalWidth = bars.reduce((sum, b) => sum + b.width, 0);

  let currentX = 0;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full max-w-[280px] h-12"
        preserveAspectRatio="none"
      >
        {bars.map((bar, i) => {
          const rect = bar.isBlack ? (
            <rect
              key={i}
              x={currentX}
              y={0}
              width={bar.width}
              height={height}
              fill="#000000"
            />
          ) : null;
          currentX += bar.width;
          return rect;
        })}
      </svg>
      <span className="font-mono text-xs font-bold tracking-widest text-[#000000] mt-1">
        *{text}*
      </span>
    </div>
  );
};

export const AWBBarcodeModal: React.FC<AWBBarcodeModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    if (!order) return;
    printShippingLabel(order);
  };

  const barcodeCode = order.awbBarcode || `HK-AWB-${order.orderNumber.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6)}`;

  return (
    <div
      id="awb-modal-overlay"
      className="modal-backdrop-overlay bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="awb-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="modal-content-wrapper modal-body-scroll w-full max-w-2xl bg-[#f8f9fa] text-[#000000] rounded-2xl shadow-2xl border border-[#e0e0e0] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Top Bar (Hidden during print) */}
        <div className="no-print bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-[#111111]">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-white/80" />
            <div>
              <h3 className="font-bold text-sm text-white">بوليصة الشحن السريع والباركود (AWB)</h3>
              <p className="text-[11px] text-neutral-300 font-mono">الطلب رقم: {order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#f8f9fa] text-[#111111] hover:bg-neutral-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوليصة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-300 hover:text-white hover:bg-[#f8f9fa]/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Shipping Label / Waybill Document */}
        <div id="printable-awb-sheet" className="p-6 sm:p-8 space-y-6 text-[#000000] bg-[#f8f9fa] font-sans">
          {/* Header & Sender Info */}
          <div className="flex items-center justify-between border-b-2 border-[#000000] pb-4">
            <div className="space-y-1 text-start">
              <div className="flex items-center gap-2">
                <BrandLogo height={28} />
                <span className="font-bold text-base tracking-wide text-[#111111]">حكاية للأزياء والموضة</span>
              </div>
              <p className="text-xs text-neutral-600">المملكة الأردنية الهاشمية - عمان</p>
              <p className="text-xs text-neutral-600 font-mono">هاتف الإدارة: 0798123456</p>
            </div>

            <div className="text-end">
              <span className="inline-block px-2.5 py-1 bg-[#111111] text-white text-[11px] font-bold rounded-sm mb-1">
                شحنة تجارة إلكترونية سريعة
              </span>
              <div className="text-xs text-neutral-500 font-mono">
                {new Date(order.createdAt).toLocaleDateString('ar-JO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Barcode Center Slot */}
          <div className="py-3 px-4 bg-neutral-50 border border-dashed border-neutral-400 rounded-lg flex flex-col items-center justify-center">
            <BarcodeSVG text={barcodeCode} height={52} />
          </div>

          {/* Customer & Delivery Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#e0e0e0] rounded-xl p-4 bg-neutral-50/50">
            <div className="space-y-2 text-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                بيانات المستلم (العميل):
              </span>
              <p className="font-bold text-sm text-[#000000]">{order.fullName}</p>
              <p className="font-mono text-xs font-bold text-[#111111] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>{order.phoneNumber}</span>
              </p>
              <p className="text-xs text-neutral-700 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <span>
                  محافظة {order.governorate} - {order.streetName} - عمارة {order.buildingNumber}
                </span>
              </p>
            </div>

            <div className="space-y-2 text-start border-t sm:border-t-0 sm:border-r sm:pr-4 border-[#e0e0e0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                تفاصيل الشحن والتحصيل:
              </span>
              <div className="flex items-center justify-between text-xs py-1 border-b border-[#e0e0e0]">
                <span className="text-neutral-600">طريقة الدفع:</span>
                <span className="font-bold">
                  {order.paymentMethod === 'card'
                    ? 'بطاقة دفع إلكتروني (Visa / Mastercard)'
                    : order.paymentMethod === 'cliq'
                    ? 'حوالة CliQ (مدفوع)'
                    : order.paymentMethod === 'applepay'
                    ? 'Apple Pay (مدفوع)'
                    : order.paymentMethod === 'wallet'
                    ? 'المحفظة الإلكترونية (مدفوع)'
                    : 'دفع عند الاستلام (COD)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-[#e0e0e0]">
                <span className="text-neutral-600">أجور التوصيل:</span>
                <span className="font-mono font-bold">{order.deliveryFee.toFixed(2)} د.أ</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="font-bold text-[#111111]">المبلغ المطلوب تحصيله:</span>
                <span className="font-mono font-extrabold text-base text-[#111111]">
                  {order.paymentStatus === 'paid' ? '0.00 د.أ (مدفوع مسبقاً)' : `${order.total.toFixed(2)} د.أ`}
                </span>
              </div>
            </div>
          </div>

          {/* Items Breakdown Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block text-start">
              محتويات الشحنة ({order.items.length} قطع):
            </span>
            <div className="border border-[#e0e0e0] rounded-lg overflow-hidden">
              <table className="w-full text-xs text-start">
                <thead className="bg-neutral-100 text-neutral-700 border-b border-[#e0e0e0] font-bold">
                  <tr>
                    <th className="py-2 px-3 text-start">المنتج والوصف</th>
                    <th className="py-2 px-3 text-center">المقاس</th>
                    <th className="py-2 px-3 text-center">اللون</th>
                    <th className="py-2 px-3 text-center">الكمية</th>
                    <th className="py-2 px-3 text-end">السعر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="py-2 px-3 font-medium text-[#000000]">{item.title}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold">{item.selectedSize || '-'}</td>
                      <td className="py-2 px-3 text-center">
                        {item.selectedColor ? (
                          <div className="flex items-center justify-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full border border-neutral-400"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="py-2 px-3 text-end font-mono font-bold">
                        {(item.price * item.quantity).toFixed(2)} د.أ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GPS Coordinates & Instructions Box */}
          {order.gpsLocation && (
            <div className="p-3 bg-neutral-100 border border-[#e0e0e0] rounded-lg text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#111111]" />
                <span className="font-medium text-neutral-700">إحداثيات وموقع العميل (GPS):</span>
              </div>
              <a
                href={order.gpsLocation}
                target="_blank"
                rel="noreferrer"
                className="text-[#111111] underline font-mono font-bold text-xs"
              >
                فتح الموقع على خرائط Google
              </a>
            </div>
          )}

          {order.notes && (
            <div className="p-3 bg-neutral-50 border border-[#e0e0e0] rounded-lg text-xs text-start">
              <span className="font-bold text-neutral-700 block mb-0.5">ملاحظات العميل والتوصيل:</span>
              <p className="text-neutral-600">{order.notes}</p>
            </div>
          )}

          {/* Footer Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-[#e0e0e0] text-xs text-neutral-600">
            <div className="text-start">
              <p className="font-bold text-neutral-800">توقيع واستلام كابتن التوصيل:</p>
              <div className="h-10 border-b border-dashed border-neutral-400 mt-2" />
            </div>
            <div className="text-start">
              <p className="font-bold text-neutral-800">توقيع المستلم (العميل):</p>
              <div className="h-10 border-b border-dashed border-neutral-400 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
