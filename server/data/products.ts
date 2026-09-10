import { Product, CategoryItem } from '../../src/types.js';

export const categoriesData: CategoryItem[] = [
  {
    id: 'women',
    name: 'القسم النسائي',
    nameEn: 'Women',
    slug: 'women',
    hasSubCategories: true,
    subCategories: [
      { id: 'women_clothing', name: 'الملابس النسائية', nameEn: 'Women Clothing', slug: 'women-clothing' },
      { id: 'women_shoes', name: 'الأحذية النسائية', nameEn: 'Women Shoes', slug: 'women-shoes' },
      { id: 'hijab', name: 'الحجاب والشيلات', nameEn: 'Hijab & Scarves', slug: 'hijab' },
    ],
  },
  {
    id: 'men',
    name: 'القسم الرجالي',
    nameEn: 'Men',
    slug: 'men',
    hasSubCategories: true,
    subCategories: [
      { id: 'men_clothing', name: 'الملابس الرجالية', nameEn: 'Men Clothing', slug: 'men-clothing' },
      { id: 'men_shoes', name: 'الأحذية الرجالية', nameEn: 'Men Shoes', slug: 'men-shoes' },
    ],
  },
  {
    id: 'family',
    name: 'العائلة والطفل',
    nameEn: 'Family & Kids',
    slug: 'family',
    hasSubCategories: true,
    subCategories: [
      { id: 'kids', name: 'الأطفال', nameEn: 'Kids Fashion', slug: 'kids' },
      { id: 'kids_shoes', name: 'أحذية الأطفال', nameEn: 'Kids Shoes', slug: 'kids-shoes' },
      { id: 'baby', name: 'البيبي والمواليد', nameEn: 'Baby Collection', slug: 'baby' },
    ],
  },
  {
    id: 'lingerie',
    name: 'اللانجري',
    nameEn: 'Lingerie',
    slug: 'lingerie',
    hasSubCategories: false,
    isIndependent: true,
  },
  {
    id: 'beauty',
    name: 'الميكأب والمواد التجميلية',
    nameEn: 'Beauty & Makeup',
    slug: 'beauty',
    hasSubCategories: false,
    isIndependent: true,
  },
  {
    id: 'perfumes',
    name: 'العطور الفاخرة',
    nameEn: 'Luxury Perfumes',
    slug: 'perfumes',
    hasSubCategories: false,
    isIndependent: true,
  },
  {
    id: 'clearance',
    name: 'التصفية والعروض (1-5 د.أ)',
    nameEn: 'Clearance (1-5 JOD)',
    slug: 'clearance',
    hasSubCategories: false,
    isSpecial: true,
  },
];

const tints = ['#FFF9F0', '#FEF9C3', '#FFF1F2', '#F0FDF4', '#F8FAFC', '#FAF5FF'];

// SVG Placeholder generator for crisp, lightweight, luxury fashion imagery (4 Dedicated Views)
export function generate4ViewFashionSvgs(
  label: string,
  category: string,
  color: string
): [string, string, string, string] {
  const brandColor = color || '#3B020D';
  const cleanLabel = label.replace(/[<>&"]/g, '');

  // Slot 1: Front View (الواجهة الأمامية للمنتج)
  const slot1 = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${brandColor}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${brandColor}" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g1)" rx="24"/>
      <circle cx="200" cy="170" r="110" fill="#ffffff" opacity="0.85"/>
      <!-- Front Silhouette Structure -->
      <path d="M150 180 Q200 130 250 180 T300 240 Q200 280 100 240 Z" fill="${brandColor}" opacity="0.88"/>
      <path d="M170 140 Q200 110 230 140" stroke="#3B020D" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="200" cy="110" r="16" fill="#3B020D" opacity="0.3"/>
      <!-- Front Button/Collar details -->
      <circle cx="200" cy="175" r="3.5" fill="#ffffff"/>
      <circle cx="200" cy="195" r="3.5" fill="#ffffff"/>
      <circle cx="200" cy="215" r="3.5" fill="#ffffff"/>
      <!-- View Badge -->
      <rect x="110" y="24" width="180" height="26" rx="13" fill="#3B020D" opacity="0.9"/>
      <text x="200" y="41" font-family="'Cairo', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">الواجهة الأمامية (Front View)</text>
      <!-- Title & Brand -->
      <text x="200" y="325" font-family="'Cairo', sans-serif" font-weight="bold" font-size="17" fill="#111111" text-anchor="middle">${cleanLabel}</text>
      <text x="200" y="352" font-family="sans-serif" font-size="12" fill="#666666" text-anchor="middle">${category} • كولكشن حكاية</text>
    </svg>
  `);

  // Slot 2: Back View (الجهة الخلفية للمنتج)
  const slot2 = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${brandColor}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#111111" stop-opacity="0.06"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g2)" rx="24"/>
      <circle cx="200" cy="170" r="110" fill="#ffffff" opacity="0.85"/>
      <!-- Back Silhouette Structure with Seam Lines -->
      <path d="M150 180 Q200 135 250 180 T300 240 Q200 280 100 240 Z" fill="${brandColor}" opacity="0.8"/>
      <path d="M200 135 L200 270" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.8" stroke-linecap="round"/>
      <path d="M165 155 Q200 170 235 155" stroke="#ffffff" stroke-width="2" opacity="0.7" fill="none"/>
      <!-- View Badge -->
      <rect x="110" y="24" width="180" height="26" rx="13" fill="#1A1A1A" opacity="0.9"/>
      <text x="200" y="41" font-family="'Cairo', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">الجهة الخلفية (Back View)</text>
      <!-- Title & Brand -->
      <text x="200" y="325" font-family="'Cairo', sans-serif" font-weight="bold" font-size="17" fill="#111111" text-anchor="middle">${cleanLabel}</text>
      <text x="200" y="352" font-family="sans-serif" font-size="12" fill="#666666" text-anchor="middle">تفصيل الظهر والقصة الخلفية • حكاية</text>
    </svg>
  `);

  // Slot 3: Fabric & Texture Close-Up (عرض تفاصيل الخامة والقماش)
  const slot3 = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="rg3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${brandColor}" stop-opacity="0.35"/>
          <stop offset="70%" stop-color="${brandColor}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
        </radialGradient>
        <pattern id="weave" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 L20 10 M10 0 L10 20" stroke="${brandColor}" stroke-width="1.2" opacity="0.45"/>
          <circle cx="10" cy="10" r="2.5" fill="${brandColor}" opacity="0.6"/>
          <rect x="2" y="2" width="6" height="6" fill="#ffffff" opacity="0.3" rx="1"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="#F8FAFC" rx="24"/>
      <circle cx="200" cy="170" r="115" fill="url(#rg3)"/>
      <circle cx="200" cy="170" r="105" fill="url(#weave)"/>
      <circle cx="200" cy="170" r="105" stroke="${brandColor}" stroke-width="3" opacity="0.3" fill="none"/>
      <!-- Magnifier icon ring -->
      <circle cx="200" cy="170" r="45" stroke="#3B020D" stroke-width="3" fill="#ffffff" fill-opacity="0.25"/>
      <path d="M232 202 L260 230" stroke="#3B020D" stroke-width="5" stroke-linecap="round"/>
      <!-- View Badge -->
      <rect x="90" y="24" width="220" height="26" rx="13" fill="#800020" opacity="0.95"/>
      <text x="200" y="41" font-family="'Cairo', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">تفاصيل الخامة والقماش (Fabric Texture)</text>
      <!-- Title & Brand -->
      <text x="200" y="325" font-family="'Cairo', sans-serif" font-weight="bold" font-size="17" fill="#111111" text-anchor="middle">${cleanLabel}</text>
      <text x="200" y="352" font-family="sans-serif" font-size="12" fill="#666666" text-anchor="middle">قماش فاخر عالي الكثافة والمتانة • حكاية</text>
    </svg>
  `);

  // Slot 4: Fine Details / Material & Cotton View (التفاصيل الدقيقة أو نوع القطن والتطريز)
  const slot4 = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="g4" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3B020D" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.25"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#FAF5FF" rx="24"/>
      <circle cx="200" cy="170" r="110" fill="url(#g4)"/>
      <!-- Luxury Gold / Silk Embroidery Emblem Detail -->
      <circle cx="200" cy="170" r="75" stroke="#D4AF37" stroke-width="3.5" stroke-dasharray="6 3" fill="#ffffff" fill-opacity="0.9"/>
      <polygon points="200,125 212,158 245,158 218,178 228,210 200,190 172,210 182,178 155,158 188,158" fill="#D4AF37" opacity="0.85"/>
      <circle cx="200" cy="170" r="18" fill="#3B020D"/>
      <text x="200" y="175" font-family="serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">ح</text>
      <!-- View Badge -->
      <rect x="90" y="24" width="220" height="26" rx="13" fill="#D4AF37" opacity="0.95"/>
      <text x="200" y="41" font-family="'Cairo', sans-serif" font-weight="bold" font-size="11" fill="#111111" text-anchor="middle">دقة التطريز ونوع القطن (Fine Details)</text>
      <!-- Title & Brand -->
      <text x="200" y="325" font-family="'Cairo', sans-serif" font-weight="bold" font-size="17" fill="#111111" text-anchor="middle">${cleanLabel}</text>
      <text x="200" y="352" font-family="sans-serif" font-size="12" fill="#666666" text-anchor="middle">تطريز ذهبي وحبكة خيوط إيطالية 100%</text>
    </svg>
  `);

  return [
    `data:image/svg+xml;utf8,${slot1}`,
    `data:image/svg+xml;utf8,${slot2}`,
    `data:image/svg+xml;utf8,${slot3}`,
    `data:image/svg+xml;utf8,${slot4}`,
  ];
}

// Backward compatibility alias for single image
export function generateFashionSvg(label: string, category: string, color: string): string {
  const [front] = generate4ViewFashionSvgs(label, category, color);
  return front;
}

const rawProductSeeds = [
  // 1. Women Clothing (25)
  {
    subCategory: 'women_clothing',
    category: 'women',
    items: [
      { t: 'فستان سهرة كلاسيك مخمل ملكي', en: 'Royal Velvet Evening Gown', p: 38, op: 48, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A', '#1E3A8A'], desc: 'فستان مرتب وفخم جداً بقصة انسيابية ونسيج مخمل راقي بلبق لكل مناسباتك الحلوة.' },
      { t: 'بليزر أوفر سايز رسمي أنيق', en: 'Oversized Tailored Blazer', p: 29, op: 36, s: ['M', 'L', 'XL'], c: ['#3B020D', '#D4AF37', '#1F2937'], desc: 'بليزر خامة تقيلة بقصة مريحة وشياكة بتعطيكي هيبة وطلة غير شكل بكل قعدة.' },
      { t: 'قميص حرير ساتان بقصة درابيه', en: 'Draped Satin Silk Shirt', p: 18, op: 24, s: ['S', 'M', 'L'], c: ['#FFF9F0', '#3B020D', '#F472B6'], desc: 'نعومة الحرير ولمعة فخمة وخياطة نظيفة بتناسب طلعات المساء والدوام الراقي.' },
      { t: 'عباية مخملية سوداء بتطريز ناعم', en: 'Embroidered Black Velvet Abaya', p: 45, op: 55, s: ['54', '56', '58'], c: ['#0A0A0A', '#3B020D'], desc: 'قصة واسعة وتطريز يدوي على الأكمام، فخامة بتشرفك وين ما رحتي.' },
      { t: 'طقم لينين صيفي قطعتين راقي', en: 'Two-Piece Linen Summer Set', p: 26, op: 32, s: ['S', 'M', 'L', 'XL'], c: ['#E5E7EB', '#D1D5DB', '#3B020D'], desc: 'خفيف وبارد عالجسم، تفصيل مرتب ومريح جداً للمشاوير والطلعات اليومية.' },
      { t: 'تنورة بليسيه ميدي شيك', en: 'Pleated Midi Skirt', p: 16, op: 22, s: ['S', 'M', 'L'], c: ['#3B020D', '#000000', '#D4D4D8'], desc: 'تكسيرات ناعمة وثابتة مع لمعة خفيفة بتتماشى مع كل القطع العلوية.' },
      { t: 'هودي أوفر سايز قطن كولكشن حكاية', en: 'HKAYA Signature Oversized Hoodie', p: 22, op: 28, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#18181B', '#F3F4F6'], desc: 'قطن 100% مبطن وبدفّي على الأصول، راحة وشياكة ستريت وير أردنية.' },
      { t: 'كنزة صوف كشمير هاي نك', en: 'Cashmere High-Neck Sweater', p: 24, op: 30, s: ['S', 'M', 'L'], c: ['#FFF9F0', '#3B020D', '#78716C'], desc: 'صوف ناعم ما بحك ولا بتحبب، دفا وأناقة بتضل سنين.' },
      { t: 'بنطال قماش وايد ليج كلاسيكي', en: 'Wide Leg Tailored Trousers', p: 19, op: 25, s: ['36', '38', '40', '42'], c: ['#0A0A0A', '#3B020D', '#6B7280'], desc: 'قصة مستقيمة بتطول الجسم ومريحة بالحركة، بتركب ع كل البلايز.' },
      { t: 'جاكيت جينز كاجوال مع تفاصيل مميزة', en: 'Distressed Denim Jacket', p: 27, op: 35, s: ['S', 'M', 'L'], c: ['#3B82F6', '#1E3A8A', '#1F2937'], desc: 'جينز متين وخياطة محكمة بلبق لجميع فصول السنة.' },
      { t: 'كارديجان طويل مفتوح بنقشة جاكار', en: 'Jacquard Knit Long Cardigan', p: 23, op: 29, s: ['M', 'L', 'XL'], c: ['#3B020D', '#E5E7EB'], desc: 'خامة شتوية ناعمة بتنزل انسيابية ومثالية مع البناطيل والفساتين.' },
      { t: 'فستان شيفون مطبع بزهور ربيعية', en: 'Floral Printed Chiffon Dress', p: 32, op: 40, s: ['S', 'M', 'L', 'XL'], c: ['#F43F5E', '#3B020D'], desc: 'مبطن بالكامل، قماش طيار وخفيف وبلبق للمناسبات والجمعات.' },
      { t: 'بلوزة قطنية مطرزة يدوياً بالحرير', en: 'Hand-Embroidered Cotton Blouse', p: 21, op: 28, s: ['S', 'M', 'L'], c: ['#FFFFFF', '#3B020D'], desc: 'تطريز تراثي مطوّر بتصميم معاصر يجمع الأصالة والجمال.' },
      { t: 'بنطال جلد سوفت بقصة ضيقة راقية', en: 'Soft Faux Leather Slim Pants', p: 25, op: 34, s: ['38', '40', '42'], c: ['#0A0A0A', '#3B020D'], desc: 'جلد مرن وخفيف ما بتشقق وبعطي طلة جريئة وأنيقة.' },
      { t: 'ترنش كوت كلاسيك مقاوم للماء', en: 'Classic Trench Coat', p: 48, op: 60, s: ['M', 'L', 'XL'], c: ['#D1D5DB', '#3B020D', '#1F2937'], desc: 'القطعة الأساسية لكل خزانة راقية، تفاصيل فاخرة وحزام خصر متقن.' },
      { t: 'تيشيرت بولو قطن ناعم نسائي', en: 'Women Fine Cotton Polo Tee', p: 14, op: 18, s: ['S', 'M', 'L'], c: ['#FFFFFF', '#3B020D', '#111827'], desc: 'قصة رسمية مريحة جداً وخامة قطن مسرح تحافظ على لونها.' },
      { t: 'تنورة جينز ماكسي بفتحة خلفية', en: 'Maxi Denim Skirt', p: 22, op: 28, s: ['38', '40', '42'], c: ['#2563EB', '#1E293B'], desc: 'موضة الموسم بقصة عصرية ومريحة بالمشي والحركة اليومية.' },
      { t: 'سترة صوفية بدون أكمام فيست', en: 'Knitted Sleeveless Vest', p: 17, op: 22, s: ['S', 'M', 'L'], c: ['#FEF08A', '#3B020D', '#E2E8F0'], desc: 'بتنلبس فوق القمصان لتعطي طلة كورية عصرية وفخمة.' },
      { t: 'فستان كتان ميدي بياقة V', en: 'V-Neck Linen Midi Dress', p: 30, op: 38, s: ['S', 'M', 'L', 'XL'], c: ['#E5E7EB', '#3B020D'], desc: 'تفصيل ناعم مع جيوب جانبية وحزام ربط يحدد الخصر بأناقة.' },
      { t: 'جاكيت فرو صناعي ناعم للمناسبات', en: 'Faux Fur Luxury Cropped Jacket', p: 42, op: 52, s: ['M', 'L'], c: ['#FFFBEB', '#3B020D', '#0A0A0A'], desc: 'فرو كثيف وناعم كالحرير بضفي لمسة ملكية على أي فستان.' },
      { t: 'قميص بوبلين أبيض بياقة درامية', en: 'Statement Collar Poplin Shirt', p: 19, op: 25, s: ['S', 'M', 'L'], c: ['#FFFFFF', '#F3F4F6'], desc: 'ياقة مميزة بتلفت النظر وقطن إيطالي فاخر وسهل الكوي.' },
      { t: 'بنطال رياضي ستريت وير قطني', en: 'Streetwear Cotton Sweatpants', p: 18, op: 23, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#18181B', '#E5E7EB'], desc: 'مريح للبيت والمشاوير السريعة وخامته قطن مبطن ممتاز.' },
      { t: 'جمبسوت سهرة كلاسيك بقصة ساق مستقيمة', en: 'Tailored Evening Jumpsuit', p: 39, op: 49, s: ['38', '40', '42'], c: ['#3B020D', '#0A0A0A'], desc: 'شياكة بلا حدود وحزام ذهبي ناعم وفتحة ياقة مدروسة.' },
      { t: 'شال صوف ناعم مطرز باليد', en: 'Handmade Wool Wrap Shawl', p: 15, op: 20, s: ['Free Size'], c: ['#3B020D', '#F43F5E', '#E2E8F0'], desc: 'كبير ومريح وبلف الجسم بدفا وأناقة أردنية أصيلة.' },
      { t: 'فستان قفطان فاخر بحزام تطريز مذهب', en: 'Embellished Luxury Caftan Dress', p: 52, op: 65, s: ['Free Size'], c: ['#3B020D', '#0A0A0A', '#047857'], desc: 'قطعة فريدة للمناسبات الخاصة والزيارات العائلية الكشخة.' },
    ],
  },

  // 2. Women Shoes (25)
  {
    subCategory: 'women_shoes',
    category: 'women',
    items: [
      { t: 'حذاء كعب عالي سهرة جلد ناعم', en: 'Stiletto Leather Pumps', p: 34, op: 42, s: ['36', '37', '38', '39', '40'], c: ['#3B020D', '#0A0A0A', '#FDE047'], desc: 'كعب متوازن ومريح مع بطانة ميموري فوم تخفف الضغط على القدم.' },
      { t: 'سنيكرز أبيض كلاسيك كولكشن حكاية', en: 'Minimalist White Classic Sneaker', p: 26, op: 32, s: ['36', '37', '38', '39', '40', '41'], c: ['#FFFFFF', '#3B020D'], desc: 'خفيف ومرن ومناسب للمشي الطويل والدوامات مع نعل طبي مانع للانزلاق.' },
      { t: 'حذاء لوفر جلد إيطالي مع بكلة ذهبية', en: 'Italian Leather Gold Buckle Loafers', p: 31, op: 38, s: ['37', '38', '39', '40'], c: ['#3B020D', '#0A0A0A', '#78350F'], desc: 'جلد طبيعي مرن بتفصيل يدوي عالي الدقة شياكة للمكتب والمشاوير.' },
      { t: 'صندل صيفي كعب ويدج مريح', en: 'Comfort Wedge Summer Sandals', p: 22, op: 28, s: ['36', '37', '38', '39'], c: ['#D97706', '#3B020D', '#0A0A0A'], desc: 'نعل خفيف وطبي وسير كاحل قابل للتعديل لثبات ممتاز.' },
      { t: 'بوت شتوي جلد تشيلسي برقبة كاحل', en: 'Chelsea Ankle Winter Boots', p: 36, op: 46, s: ['37', '38', '39', '40', '41'], c: ['#0A0A0A', '#3B020D', '#78350F'], desc: 'مبطن من الداخل ومقاوم للمطر مع مطاط جانبي لسهولة اللبس.' },
      { t: 'حذاء باليرينا فلات مرن ومبطن', en: 'Cushioned Ballet Flats', p: 17, op: 22, s: ['36', '37', '38', '39', '40'], c: ['#FCE7F3', '#3B020D', '#0A0A0A'], desc: 'خفيف بالشنطة ومريح للتبديل، نعل مرن جداً وراحة يومية.' },
      { t: 'ميول أنيق بياقة مربعة وكعب خشبي', en: 'Square Toe Mules', p: 24, op: 30, s: ['37', '38', '39', '40'], c: ['#FFFBEB', '#3B020D'], desc: 'موديل ترندي بكعب مريح وثابت بلبق مع البناطيل والفساتين.' },
      { t: 'سنيكرز سبورت ركض مبطن بالهواء', en: 'Air Cushion Running Shoes', p: 28, op: 35, s: ['36', '37', '38', '39', '40'], c: ['#F43F5E', '#3B020D', '#FFFFFF'], desc: 'تهوية ممتازة وامتصاص للصدمات للمشي والرياضة اليومية.' },
      { t: 'حذاء سهرة شفاف مرصع بالكريستال', en: 'Crystal Embellished Clear Heels', p: 38, op: 48, s: ['36', '37', '38', '39'], c: ['#FFFFFF', '#3B020D'], desc: 'لمعان ساحر يلفت الأنظار وكعب كريستالي بارتفاع مدروس.' },
      { t: 'صندل فلات حبال جلدية بتصميم إغريقي', en: 'Strappy Leather Flat Sandals', p: 19, op: 25, s: ['36', '37', '38', '39', '40'], c: ['#78350F', '#3B020D', '#0A0A0A'], desc: 'جلد طبيعي ناعم مع أربطة مريحة للمشاوير والرحلات.' },
      { t: 'بوت طويل فوق الركبة شامواه فاخر', en: 'Over-The-Knee Suede Boots', p: 44, op: 55, s: ['37', '38', '39', '40'], c: ['#0A0A0A', '#3B020D'], desc: 'شامواه مخملي بمسكة ممتازة على الساق بدون ما يزحلق.' },
      { t: 'حذاء بلاتفورم سنيكرز سميك النعل', en: 'Chunky Platform Sneaker', p: 27, op: 34, s: ['36', '37', '38', '39', '40'], c: ['#FFFFFF', '#E2E8F0'], desc: 'بعطيكي طول وشياكة كاجوال مع خفة وزن غير متوقعة.' },
      { t: 'سليبر منزلي مخملي فاخر ببطانة صوف', en: 'Velvet Cozy Home Slippers', p: 12, op: 16, s: ['37-38', '39-40'], c: ['#3B020D', '#F472B6'], desc: 'دفا فاخر وراحة تامة بعد يوم طويل بنعل مقاوم للتزحلق.' },
      { t: 'حذاء ماري جين كلاسيكي بكعب سميك', en: 'Mary Jane Block Heels', p: 29, op: 36, s: ['36', '37', '38', '39'], c: ['#0A0A0A', '#3B020D'], desc: 'أناقة الستينيات المتجددة بحزام كاحل ناعم وخامة لماعة.' },
      { t: 'صندل مسائي ميتاليك فضي', en: 'Metallic Silver Evening Sandals', p: 25, op: 32, s: ['36', '37', '38', '39'], c: ['#E5E7EB', '#3B020D'], desc: 'سيور رفيعة أنيقة وكعب متوسط مناسب للسهرات الطويلة.' },
      { t: 'لوفر شمواه ناعم بتطريز رمزي', en: 'Embroidered Suede Loafers', p: 28, op: 35, s: ['37', '38', '39', '40'], c: ['#3B020D', '#1E3A8A'], desc: 'خياطة يدوية دقيقة ومظهر كلاسيكي كشخة بلبق للجينز.' },
      { t: 'حذاء كعب هريرة كيتن هيل رسمي', en: 'Kitten Heel Formal Pumps', p: 26, op: 33, s: ['36', '37', '38', '39', '40'], c: ['#3B020D', '#0A0A0A'], desc: 'كعب واطي أنيق ومريح للمكتب والاجتماعات الطويلة.' },
      { t: 'سنيكرز كانفاس قماش قطني صيفي', en: 'Summer Canvas Lace-Up Shoes', p: 16, op: 20, s: ['36', '37', '38', '39', '40'], c: ['#FFFFFF', '#3B020D', '#0A0A0A'], desc: 'تهوية طبيعية وخفيف جداً وسهل الغسيل.' },
      { t: 'بوت جلد مطر مانع للماء مبطن', en: 'Waterproof Rain Ankle Boots', p: 24, op: 30, s: ['37', '38', '39', '40'], c: ['#0A0A0A', '#3B020D'], desc: 'حماية كاملة من المطر والوحل مع شكل أنيق وعصري.' },
      { t: 'صندل أصبع جلد طبيعي مريح', en: 'Orthopedic Leather Thong Sandal', p: 18, op: 23, s: ['36', '37', '38', '39', '40'], c: ['#78350F', '#3B020D'], desc: 'فرشة طبية تدعم قوس القدم وتقلل تعب الوقوف.' },
      { t: 'حذاء كعب عريض بلاتفورم مخمل', en: 'Velvet Platform Block Heels', p: 33, op: 42, s: ['36', '37', '38', '39'], c: ['#3B020D', '#0A0A0A'], desc: 'ثبات عالي جداً مع ارتفاع مميز وفخامة تلفت الأنظار.' },
      { t: 'شوز سبورت جري بدون رباط سليب أون', en: 'Slip-On Mesh Athletic Shoes', p: 21, op: 27, s: ['36', '37', '38', '39', '40'], c: ['#18181B', '#3B020D', '#FFFFFF'], desc: 'قماش شبكي مطاطي بلبس لحاله بدون غلبة الرباط.' },
      { t: 'صندل كعب شفاف بتصميم عصري', en: 'Lucite Clear Heeled Sandals', p: 26, op: 33, s: ['36', '37', '38', '39'], c: ['#FFFFFF', '#3B020D'], desc: 'موضة حديثة جداً تبرز جمال القدم وتتماشى مع أي لون فستان.' },
      { t: 'حذاء فلات برأس مدبب وجلد تمساح', en: 'Pointed Croc-Embossed Flats', p: 22, op: 28, s: ['36', '37', '38', '39', '40'], c: ['#3B020D', '#0A0A0A'], desc: 'رسمي وشيك ومريح وبعطي لوك فاخر للملابس الرسمية.' },
      { t: 'بوت كومبات جلد برباط ونعل سميك', en: 'Lace-Up Combat Leather Boots', p: 37, op: 46, s: ['37', '38', '39', '40', '41'], c: ['#0A0A0A', '#3B020D'], desc: 'متانة عالية وستايل ستريت وير قوي وعصري جداً.' },
    ],
  },

  // 3. Hijab (25)
  {
    subCategory: 'hijab',
    category: 'women',
    items: [
      { t: 'شيلة شيفون ملكي تركي كريب', en: 'Royal Turkish Chiffon Hijab', p: 6, op: 9, s: ['Standard 70x190'], c: ['#3B020D', '#FFF9F0', '#0A0A0A', '#94A3B8'], desc: 'شيفون أصلي ما بزحلق ولا ببهت، ثابتة باللبس وتعطي انسيابية فخمة.' },
      { t: 'طرحة كريب جورجيت فاخرة', en: 'Premium Georgette Crepe Scarf', p: 7, op: 10, s: ['Standard 75x200'], c: ['#3B020D', '#E2E8F0', '#78716C'], desc: 'قماش غير شفاف وسهل اللف بدون كثرة دبابيس وخياطة مبرومة نظيفة.' },
      { t: 'حجاب حرير طبيعي بطبعة ملكية', en: 'Pure Silk Printed Hijab', p: 14, op: 19, s: ['Square 90x90'], c: ['#3B020D', '#FDE047', '#1E3A8A'], desc: 'حرير 100% ناعم ولمعة هادئة وراقية للزيارات والمناسبات.' },
      { t: 'بندانة قطن ليكرا أصلية مانعة للانزلاق', en: 'Anti-Slip Cotton Lycra Undercap', p: 3, op: 5, s: ['Free Size'], c: ['#0A0A0A', '#FFFFFF', '#3B020D', '#D1D5DB'], desc: 'قطن ناعم مسامي ما بضغط على الراس ولا بسبب صداع وثابتة طول اليوم.' },
      { t: 'شال قطن مجعد ترندي كاجوال', en: 'Crinkle Cotton Casual Shawl', p: 5, op: 8, s: ['Standard 80x190'], c: ['#3B020D', '#F472B6', '#10B981'], desc: 'ما بحتاج كوي نهائياً ومثالي للدوام الجامعي والمشاوير السريعة.' },
      { t: 'طقم مثبتات وملاقط حجاب مغناطيسية', en: 'Magnetic Hijab Pin Set', p: 4, op: 6, s: ['Pack of 4'], c: ['#D4AF37', '#E5E7EB', '#3B020D'], desc: 'مغناطيس قوي جداً بحافظ على الشيلة بدون ما يخزق القماش نهائياً.' },
      { t: 'طرحة قطن مديني أصلي بارد', en: 'Madini Soft Cotton Scarf', p: 6, op: 9, s: ['Standard 70x180'], c: ['#FFFBEB', '#3B020D', '#374151'], desc: 'قطن طبيعي 100% بارد بالصيف وناعم ومريح جداً عالبشرة.' },
      { t: 'شيلة ساتان حريري لماع للسهرة', en: 'Lustrous Satin Silk Wrap', p: 8, op: 12, s: ['Standard 70x190'], c: ['#3B020D', '#0A0A0A', '#C084FC'], desc: 'إطلالة مسائية فاخرة وانعكاس ضوء خافت يعطيك طلة الأميرات.' },
      { t: 'بندانة سيليكون بقبعة تغطية كاملة', en: 'Full Coverage Silicon Grip Cap', p: 4, op: 6, s: ['Free Size'], c: ['#0A0A0A', '#FFFFFF'], desc: 'شريط سيليكون داخلي يضمن ثبات الحجاب حتى في أصعب الظروف.' },
      { t: 'شال جيرسي مطاطي فاخر ناعم', en: 'Premium Modal Jersey Shawl', p: 7, op: 10, s: ['Standard 75x190'], c: ['#3B020D', '#18181B', '#64748B'], desc: 'مطاطية مريحة ولف سريع بدقيقة واحدة بدون ولا دبوس.' },
      { t: 'طرحة شيفون مطرزة أطرافها بالدانتيل', en: 'Lace-Trimmed Chiffon Hijab', p: 9, op: 13, s: ['Standard 70x190'], c: ['#3B020D', '#FFFFFF', '#FCE7F3'], desc: 'دانتيل فرنسي رقيق يضفي لمسة رومانسية أنيقة لحجابك.' },
      { t: 'طرحة كريب حرير بلون بورغندي حكاية', en: 'HKAYA Signature Burgundy Silk Crepe', p: 8, op: 11, s: ['Standard 75x200'], c: ['#3B020D'], desc: 'اللون الأيقوني لعلامة حكاية، خامة فخمة تثبت حضورك.' },
      { t: 'شيلة صوف كشميري دافئة للشتاء', en: 'Winter Cashmere Blend Wrap', p: 11, op: 15, s: ['Standard 80x200'], c: ['#3B020D', '#78716C', '#1E293B'], desc: 'دفء استثنائي وخفة وزن تحميك من برد الشتاء بأناقة.' },
      { t: 'طرحة أورجانزا مبطنة للمناسبات', en: 'Embroidered Organza Hijab', p: 12, op: 16, s: ['Standard 70x180'], c: ['#3B020D', '#FEF08A'], desc: 'شكل ثابت وأنيق يعطي وقار وفخامة مع الفساتين الرسمية.' },
      { t: 'بندانة كلاسيك مفتوحة من الخلف', en: 'Open Back Cotton Tube Cap', p: 2.5, op: 4, s: ['Free Size'], c: ['#0A0A0A', '#FFFFFF', '#3B020D'], desc: 'مريحة للشعر الطويل وتسمح بالتهوية الممتازة.' },
      { t: 'شال كتان طبيعي منسوج يدوياً', en: 'Handwoven Pure Linen Scarf', p: 10, op: 14, s: ['Standard 70x190'], c: ['#E5E7EB', '#3B020D'], desc: 'طبيعي وصحي ومريح جداً في الأيام الحارة.' },
      { t: 'طرحة ليزر كت بأطراف مقصوصة دقيقة', en: 'Laser-Cut Wave Edge Hijab', p: 7.5, op: 11, s: ['Standard 75x190'], c: ['#3B020D', '#E0E7FF'], desc: 'قص ليزري متقن يمنع تنسيل الخيوط ويعطي حواف ناعمة.' },
      { t: 'شيلة شيفون مع كشكش ناعم', en: 'Ruffled Edge Chiffon Scarf', p: 8.5, op: 12, s: ['Standard 70x190'], c: ['#F472B6', '#3B020D'], desc: 'حركة أنثوية لطيفة تناسب الفساتين الصيفية والعبايات.' },
      { t: 'طرحة فوال قطني سويسري خفيف', en: 'Swiss Voile Cotton Hijab', p: 9, op: 13, s: ['Square 110x110'], c: ['#FFFFFF', '#3B020D'], desc: 'شفافية خفيفة وقوام ناعم وخفة متناهية في اللبس.' },
      { t: 'مجموعة 6 دبابيس لؤلؤية فاخرة', en: 'Luxury Pearl Hijab Pins Pack', p: 3.5, op: 5, s: ['Pack of 6'], c: ['#FFFFFF', '#3B020D'], desc: 'رؤوس لؤلؤ ناعمة وإبر فولاذية حادة لا تؤذي قماش الحجاب.' },
      { t: 'شال كريب مطاط بكسرات ناعمة', en: 'Pleated Stretch Crepe Scarf', p: 7, op: 10, s: ['Standard 70x180'], c: ['#3B020D', '#64748B'], desc: 'كسرات دائمة لا تختفي مع الغسيل وتمنح الحجاب حجماً متناسقاً.' },
      { t: 'طرحة حرير جورجيت بتدرج ألوان أومبري', en: 'Ombre Gradient Georgette Hijab', p: 8.5, op: 12, s: ['Standard 75x195'], c: ['#3B020D', '#F43F5E'], desc: 'تدرج لوني ساحر ينسجم مع عدة قطع ملابس مختلفة.' },
      { t: 'بندانة كويتي قطنية مع ربطة عنق', en: 'Kuwaiti Tie-Back Undercap', p: 3.5, op: 5, s: ['Free Size'], c: ['#0A0A0A', '#3B020D', '#FFFFFF'], desc: 'تحكم كامل بدرجة الشد المناسبة لراحتك.' },
      { t: 'شيلة مخمل شتوية مطرزة', en: 'Velvet Winter Embroidered Shawl', p: 13, op: 18, s: ['Standard 70x190'], c: ['#3B020D', '#0A0A0A'], desc: 'فخامة ملكية دافئة تليق بالمناسبات الشتوية الراقية.' },
      { t: 'طرحة قطن ليكرا ناعمة يومية', en: 'Daily Soft Stretch Cotton Hijab', p: 5.5, op: 8, s: ['Standard 70x180'], c: ['#3B020D', '#94A3B8'], desc: 'الخيار العملي المفضل لكل يوم بدون أي تعقيد.' },
    ],
  },

  // 4. Men Clothing (25)
  {
    subCategory: 'men_clothing',
    category: 'men',
    items: [
      { t: 'قميص أوكسفورد قطن كلاسيك رسمي', en: 'Classic Oxford Cotton Shirt', p: 24, op: 30, s: ['M', 'L', 'XL', '2XL'], c: ['#FFFFFF', '#3B020D', '#93C5FD'], desc: 'قطن مصري 100% وياقة مشدودة بأزرار تضمن وقفة رسمية وكشخة تامة.' },
      { t: 'هودي ستريت وير تقيل كولكشن حكاية', en: 'HKAYA Signature Heavyweight Hoodie', p: 25, op: 32, s: ['M', 'L', 'XL', '2XL', '3XL'], c: ['#3B020D', '#0A0A0A', '#E5E7EB'], desc: 'وزن 450 جرام قطن مبطن فليس، دفى وهيبة بقصة أوفر سايز معاصرة.' },
      { t: 'بليزر رجالي كاجوال سليم فيت', en: 'Slim-Fit Casual Blazer', p: 44, op: 55, s: ['48', '50', '52', '54'], c: ['#3B020D', '#1F2937', '#374151'], desc: 'خامة صوفية خفيفة وقصة سليم بتعطيك مظهر أنيق وجذاب بالمناسبات والعمل.' },
      { t: 'تيشيرت أوفر سايز قطن 100% ثقيل', en: 'Heavyweight Oversized Tee', p: 14, op: 18, s: ['S', 'M', 'L', 'XL', '2XL'], c: ['#0A0A0A', '#3B020D', '#FFFFFF'], desc: 'قبة مشدودة وقماش ثقيل ما بتمدد مع الغسيل بتفصيل ستريت وير فاخر.' },
      { t: 'بنطال تشينو كلاسيكي قطن مطاطي', en: 'Stretch Cotton Chino Pants', p: 22, op: 28, s: ['30', '32', '34', '36', '38'], c: ['#3B020D', '#D1D5DB', '#1E293B'], desc: 'مرن ومريح جداً للدوام والحركة اليومية مع قصّة مستقيمة أنيقة.' },
      { t: 'كنزة صوفية ميرينو بياقة دائرية', en: 'Merino Wool Crewneck Sweater', p: 26, op: 34, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#0A0A0A', '#475569'], desc: 'صوف ميرينو أصلي فائق النعومة، خفيف بالوزن ودافئ جداً.' },
      { t: 'بنطال كارجو عصري بجيوب جانبية', en: 'Tactical Urban Cargo Pants', p: 23, op: 29, s: ['M', 'L', 'XL', '2XL'], c: ['#1F2937', '#3B020D', '#365314'], desc: 'جيوب عملية وخامة متينة مقاومة للاهتراء وسلسة بالحركة.' },
      { t: 'قميص لينين صيفي بياقة ماو صينية', en: 'Grandad Collar Linen Shirt', p: 20, op: 26, s: ['M', 'L', 'XL'], c: ['#FFFFFF', '#E2E8F0', '#3B020D'], desc: 'بارد ومنعش لأيام الصيف والمشاوير البحرية بقصة مريحة.' },
      { t: 'جاكيت بومبر عصري بسحاب مزدوج', en: 'Modern Dual-Zip Bomber Jacket', p: 38, op: 48, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#0A0A0A', '#1E3A8A'], desc: 'بطانة حريرية وسحاب نحاسي متين وستايش كشخة بلبق لكل المشاوير.' },
      { t: 'سويت شيرت كرو نك مينيمال', en: 'Minimalist Crewneck Sweatshirt', p: 19, op: 24, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#475569', '#0A0A0A'], desc: 'تصميم هادئ بدون رسومات فجة وخامة قطنية ناعمة جداً.' },
      { t: 'جاكيت جينز رجالي بتفصيل تراكر', en: 'Classic Denim Trucker Jacket', p: 32, op: 40, s: ['M', 'L', 'XL', '2XL'], c: ['#1E3A8A', '#0F172A'], desc: 'جينز قطن 100% ثقيل مع أزرار معدنية مختومة كولكشن حكاية.' },
      { t: 'بنطال جينز كلاسيك بقصة مستقيمة', en: 'Straight Leg Classic Jeans', p: 24, op: 30, s: ['31', '32', '33', '34', '36'], c: ['#1E293B', '#3B020D'], desc: 'درجة زراق كلاسيكية مع مرونة خفيفة لراحة لا تضاهى.' },
      { t: 'بولو شيرت بيكيه قطن ممتاز', en: 'Classic Pique Cotton Polo', p: 16, op: 21, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#FFFFFF', '#0A0A0A'], desc: 'ياقة متماسكة وقصة تبرز الأكتاف وخامة تسمح بمرور الهواء.' },
      { t: 'طقم رياضي هودي وبنطال قطني كامل', en: 'Full Fleece Tracksuit Set', p: 39, op: 49, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#18181B'], desc: 'طقم متناسق بجودة عالية ومثالي للجيم والسفر والراحة اليومية.' },
      { t: 'معطف ترانش طويل رسمي للشتاء', en: 'Double-Breasted Winter Overcoat', p: 65, op: 85, s: ['48', '50', '52', '54'], c: ['#3B020D', '#0A0A0A', '#475569'], desc: 'قصة إيطالية ملكية وصوف ثقيل يعكس هيبة استثنائية.' },
      { t: 'فيست صوف محبوك بياقة V', en: 'V-Neck Knitted Sweater Vest', p: 17, op: 22, s: ['M', 'L', 'XL'], c: ['#3B020D', '#CBD5E1'], desc: 'ينسجم بشكل مثالي فوق القمصان لإطلالة كلاسيكية ذكية.' },
      { t: 'قميص كاروهات فرانيل شتوي', en: 'Heavyweight Flannel Plaid Shirt', p: 21, op: 27, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#1E293B'], desc: 'نسيج سميك ودافئ جداً يمكن ارتداؤه مفتوحاً كجاكيت خفيف.' },
      { t: 'بنطال رياضي جوغر قطني مريح', en: 'Tapered Fit Jogger Pants', p: 18, op: 23, s: ['M', 'L', 'XL', '2XL'], c: ['#0A0A0A', '#3B020D', '#64748B'], desc: 'أساور كاحل مريحة وحزام خصر مطاطي برباط سميك.' },
      { t: 'جاكيت جلد بايكر كلاسيك', en: 'Classic Biker Faux Leather Jacket', p: 48, op: 62, s: ['M', 'L', 'XL'], c: ['#0A0A0A', '#3B020D'], desc: 'سحابات كروم متينة وقصة رجولية حادة تمنحك إطلالة فريدة.' },
      { t: 'شورت صيفي كاجوال قطن تويل', en: 'Summer Cotton Twill Shorts', p: 14, op: 18, s: ['30', '32', '34', '36'], c: ['#D1D5DB', '#3B020D', '#1E293B'], desc: 'طول مثالي فوق الركبة وجيوب عميقة ومريح للمشاوير الصيفية.' },
      { t: 'تيشيرت بياقة عالية هاف نك', en: 'Mock Neck Minimalist T-Shirt', p: 15, op: 20, s: ['S', 'M', 'L', 'XL'], c: ['#0A0A0A', '#3B020D', '#FFFFFF'], desc: 'يعطي مظهراً عصرياً فخماً خصوصاً عند ارتدائه أسفل البليزر.' },
      { t: 'قميص ساتان سهرة أسود فاخر', en: 'Luxury Black Satin Party Shirt', p: 27, op: 35, s: ['M', 'L', 'XL'], c: ['#0A0A0A', '#3B020D'], desc: 'لمعة خافتة وأزرار لؤلؤية لإطلالة سهرة تلفت كل الأنظار.' },
      { t: 'جاكيت بافر منفوخ عازل للبرد', en: 'Insulated Puffer Winter Jacket', p: 45, op: 58, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#0A0A0A'], desc: 'حشوة فايبر حراري تحميك في أيام المطر والصقيع.' },
      { t: 'كنزة صوفية بسحاب نصف ياقة', en: 'Quarter-Zip Knit Pullover', p: 24, op: 30, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#334155'], desc: 'مزيج رائع بين الكاجوال والرسمي ومريح في ساعات العمل الطويلة.' },
      { t: 'دشداشة ثوب أردني مطور كولكشن فخامة', en: 'Modern Tailored Arabic Thobe', p: 35, op: 45, s: ['54', '56', '58', '60'], c: ['#FFFFFF', '#3B020D', '#E2E8F0'], desc: 'قماش ياباني بارد لا يتجعد وتفصيل خياطة أردنية عالية المهارة.' },
    ],
  },

  // 5. Men Shoes (25)
  {
    subCategory: 'men_shoes',
    category: 'men',
    items: [
      { t: 'حذاء ديربي جلد طبيعي إيطالي كلاسيك', en: 'Classic Italian Leather Derby', p: 39, op: 49, s: ['40', '41', '42', '43', '44', '45'], c: ['#3B020D', '#0A0A0A', '#78350F'], desc: 'جلد طبيعي فاخر بلمعة يدوية ونعل مخيط يدوم لسنوات.' },
      { t: 'سنيكرز جلد أبيض مينيمال كشخة', en: 'Minimalist White Leather Sneaker', p: 28, op: 36, s: ['40', '41', '42', '43', '44', '45'], c: ['#FFFFFF', '#3B020D'], desc: 'شكل نقي ونظيف مع وسادة قدم ميموري فوم مريحة طوال اليوم.' },
      { t: 'حذاء تشيلسي بوت جلد كاحل', en: 'Leather Chelsea Ankle Boots', p: 42, op: 52, s: ['41', '42', '43', '44', '45'], c: ['#0A0A0A', '#3B020D', '#78350F'], desc: 'سهل الارتداء ومقاوم للماء مع مظهر رجالي واثق وفخم.' },
      { t: 'لوفر كاجوال جلد سويدي مرن', en: 'Suede Driving Loafers', p: 32, op: 40, s: ['40', '41', '42', '43', '44'], c: ['#3B020D', '#1E3A8A', '#78350F'], desc: 'نعل مطاطي مقسم يمنحك راحة تامة أثناء القيادة والمشي اليومي.' },
      { t: 'حذاء أوكسفورد رسمي للمناسبات والبدلات', en: 'Formal Cap-Toe Oxford Shoes', p: 45, op: 58, s: ['40', '41', '42', '43', '44'], c: ['#0A0A0A', '#3B020D'], desc: 'الخيار الأول للبدل الرسمية والأعراس بتفصيل كلاسيكي رفيع.' },
      { t: 'سنيكرز راننج رياضي عالي الأداء', en: 'High-Performance Running Shoes', p: 29, op: 38, s: ['40', '41', '42', '43', '44', '45'], c: ['#0A0A0A', '#3B020D', '#FFFFFF'], desc: 'نعل هيدروليكي يمتص الصدمات مع نسيج شبكي يسمح بتهوية القدمين.' },
      { t: 'صندل شرقي جلد طبيعي فاخر مطور', en: 'Traditional Modern Leather Sandal', p: 26, op: 34, s: ['40', '41', '42', '43', '44'], c: ['#78350F', '#3B020D', '#0A0A0A'], desc: 'فرشة طبية مبطنة وأرضية خفيفة تليق بالثياب والدشاديش.' },
      { t: 'حذاء مونك ستراب بحزامين معدنيين', en: 'Double Monk Strap Leather Shoes', p: 43, op: 54, s: ['41', '42', '43', '44'], c: ['#3B020D', '#0A0A0A'], desc: 'إبزيمين من الكروم اللامع ولمسة عصرية لأصحاب الذوق المتميز.' },
      { t: 'سنيكرز هاي توب جلد بتصميم عصري', en: 'High-Top Streetwear Sneaker', p: 33, op: 42, s: ['40', '41', '42', '43', '44'], c: ['#3B020D', '#0A0A0A', '#FFFFFF'], desc: 'دعم كامل للكاحل ومظهر ستريت وير يواكب أحدث صيحات الموضة.' },
      { t: 'بوت هايكنج جبلي خفيف ومقاوم للانزلاق', en: 'Lightweight Mountain Trail Boots', p: 38, op: 48, s: ['41', '42', '43', '44', '45'], c: ['#334155', '#3B020D'], desc: 'أرضية فيبرام خشنة توفر ثباتاً ممتازاً على كافة التضاريس.' },
      { t: 'سليب أون كانفاس خفيف بدون رباط', en: 'Canvas Slip-On Deck Shoes', p: 18, op: 23, s: ['40', '41', '42', '43', '44'], c: ['#1E293B', '#3B020D', '#FFFFFF'], desc: 'خفة لا تصدق وسهولة في اللبس والمشاوير الصيفية السريعة.' },
      { t: 'حذاء بروغ مزين بنقوش تخريم كلاسيك', en: 'Full Brogue Wingtip Shoes', p: 44, op: 56, s: ['41', '42', '43', '44'], c: ['#78350F', '#3B020D'], desc: 'نقوش يدوية راقية تعكس عراقة الحرفية الكلاسيكية.' },
      { t: 'شوز ترينينج للجيم ورفع الأثقال', en: 'Cross-Training Flat Sole Shoes', p: 27, op: 35, s: ['40', '41', '42', '43', '44', '45'], c: ['#0A0A0A', '#3B020D'], desc: 'أرضية مسطحة غير قابلة للانضغاط تمنحك ثباتاً تاماً في التمارين.' },
      { t: 'سليبر منزلي جلد طبيعي مبطن', en: 'Plush Leather House Slippers', p: 15, op: 20, s: ['41-42', '43-44'], c: ['#3B020D', '#78350F'], desc: 'فخامة ودفء داخل المنزل بنعل مطاطي صامت على الباركيه والرخام.' },
      { t: 'حذاء لوفر مع شراشيب كلاسيكية تاسيليز', en: 'Tassel Leather Loafers', p: 36, op: 45, s: ['40', '41', '42', '43', '44'], c: ['#3B020D', '#0A0A0A'], desc: 'شياكة إيطالية كشخة تمنح إطلالتك اليومية تميزاً واضحاً.' },
      { t: 'سنيكرز ريترو بتصميم كلاسيكي قديم', en: 'Retro Heritage Sneaker', p: 30, op: 38, s: ['40', '41', '42', '43', '44'], c: ['#E2E8F0', '#3B020D'], desc: 'مزيج شمواه وجلد مستوحى من حقبة الثمانينيات الذهبية.' },
      { t: 'بوت عسكري خفيف الوزن جلد برباط', en: 'Tactical Lightweight Duty Boots', p: 39, op: 50, s: ['41', '42', '43', '44', '45'], c: ['#0A0A0A', '#3B020D'], desc: 'تحمل قوي وصمود في أصعب الظروف مع خفة وسلاسة.' },
      { t: 'صندل أصبع شاطئي بنعل فلين طبيعي', en: 'Cork Footbed Leather Slide Sandal', p: 20, op: 26, s: ['40', '41', '42', '43', '44'], c: ['#78350F', '#3B020D'], desc: 'يتشكل الفلين الطبيعي على مقاس قدمك لراحة قصوى.' },
      { t: 'حذاء سنيكرز كاجوال بياقة صوفية', en: 'Wool Blend Casual Sneaker', p: 31, op: 39, s: ['40', '41', '42', '43', '44'], c: ['#475569', '#3B020D'], desc: 'دافئ ومثالي لأيام الخريف والشتاء الباردة.' },
      { t: 'حذاء دربي بنعل سميك تشانكي', en: 'Chunky Lug Sole Derby Shoes', p: 41, op: 52, s: ['40', '41', '42', '43', '44'], c: ['#0A0A0A', '#3B020D'], desc: 'مزيج قوي بين الرسمية والجرأة المعاصرة.' },
      { t: 'حذاء فلات جلد ناعم للمشي الطويل', en: 'Comfort Walking Leather Shoes', p: 34, op: 42, s: ['40', '41', '42', '43', '44', '45'], c: ['#3B020D', '#0A0A0A'], desc: 'مرونة فائقة تقلل من إجهاد الركبتين وأسفل الظهر.' },
      { t: 'سنيكرز سبورت بدون رباط نسيج مرن', en: 'Knit Sock Runner Sneaker', p: 25, op: 32, s: ['40', '41', '42', '43', '44'], c: ['#0A0A0A', '#3B020D', '#FFFFFF'], desc: 'يحتضن القدم كالشراب ويوفر خفة لا تصدق.' },
      { t: 'حذاء لوفر قارب دوك سايدز', en: 'Classic Boat Deck Shoes', p: 29, op: 37, s: ['40', '41', '42', '43', '44'], c: ['#78350F', '#1E3A8A'], desc: 'جلد مقاوم للأملاح والماء مع أربطة جلدية متينة.' },
      { t: 'بوت تشوكا جلد سويدي بثلاث فتحات', en: 'Suede Chukka Desert Boots', p: 35, op: 44, s: ['41', '42', '43', '44'], c: ['#78716C', '#3B020D'], desc: 'خامة صحراوية أصلية تتماشى بروعة مع بناطيل الجينز.' },
      { t: 'حذاء سهرة ورنيش لامع مع ربطة حريرية', en: 'Patent Leather Tuxedo Shoes', p: 49, op: 65, s: ['40', '41', '42', '43', '44'], c: ['#0A0A0A'], desc: 'الرفيق الحصري لبدلة السهرة الرسمية في ليالي العمر.' },
    ],
  },

  // 6. Kids (25)
  {
    subCategory: 'kids',
    category: 'family',
    items: [
      { t: 'طقم أطفال قطعتين قطن عضوي ناعم', en: 'Organic Cotton Kids 2-Piece Set', p: 15, op: 20, s: ['2Y', '3Y', '4Y', '6Y', '8Y'], c: ['#3B020D', '#93C5FD', '#FEF08A'], desc: 'قطن ناعم جداً ولطيف عالبشرة مع تفصيل مريح للعب والحركة.' },
      { t: 'فستان بناتي تول وأورجانزا للأعياد', en: 'Girls Holiday Tulle Dress', p: 22, op: 28, s: ['3Y', '4Y', '6Y', '8Y', '10Y'], c: ['#FCE7F3', '#3B020D', '#FFFFFF'], desc: 'فستان أميرات مبطن بالقطن مع فيونكة ظهر أنيقة ولمعة راقية.' },
      { t: 'هودي ولادي دافئ مع جيب كانغرو', en: 'Boys Fleece Kangaroo Hoodie', p: 14, op: 18, s: ['4Y', '6Y', '8Y', '10Y', '12Y'], c: ['#3B020D', '#18181B', '#3B82F6'], desc: 'قطن مبطن فليس يحمي طفلك من البرد مع غطاء رأس متماسك.' },
      { t: 'بدلة ولادي رسمية 3 قطع للمناسبات', en: 'Boys 3-Piece Formal Suit', p: 32, op: 42, s: ['4Y', '6Y', '8Y', '10Y'], c: ['#3B020D', '#0A0A0A', '#1E293B'], desc: 'جاكيت وفيست وبنطال بقصة شيك تجعل طفلك نجماً في أي مناسبة.' },
      { t: 'بيجاما أطفال قطنية دافئة بنقشات ممتعة', en: 'Kids Snug-Fit Cotton Pajama', p: 9, op: 13, s: ['2Y', '4Y', '6Y', '8Y'], c: ['#3B020D', '#E2E8F0'], desc: 'مطاط ناعم على الخصر وخياطة مسطحة تضمن نوماً هنيئاً ومريحاً.' },
      { t: 'جاكيت جينز ولادي بتطريز ظهر مرح', en: 'Kids Embroidered Denim Jacket', p: 18, op: 24, s: ['4Y', '6Y', '8Y', '10Y'], c: ['#3B82F6', '#1E3A8A'], desc: 'متانة عالية تتحمل شقاوة الأطفال مع مظهر عصري أنيق.' },
      { t: 'جاكيت بافر أطفال مقاوم للمطر', en: 'Kids Waterproof Puffer Jacket', p: 25, op: 32, s: ['3Y', '4Y', '6Y', '8Y', '10Y'], c: ['#3B020D', '#EF4444', '#0A0A0A'], desc: 'عازل حراري عالي الجودة يحمي طفلك من الصقيع في أيام الشتاء.' },
      { t: 'فستان بناتي صيفي قطن بطبعة زهور', en: 'Girls Floral Summer Cotton Dress', p: 13, op: 17, s: ['2Y', '4Y', '6Y', '8Y'], c: ['#F472B6', '#FEF08A'], desc: 'خفيف وبارد ومناسب للنزهات العائلية والأيام المشمسة.' },
      { t: 'بنطال جينز أطفال مطاطي مريح', en: 'Kids Flex Stretch Denim Jeans', p: 12, op: 16, s: ['4Y', '6Y', '8Y', '10Y', '12Y'], c: ['#1E3A8A', '#0F172A'], desc: 'حزام خصر داخلي قابل للتعديل ليتناسب مع نمو طفلك.' },
      { t: 'تيشيرت أطفال قطن جرافيك مرح', en: 'Kids 100% Cotton Graphic Tee', p: 7, op: 10, s: ['2Y', '4Y', '6Y', '8Y', '10Y'], c: ['#FFFFFF', '#3B020D', '#0A0A0A'], desc: 'ألوان ثابتة لا تتأثر بالغسيل المتكرر ونعومة فائقة.' },
      { t: 'تنورة بناتي بليسيه مع شورت داخلي', en: 'Girls Pleated Skort with Shorts', p: 11, op: 15, s: ['4Y', '6Y', '8Y', '10Y'], c: ['#3B020D', '#E2E8F0'], desc: 'شورت داخلي يمنح بنوتتك حرية الحركة واللعب براحة تامة.' },
      { t: 'سويتر صوف تريكو محبوك ناعم للأطفال', en: 'Kids Cable-Knit Soft Sweater', p: 16, op: 21, s: ['3Y', '4Y', '6Y', '8Y'], c: ['#3B020D', '#FFFBEB'], desc: 'غرز حياكة كلاسيكية مريحة لا تسبب أي حكة.' },
      { t: 'أفرول جينز أطفال كلاسيك', en: 'Kids Classic Denim Dungarees', p: 17, op: 23, s: ['2Y', '4Y', '6Y', '8Y'], c: ['#2563EB', '#1E293B'], desc: 'حمالات قابلة للتعديل وأزرار جانبية لسهولة الارتداء.' },
      { t: 'كارديجان بناتي صوف بنقشة لؤلؤ', en: 'Girls Pearl-Button Cardigan', p: 15, op: 20, s: ['3Y', '4Y', '6Y', '8Y'], c: ['#FCE7F3', '#3B020D'], desc: 'لمسة أنثوية ناعمة ترتدى فوق الفساتين والقمصان.' },
      { t: 'شورت سباحة أطفال سريع الجفاف', en: 'Kids Quick-Dry Swim Trunks', p: 8, op: 12, s: ['4Y', '6Y', '8Y', '10Y'], c: ['#3B82F6', '#10B981'], desc: 'بطانة شبكية مريحة وقماش مقاوم للكلور والشمس.' },
      { t: 'قميص بولو أطفال كلاسيك قطني', en: 'Kids Classic Cotton Polo', p: 10, op: 14, s: ['3Y', '4Y', '6Y', '8Y', '10Y'], c: ['#3B020D', '#FFFFFF'], desc: 'إطلالة أنيقة للأولاد تناسب الزيارات والمناسبات العائلية.' },
      { t: 'طقم رياضي مدرسي قطن كامل', en: 'Kids School Tracksuit Set', p: 19, op: 25, s: ['6Y', '8Y', '10Y', '12Y'], c: ['#1E293B', '#3B020D'], desc: 'تحمل قوي ومناسب لدروس الرياضة والأنشطة اليومية.' },
      { t: 'فستان مخمل بناتي شتوي بأكمام طويلة', en: 'Girls Long-Sleeve Velvet Dress', p: 20, op: 26, s: ['3Y', '4Y', '6Y', '8Y'], c: ['#3B020D', '#0A0A0A'], desc: 'دفء وفخامة مخملية أنيقة مع تطريز ناعم على الياقة.' },
      { t: 'بنطال رياضي جوغر قطني أطفال', en: 'Kids Cotton Fleece Joggers', p: 10, op: 14, s: ['4Y', '6Y', '8Y', '10Y'], c: ['#3B020D', '#475569'], desc: 'حزام مطاطي مرن وأساور كاحل محكمة لراحة اللعب.' },
      { t: 'بلوزة قطنية بياقة كشكش بناتي', en: 'Girls Ruffle Collar Blouse', p: 12, op: 16, s: ['3Y', '4Y', '6Y', '8Y'], c: ['#FFFFFF', '#FDF2F8'], desc: 'تفاصيل كشكش رقيقة تعطي طلة طفولية بريئة وجميلة.' },
      { t: 'جاكيت فليس صوف شتوي خفيف', en: 'Kids Lightweight Fleece Zip Jacket', p: 14, op: 19, s: ['4Y', '6Y', '8Y', '10Y'], c: ['#3B020D', '#0D9488'], desc: 'طبقة تدفئة ممتازة وسهلة الحمل في الحقيبة المدرسية.' },
      { t: 'قميص كتان ولادي بياقة ماندارين', en: 'Boys Mandarin Collar Linen Shirt', p: 13, op: 17, s: ['3Y', '4Y', '6Y', '8Y'], c: ['#FFFFFF', '#3B020D'], desc: 'شياكة صيفية مريحة لا تعيق حركة ونشاط طفلك.' },
      { t: 'تنورة توتو منفوشة بناتي مع بريق', en: 'Girls Glittering Tutu Skirt', p: 11, op: 15, s: ['2Y', '4Y', '6Y', '8Y'], c: ['#F472B6', '#E0E7FF'], desc: 'طبقات تول ناعمة مع لمعة براقة تسعد قلب كل طفلة.' },
      { t: 'طقم كنزة وبنطال تريكو شتوي', en: 'Kids Knitted Sweater & Pants Set', p: 21, op: 27, s: ['2Y', '3Y', '4Y', '6Y'], c: ['#3B020D', '#CBD5E1'], desc: 'تنسيق أنيق ومتكامل يوفر دفئاً شاملاً في الأيام الباردة.' },
      { t: 'قبعة وقفازات صوفية أطفال دافئة', en: 'Kids Beanie & Gloves Warm Set', p: 6, op: 9, s: ['Free Size Kids'], c: ['#3B020D', '#18181B'], desc: 'صوف ناعم مبطن بفرو لطيف يحمي الرأس واليدين من الصقيع.' },
    ],
  },

  // 7. Kids Shoes (25)
  {
    subCategory: 'kids_shoes',
    category: 'family',
    items: [
      { t: 'سنيكرز أطفال بإغلاق فيلكرو لاصق سهل', en: 'Kids Easy Strap Velcro Sneaker', p: 16, op: 22, s: ['24', '26', '28', '30', '32', '34'], c: ['#FFFFFF', '#3B020D', '#3B82F6'], desc: 'سهل اللبس والخلع لطفلك لحاله مع نعل مطاطي مانع للانزلاق وخفيف.' },
      { t: 'حذاء سهرة بناتي لامع مع فيونكة', en: 'Girls Sparkly Bow Party Shoes', p: 18, op: 24, s: ['25', '27', '29', '31', '33'], c: ['#FCE7F3', '#3B020D', '#D4AF37'], desc: 'حزام كاحل آمن ولمعان ساحر وفرشة طبية مبطنة لراحة الأقدام الصغيرة.' },
      { t: 'بوت شتوي أطفال مبطن بفرو دافئ', en: 'Kids Fur-Lined Winter Boots', p: 22, op: 28, s: ['26', '28', '30', '32', '34'], c: ['#3B020D', '#0A0A0A', '#78350F'], desc: 'حماية كاملة من البرد والرطوبة مع نعل خشن يمنع التزحلق.' },
      { t: 'صندل صيفي للأطفال بحزامين قابلين للتعديل', en: 'Kids Double Strap Summer Sandals', p: 14, op: 18, s: ['24', '26', '28', '30', '32'], c: ['#3B82F6', '#3B020D', '#10B981'], desc: 'تهوية ممتازة ومرونة عالية وسهولة في التنظيف بعد اللعب.' },
      { t: 'حذاء كاجوال مدرسي جلد أسود متين', en: 'Kids Durable Black School Shoes', p: 19, op: 25, s: ['28', '30', '32', '34', '36'], c: ['#0A0A0A'], desc: 'مصمم خصيصاً لتحمل الاستخدام اليومي الشاق في المدرسة.' },
      { t: 'سنيكرز رياضي بإضاءة LED تفاعلية عند المشي', en: 'Kids LED Light-Up Fun Sneakers', p: 20, op: 26, s: ['24', '26', '28', '30'], c: ['#EC4899', '#3B020D', '#3B82F6'], desc: 'أضواء ملونة تبهج طفلك مع كل خطوة وبطارية تدوم طويلاً.' },
      { t: 'بوت مطر مطاطي أطفال بألوان مرحة', en: 'Kids Waterproof Rubber Rain Boots', p: 13, op: 17, s: ['25', '27', '29', '31', '33'], c: ['#EAB308', '#3B020D', '#06B6D4'], desc: 'حماية 100% من برك الماء مع مقابض علوية لسهولة السحب.' },
      { t: 'حذاء باليرينا أطفال مرن للحفلات', en: 'Girls Soft Ballet Flats', p: 15, op: 20, s: ['24', '26', '28', '30', '32'], c: ['#FFFFFF', '#3B020D'], desc: 'مطاط علوي يضمن بقاء الحذاء ثابتاً في قدم طفلتك أثناء الجري.' },
      { t: 'حذاء لوفر ولادي جلد كلاسيكي', en: 'Boys Classic Leather Loafers', p: 21, op: 27, s: ['28', '30', '32', '34'], c: ['#3B020D', '#0A0A0A'], desc: 'يكمل إطلالة طفلك في المناسبات والأعياد بفخامة ورقي.' },
      { t: 'سليبر أطفال منزلي بأشكال كرتونية لطيفة', en: 'Kids Cozy Character Slippers', p: 8, op: 12, s: ['24-25', '26-27', '28-29'], c: ['#3B020D', '#F472B6'], desc: 'دفء ونعومة فائقة داخل البيت مع أرضية مانعة للانزلاق.' },
      { t: 'سنيكرز شبكي خفيف مسامي للأطفال', en: 'Kids Breathable Mesh Runner', p: 15, op: 19, s: ['26', '28', '30', '32', '34'], c: ['#0A0A0A', '#3B020D'], desc: 'يمنع تعرق الأقدام أثناء اللعب والنشاط الرياضي المكثف.' },
      { t: 'صندل ماء للأطفال سريع الجفاف', en: 'Kids Water Play Sandals', p: 12, op: 16, s: ['24', '26', '28', '30'], c: ['#0284C7', '#3B020D'], desc: 'حماية لأصابع القدمين أثناء السباحة واللعب على الشاطئ.' },
      { t: 'حذاء رياضي هاي توب أطفال برباط مطاطي', en: 'Kids High-Top Elastic Sneaker', p: 18, op: 24, s: ['27', '29', '31', '33'], c: ['#3B020D', '#18181B'], desc: 'ثبات ودعم للكاحل مع شكل جذاب يعشقه الأولاد.' },
      { t: 'حذاء قماش كانفاس أطفال برسمات مرحة', en: 'Kids Printed Canvas Slip-On', p: 11, op: 15, s: ['24', '26', '28', '30'], c: ['#FFFFFF', '#3B020D'], desc: 'خفيف الوزن وسهل الغسيل ومريح للبس اليومي.' },
      { t: 'بوت تشيلسي كاحل بناتي أنيق', en: 'Girls Chelsea Fashion Ankle Boots', p: 23, op: 29, s: ['28', '30', '32', '34'], c: ['#3B020D', '#0A0A0A'], desc: 'إطلالة شتوية عصرية ومطاط جانبي لسهولة اللبس.' },
      { t: 'صندل طبي أطفال بفرشة داعمة للقوس', en: 'Kids Orthopedic Arch Support Sandals', p: 17, op: 23, s: ['25', '27', '29', '31'], c: ['#78350F', '#3B020D'], desc: 'يساعد على النمو السليم لعظام وقوس القدم عند الأطفال.' },
      { t: 'حذاء رياضي لكرة القدم عشب صناعي', en: 'Kids Turf Soccer Cleats', p: 20, op: 26, s: ['28', '30', '32', '34', '36'], c: ['#16A34A', '#3B020D'], desc: 'مسامير مطاطية آمنة توفر تحكماً ممتازاً بالكرة في الملاعب.' },
      { t: 'حذاء ماري جين بناتي بفيونكة كلاسيك', en: 'Girls Classic Mary Jane Shoes', p: 16, op: 21, s: ['24', '26', '28', '30'], c: ['#0A0A0A', '#3B020D'], desc: 'أناقة تقليدية مريحة تناسب الزي المدرسي والفساتين.' },
      { t: 'سنيكرز سبورت بدون رباط للأطفال', en: 'Kids Slip-On Stretch Sneaker', p: 14, op: 18, s: ['26', '28', '30', '32'], c: ['#64748B', '#3B020D'], desc: 'مرن وسريع الارتداء ويناسب أصحاب الأقدام العريضة.' },
      { t: 'صندل أصبع شاطئي للأطفال مع حزام خلفي', en: 'Kids Flip-Flop with Backstrap', p: 7, op: 10, s: ['24', '26', '28', '30'], c: ['#3B020D', '#06B6D4'], desc: 'الحزام الخلفي يمنع سقوط الصندل أثناء المشي واللعب.' },
      { t: 'حذاء سهرة بناتي بكعب منخفض عريض', en: 'Girls Low Block Heel Princess Shoes', p: 19, op: 25, s: ['29', '31', '33', '35'], c: ['#FDE047', '#3B020D'], desc: 'ارتفاع آمن ومريح يمنح طفلتك إحساس الأميرات في الحفلات.' },
      { t: 'بوت ثلج أطفال حراري مقاوم للماء', en: 'Kids Thermal Snow Boots', p: 25, op: 32, s: ['27', '29', '31', '33'], c: ['#3B020D', '#1E293B'], desc: 'طبقات عزل متعددة تحافظ على دفء وجفاف القدمين تماماً.' },
      { t: 'سنيكرز تزلج بعجلات مخفية قابلة للطي', en: 'Kids Roller Skate Shoes with Wheels', p: 26, op: 35, s: ['28', '30', '32', '34'], c: ['#EC4899', '#3B020D'], desc: 'متعة مضاعفة؛ يمكن تحويله لحذاء عادي أو حذاء تزلج بنقرة زر.' },
      { t: 'حذاء كاجوال خفيف بنعل فوم رغوي', en: 'Kids Featherlight EVA Shoes', p: 12, op: 16, s: ['25', '27', '29', '31'], c: ['#FFFFFF', '#3B020D'], desc: 'خفيف كالريشة وقابل للغسل في الغسالة بلمح البصر.' },
      { t: 'جوارب أحذية للأطفال بنعل مطاطي مرن', en: 'Kids Sock Shoes with Rubber Grip', p: 9, op: 13, s: ['22-23', '24-25', '26-27'], c: ['#3B020D', '#F472B6'], desc: 'الخيار الأفضل للخطوات الأولى داخل المنزل والحضانة.' },
    ],
  },

  // 8. Baby (25)
  {
    subCategory: 'baby',
    category: 'family',
    items: [
      { t: 'أفرول بيبي قطن 100% فائق النعومة بسحاب', en: 'Newborn 100% Organic Zip Sleepsuit', p: 8, op: 12, s: ['0-3M', '3-6M', '6-9M', '9-12M'], c: ['#FFF9F0', '#3B020D', '#93C5FD'], desc: 'سحاب مزدوج ناعم يسهل تغيير الحفاض بسرعة بدون إزعاج نوم البيبي.' },
      { t: 'طقم استقبال مواليد ملكي 5 قطع مطرز', en: 'Royal 5-Piece Newborn Welcome Set', p: 24, op: 32, s: ['Newborn', '0-3M'], c: ['#FFFBEB', '#3B020D'], desc: 'أفرول، كوفلية، قبعة، قفازات، وصدار مطرز بتفاصيل ذهبية فاخرة.' },
      { t: 'بطانية مهد بيبي صوف ناعم مبطنة فرو', en: 'Plush Sherpa Lined Baby Blanket', p: 14, op: 19, s: ['80x100 cm'], c: ['#3B020D', '#E2E8F0'], desc: 'دفء ونعومة فائقة تحيط طفلك بحنان وأمان في السرير وعربة الأطفال.' },
      { t: 'طقم بودي سوت بيبي 3 قطع بألوان ناعمة', en: 'Pack of 3 Soft Cotton Bodysuits', p: 10, op: 14, s: ['0-3M', '3-6M', '6-12M'], c: ['#FFFFFF', '#3B020D', '#FEF08A'], desc: 'فتحة رقبة مرنة وأزرار كبس خالية من النيكل لحماية بشرة الرضيع.' },
      { t: 'كيس نوم شتوي دافئ للأطفال الرضع', en: 'Warm Padded Baby Sleeping Bag', p: 18, op: 25, s: ['0-6M', '6-18M'], c: ['#3B020D', '#CBD5E1'], desc: 'بديل آمن للبطانيات يمنع اختناق الطفل ويحافظ على دفئه طوال الليل.' },
      { t: 'طقم مريلة قطنية ومصاصة عضوية', en: 'Cotton Bandana Bibs & Teether Set', p: 6, op: 9, s: ['Free Size'], c: ['#3B020D', '#F472B6'], desc: 'طبقة قطنية ماصة تمنع بلل الملابس أثناء فترة التسنين.' },
      { t: 'جاكيت بيبي شتوي بغطاء رأس وأذني دب', en: 'Cute Bear Ear Hooded Baby Fleece Coat', p: 16, op: 22, s: ['3-6M', '6-12M', '12-18M'], c: ['#FFFBEB', '#3B020D'], desc: 'مظهر لطيف جداً يحبس الحرارة ويحمي صغيرك في النزهات الشتوية.' },
      { t: 'حذاء بيبي قماش للخطوات الأولى بنعل سيليكون', en: 'Soft Sole Non-Slip Pre-Walker Baby Shoes', p: 7, op: 10, s: ['0-6M', '6-12M'], c: ['#FFFFFF', '#3B020D'], desc: 'مرن وخفيف يدعم التطور الطبيعي لقدم الطفل دون تقييد.' },
      { t: 'رومبر صيفي بيبي قطن بياقة بيتر بان', en: 'Peter Pan Collar Cotton Summer Romper', p: 11, op: 15, s: ['3-6M', '6-12M', '12-18M'], c: ['#E0E7FF', '#3B020D'], desc: 'قصة كلاسيكية ناعمة تضفي براءة وأناقة في الصور والزيارات.' },
      { t: 'مجموعة 4 قماطات قطن موسلين ناعمة', en: 'Pack of 4 Organic Muslin Swaddles', p: 15, op: 20, s: ['120x120 cm'], c: ['#FFF9F0', '#3B020D'], desc: 'قماش موسلين مسامي متعدد الاستخدامات كغطاء رضاعة أو كوفلية.' },
      { t: 'طقم بنطال وقبعة بيبي محبوك تريكو', en: 'Knitted Baby Leggings & Bonnet Set', p: 12, op: 16, s: ['0-3M', '3-6M', '6-12M'], c: ['#3B020D', '#F3F4F6'], desc: 'حياكة دافئة ومرنة ومريحة لحركات بطن الطفل وساقيه.' },
      { t: 'منشفة بيبي بغطاء رأس وقماش خيزران', en: 'Hooded Bamboo Ultra-Absorbent Towel', p: 13, op: 18, s: ['90x90 cm'], c: ['#FFFFFF', '#3B020D'], desc: 'امتصاص مضاعف ونعومة فائقة لا تقارن بعد كل حمام دافئ.' },
      { t: 'فستان بيبي بناتي مع أفرول مطرز بالزهور', en: 'Baby Girl Floral Dress & Romper Set', p: 17, op: 23, s: ['3-6M', '6-12M', '12-18M'], c: ['#FCE7F3', '#3B020D'], desc: 'طلة ملائكية لأميرتك الصغيرة مع غطاء حفاض متناسق.' },
      { t: 'طقم ولادي بيبي شورت وقميص بفيونكة', en: 'Baby Boy Suspender Shorts & Shirt Set', p: 19, op: 25, s: ['3-6M', '6-12M', '12-18M'], c: ['#3B020D', '#1E293B'], desc: 'شياكة مصغرة تجعل طفلك يخطف الأضواء في المناسبات.' },
      { t: 'جوارب بيبي قطنية مانعة للانزلاق 4 أزواج', en: 'Pack of 4 Baby Grip Ankle Socks', p: 5, op: 8, s: ['0-12M', '12-24M'], c: ['#3B020D', '#FFFFFF'], desc: 'نقاط سيليكون أسفل الجورب تمنح البيبي ثباتاً عند الوقوف.' },
      { t: 'كارديجان بيبي صوف كشمير ناعم بأزرار خشبية', en: 'Cashmere Blend Wooden Button Baby Cardigan', p: 15, op: 20, s: ['0-6M', '6-12M'], c: ['#FFFBEB', '#3B020D'], desc: 'أزرار خشبية طبيعية ولمسة فخمة فوق أي أفرول.' },
      { t: 'أفرول بيبي دبدوب صوف شتوي كامل', en: 'Full Body Teddy Bear Plush Snowsuit', p: 22, op: 30, s: ['3-6M', '6-12M'], c: ['#78350F', '#3B020D'], desc: 'يحول طفلك لدبدوب لطيف ويحميه من قسوة البرد الخارجي.' },
      { t: 'طقم أغطية مهد بيبي قطن ساتان', en: 'Satin Cotton Baby Crib Sheet Set', p: 16, op: 22, s: ['Standard Crib'], c: ['#FFF9F0', '#3B020D'], desc: 'نعومة حريرية تساعد على استرخاء الرضيع ونوم هادئ.' },
      { t: 'حذاء بيبي كروشيه صوف مصنوع يدوياً', en: 'Handmade Crochet Baby Booties', p: 6.5, op: 9, s: ['0-6M'], c: ['#3B020D', '#F472B6'], desc: 'صناعة يدوية متقنة بلمسة دافئة تهدى في حفلات استقبال المواليد.' },
      { t: 'وسادة تشكيل رأس البيبي لمنع التسطح', en: 'Ergonomic Flat Head Baby Pillow', p: 9, op: 13, s: ['Free Size'], c: ['#FFFFFF', '#3B020D'], desc: 'تصميم طبي يوزع الضغط بالتساوي على جمجمة الرضيع.' },
      { t: 'طقم حفاضات سباحة بيبي قابلة لإعادة الاستخدام', en: 'Reusable Waterproof Swim Diaper', p: 8, op: 11, s: ['Adjustable 0-2Y'], c: ['#0284C7', '#3B020D'], desc: 'أزرار كبس جانبية لضبط المقاس وموفرة وصديقة للبيئة.' },
      { t: 'طقم قبعات بيبي قطنية لحديثي الولادة 3 قطع', en: 'Pack of 3 Newborn Cotton Knot Hats', p: 6, op: 9, s: ['Newborn', '0-6M'], c: ['#3B020D', '#FEF08A'], desc: 'تحافظ على درجة حرارة رأس البيبي برقة ونعومة.' },
      { t: 'أفرول بيبي بدون أكمام كتان صيفي', en: 'Sleeveless Linen Summer Baby Romper', p: 12, op: 16, s: ['3-6M', '6-12M'], c: ['#E5E7EB', '#3B020D'], desc: 'تصميم بسيط ومنعش لأيام الصيف الحارة داخل المنزل وخارجه.' },
      { t: 'حقيبة مستلزمات البيبي الأنيقة للأمهات', en: 'Luxury Waterproof Baby Diaper Bag', p: 28, op: 38, s: ['Multi-Pocket'], c: ['#3B020D', '#0A0A0A'], desc: 'جيوب حرارية لحفظ حرارة الرضاعات وتقسيمات منظمة لكل احتياجاتك.' },
      { t: 'لعبة خشخيشة بيبي قماش عضوية مهدئة', en: 'Organic Cotton Sensory Baby Rattle', p: 5.5, op: 8, s: ['Free Size'], c: ['#3B020D', '#FFFBEB'], desc: 'خامات آمنة وغير سامة تناسب عض الطفل واستكشافه الحسي.' },
    ],
  },

  // 9. Lingerie (25)
  {
    subCategory: 'lingerie_all',
    category: 'lingerie',
    items: [
      { t: 'روب ستان حريري ملكي طويل مع حزام', en: 'Royal Silk Satin Long Kimono Robe', p: 26, op: 34, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A', '#FFF9F0'], desc: 'نعومة فائقة وانسيابية فاخرة تمنحك إحساس الدلال والراحة داخل المنزل.' },
      { t: 'طقم بيجاما حرير دانتيل قطعتين شيك', en: 'Two-Piece Lace Trim Silk Pajama Set', p: 22, op: 28, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A', '#F472B6'], desc: 'خياطة نظيفة وتفاصيل دانتيل فرنسي رقيق على الصدر والأكمام.' },
      { t: 'قميص نوم ساتان ناعم بقصة ميدي', en: 'Soft Satin Midi Nightdress', p: 18, op: 24, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#18181B', '#FCE7F3'], desc: 'حمالات قابلة للتعديل وقصة تبرز القوام بأنوثة وجمال لا يضاهى.' },
      { t: 'طقم لانجري دانتيل راقي قطعتين', en: 'Two-Piece Floral Lace Lingerie Set', p: 19, op: 26, s: ['34B', '36B', '38B', '40C'], c: ['#3B020D', '#0A0A0A', '#FFFFFF'], desc: 'دعم مريح بدون أسلاك ضاغطة ومظهر أنثوي جذاب وفخم.' },
      { t: 'كيمونو منزلي مخملي دافئ للشتاء', en: 'Winter Plush Velvet Lounge Kimono', p: 28, op: 36, s: ['M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A'], desc: 'دفء مخملي استثنائي وأناقة منزلية تليق بذوقك الرفيع.' },
      { t: 'بودي سوت دانتيل مطرز بياقة V', en: 'Embroidered Lace V-Neck Bodysuit', p: 21, op: 28, s: ['S', 'M', 'L'], c: ['#3B020D', '#0A0A0A'], desc: 'يمكن ارتداؤه كلانجري راقي أو أسفل البليزر لإطلالة سهرة جذابة.' },
      { t: 'طقم بيجاما شورت قطن مودال بارد', en: 'Soft Modal Cotton Cami & Shorts Set', p: 15, op: 20, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#E2E8F0'], desc: 'أعلى درجات النعومة والتهوية لنوم هانئ في ليالي الصيف.' },
      { t: 'روب نوم قصير شيفون مع أطراف ريش', en: 'Feather-Trimmed Chiffon Bridal Robe', p: 32, op: 42, s: ['S', 'M', 'L'], c: ['#FFFFFF', '#3B020D'], desc: 'القطعة المفضلة للعرائس بلمسة ريش ناعمة تعكس فخامة لا تنسى.' },
      { t: 'حمالة صدر دانتيل بدون حشوة سلك', en: 'Wireless Bralette in Floral Lace', p: 12, op: 16, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A'], desc: 'راحة مطلقة تدوم طوال اليوم بدون أي ضغط غير مريح.' },
      { t: 'طقم سراويل قطن برازيلي ناعم 3 قطع', en: 'Pack of 3 Seamless Brazilian Panties', p: 9, op: 13, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A', '#FFFFFF'], desc: 'حواف ليزرية غير مرئية لا تظهر نهائياً أسفل الملابس الضيقة.' },
      { t: 'قميص نوم طويل حريري بفتحة جانبية', en: 'Floor-Length Silk Slit Nightgown', p: 25, op: 33, s: ['S', 'M', 'L'], c: ['#3B020D', '#0A0A0A'], desc: 'قصة انسيابية ساحرة وفتحة جانبية تمنحك حركة مريحة وأنيقة.' },
      { t: 'بيجاما شتوية فليس ناعمة جداً', en: 'Cozy Fluffy Fleece Winter Pajama', p: 23, op: 30, s: ['M', 'L', 'XL', '2XL'], c: ['#3B020D', '#F472B6'], desc: 'تحتضن الجسم بدفء فائق ونسيج لا يسبب أي تحسس.' },
      { t: 'كورسيه نحت الخصر دانتيل فاخر', en: 'Lace Waist-Cincher Sculpting Corset', p: 27, op: 36, s: ['S', 'M', 'L', 'XL'], c: ['#0A0A0A', '#3B020D'], desc: 'يحدد الخصر وينسق القوام بأسلاك مرنة مريحة بالجلوس.' },
      { t: 'طقم لانجري ساتان قطعتين مع حزام ربط', en: 'Two-Piece Satin Babydoll Set', p: 17, op: 23, s: ['S', 'M', 'L'], c: ['#3B020D', '#F43F5E'], desc: 'خفيف وناعم ولمعة جذابة تعزز جمالك الطبيعي.' },
      { t: 'طقم لانجري عرائسي حريري 4 قطع', en: '4-Piece Luxury Bridal Silk Set', p: 46, op: 60, s: ['S', 'M', 'L'], c: ['#FFFFFF', '#FFFBEB'], desc: 'روب، قميص نوم، توب وشورت بتنسيق متكامل وفخامة أسطورية.' },
      { t: 'حمالة صدر سيليكون بدون ظهر ولا حمالات', en: 'Invisible Backless Adhesive Push-Up Bra', p: 8, op: 12, s: ['A', 'B', 'C', 'D'], c: ['#D4AF37', '#0A0A0A'], desc: 'الحل المثالي لفساتين السهرة المفتوحة من الظهر والكتفين.' },
      { t: 'طقم بيجاما قطنية بأزرار أمامية كلاسيك', en: 'Classic Button-Down Cotton Pajama', p: 19, op: 25, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#1E293B'], desc: 'ياقة كلاسيكية محددة بخيوط بيضاء ناصعة وراحة منزلية راقية.' },
      { t: 'مشد كامل للجسم تحت الفساتين ينحت البطن', en: 'Full Body Shapewear Bodysuit', p: 22, op: 30, s: ['S', 'M', 'L', 'XL', '2XL'], c: ['#D1D5DB', '#0A0A0A'], desc: 'يخفي الترهلات ويبرز الفستان بدون أي خطوط ظاهرة.' },
      { t: 'قميص نوم شيفون ناعم بظهر مفتوح', en: 'Open Back Sheer Chiffon Chemise', p: 16, op: 22, s: ['S', 'M', 'L'], c: ['#3B020D', '#0A0A0A'], desc: 'تصميم جريء ومفعم بالأنوثة يجمع الشيفون والساتان بتناغم.' },
      { t: 'طقم ملابس نوم ستان 3 قطع توب وبنطال وروب', en: '3-Piece Satin Lounge & Sleep Set', p: 29, op: 38, s: ['M', 'L', 'XL'], c: ['#3B020D', '#78350F'], desc: 'تنوع في اللبس يناسب مختلف درجات حرارة الغرفة والمواسم.' },
      { t: 'سروال دانتيل عالي الخصر مريح', en: 'High-Waisted Vintage Lace Briefs', p: 7, op: 10, s: ['S', 'M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A'], desc: 'تغطية متوازنة ولمسة كلاسيكية ساحرة وراحة تامة.' },
      { t: 'حمالة صدر تي شيرت مبطنة ميموري فوم', en: 'Seamless Memory Foam T-Shirt Bra', p: 14, op: 19, s: ['34B', '36B', '38C', '40C'], c: ['#FFF9F0', '#3B020D', '#0A0A0A'], desc: 'لا تظهر خطوطها أسفل التيشيرتات والقمصان وتدعم الصدر بنعومة.' },
      { t: 'فستان منزلي قطن ميدي بأكمام كيمونو', en: 'Kimono Sleeve Cotton House Dress', p: 18, op: 24, s: ['Free Size'], c: ['#3B020D', '#475569'], desc: 'وسيع ومريح وفخم لاستقبال الضيوف المقربين بكل ثقة.' },
      { t: 'طقم بيجاما ساتان مطبوع بنقشة نمر فاخرة', en: 'Luxury Leopard Print Satin Pajamas', p: 24, op: 32, s: ['S', 'M', 'L'], c: ['#78350F', '#3B020D'], desc: 'طبعة تريند فاخرة تعكس الجرأة والأناقة العصرية.' },
      { t: 'جوارب حريرية طويلة للسهرة مع دانتيل', en: 'Thigh-High Lace Top Silk Stockings', p: 6.5, op: 9, s: ['Free Size'], c: ['#0A0A0A', '#3B020D'], desc: 'شريط سيليكون داخلي يضمن بقاء الجورب ثابتاً طوال السهرة.' },
    ],
  },

  // 10. Beauty & Makeup (25)
  {
    subCategory: 'beauty_all',
    category: 'beauty',
    items: [
      { t: 'أحمر شفاه مخملي مات مقاوم للماء والمسح', en: 'Velvet Matte Waterproof Lipstick', p: 12, op: 16, s: ['3.5g'], c: ['#3B020D', '#991B1B', '#BE185D'], desc: 'ثبات يدوم 16 ساعة بدون جفاف للشفاه، لون غني ومرطب غني بزيت الجوجوبا.' },
      { t: 'سيروم حمض الهيالورونيك وفيتامين C للترطيب والنضارة', en: 'Hyaluronic Acid & Vitamin C Radiant Serum', p: 18, op: 25, s: ['30ml'], c: ['#FFFBEB'], desc: 'يمنح بشرتك نضارة زجاجية فورية ويقلل الخطوط الدقيقة والتعب.' },
      { t: 'لوحة ظلال عيون سهرة 18 لون مات وميتاليك', en: '18-Shade Luxury Eyeshadow Palette', p: 22, op: 30, s: ['Full Palette'], c: ['#3B020D', '#D4AF37'], desc: 'تدرجات ترابية وبورغندية غنية بالتصوير وسهلة الدمج كالزبدة.' },
      { t: 'كريم أساس فاونديشن كولكشن مخملي خافي للعيوب', en: 'Flawless Full-Coverage Velvet Foundation', p: 19, op: 26, s: ['30ml'], c: ['#FDE047', '#D1D5DB'], desc: 'تغطية كاملة تخفي المسام والتصبغات مع مظهر طبيعي لا يكتل.' },
      { t: 'مسكارا تكثيف وتطويل الرموش ثلاثية الأبعاد', en: '3D Volume & Length Waterproof Mascara', p: 11, op: 15, s: ['10ml'], c: ['#0A0A0A'], desc: 'فرشاة سيليكون ترفع وتفصل كل رمش بدون تكتل طوال اليوم.' },
      { t: 'بودرة تثبيت حرة شفافة تمنع اللمعان', en: 'Translucent Oil-Control Setting Powder', p: 14, op: 19, s: ['20g'], c: ['#FFF9F0'], desc: 'تثبت المكياج طوال اليوم وتعطي فلتر نعومة حقيقي للبشرة.' },
      { t: 'هايلايتر سائل ببريق لؤلؤي طبيعي', en: 'Liquid Pearl Glow Illuminator', p: 13, op: 18, s: ['15ml'], c: ['#FDE047', '#FCE7F3'], desc: 'إشراقة صحية وندية على عظام الخد وجسر الأنف بدون لمعان زيتي.' },
      { t: 'محدد حواجب دقيق ضد الماء برأس ميكرو', en: 'Micro-Blade Waterproof Brow Pencil', p: 8, op: 12, s: ['0.05g'], c: ['#3B020D', '#0A0A0A'], desc: 'يرسم شعيرات الحواجب بدقة متناهية وثبات يدوم في الحر والرطوبة.' },
      { t: 'بلاش سائل للخدود والشفاه بنغمات وردية', en: 'Soft Flush Liquid Blush & Lip Tint', p: 10, op: 14, s: ['10ml'], c: ['#F43F5E', '#3B020D'], desc: 'دمج سلس بأطراف الأصابع يمنحك تورداً طبيعياً وكأنك للتو استيقظت.' },
      { t: 'محدد شفاه كريمي يدوم طويلاً', en: 'Longwear Creamy Lip Definer', p: 6, op: 9, s: ['1.2g'], c: ['#3B020D', '#881337'], desc: 'يحدد الشفاه ويمنع سيلان الروج مع قوام زبدي ناعم.' },
      { t: 'زيت تنظيف المكياج وإزالة الشوائب اللطيف', en: 'Gentle Cleansing Oil & Makeup Remover', p: 15, op: 20, s: ['150ml'], c: ['#FFFBEB'], desc: 'يذيب أصعب أنواع المكياج المقاوم للماء بلطف ويترك البشرة رطبة.' },
      { t: 'مجموعة 12 فرشاة مكياج احترافية بشعيرات ناعمة', en: '12-Piece Professional Makeup Brush Set', p: 21, op: 29, s: ['12 Brushes + Bag'], c: ['#3B020D', '#0A0A0A'], desc: 'شعيرات نباتية فائقة النعومة مع حقيبة جلدية فاخرة لحفظها.' },
      { t: 'كونسيلر تغطية كاملة ومفتح لتحت العين', en: 'Brightening High-Coverage Concealer', p: 13, op: 17, s: ['6ml'], c: ['#FEF08A'], desc: 'يخفي الهالات السوداء تماماً دون أن يستقر في الخطوط التعبيرية.' },
      { t: 'بخاخ تثبيت المكياج بمستخلص الشاي الأخضر', en: 'All-Day Makeup Setting Mist', p: 12, op: 16, s: ['100ml'], c: ['#10B981'], desc: 'يثبت إطلالتك ويحميها من الذوبان والبهتان لمدة تصل إلى 24 ساعة.' },
      { t: 'مرطب شفاه معالج بزبدة الشيا والورد', en: 'Rose Petal & Shea Butter Lip Therapy', p: 5, op: 8, s: ['15g'], c: ['#F472B6'], desc: 'يعالج الشفاه المتشققة ويمنحها لمعاناً وردياً وامتلاءً جذاباً.' },
      { t: 'قناع الطين الوردي لتنقية وتضييق المسام', en: 'Purifying Pink Clay Detox Mask', p: 16, op: 22, s: ['100g'], c: ['#FCE7F3'], desc: 'ينظف البشرة بعمق من الدهون الزائدة ويوحد لونها بنعومة.' },
      { t: 'كريم ترطيب عميق بالسيراميد لحاجز البشرة', en: 'Ceramide Barrier Recovery Face Cream', p: 17, op: 23, s: ['50ml'], c: ['#FFFFFF'], desc: 'يعيد بناء حاجز البشرة المتضرر ويهدئ الاحمرار والتهيج.' },
      { t: 'جل حواجب شفاف لتثبيت ورفع الحواجب', en: 'Clear 24H Brow Sculpting Gel', p: 7.5, op: 11, s: ['8ml'], c: ['#FFFFFF'], desc: 'تأثير تصفيح الحواجب بدون أي بقايا بيضاء أو ملمس لاصق.' },
      { t: 'إسفنجة مكياج بيوتي بلندر ثلاثية الأبعاد', en: 'Ultra-Soft Makeup Blending Sponge', p: 4, op: 6, s: ['Pack of 2'], c: ['#3B020D', '#F472B6'], desc: 'تتضاعف مع الماء وتوزع الفاونديشن بسلاسة وخفة تامة.' },
      { t: 'سيروم مقشر لطيف بأحماض الفواكه AHA BHA', en: 'AHA 10% + BHA 2% Peeling Solution', p: 14, op: 19, s: ['30ml'], c: ['#3B020D'], desc: 'يجدد خلايا البشرة ويزيل البقع الداكنة ليعيد لها إشراقتها.' },
      { t: 'كحل عيون سائل فاحم السواد بريشة دقيقة', en: 'Ultra-Black Waterproof Liquid Eyeliner', p: 9, op: 13, s: ['2ml'], c: ['#0A0A0A'], desc: 'رسمة آيلاينر مجنحة مثالية بضربة واحدة تدوم دون تلطخ.' },
      { t: 'زيت الأرغان المغربي النقي للشعر والبشرة', en: '100% Pure Moroccan Argan Oil', p: 19, op: 26, s: ['50ml'], c: ['#D4AF37'], desc: 'تغذية عميقة ولمعان حريري للشعر وبشرة نضرة كالحرير.' },
      { t: 'لوحة كونتور ونحت الوجه الاحترافية 6 ألوان', en: '6-Shade Sculpt & Define Contour Palette', p: 18, op: 24, s: ['Full Palette'], c: ['#78350F'], desc: 'تدرجات مدروسة بدقة لتحديد وتصغير ملامح الوجه باحترافية.' },
      { t: 'ملمع شفاه ممتلئ بحمض الهيالورونيك بلمعة كريستال', en: 'Hyaluronic Crystal Plumping Lip Gloss', p: 10, op: 14, s: ['6ml'], c: ['#FCE7F3'], desc: 'يعطي الشفاه حجماً ممتلئاً ولمعاناً زجاجياً خيالياً بدون لزوجة.' },
      { t: 'واقي شمس سائل واسع الطيف SPF50+ بدون أثر أبيض', en: 'Invisible Fluid Sunscreen SPF50+', p: 16, op: 22, s: ['50ml'], c: ['#FFFBEB'], desc: 'حماية كاملة من أشعة الشمس مع قوام مائي خفيف يمتص بثوانٍ.' },
    ],
  },

  // 11. Perfumes (25)
  {
    subCategory: 'perfumes_all',
    category: 'perfumes',
    items: [
      { t: 'عطر حكاية عنبر ملكي نيش فاخر', en: 'HKAYA Royal Amber Signature Niche', p: 48, op: 65, s: ['100ml EDP'], c: ['#3B020D'], desc: 'مزيج ساحر من العنبر الفاخر، خشب الصندل، والفانيلا المدخنة مع فوحان وثبات يدوم لأيام.' },
      { t: 'عطر مسك الروم والياسمين الدمشقي الفاخر', en: 'Tuberose & Damascene Jasmine Elixir', p: 38, op: 49, s: ['100ml EDP'], c: ['#FFF9F0'], desc: 'رائحة أنثوية مفعمة بالرقة والجاذبية تأسر الحواس وتترك أثراً لا ينسى.' },
      { t: 'عطر عود كمبودي معتق مع الورد الجوري', en: 'Aged Cambodian Oud & Rose Absolute', p: 58, op: 75, s: ['100ml EDP'], c: ['#78350F'], desc: 'فخامة شرقية أصيلة تليق بأرقى المناسبات والشخصيات الرفيعة.' },
      { t: 'عطر لافندر وفيتيفر منعش للصباح والعمل', en: 'French Lavender & Crisp Vetiver', p: 32, op: 42, s: ['100ml EDP'], c: ['#C084FC'], desc: 'انتعاش أرستقراطي يمنحك طاقة وهدوءاً وثقة طوال ساعات الدوام.' },
      { t: 'عطر فانيلا بوربون مع حبوب التونكا والكراميل', en: 'Bourbon Vanilla & Tonka Bean Extrait', p: 42, op: 55, s: ['100ml EDP'], c: ['#FDE047'], desc: 'دفء جذاب ومذاق عطري شهي يلتف حولك كالوشاح الفاخر.' },
      { t: 'عطر تبغ فاخر وجلد أسود رجالي هيبة', en: 'Smoky Tobacco & Black Leather Parfum', p: 46, op: 60, s: ['100ml EDP'], c: ['#0A0A0A'], desc: 'عطر رجولي غامض وقوي يعكس شخصية قيادية ذات حضور طاغٍ.' },
      { t: 'عطر زهر البرتقال والمسك الأبيض النقي', en: 'Orange Blossom & Pure White Musk', p: 29, op: 38, s: ['100ml EDP'], c: ['#FFFFFF'], desc: 'رائحة النظافة والانتعاش والهدوء التي تناسب الاستخدام اليومي.' },
      { t: 'عطر هيل وزعفران ملكي بتوليفة دافئة', en: 'Royal Cardamom & Saffron Infusion', p: 44, op: 58, s: ['100ml EDP'], c: ['#D4AF37'], desc: 'مستوحى من كرم الضيافة الأردنية بلمسة نيش عصرية راقية.' },
      { t: 'عطر باتشولي وورد بلغاري مركز', en: 'Velvet Patchouli & Bulgarian Rose', p: 39, op: 50, s: ['100ml EDP'], c: ['#3B020D'], desc: 'عمق وترف لا حدود لهما يمتزجان بتناغم كلاسيكي أخاذ.' },
      { t: 'عطر حمضيات صقلية وخشب الأرز المنعش', en: 'Sicilian Citrus & Cedarwood Cologne', p: 27, op: 35, s: ['100ml EDT'], c: ['#38BDF8'], desc: 'انفجار من الانتعاش الحيوي يوقظ الحواس في الأيام الحارة.' },
      { t: 'عطر بخور شرقي ملكي للبيت والملابس', en: 'Royal Incense Room & Fabric Mist', p: 15, op: 20, s: ['250ml'], c: ['#3B020D'], desc: 'يعطر الأجواء وثنايا الأقمشة برائحة البخور الفاخرة لساعات طويلة.' },
      { t: 'عطر للشعر غني بزيت الأرغان بنفحات المسك', en: 'Argan Infused Hair Mist in Pure Musk', p: 19, op: 25, s: ['50ml'], c: ['#FCE7F3'], desc: 'يعطي شعرك لمعاناً حريرياً ورائحة فواحة مع كل حركة.' },
      { t: 'دهن عود تراد أصلي درجة أولى', en: 'Pure Trad Oud Essential Oil', p: 35, op: 45, s: ['3ml Tola'], c: ['#78350F'], desc: 'قطرات مركزة جداً تثبت في الملابس لأكثر من أسبوع.' },
      { t: 'مسك الطهارة الأبيض الأصلي الكثيف', en: 'Pure White Tahara Concentrated Musk', p: 12, op: 16, s: ['6ml Tola'], c: ['#FFFFFF'], desc: 'قوام كريمي غني ورائحة نقاء أبدية لا تتغير.' },
      { t: 'عطر الرمان والكرز الأسود الفواح', en: 'Black Cherry & Pomegranate Nectar', p: 31, op: 40, s: ['100ml EDP'], c: ['#3B020D'], desc: 'حلاوة فاكهية عميقة وجذابة ومحبوبة جداً في الطلعات.' },
      { t: 'عطر غاردينيا وبيوني نسائي رقيق', en: 'Gardenia Bloom & Peony Petals', p: 34, op: 44, s: ['100ml EDP'], c: ['#FCE7F3'], desc: 'باقة زهور ربيعية متفتحة تفيض بالبهجة والجمال.' },
      { t: 'عطر خشب الصندل السيلاني النقي', en: 'Ceylon Sandalwood Pure Essence', p: 41, op: 53, s: ['100ml EDP'], c: ['#D97706'], desc: 'عطر هادئ ومريح للأعصاب يضفي وقاراً وسكينة لا توصف.' },
      { t: 'عطر بحري بنفحات الملح والأعشاب البحرية', en: 'Mineral Sea Salt & Aquatic Driftwood', p: 28, op: 36, s: ['100ml EDP'], c: ['#0284C7'], desc: 'يأخذك إلى شواطئ العقبة ونسمات البحر المنعشة.' },
      { t: 'عطر حبوب القهوة والشوكولاتة الداكنة', en: 'Roasted Coffee & Dark Cocoa Accord', p: 36, op: 46, s: ['100ml EDP'], c: ['#3B020D'], desc: 'مزيج غني ودافئ لعشاق الروائح الغورماند العميقة.' },
      { t: 'طقم عطور ميني كولكشن حكاية 5 عينات', en: 'HKAYA Discovery Set 5x10ml', p: 22, op: 30, s: ['5x10ml'], c: ['#3B020D'], desc: 'فرصة مثالية لتجربة كافة عطورنا الملكية واختيار عطرك المفضل.' },
      { t: 'عطر السوسن الملكي مع خشب الغاياك', en: 'Royal Iris & Guaiac Wood Luxury', p: 45, op: 58, s: ['100ml EDP'], c: ['#6366F1'], desc: 'رائحة البودرة الفاخرة الممزوجة بالأخشاب النبيلة.' },
      { t: 'معطر جو منزلي فاخر بأعواد البامبو', en: 'Luxury Reed Diffuser in Amber Rose', p: 16, op: 22, s: ['150ml'], c: ['#3B020D'], desc: 'يوزع العطر باستمرار في غرفتك لمدة تتجاوز 3 أشهر.' },
      { t: 'عطر المسك الذهبي مع رذاذ البرغموت', en: 'Golden Musk & Bergamot Sparkle', p: 33, op: 43, s: ['100ml EDP'], c: ['#EAB308'], desc: 'توليفة متألقة تجمع بين الانتعاش والجاذبية الشرقية.' },
      { t: 'عطر توفي وبندق محمص شتوي', en: 'Toffee & Roasted Hazelnut Gourmand', p: 37, op: 48, s: ['100ml EDP'], c: ['#78350F'], desc: 'دفء شتوي لا يقاوم يمنحك شعوراً فورياً بالراحة والسرور.' },
      { t: 'عطر عنبر الحوت النادر والجلد الأبيض', en: 'Rare Ambergris & White Suede Extrait', p: 62, op: 80, s: ['100ml Parfum'], c: ['#3B020D'], desc: 'درة تاج عطور حكاية، تركيز فائق لا يضاهى لأصحاب الذوق النادر.' },
    ],
  },

  // 12. Clearance 1-5 JOD (25)
  {
    subCategory: 'clearance_all',
    category: 'clearance',
    items: [
      { t: 'تيشيرت قطني كاجوال تصفية موسم', en: 'Summer Cotton Clearance Tee', p: 3.5, op: 14, s: ['M', 'L', 'XL'], c: ['#3B020D', '#0A0A0A', '#FFFFFF'], desc: 'قطن 100% بسعر التصفية الحقيقي، مريح وعملي جداً للبيت والمشاوير.' },
      { t: 'طقم جوارب قطنية فاخرة 3 أزواج', en: 'Pack of 3 Premium Cotton Socks', p: 1.5, op: 6, s: ['Free Size'], c: ['#0A0A0A', '#FFFFFF', '#3B020D'], desc: 'ناعمة ومطاطية ومريحة لا تسبب تعرق القدمين.' },
      { t: 'إكسسوار شعر لؤلؤي أنيق للمناسبات', en: 'Pearl Hair Clip Accessory', p: 1.0, op: 4.5, s: ['Standard'], c: ['#FFFFFF', '#D4AF37'], desc: 'شكل ناعم يثبت في الشعر ويضفي لمسة جمالية راقية.' },
      { t: 'حزام خصر كلاسيكي بإبزيم ناعم', en: 'Slim Classic Waist Belt', p: 2.5, op: 9, s: ['Free Size'], c: ['#0A0A0A', '#3B020D', '#78350F'], desc: 'يكمل إطلالة البنطال أو الفستان بأناقة وبسعر رمزي.' },
      { t: 'كفر جوال جلدي فاخر بحماية كاملة', en: 'Luxury Leather Textured Phone Case', p: 2.0, op: 8, s: ['Universal / Pro'], c: ['#3B020D', '#0A0A0A'], desc: 'ملمس جلدي ناعم ومقاوم للصدمات والبصمات.' },
      { t: 'قلم تحديد شفاه وثبات كريمي', en: 'Creamy Matte Lip Pencil', p: 1.25, op: 5, s: ['1.2g'], c: ['#3B020D', '#F43F5E'], desc: 'رسم دقيق وسلس يحدد الشفاه بثبات عالي.' },
      { t: 'محفظة بطاقات جلدية رفيعة للجيب', en: 'Slim Pocket Leather Card Holder', p: 3.0, op: 10, s: ['6 Cards Slot'], c: ['#3B020D', '#0A0A0A'], desc: 'تتسع لـ 6 بطاقات مع جيب للنقود وتناسب الجيب بدون انتفاخ.' },
      { t: 'نظارة شمسية كلاسيك حماية UV400', en: 'Classic UV400 Sunglasses', p: 4.5, op: 16, s: ['Standard'], c: ['#0A0A0A', '#3B020D'], desc: 'حماية كاملة من أشعة الشمس مع إطار عصري خفيف الوزن.' },
      { t: 'شال قطني ناعم كاجوال ألوان متعددة', en: 'Soft Casual Lightweight Scarf', p: 2.0, op: 7, s: ['Standard'], c: ['#3B020D', '#FEF08A'], desc: 'قطن خفيف ومثالي للف السريع وتصفية أسعار خرافية.' },
      { t: 'ميدالية مفاتيح جلدية كولكشن حكاية', en: 'HKAYA Leather Charm Keychain', p: 1.0, op: 4, s: ['Standard'], c: ['#3B020D', '#D4AF37'], desc: 'معدن كروم مقاوم للصدأ مع شريط جلد أنيق.' },
      { t: 'طقم أساور ستانلس ستيل ناعمة 2 قطعة', en: 'Stainless Steel Minimalist Bracelets', p: 3.0, op: 12, s: ['Free Size'], c: ['#D4AF37', '#E5E7EB'], desc: 'لون ثابت لا يتغير مع الماء ومظهر جذاب باليد.' },
      { t: 'قناع نوم حريري مريح للعينين', en: 'Silk Blackout Sleeping Eye Mask', p: 1.75, op: 6, s: ['Free Size'], c: ['#3B020D', '#0A0A0A'], desc: 'يحجب الضوء بنسبة 100% لنوم عميق أثناء السفر أو في البيت.' },
      { t: 'سلسال رقبة ناعم بقلادة هلال ونجمة', en: 'Crescent & Star Dainty Necklace', p: 2.5, op: 9, s: ['45cm'], c: ['#D4AF37'], desc: 'مطلي بماء الذهب ولمعة تدوم وبلبق لكل يوم.' },
      { t: 'طوق شعر قماشي مخملي بناتي', en: 'Padded Velvet Headband', p: 1.5, op: 5, s: ['Free Size'], c: ['#3B020D', '#0A0A0A'], desc: 'مريح خلف الأذنين ولا يسبب أي ضغط أو صداع.' },
      { t: 'حقيبة قماشية توت باج قطنية للكتب والتسوق', en: 'Eco Cotton Canvas Tote Bag', p: 2.0, op: 8, s: ['38x42 cm'], c: ['#FFF9F0', '#3B020D'], desc: 'متينة وعملية ومطبوعة بشعار حكاية الكشخة.' },
      { t: 'مبرد أظافر كريستالي زجاجي دائم', en: 'Permanent Crystal Glass Nail File', p: 1.0, op: 4, s: ['Standard'], c: ['#F472B6'], desc: 'ينعم الأظافر بدقة دون تكسير وقابل للغسل مدى الحياة.' },
      { t: 'شورت قطني داخلي مريح للبيت', en: 'Soft Cotton Home Boxers / Shorts', p: 2.5, op: 8, s: ['M', 'L', 'XL'], c: ['#3B020D', '#18181B'], desc: 'قطن مسامي بارد وخياطة مسطحة مريحة جداً.' },
      { t: 'مشبك شعر معدني كروم كبير متين', en: 'Large Metal Claw Hair Clip', p: 1.5, op: 5, s: ['10cm'], c: ['#D4AF37', '#3B020D'], desc: 'يمسك الشعر الكثيف بقوة وثبات طوال اليوم.' },
      { t: 'فرشاة تنظيف الوجه السيليكونية اليدوية', en: 'Manual Silicon Face Cleansing Pad', p: 1.0, op: 3.5, s: ['Standard'], c: ['#F472B6', '#3B020D'], desc: 'تنظف المسام وتزيل الرؤوس السوداء بلطف أثناء الغسول.' },
      { t: 'كوفية شتوية قطنية منقوشة', en: 'Traditional Patterned Cotton Keffiyeh', p: 3.5, op: 10, s: ['110x110 cm'], c: ['#0A0A0A', '#3B020D'], desc: 'نسيج قطني أصيل دافئ وأناقة وطنية تعتز بها.' },
      { t: 'طقم خواتم يد كلاسيكية 3 قطع', en: 'Stackable Fashion Midi Rings Set', p: 2.0, op: 7, s: ['Mixed Sizes'], c: ['#D4AF37'], desc: 'تنسيقات متعددة يمكن ارتداؤها في أصابع مختلفة.' },
      { t: 'حبل نظارة جلدي أنيق مضفر', en: 'Braided Leather Eyewear Retainer', p: 1.2, op: 4, s: ['70cm'], c: ['#78350F', '#3B020D'], desc: 'يحمي نظارتك من السقوط ويعطي لمسة كلاسيكية.' },
      { t: 'مرآة جيب صغيرة مزدوجة مع إضاءة', en: 'Compact Dual Pocket Makeup Mirror', p: 2.5, op: 8, s: ['7x7 cm'], c: ['#3B020D'], desc: 'تكبير وتفاصيل واضحة لوضع اللمسات السريعة في أي مكان.' },
      { t: 'جوارب رياضية قصيرة داعمة للكاحل', en: 'Cushioned Low-Cut Ankle Sport Socks', p: 1.0, op: 4, s: ['Free Size'], c: ['#FFFFFF', '#0A0A0A'], desc: 'تبطين أسفل القدم لامتصاص الصدمات أثناء الجري.' },
      { t: 'شنطة مكياج صغيرة مخملية للسفر', en: 'Small Velvet Travel Cosmetic Pouch', p: 2.5, op: 9, s: ['18x12 cm'], c: ['#3B020D', '#0A0A0A'], desc: 'سحاب ذهبي سلس وحجم مثالي لحقيبة اليد اليومية.' },
    ],
  },
];

let globalProductId = 1;

export function generateAllProducts(): Product[] {
  const products: Product[] = [];

  for (const group of rawProductSeeds) {
    let itemIndex = 0;
    for (const item of group.items) {
      globalProductId++;
      itemIndex++;
      const tint = tints[itemIndex % tints.length];
      const isClearance = group.category === 'clearance' || (item.p >= 1 && item.p <= 5);
      const inStock = itemIndex % 8 !== 0; // realistic 90% in-stock, some sold out
      
      const fourImages = generate4ViewFashionSvgs(
        item.t.split(' ').slice(0, 3).join(' '),
        group.category,
        item.c[0] || '#3B020D'
      );

      const prod: Product = {
        id: `hk-${globalProductId}`,
        sku: `HK-${group.subCategory.substring(0, 3).toUpperCase()}-${1000 + globalProductId}`,
        title: item.t,
        titleEn: item.en,
        category: group.category as any,
        subCategory: group.subCategory as any,
        price: item.p,
        oldPrice: item.op,
        description: item.desc,
        descriptionEn: `High quality luxury authentic piece crafted for timeless elegance. Fast delivery to all Jordanian cities.`,
        sizes: item.s,
        colors: item.c,
        inStock: inStock,
        stockQuantity: inStock ? (10 + (globalProductId % 40)) : 0,
        isClearance: isClearance,
        bgTint: tint,
        image: fourImages[0],
        images: fourImages,
        badge: isClearance ? 'تصفية 1-5 د.أ' : (itemIndex <= 3 ? 'جديد' : (itemIndex % 5 === 0 ? 'الأكثر طلباً' : undefined)),
        rating: 4.8 + ((globalProductId % 3) / 10),
        reviewsCount: 15 + (globalProductId % 120),
        tags: [group.category, group.subCategory, isClearance ? 'عروض' : 'كولكشن'],
      };

      products.push(prod);
    }
  }

  return products;
}
