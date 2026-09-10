const fs = require('fs');

let content = fs.readFileSync('src/types.ts', 'utf-8');

const newFields = `    contactLocationAr: string;
    socialInstagramUrl: string;
    socialFacebookUrl: string;
    socialTikTokUrl: string;
    socialYouTubeUrl: string;
    paymentBadgesActive: boolean;
    paymentBadgesImageUrl: string;
    sectionFeaturedTitleAr: string;
    sectionFeaturedSubtitleAr: string;
    sectionCategoriesTitleAr: string;
    sectionCategoriesSubtitleAr: string;
    sectionSizeGuideTitleAr: string;
    customAlertBannerActive: boolean;
    customAlertBannerText: string;
    customAlertBannerBgColor: string;
    clearanceBannerTitleAr: string;
    clearanceBannerSubtitleAr: string;
    clearanceBadgeTextAr: string;
    returnPolicyTextAr: string;
    deliveryNoticeAr: string;
    deliveryNoticeEn: string;
    categoryWomenTitleAr: string;
    categoryMenTitleAr: string;
    categoryFamilyTitleAr: string;
    categoryLingerieTitleAr: string;
    categoryBeautyTitleAr: string;
    categoryPerfumesTitleAr: string;
    categoryClearanceTitleAr: string;
    checkoutTitleAr: string;
    checkoutNoticeAr: string;
    currencySymbolAr: string;
    currencySymbolEn: string;
    // New text dictionary for global texts
    globalTextMap?: Record<string, string>;`;

content = content.replace(/contactLocationAr: string;[\s\S]*?currencySymbolEn: string;/, newFields);
fs.writeFileSync('src/types.ts', content);

let defaultSettings = fs.readFileSync('src/utils/defaultSettings.ts', 'utf-8');
const newDefaultFields = `    contactLocationAr: 'المملكة الأردنية الهاشمية - عمان',
    socialInstagramUrl: '#',
    socialFacebookUrl: '#',
    socialTikTokUrl: '#',
    socialYouTubeUrl: '#',
    paymentBadgesActive: true,
    paymentBadgesImageUrl: '',
    sectionFeaturedTitleAr: 'تشكيلة الموسم الجديدة',
    sectionFeaturedSubtitleAr: 'أحدث الإضافات المنتقاة بعناية تامة لترضي ذوقك',
    sectionCategoriesTitleAr: 'الأقسام الرئيسية',
    sectionCategoriesSubtitleAr: 'تصفح تشكيلتنا عبر الفئات',
    sectionSizeGuideTitleAr: 'دليل المقاسات',
    customAlertBannerActive: false,
    customAlertBannerText: '',
    customAlertBannerBgColor: '#6b1d2f',
    clearanceBannerTitleAr: 'قسم التصفية والعروض النارية',
    clearanceBannerSubtitleAr: 'قطع مختارة من 1 إلى 5 دنانير أردنية فقط - الكميات محدودة استنقِ قبل النفاذ',
    clearanceBadgeTextAr: 'عروض 1-5 د.أ',
    returnPolicyTextAr: 'حق التبديل والترجيع محفوظ بكل سلاسة وسرعة خلال 3 أيام من الاستلام',
    deliveryNoticeAr: 'توصيل خلال 24-48 ساعة لجميع محافظات الأردن',
    deliveryNoticeEn: 'Express Delivery across Jordan (Amman 1 JOD, Other Governorates 2 JOD)',
    categoryWomenTitleAr: 'القسم النسائي',
    categoryMenTitleAr: 'القسم الرجالي',
    categoryFamilyTitleAr: 'العائلة والطفل',
    categoryLingerieTitleAr: 'اللانجري والحرير',
    categoryBeautyTitleAr: 'الميكأب والعناية',
    categoryPerfumesTitleAr: 'العطور النيش',
    categoryClearanceTitleAr: 'التصفية والعروض (1-5 د.أ)',
    checkoutTitleAr: 'إتمام الطلب السريع',
    checkoutNoticeAr: 'الدفع عند الاستلام بعد معاينة الطلب والتأكد من الجودة والمقاس',
    currencySymbolAr: 'د.أ',
    currencySymbolEn: 'JOD',
    globalTextMap: {
      'checkout.instructions': 'جميع طرق الدفع متوفرة عند التوصيل (نقداً، بطاقة بنكية POS، كليك CliQ، أو محفظة إلكترونية مع الكابتن).',
      'cart.empty': 'سلة المشتريات فارغة',
      'toast.success': 'تمت العملية بنجاح',
      'product.sizeGuide': 'دليل المقاسات (سم)',
      'product.price': 'السعر'
    },`;
defaultSettings = defaultSettings.replace(/contactLocationAr: 'المملكة الأردنية الهاشمية - عمان',[\s\S]*?currencySymbolEn: 'JOD',/, newDefaultFields);
fs.writeFileSync('src/utils/defaultSettings.ts', defaultSettings);
