const fs = require('fs');

const content = `import React from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { HeroBanner } from './components/HeroBanner.js';
import { ProductGrid } from './components/ProductGrid.js';
import { ClearanceView } from './components/ClearanceView.js';
import { CartDrawer } from './components/CartDrawer.js';
import { WishlistDrawer } from './components/WishlistDrawer.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { QuickViewModal } from './components/QuickViewModal.js';
import { CustomerAuthModal } from './components/CustomerAuthModal.js';
import { CustomerProfileDrawer } from './components/CustomerProfileDrawer.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { Footer } from './components/Footer.js';
import { AdminPanel } from './components/AdminPanel.js';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary.js';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AnnouncementBar: React.FC = () => {
  const { settings } = useApp();
  
  if (!settings?.cms?.announcementBarActive) return null;

  return (
    <div 
      className="w-full py-2 px-4 text-center text-[10px] sm:text-xs font-bold tracking-wider z-50 relative animate-in slide-in-from-top"
      style={{
        backgroundColor: settings.cms.announcementBarBgColor || '#120205',
        color: settings.cms.announcementBarTextColor || '#FFFFFF'
      }}
    >
      {settings.cms.announcementBarTextAr}
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { isAdminView, isClearanceView, toast } = useApp();

  if (isAdminView) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#800020] selection:text-[#111111] transition-colors duration-200 pb-16 lg:pb-0">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          id="toast-notification"
          className="fixed bottom-20 lg:bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md bg-neutral-900/95 text-white border border-neutral-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Level Announcement */}
      <AnnouncementBar />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {isClearanceView ? (
          <ClearanceView />
        ) : (
          <>
            <HeroBanner />
            <ProductGrid />
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <CustomerAuthModal />
      <CustomerProfileDrawer />

      {/* Mobile Persistent Bottom Navigation */}
      <MobileBottomNav />

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
`;

fs.writeFileSync('src/App.tsx', content);
