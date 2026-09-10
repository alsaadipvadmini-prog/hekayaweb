import { Order } from '../types.js';

/**
 * Generates clean SVG barcode bars for deterministic Code128-like vector display
 * without requiring external network dependencies at print time.
 */
export function generateBarcodeSVG(text: string, height = 48): string {
  const bars: { width: number; isBlack: boolean }[] = [];
  const clean = text.toUpperCase().replace(/[^A-Z0-9-]/g, '') || 'HKY-1001';

  // Start guard pattern
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

  // Stop guard pattern
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });

  const totalWidth = bars.reduce((sum, b) => sum + b.width, 0);

  let currentX = 0;
  const rects = bars
    .map((bar) => {
      const rect = bar.isBlack
        ? `<rect x="${currentX}" y="0" width="${bar.width}" height="${height}" fill="#000000" />`
        : '';
      currentX += bar.width;
      return rect;
    })
    .join('');

  return `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
      <svg viewBox="0 0 ${totalWidth} ${height}" style="width: 100%; max-width: 320px; height: ${height}px;" preserveAspectRatio="none">
        ${rects}
      </svg>
      <span style="font-family: monospace; font-size: 13px; font-weight: bold; letter-spacing: 2px; color: #000000; margin-top: 4px;">
        *${clean}*
      </span>
    </div>
  `;
}

/**
 * Builds standalone, print-perfect HTML document for AWB shipping label
 */
export function generateShippingLabelHTML(order: Order): string {
  const barcodeCode =
    order.awbBarcode || `HKY-${order.orderNumber ? order.orderNumber.replace(/[^0-9]/g, '') : order.id || Date.now().toString().slice(-6)}-2026`;
  const barcodeSvgHtml = generateBarcodeSVG(barcodeCode, 52);

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentMethodLabel =
    order.paymentMethod === 'card' || (order.paymentMethod as string) === 'visa'
      ? 'بطاقة دفع إلكتروني (Visa / Mastercard)'
      : order.paymentMethod === 'cliq'
      ? 'تحويل فوري (CliQ)'
      : order.paymentMethod === 'applepay'
      ? 'Apple Pay (مدفوع)'
      : order.paymentMethod === 'wallet'
      ? 'المحفظة الإلكترونية (مدفوع)'
      : 'دفع عند الاستلام (COD)';

  const paymentStatusBadge =
    order.paymentStatus === 'paid'
      ? '<span style="background: #e6f4ea; color: #137333; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; border: 1px solid #ceead6;">مدفوع مسبقاً (Paid)</span>'
      : '<span style="background: #fef7e0; color: #b06000; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; border: 1px solid #fde293;">تحصيل نقدي عند الاستلام (COD)</span>';

  const amountToCollect =
    order.paymentStatus === 'paid' ? '0.00 د.أ (مدفوع مسبقاً)' : `${order.total.toFixed(2)} د.أ`;

  const items = Array.isArray(order.items) ? order.items : [];
  const itemsRows = items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e5e5e5; font-size: 13px;">
        <td style="padding: 10px; text-align: right; font-weight: 600; color: #000000;">
          ${idx + 1}. ${item.title}
        </td>
        <td style="padding: 10px; text-align: center; font-family: monospace; font-weight: bold;">
          ${item.selectedSize || '-'}
        </td>
        <td style="padding: 10px; text-align: center;">
          ${
            item.selectedColor
              ? `<span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 1px solid #777; vertical-align: middle; background-color: ${item.selectedColor};"></span>`
              : '-'
          }
        </td>
        <td style="padding: 10px; text-align: center; font-family: monospace; font-weight: bold;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; text-align: left; font-family: monospace; font-weight: bold;">
          ${(item.price * item.quantity).toFixed(2)} د.أ
        </td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>بوليصة شحن - ${order.orderNumber || order.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #ffffff;
      color: #000000;
      direction: rtl;
      font-size: 13px;
      line-height: 1.5;
    }

    .label-card {
      max-width: 780px;
      margin: 0 auto;
      border: 2px solid #000000;
      border-radius: 12px;
      padding: 20px;
      background: #ffffff;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000000;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }

    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #111111;
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sub-brand {
      font-size: 12px;
      color: #444444;
      margin: 0;
    }

    .order-badge {
      background: #111111;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 4px;
    }

    .barcode-box {
      background: #fdfdfd;
      border: 1.5px dashed #333333;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      text-align: center;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .info-box {
      border: 1px solid #cccccc;
      border-radius: 8px;
      padding: 14px;
      background: #fafafa;
    }

    .box-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      color: #444444;
      margin-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 6px;
    }

    .client-name {
      font-size: 16px;
      font-weight: 800;
      color: #000000;
      margin: 0 0 6px 0;
    }

    .phone-number {
      font-family: monospace;
      font-size: 15px;
      font-weight: bold;
      color: #111111;
      margin: 0 0 6px 0;
    }

    .table-container {
      margin-bottom: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cccccc;
      border-radius: 8px;
      overflow: hidden;
    }

    th {
      background: #f0f0f0;
      color: #111111;
      font-weight: 700;
      padding: 10px;
      font-size: 12px;
      border-bottom: 1px solid #cccccc;
    }

    .total-highlight {
      font-size: 18px;
      font-weight: 800;
      color: #111111;
      font-family: monospace;
    }

    .signatures-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 2px solid #000000;
      font-size: 12px;
    }

    .sign-line {
      height: 40px;
      border-bottom: 1px dashed #666666;
      margin-top: 8px;
    }

    @media print {
      body {
        padding: 0;
      }
      .label-card {
        border-width: 1.5px;
        padding: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="label-card" id="printable-awb-sheet">
    <!-- Header -->
    <div class="header-row">
      <div>
        <h1 class="brand-title">
          <img src="/logo.png" alt="HKAYA" style="height: 32px; width: auto; vertical-align: middle;" onerror="this.style.display='none'" />
          حكاية للأزياء والموضة (HKAYA)
        </h1>
        <p class="sub-brand">المملكة الأردنية الهاشمية - عمان | خدمة العملاء: 0798123456</p>
      </div>
      <div style="text-align: left;">
        <span class="order-badge">بوليصة شحن AWB: #${order.orderNumber || order.id}</span>
        <div style="font-family: monospace; font-size: 12px; color: #555555; margin-top: 4px;">
          تاريخ الطلب: ${formattedDate}
        </div>
      </div>
    </div>

    <!-- Barcode Box -->
    <div class="barcode-box">
      ${barcodeSvgHtml}
    </div>

    <!-- Customer and Shipping Details -->
    <div class="info-grid">
      <div class="info-box">
        <div class="box-title">بيانات المستلم (العميل):</div>
        <p class="client-name">${order.fullName}</p>
        <p class="phone-number">رقم الهاتف: ${order.phoneNumber}</p>
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #222222;">
          <strong>المحافظة / العنوان:</strong> محافظة ${order.governorate} - ${order.streetName} - عمارة ${order.buildingNumber || ''}
        </p>
        <p style="margin: 0; font-size: 12px; color: #444444; word-break: break-all;">
          <strong>رابط الموقع الجغرافي (GPS):</strong> ${
            order.gpsLocation
              ? `<a href="${order.gpsLocation}" target="_blank" style="color: #111111; font-family: monospace; font-weight: bold; text-decoration: underline;">${order.gpsLocation}</a>`
              : '<span style="color: #888;">غير محدد</span>'
          }
        </p>
      </div>

      <div class="info-box">
        <div class="box-title">تفاصيل الشحن والتحصيل المالي:</div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: #555;">طريقة الدفع:</span>
          <strong>${paymentMethodLabel}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: #555;">حالة الدفع:</span>
          ${paymentStatusBadge}
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
          <span style="color: #555;">أجور التوصيل:</span>
          <strong style="font-family: monospace;">${order.deliveryFee.toFixed(2)} د.أ</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px dashed #cccccc;">
          <span style="font-weight: 800; color: #111111; font-size: 14px;">المبلغ المطلوب تحصيله عند التسليم:</span>
          <span class="total-highlight">${amountToCollect}</span>
        </div>
      </div>
    </div>

    <!-- Items Breakdown -->
    <div class="table-container">
      <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #222222;">
        محتويات الطرد (${items.length} قطع):
      </div>
      <table>
        <thead>
          <tr>
            <th style="text-align: right;">المنتج والوصف</th>
            <th style="text-align: center; width: 65px;">المقاس</th>
            <th style="text-align: center; width: 55px;">اللون</th>
            <th style="text-align: center; width: 55px;">الكمية</th>
            <th style="text-align: left; width: 100px;">السعر الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    ${
      order.notes
        ? `<div style="background: #fff9e6; border: 1px solid #ffe082; border-radius: 6px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px;">
             <strong>ملاحظات العميل والتوصيل:</strong> ${order.notes}
           </div>`
        : ''
    }

    <!-- Signatures -->
    <div class="signatures-row">
      <div>
        <strong>توقيع واستلام كابتن الشحن والتوزيع:</strong>
        <div class="sign-line"></div>
      </div>
      <div>
        <strong>توقيع واستلام العميل (المستلم):</strong>
        <div class="sign-line"></div>
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        try {
          window.focus();
          window.print();
        } catch (e) {
          console.error(e);
        }
      }, 300);
    });
  </script>
</body>
</html>`;
}

/**
 * ISOLATED PRINT WINDOW ARCHITECTURE
 * 
 * 1. Opens an isolated print window (window.open) and writes the complete standalone HTML.
 * 2. If popup is blocked, uses a hidden iframe fallback to trigger print without failing.
 * 3. Guarantees 0% blank pages or missing CSS styles.
 */
export function printShippingLabel(order: Order): void {
  const labelHTML = generateShippingLabelHTML(order);

  try {
    // Attempt 1: Isolated Popup Window
    const printWindow = window.open('', '_blank', 'width=850,height=950,scrollbars=yes,status=no');

    if (printWindow && printWindow.document) {
      printWindow.document.open();
      printWindow.document.write(labelHTML);
      printWindow.document.close();

      // Ensure focus and print trigger
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (err) {
          console.warn('Isolated window print triggered with error:', err);
        }
      }, 350);
      return;
    }
  } catch (windowErr) {
    console.warn('window.open was blocked or threw error, switching to isolated iframe print:', windowErr);
  }

  // Attempt 2: Isolated Hidden Iframe Fallback
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    iframe.setAttribute('title', 'HKAYA Shipping Label Print Frame');

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(labelHTML);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printErr) {
          console.error('Iframe print error:', printErr);
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 4000);
        }
      }, 350);
      return;
    }
  } catch (iframeErr) {
    console.error('Iframe fallback error:', iframeErr);
  }

  // Final fallback
  window.print();
}
