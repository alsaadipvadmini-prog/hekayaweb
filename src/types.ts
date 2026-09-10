export type MainCategory = 
  | 'women' 
  | 'men' 
  | 'family' 
  | 'lingerie' 
  | 'beauty' 
  | 'perfumes' 
  | 'clearance';

export type SubCategory = 
  | 'women_clothing' 
  | 'women_shoes' 
  | 'hijab' 
  | 'men_clothing' 
  | 'men_shoes' 
  | 'kids' 
  | 'kids_shoes' 
  | 'baby' 
  | 'lingerie_all' 
  | 'beauty_all' 
  | 'perfumes_all' 
  | 'clearance_all';

export interface Product {
  id: string;
  sku: string;
  title: string;
  titleEn: string;
  category: MainCategory;
  subCategory: SubCategory;
  price: number; // in JOD
  oldPrice?: number;
  description: string;
  descriptionEn: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  isClearance: boolean; // items 1-5 JOD
  bgTint: string;
  image: string; // Default front view
  images: [string, string, string, string] | string[]; // Slot 1: Front, Slot 2: Back, Slot 3: Fabric Close-Up, Slot 4: Fine Details
  badge?: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface SubCategoryItem {
  id: SubCategory;
  name: string;
  nameEn: string;
  slug: string;
}

export interface CategoryItem {
  id: MainCategory;
  name: string;
  nameEn: string;
  slug: string;
  hasSubCategories: boolean;
  subCategories?: SubCategoryItem[];
  isIndependent?: boolean;
  isSpecial?: boolean;
}

export interface CartItem {
  id: string; // product id + size + color
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export type PaymentMethod = 'cod' | 'card' | 'cliq' | 'wallet' | 'applepay';

export interface SavedAddress {
  id: string;
  label: string; // e.g. "المنزل", "العمل", "الشاليه"
  governorate: string;
  streetName: string;
  buildingNumber: string;
  gpsLocation?: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  token?: string;
  savedAddresses: SavedAddress[];
  createdAt: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  cardLast4?: string;
  cardBrand?: string;
  cliqAlias?: string;
  transactionRef?: string;
  status: 'paid' | 'pending' | 'cod';
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  fullName: string; // الاسم الرباعي
  phoneNumber: string; // 07X
  governorate: string; // المحافظة
  streetName: string; // اسم الشارع
  buildingNumber: string; // رقم العمارة
  gpsLocation: string; // رابط الموقع
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusAr: string;
  awbBarcode: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: 'paid' | 'pending' | 'cod' | 'refunded';
  transactionRef?: string;
  receiptUrl?: string;
  paymentAuditStatus?: 'verified' | 'pending_verification' | 'rejected';
  paymentAuditNote?: string;
  webhookProcessedAt?: string;
  customerId?: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin';
  status: 'approved' | 'pending' | 'rejected' | 'revoked';
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

export interface SiteSettings {
  colors: {
    primaryBurgundy: string;
    primaryBurgundyLight: string;
    primaryBurgundyDark: string;
    brandDark: string;
    brandWhite: string;
    cardBgTint1: string;
    cardBgTint2: string;
    cardBgTint3: string;
    cardBgTint4: string;
    buttonStyle: 'solid-burgundy' | 'outline' | 'pill-luxury';
  };
  cms: {
    // Header & Navigation Control
    announcementBarTextAr: string;
    announcementBarBgColor: string;
    announcementBarTextColor: string;
    announcementBarActive: boolean;
    logoImageUrl: string;
    logoWidth: number;
    logoHeight: number;
    siteNameAr: string;
    siteNameEn: string;
    siteTaglineAr: string;
    navLinks: Array<{ label: string; url: string }>;

    // Hero & Banner Section Control
    heroTitleAr: string;
    heroSubtitleAr: string;
    heroDescriptionAr: string;
    heroCtaButtonTextAr: string;
    heroCtaButtonUrl: string;
    heroBgImageUrl: string;
    heroBgVideoUrl: string;
    heroOverlayOpacity: number;
    promoBannerActive: boolean;
    promoBannerText: string;
    promoBannerImageUrl: string;

    // Footer & Global Information Control
    footerSloganAr: string;
    footerDescriptionAr: string;
    footerCopyrightText: string;
    policyTermsUrl: string;
    policyPrivacyUrl: string;
    policyRefundUrl: string;
    contactPhone: string;
    contactWhatsApp: string;
    contactEmail: string;
        contactLocationAr: string;
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
    globalTextMap?: Record<string, string>;
  };
  deliveryFees: Record<string, number>;
  paymentConfig?: {
    serviceName: string;
    cliqPhone: string;
    cliqAlias: string;
    accountName: string;
    walletPhone: string;
    walletProvider: string;
    instructionsAr: string;
    instructionsEn: string;
    isCliqActive: boolean;
    isCardActive: boolean;
    isCodActive: boolean;
    isWalletActive: boolean;
  };
}

export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';
