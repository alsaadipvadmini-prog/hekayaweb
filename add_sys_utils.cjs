const fs = require('fs');

const content = fs.readFileSync('src/components/admin/SecurityTab.tsx', 'utf-8');

const additionalImports = `
import { Download, Upload as UploadIcon, Trash2, RefreshCcw } from 'lucide-react';
import storage from '../../utils/storage.js';
import { defaultSettings } from '../../utils/defaultSettings.js';
`;

let updatedContent = content.replace(
  "import { Shield, KeyRound, Lock, User, Clock, CheckCircle2, AlertTriangle, LogOut } from 'lucide-react';",
  "import { Shield, KeyRound, Lock, User, Clock, CheckCircle2, AlertTriangle, LogOut, Download, Upload as UploadIcon, Trash2, RefreshCcw } from 'lucide-react';\nimport storage from '../../utils/storage.js';\nimport { defaultSettings } from '../../utils/defaultSettings.js';"
);

const sysUtilsJSX = `
      {/* System & Utility Controls */}
      <div className="bg-white border border-neutral-300 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
          <Shield className="w-4 h-4 text-[#120205]" />
          <h3 className="font-bold text-sm text-[#120205]">إدارة النظام والبيانات (System Controls)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              try {
                const settingsData = storage.get('hkaya_admin_settings', defaultSettings);
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsData));
                const dlAnchorElem = document.createElement('a');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", "hkaya_backup.json");
                dlAnchorElem.click();
                showToast('تم تصدير النسخة الاحتياطية بنجاح', 'success');
              } catch (e) {
                showToast('تعذر تصدير البيانات', 'error');
              }
            }}
            className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-right group"
          >
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">تصدير الإعدادات</h4>
              <p className="text-xs text-neutral-500">تحميل نسخة احتياطية (JSON)</p>
            </div>
          </button>

          <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-right group cursor-pointer">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <UploadIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">استيراد الإعدادات</h4>
              <p className="text-xs text-neutral-500">رفع نسخة احتياطية (JSON)</p>
            </div>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target.result);
                    storage.set('hkaya_admin_settings', parsed);
                    showToast('تم استيراد الإعدادات بنجاح. يرجى إعادة تحميل الصفحة.', 'success');
                    setTimeout(() => window.location.reload(), 2000);
                  } catch(err) {
                    showToast('ملف غير صالح', 'error');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من إعادة ضبط الموقع للوضع الافتراضي؟ ستفقد كافة التعديلات.')) {
                storage.set('hkaya_admin_settings', defaultSettings);
                showToast('تمت استعادة الوضع الافتراضي.', 'success');
                setTimeout(() => window.location.reload(), 1500);
              }
            }}
            className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-rose-50 transition-colors text-right group"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">الوضع الافتراضي</h4>
              <p className="text-xs text-neutral-500">إلغاء التعديلات (Reset)</p>
            </div>
          </button>

          <button
            onClick={() => {
              try {
                // Clear all except token and essential state
                const token = storage.get('hkaya_admin_token', '');
                storage.clearPlatformData();
                if(token) storage.set('hkaya_admin_token', token);
                showToast('تم مسح ذاكرة التخزين المؤقت بنجاح', 'success');
                setTimeout(() => window.location.reload(), 1000);
              } catch (e) {
                showToast('حدث خطأ أثناء المسح', 'error');
              }
            }}
            className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl hover:bg-rose-50 transition-colors text-right group"
          >
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-800">مسح الذاكرة</h4>
              <p className="text-xs text-neutral-500">إفراغ التخزين (Clear Cache)</p>
            </div>
          </button>
        </div>
      </div>
`;

updatedContent = updatedContent.replace(
  "</div>\n    </div>\n  );\n};",
  sysUtilsJSX + "\n    </div>\n  );\n};"
);

fs.writeFileSync('src/components/admin/SecurityTab.tsx', updatedContent);
