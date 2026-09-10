import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, RefreshCw, Home, Terminal, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { storage } from '../utils/storage.js';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GlobalErrorBoundary] Critical render exception caught:', error, errorInfo);
    (this as any).setState({ errorInfo });
  }

  /**
   * Complete Hard Reset:
   * Clears all localStorage entries, sessionStorage, and resets the URL to root '/'
   * to eliminate any state-induced black screen loop.
   */
  private handleFullReset = () => {
    try {
      storage.clearPlatformData();
      if (typeof window !== 'undefined') {
        // Sanitize URL completely to root to kill hash loops
        window.history.replaceState(null, '', '/');
        window.location.replace('/');
      }
    } catch (e) {
      console.warn('[GlobalErrorBoundary] Error during emergency reset:', e);
      window.location.href = '/';
    }
  };

  /**
   * Soft Reload:
   * Cleans malformed hash segments and performs a fresh reload
   */
  private handleQuickReload = () => {
    try {
      if (typeof window !== 'undefined') {
        const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
        window.history.replaceState(null, '', cleanPath);
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private toggleDetails = () => {
    (this as any).setState((prev: State) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    const { hasError, error, errorInfo, showDetails } = (this as any).state as State;

    if (hasError) {
      return (
        <div
          id="global-emergency-overlay"
          dir="rtl"
          className="fixed inset-0 z-[999999] min-h-screen w-full bg-[#F8F9FA] text-[#111111] flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans"
        >
          {/* Main Card Container */}
          <div className="w-full max-w-xl bg-[#f8f9fa] rounded-3xl border border-[#e0e0e0] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header with Security Shield Icon */}
            <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#111111]/10 border border-[#111111]/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-[#111111]" />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-neutral-100 text-neutral-800 rounded-full text-[11px] font-bold tracking-wide">
                  <span>منظومة حماية واستعادة المنصة</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#111111]">
                  درع الطوارئ لمنصة رستم
                </h1>
              </div>
            </div>

            {/* Explanation & User Notice */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-[#e0e0e0]/80 space-y-2">
              <div className="flex items-center gap-2 text-[#111111] font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>تم إيقاف الواجهة تلقائياً لمنع تكرار الانهيار</span>
              </div>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                واجه المتصفح تعارضاً غير متوقع في بيانات الجلسة أو مسار التوجيه، مما استدعى تفعيل وضع الطوارئ بدلاً من الشاشة السوداء. يمكنك تصفير ذاكرة المتصفح للعودة الفورية للعمل.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              {/* Primary Reset Button */}
              <button
                id="emergency-reset-app-btn"
                type="button"
                onClick={this.handleFullReset}
                className="w-full py-3.5 px-5 bg-[#111111] hover:bg-[#600018] text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>إعادة ضبط وتصفير بيانات التطبيق (Reset Application State)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Secondary Quick Reload */}
                <button
                  type="button"
                  onClick={this.handleQuickReload}
                  className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 shrink-0 text-neutral-700" />
                  <span>إعادة المحاولة السريعة</span>
                </button>

                {/* Back to Home Storefront */}
                <button
                  type="button"
                  onClick={this.handleGoHome}
                  className="w-full py-2.5 px-4 bg-[#f8f9fa] hover:bg-neutral-50 text-neutral-900 border border-[#e0e0e0] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4 shrink-0 text-neutral-700" />
                  <span>الواجهة الرئيسية</span>
                </button>
              </div>
            </div>

            {/* Technical Diagnostics Collapsible */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-800 py-1 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>التفاصيل التقنية للخطأ (للإدارة والمطورين)</span>
                </span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetails && (
                <div className="mt-3 p-3 bg-[#F8F9FA] text-neutral-200 rounded-xl text-[11px] font-mono leading-relaxed space-y-2 overflow-x-auto text-left ltr max-h-48 overflow-y-auto">
                  <div className="text-neutral-900 font-bold border-b border-[#e0e0e0] pb-1">
                    {error?.name}: {error?.message}
                  </div>
                  {error?.stack && (
                    <div className="text-neutral-400 whitespace-pre-wrap text-[10px]">
                      {error.stack}
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div className="text-neutral-500 whitespace-pre-wrap text-[10px] border-t border-[#e0e0e0] pt-1">
                      {errorInfo.componentStack}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Micro Footer Notice */}
          <p className="mt-6 text-[11px] text-neutral-400 font-medium">
            منصة رستم — إشراف وإدارة السيد عبد الملك
          </p>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default GlobalErrorBoundary;
