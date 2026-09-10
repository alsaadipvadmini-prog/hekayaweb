import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, RefreshCw } from 'lucide-react';
import { storage } from '../utils/storage.js';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AdminErrorBoundary] Uncaught error in Admin Panel:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      storage.remove('hkaya_admin_token');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/#admin');
        window.location.reload();
      }
    } catch (e) {
      console.warn('[AdminErrorBoundary] Reset error:', e);
      window.location.href = '/';
    }
  };

  public render() {
    const state = (this as any).state as State;
    if (state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans"
        >
          <div className="w-16 h-16 bg-[#111111]/10 border border-[#111111]/20 rounded-2xl flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8 text-[#111111]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-xl sm:text-2xl font-black text-[#111111]">
              حدث خطأ غير متوقع في لوحة التحكم
            </h1>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              يبدو أن هناك تعارضاً في استجابة الخادم أو بيانات الجلسة، تم إيقاف واجهة الإدارة لحماية بيانات المتجر.
            </p>
          </div>

          {state.error && (
            <div className="max-w-md w-full bg-[#f8f9fa] p-3 rounded-xl border border-[#e0e0e0] text-xs text-[#111111] font-mono text-left ltr break-words shadow-xs">
              {state.error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-[#111111] text-white rounded-xl hover:bg-[#600018] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط جلسة الإدارة وتنشيط اللوحة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="flex items-center gap-2 px-5 py-3 bg-[#f8f9fa] text-neutral-800 border border-[#e0e0e0] rounded-xl hover:bg-neutral-50 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>العودة للمتجر الرئيسي</span>
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default AdminErrorBoundary;
