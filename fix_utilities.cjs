const fs = require('fs');

let content = fs.readFileSync('src/components/admin/SecurityTab.tsx', 'utf-8');

const utilitiesContent = `
        {/* System Utilities */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111111]">أدوات النظام المتقدمة</h3>
              <p className="text-xs text-neutral-500">النسخ الاحتياطي، الاستعادة، وإدارة الذاكرة المؤقتة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                try {
                  const backup = JSON.stringify(localStorage);
                  const blob = new Blob([backup], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = \`hkaya_backup_\${new Date().getTime()}.json\`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('تم تصدير النسخة الاحتياطية بنجاح', 'success');
                } catch(e) {
                  showToast('فشل التصدير', 'error');
                }
              }}
              className="flex items-center justify-center gap-2 p-4 border border-[#E2E8F0] rounded-xl hover:bg-neutral-50 transition-colors text-center group cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#111111]" />
              <span className="font-bold text-sm text-[#111111]">تصدير النسخة الاحتياطية (Export Backup)</span>
            </button>

            <button
              onClick={() => {
                try {
                  if(confirm('هل أنت متأكد من استعادة إعدادات المصنع؟ ستحذف التخصيصات.')){
                     storage.remove('hkaya_settings');
                     showToast('تمت استعادة إعدادات المصنع. يرجى التحديث', 'success');
                     setTimeout(() => window.location.reload(), 1000);
                  }
                } catch(e) {
                  showToast('حدث خطأ', 'error');
                }
              }}
              className="flex items-center justify-center gap-2 p-4 border border-[#E2E8F0] rounded-xl hover:bg-neutral-50 transition-colors text-center group cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-sm text-blue-600">استعادة الافتراضي (Restore Default State)</span>
            </button>

            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  showToast('تم تفريغ الذاكرة المؤقتة بنجاح', 'success');
                  setTimeout(() => window.location.reload(), 1000);
                } catch(e) {
                  showToast('فشل تفريغ الذاكرة', 'error');
                }
              }}
              className="flex items-center justify-center gap-2 p-4 border border-[#E2E8F0] rounded-xl hover:bg-neutral-50 transition-colors text-center group cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-sm text-rose-600">تفريغ الذاكرة (Clear Cache)</span>
            </button>
          </div>
        </div>
`;

content = content.replace(/\{\/\* System Utilities \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>/s, utilitiesContent);

fs.writeFileSync('src/components/admin/SecurityTab.tsx', content);

