const fs = require('fs');

let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');

// --- SECTION 1: Form Changes ---

// 1. Name Field Validation
content = content.replace(
  /\/\/ 1\. Full name at least 4 words[\s\S]*?const nameWords = fullName\.trim\(\)\.split\(\/\\s\+\/\)\.filter\(Boolean\);\s*if \(\!fullName\.trim\(\)\) {[\s\S]*?\} else if \(nameWords\.length < 4\) {[\s\S]*?\}/,
  `// 1. Full name required\n    if (!fullName.trim()) {\n      errs.fullName = isAr ? 'الاسم مطلوب يا نشمي' : 'Name is required';\n    }`
);

// Name Field Label
content = content.replace(
  /<span>\{isAr \? 'الاسم الرباعي كاملاً \(4 كلمات على الأقل\)\*' : 'Full Name \(4 words min\)\*'\}<\/span>/,
  "<span>{isAr ? 'الاسم*' : 'Name*'}</span>"
);

// Name Field Placeholder
content = content.replace(
  /placeholder=\{isAr \? 'مثال: طارق عبد الله محمد العجارمة' : 'e\.g\. Tareq Abdullah Mohammad Ajarmal'\}/,
  "placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}"
);

// 2. Phone Field Label
content = content.replace(
  /<span>\{isAr \? 'رقم الهاتف الخلوي \(أردني 07X\)\*' : 'Jordan Phone \(07X\)\*'\}<\/span>/,
  "<span>{isAr ? 'رقم الهاتف الخلوي (أردني)*' : 'Jordan Phone*'}</span>"
);

// Phone Field Placeholder
content = content.replace(
  /placeholder="079XXXXXXX"/,
  'placeholder="07XXXXXXXX"'
);

// 3. Governorate Label (keeping existing dropdown logic)
content = content.replace(
  /<span>\{isAr \? 'المحافظة \(حساب فوري لأجور التوصيل\)\*' : 'Governorate & Delivery Fee\*'\}<\/span>/,
  "<span>{isAr ? 'المحافظة*' : 'Governorate*'}</span>"
);

// 4. Street Name Label & Placeholder
content = content.replace(
  /<span>\{isAr \? 'اسم الشارع \/ الحي \/ المعلم القريب\*' : 'Street Name \/ Area\*'\}<\/span>/,
  "<span>{isAr ? 'اسم الشارع والحي*' : 'Street Name & Area*'}</span>"
);
content = content.replace(
  /placeholder=\{isAr \? 'مثال: شارع المدينة المنورة - قرب دوار الواحة' : 'e\.g\. Madina St\.'\}/,
  "placeholder={isAr ? 'مثال: شارع المدينة المنورة - حي التلاع' : 'e.g. Madina St. - Tlaa Al Ali'}"
);

// 5. Building Number Label & Placeholder
content = content.replace(
  /<span>\{isAr \? 'رقم العمارة \/ الشقة\*' : 'Building \/ Flat Number\*'\}<\/span>/,
  "<span>{isAr ? 'رقم العمارة / الشقة*' : 'Building / Apt Number*'}</span>"
);
content = content.replace(
  /placeholder=\{isAr \? 'مثال: عمارة رقم 12 - الطابق الثاني' : 'e\.g\. Building 12, Apt 4'\}/,
  "placeholder={isAr ? 'مثال: عمارة 12 - الطابق الثاني' : 'e.g. Building 12 - 2nd Floor'}"
);


// --- SECTION 2: Doorstep Payment Method Restructuring ---

// Replace the entire method options grid and sub-forms with a simple strip
// The grid starts with: {/* Method Options Grid */} and ends before {/* Order Cost Summary Box */}
// I will use regex to find this block.
const paymentSectionRegex = /\{\/\* Method Options Grid \*\/\}[\s\S]*?(?=\{\/\* Order Cost Summary Box \*\/)/;

const newPaymentSection = `
                {/* Method Options Info Strip */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-center shadow-inner">
                  <p className="text-xs font-bold leading-relaxed">
                    {isAr ? 'جميع طرق الدفع متوفرة عند التوصيل (نقداً، بطاقة بنكية POS، كليك CliQ، أو محفظة إلكترونية مع الكابتن).' : 'All payment methods are available on delivery (Cash, POS Card, CliQ, or E-Wallet with the driver).'}
                  </p>
                </div>
              </div>
              `;

content = content.replace(paymentSectionRegex, newPaymentSection);

fs.writeFileSync('src/components/CheckoutModal.tsx', content);

console.log("Done updating CheckoutModal.tsx");
