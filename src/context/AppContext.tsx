import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  SiteSettings,
  Language,
  Theme,
  MainCategory,
  SubCategory,
  Order,
  CustomerUser,
  SavedAddress,
} from '../types.js';
import { storage, safeStorage } from '../utils/storage.js';
import { defaultSettings } from '../utils/defaultSettings.js';

export { storage, safeStorage };

/**
 * Strict Admin Path Router Engine:
 * Respects /admin as the exclusive route for Admin Panel and Login.
 * Customer storefront (/) has zero traces of Admin Panel.
 */
export const checkAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname || '';
  const hash = window.location.hash || '';

  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.startsWith('#/admin')
  );
};

export const sanitizeLocationHash = (): { isAdmin: boolean; cleanHash: string } => {
  if (typeof window === 'undefined') {
    return { isAdmin: false, cleanHash: '' };
  }

  const rawHash = window.location.hash || '';
  const pathname = window.location.pathname || '/';
  const isAdmin = checkAdminRoute();

  // If user navigated to hash #admin, cleanly normalize path to /admin
  if (isAdmin && pathname !== '/admin') {
    window.history.replaceState(null, '', '/admin');
  }

  return { isAdmin, cleanHash: rawHash };
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  currentCategory: MainCategory | 'all';
  setCurrentCategory: (cat: MainCategory | 'all') => void;
  currentSubCategory: SubCategory | 'all';
  setCurrentSubCategory: (subCat: SubCategory | 'all') => void;
  isClearanceView: boolean;
  setIsClearanceView: (val: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (val: boolean) => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (val: boolean) => void;
  isAdminPinModalOpen: boolean;
  setIsAdminPinModalOpen: (val: boolean) => void;
  // Backward compatibility aliases
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedGPSLocation: string;
  setSavedGPSLocation: (gps: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  // Customer Auth & Profile
  customer: CustomerUser | null;
  isCustomerAuthOpen: boolean;
  setIsCustomerAuthOpen: (open: boolean) => void;
  isCustomerProfileOpen: boolean;
  setIsCustomerProfileOpen: (open: boolean) => void;
  customerAuthTab: 'login' | 'register' | 'forgot';
  setCustomerAuthTab: (tab: 'login' | 'register' | 'forgot') => void;
  loginCustomer: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerCustomer: (data: any) => Promise<{ success: boolean; message?: string }>;
  logoutCustomer: () => void;
  refreshCustomerProfile: () => Promise<void>;
  saveCustomerAddress: (address: Omit<SavedAddress, 'id'>) => Promise<boolean>;
  deleteCustomerAddress: (addressId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return storage.get<Language>('hkaya_lang', 'ar');
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return 'light';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>('hkaya_cart', []);
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    return storage.get<string[]>('hkaya_wishlist', []);
  });

  const [savedGPSLocation, setSavedGPSLocationState] = useState<string>(() => {
    return storage.get<string>('hkaya_gps', '');
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Customer auth states
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);
  const [customerAuthTab, setCustomerAuthTab] = useState<'login' | 'register' | 'forgot'>('login');

  const [currentCategory, setCurrentCategory] = useState<MainCategory | 'all'>('all');
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | 'all'>('all');
  const [isClearanceView, setIsClearanceView] = useState(false);

  const [isAdminView, _setIsAdminView] = useState(() => {
    if (typeof window === 'undefined') return false;
    const { isAdmin } = sanitizeLocationHash();
    return isAdmin;
  });
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync and sanitize route on hash/popstate
  useEffect(() => {
    const handleRouteSync = () => {
      const { isAdmin } = sanitizeLocationHash();
      _setIsAdminView(isAdmin);
    };

    // Run initial sanitize
    handleRouteSync();

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  // Synchronize Wishlist and Cart across browser tabs & windows in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hkaya_wishlist' && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          }
        } catch {
          // ignore corrupted data
        }
      }
      if (e.key === 'hkaya_cart' && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } catch {
          // ignore corrupted data
        }
      }
      if (e.key === 'hkaya_lang' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed === 'ar' || parsed === 'en') {
            setLanguageState(parsed);
          }
        } catch {
          if (e.newValue === 'ar' || e.newValue === 'en') {
            setLanguageState(e.newValue as Language);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Fetch initial site settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        applyCssVariables(data);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  // Check customer login session
  const refreshCustomerProfile = useCallback(async () => {
    const token = storage.get<string>('hkaya_customer_token', '');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
      } else {
        storage.remove('hkaya_customer_token');
        setCustomer(null);
      }
    } catch {
      // offline / quiet fail
    }
  }, []);

  useEffect(() => {
    refreshCustomerProfile();
  }, [refreshCustomerProfile]);

  const loginCustomer = async (identifier: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/customer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        storage.set('hkaya_customer_token', data.token);
        setCustomer(data.customer);
        setIsCustomerAuthOpen(false);
        showToast(
          language === 'ar'
            ? `يا هلا والله بـ ${data.customer.fullName}، نورت حكاية`
            : `Welcome back, ${data.customer.fullName}`,
          'success'
        );
        return { success: true };
      }
      return { success: false, message: data.message || 'بيانات الدخول غير صحيحة' };
    } catch (err: any) {
      return { success: false, message: err.message || 'تعذر الاتصال بالخادم' };
    }
  };

  const registerCustomer = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/customer-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        storage.set('hkaya_customer_token', data.token);
        setCustomer(data.customer);
        setIsCustomerAuthOpen(false);
        showToast(
          language === 'ar'
            ? `أهلاً وسهلاً بك في عائلة حكاية يا ${data.customer.fullName}`
            : `Registration successful! Welcome to HKAYA`,
          'success'
        );
        return { success: true };
      }
      return { success: false, message: data.message || 'فشل التسجيل' };
    } catch (err: any) {
      return { success: false, message: err.message || 'تعذر الاتصال بالخادم' };
    }
  };

  const logoutCustomer = () => {
    storage.remove('hkaya_customer_token');
    setCustomer(null);
    setIsCustomerProfileOpen(false);
    showToast(language === 'ar' ? 'تم تسجيل الخروج بنجاح، نشوفك ع خير' : 'Logged out successfully', 'info');
  };

  const saveCustomerAddress = async (addressData: Omit<SavedAddress, 'id'>) => {
    const token = storage.get<string>('hkaya_customer_token', '');
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
      if (res.ok) {
        await refreshCustomerProfile();
        showToast(language === 'ar' ? 'تم حفظ العنوان الجديد بنجاح' : 'Address saved successfully', 'success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCustomerAddress = async (addressId: string) => {
    const token = storage.get<string>('hkaya_customer_token', '');
    if (!token) return false;
    try {
      const res = await fetch(`/api/auth/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await refreshCustomerProfile();
        showToast(language === 'ar' ? 'تم حذف العنوان' : 'Address deleted', 'info');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const applyCssVariables = (st: SiteSettings) => {
    if (!st || !st.colors) return;
    const root = document.documentElement;
    root.style.setProperty('--primary-burgundy', '#111111');
    root.style.setProperty('--primary-burgundy-light', '#3a080d');
    root.style.setProperty('--primary-burgundy-dark', '#111111');
    root.style.setProperty('--brand-dark', '#111111');
    root.style.setProperty('--brand-white', '#FFFFFF');
    root.style.setProperty('--brand-cream', '#FFFFFF');
    root.style.setProperty('--brand-muted-yellow', '#F8F9FA');
    root.style.setProperty('--brand-subtle-rose', '#FFFFFF');
    root.style.setProperty('--brand-soft-sage', '#F8F9FA');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.set('hkaya_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setTheme = (thm: Theme) => {
    setThemeState(thm);
    storage.set('hkaya_theme', thm);
    if (thm === 'light') {
      document.body.classList.add('light-theme');
    } else {
      
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      
    }
  }, [language, theme]);

  const setSavedGPSLocation = (gps: string) => {
    setSavedGPSLocationState(gps);
    storage.set('hkaya_gps', gps);
  };

  // Cart Management
  useEffect(() => {
    storage.set('hkaya_cart', cart);
  }, [cart]);

  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    quantity: number = 1
  ) => {
    const safeSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? (product.sizes as any).split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []));
    const size = selectedSize || safeSizes[0] || 'Standard';
    const safeColors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? (product.colors as any).split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []));
    const color = selectedColor || safeColors[0] || '#111111';
    const cartItemId = `${product.id}-${size}-${color}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });

    const isAr = language === 'ar';
    showToast(
      isAr ? `ضفنا "${product.title}" ع السلة بنجاح يا كشخة` : `Added "${product.titleEn}" to your bag`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast(language === 'ar' ? 'تم حذف القطعة من السلة' : 'Item removed from bag', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Management
  useEffect(() => {
    storage.set('hkaya_wishlist', wishlist);
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'ar' ? 'انشالت القطعة من المفضلة' : 'Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'ar' ? 'انحفظت بالمفضلة واستنقِ وقت ما بدك' : 'Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    storage.set('hkaya_wishlist', []);
    showToast(language === 'ar' ? 'تم تفريغ قائمة المفضلة' : 'Wishlist cleared', 'info');
  };

  const setIsAdminView = (val: boolean) => {
    _setIsAdminView(val);
    if (typeof window === 'undefined') return;

    if (val) {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin' || window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const token = storage.get<string>('hkaya_admin_token', '');
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        applyCssVariables(updated);
        showToast(language === 'ar' ? 'تم تحديث إعدادات وهوية المتجر بنجاح' : 'Settings updated successfully', 'success');
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || (language === 'ar' ? 'تعذر حفظ الإعدادات، يرجى إعادة تسجيل الدخول' : 'Failed to save settings'), 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast(language === 'ar' ? 'حدث خطأ في الاتصال أثناء حفظ الإعدادات' : 'Error updating settings', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        settings,
        updateSettings,
        currentCategory,
        setCurrentCategory,
        currentSubCategory,
        setCurrentSubCategory,
        isClearanceView,
        setIsClearanceView,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminView,
        setIsAdminView,
        isAdminOpen: isAdminView,
        setIsAdminOpen: setIsAdminView,
        isAdminPinModalOpen,
        setIsAdminPinModalOpen,
        // Backward compatibility aliases
        isAuthModalOpen: isCustomerAuthOpen,
        setIsAuthModalOpen: setIsCustomerAuthOpen,
        isProfileOpen: isCustomerProfileOpen,
        setIsProfileOpen: setIsCustomerProfileOpen,
        searchQuery,
        setSearchQuery,
        savedGPSLocation,
        setSavedGPSLocation,
        showToast,
        toast,
        // Customer Auth & Profile
        customer,
        isCustomerAuthOpen,
        setIsCustomerAuthOpen,
        isCustomerProfileOpen,
        setIsCustomerProfileOpen,
        customerAuthTab,
        setCustomerAuthTab,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        refreshCustomerProfile,
        saveCustomerAddress,
        deleteCustomerAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
