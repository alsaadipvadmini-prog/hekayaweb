import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types.js';
import { printShippingLabel } from '../../utils/printShippingLabel.js';
import {
  ShoppingBag,
  Search,
  Printer,
  Trash2,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  CreditCard,
  Banknote,
  DollarSign,
  FileDown,
} from 'lucide-react';

interface OrdersTabProps {
  orders: Order[];
  token: string;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onOpenAWB: (order: Order) => void;
  onRefresh: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  token,
  onUpdateOrderStatus,
  onDeleteOrder,
  onOpenAWB,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.phoneNumber.includes(searchQuery) ||
      ord.governorate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Governorate', 'Street', 'Building', 'Status', 'Total', 'Items'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => {
        const itemsList = o.items.map(i => `${i.title} (${i.selectedSize}, ${i.selectedColor}) x${i.quantity}`).join(' | ');
        return [`"${o.orderNumber}"`, `"${new Date(o.createdAt).toLocaleDateString('en-US')}"`, `"${o.fullName}"`, `"${o.phoneNumber}"`, `"${o.governorate}"`, `"${o.streetName}"`, `"${o.buildingNumber}"`, `"${o.status}"`, o.total, `"${itemsList}"`].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>بانتظار التأكيد</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-300">
            <Package className="w-3 h-3 text-blue-700" />
            <span>قيد التجهيز بالمستودع</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-300">
            <Truck className="w-3 h-3 text-purple-700" />
            <span>مع كابتن الشحن</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-700" />
            <span>تم التسليم بنجاح</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-50 text-[#111111] border border-[#e0e0e0]">
            <AlertCircle className="w-3 h-3 text-[#111111]" />
            <span>ملغي</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* KPI Stats Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>إجمالي الطلبات</span>
            <ShoppingBag className="w-4 h-4 text-[#111111]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-[#000000]">{orders.length}</p>
          <span className="text-[10px] text-neutral-500 block">كافة الطلبات المسجلة</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>إجمالي المبيعات</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-700">
            {totalRevenue.toFixed(2)} <span className="text-xs">د.أ</span>
          </p>
          <span className="text-[10px] text-neutral-500 block">بدون الطلبات الملغاة</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>طلبات جديدة معلقة</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-amber-800">{pendingCount}</p>
          <span className="text-[10px] text-neutral-500 block">بانتظار التأكيد والموافقة</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>قيد الشحن والتوصيل</span>
            <Truck className="w-4 h-4 text-purple-700" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-purple-800">{shippedCount}</p>
          <span className="text-[10px] text-neutral-500 block">خرجت مع كباتن الشحن</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>طلبات مكتملة ومسلمة</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-800">{completedCount}</p>
          <span className="text-[10px] text-neutral-500 block">تم التحصيل والتسليم</span>
        </div>
      </div>

      {/* Search, Filter & Action Bar */}
      <div className="p-4 bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب، الاسم الرباعي، الهاتف، أو المحافظة..."
              className="w-full pr-10 pl-3 py-2 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] focus:outline-hidden font-medium cursor-pointer"
          >
            <option value="all">جميع الحالات ({orders.length})</option>
            <option value="pending">بانتظار التأكيد ({pendingCount})</option>
            <option value="processing">قيد التجهيز بالمستودع ({processingCount})</option>
            <option value="shipped">مع كابتن الشحن ({shippedCount})</option>
            <option value="completed">مكتمل ومسلّم ({completedCount})</option>
            <option value="cancelled">ملغي ({orders.filter((o) => o.status === 'cancelled').length})</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer"
          title="تحديث قائمة الطلبات"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300" />
            <p className="font-bold text-sm text-neutral-700">لا توجد طلبات مطابقة للبحث أو الفلتر</p>
            <p className="text-xs text-neutral-400">يرجى تجربة كلمات بحث أخرى أو تفقد الحالات المختلفة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[#111111] text-white border-b border-[#111111]">
                <tr>
                  <th className="py-3.5 px-4 text-start font-bold">رقم الطلب والتاريخ</th>
                  <th className="py-3.5 px-4 text-start font-bold">العميل (الاسم الرباعي والهاتف)</th>
                  <th className="py-3.5 px-4 text-start font-bold">عنوان التوصيل والموقع</th>
                  <th className="py-3.5 px-4 text-center font-bold">طريقة الدفع</th>
                  <th className="py-3.5 px-4 text-end font-bold">المجموع (د.أ)</th>
                  <th className="py-3.5 px-4 text-center font-bold">حالة الطلب</th>
                  <th className="py-3.5 px-4 text-end font-bold">الإجراءات والبوليصة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Order Number & Timestamp */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-sm text-[#111111] block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          {new Date(ord.createdAt).toLocaleDateString('ar-JO', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#000000]">{ord.fullName}</p>
                        <p className="font-mono text-neutral-600 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{ord.phoneNumber}</span>
                        </p>
                      </div>
                    </td>

                    {/* Address & GPS Link */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-[200px]">
                        <p className="text-neutral-800 font-medium truncate">
                          محافظة {ord.governorate} - {ord.streetName}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate">عمارة: {ord.buildingNumber}</p>
                        {ord.gpsLocation && (
                          <a
                            href={ord.gpsLocation}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#111111] hover:underline"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>موقع GPS</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold rounded-sm border border-[#e0e0e0]">
                          {ord.paymentMethod === 'visa'
                            ? 'بطاقة Visa'
                            : ord.paymentMethod === 'cliq'
                            ? 'حوالة CliQ'
                            : 'دفع باليد (COD)'}
                        </span>
                        {ord.paymentStatus === 'paid' && (
                          <span className="block text-[9px] text-emerald-700 font-bold">مدفوع إلكترونياً</span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 text-end">
                      <span className="font-mono font-extrabold text-sm text-[#111111]">
                        {ord.total.toFixed(2)} د.أ
                      </span>
                      <span className="block text-[10px] text-neutral-500">
                        ({ord.items.length} قطع + توصيل {ord.deliveryFee} د.أ)
                      </span>
                    </td>

                    {/* Status Dropdown Controller */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#e0e0e0] bg-[#f8f9fa] text-[#000000] focus:outline-hidden cursor-pointer shadow-2xs"
                      >
                        <option value="pending">طلب جديد (New)</option>
                        <option value="shipped">مع كابتن الشحن (In Transit)</option>
                        <option value="completed">تم التسليم (Delivered)</option>
                        <option value="cancelled">ملغي (Cancelled)</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenAWB(ord)}
                          className="px-2.5 py-1.5 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          title="معاينة وطباعة بوليصة الشحن والباركود"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">بوليصة AWB</span>
                        </button>

                        <button
                          onClick={() => printShippingLabel(ord)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="طباعة فورية سريعة لبوليصة الشحن"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="عرض تفاصيل القطع"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteOrder(ord.id)}
                          className="p-1.5 text-[#111111] hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف الطلب"
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
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div
          className="modal-backdrop-overlay bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content-wrapper modal-body-scroll w-full max-w-lg bg-[#f8f9fa] rounded-2xl p-6 space-y-4 border border-[#e0e0e0] shadow-2xl text-[#000000]"
          >
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#111111]">
                  تفاصيل الطلب: {selectedOrderDetails.orderNumber}
                </h3>
                <p className="text-xs text-neutral-500">العميل: {selectedOrderDetails.fullName}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              <span className="text-xs font-bold text-neutral-700 block">القطع المطلوبة:</span>
              <div className="space-y-2">
                {selectedOrderDetails.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-[#e0e0e0] bg-neutral-50"
                  >
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-12 h-12 object-cover rounded-lg border border-[#e0e0e0] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-[#000000] truncate">{it.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-600 mt-0.5">
                        <span>المقاس: <strong className="font-mono">{it.selectedSize || '-'}</strong></span>
                        <span>الكمية: <strong className="font-mono">{it.quantity}</strong></span>
                        {it.selectedColor && (
                          <span className="flex items-center gap-1">
                            اللون:
                            <span
                              className="w-3 h-3 rounded-full border border-neutral-400 inline-block"
                              style={{ backgroundColor: it.selectedColor }}
                            />
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#111111] shrink-0">
                      {(it.price * it.quantity).toFixed(2)} د.أ
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment Details & Receipt verification */}
              <div className="p-3 bg-neutral-100 rounded-xl text-xs space-y-2 border border-[#e0e0e0]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-800">طريقة وحالة الدفع:</span>
                  <span className="font-bold text-[#111111]">
                    {selectedOrderDetails.paymentMethod === 'cliq'
                      ? 'حوالة CliQ / محفظة Orange Money'
                      : selectedOrderDetails.paymentMethod === 'card'
                      ? 'بطاقة دفع إلكتروني'
                      : selectedOrderDetails.paymentMethod === 'wallet'
                      ? 'محفظة إلكترونية'
                      : 'دفع عند الاستلام (COD)'}
                  </span>
                </div>
                {selectedOrderDetails.transactionRef && (
                  <div className="flex justify-between items-center pt-1 border-t border-[#e0e0e0]">
                    <span className="text-neutral-600">رقم المرجع (Ref):</span>
                    <span className="font-mono font-bold text-emerald-800">{selectedOrderDetails.transactionRef}</span>
                  </div>
                )}
                {selectedOrderDetails.receiptImage && (
                  <div className="pt-2 border-t border-[#e0e0e0] space-y-1">
                    <span className="text-neutral-600 font-bold block">إشعار التحويل المرفق:</span>
                    <a
                      href={selectedOrderDetails.receiptImage}
                      target="_blank"
                      rel="noreferrer"
                      className="block group relative rounded-lg overflow-hidden border border-[#e0e0e0] max-w-[200px]"
                    >
                      <img
                        src={selectedOrderDetails.receiptImage}
                        alt="Receipt"
                        className="w-full h-24 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        فتح بالحجم الكامل
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {selectedOrderDetails.notes && (
                <div className="p-3 bg-neutral-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-neutral-800 block">ملاحظات العميل:</span>
                  <p className="text-neutral-600">{selectedOrderDetails.notes}</p>
                </div>
              )}

              <div className="pt-3 border-t border-[#e0e0e0] space-y-1 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>المجموع الفرعي للقطع:</span>
                  <span className="font-mono font-bold">{selectedOrderDetails.subtotal.toFixed(2)} د.أ</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>أجور الشحن ({selectedOrderDetails.governorate}):</span>
                  <span className="font-mono font-bold">{selectedOrderDetails.deliveryFee.toFixed(2)} د.أ</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-1 border-t border-[#e0e0e0]">
                  <span>المبلغ الإجمالي:</span>
                  <span className="font-mono font-extrabold">{selectedOrderDetails.total.toFixed(2)} د.أ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#e0e0e0]">
              <button
                onClick={() => {
                  const ord = selectedOrderDetails;
                  setSelectedOrderDetails(null);
                  onOpenAWB(ord);
                }}
                className="px-4 py-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة البوليصة</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
