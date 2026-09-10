const fs = require('fs');
let content = fs.readFileSync('src/components/admin/CmsTab.tsx', 'utf-8');

// Add file input for Hero Image
const heroUpload = `
          <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1">صورة الخلفية الرئيسية (رفع أو رابط)</label>
            <div className="flex gap-2">
              <input type="text" placeholder="رابط مباشر..." value={form.cms.heroBgImageUrl || ''} onChange={(e) => updateCms('heroBgImageUrl', e.target.value)} className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-xs font-mono" />
              <label className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs cursor-pointer flex items-center justify-center">
                رفع ملف
                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const { compressImage } = await import('../../utils/imageOptimizer.js');
                    const url = await compressImage(file, 1200, 1200, 0.8);
                    updateCms('heroBgImageUrl', url);
                    showToast('تم رفع الصورة وضغطها بنجاح', 'success');
                  } catch {
                    showToast('فشل رفع الصورة', 'error');
                  }
                }} />
              </label>
            </div>
          </div>
`;

content = content.replace(
  /<div>\s*<label className="block text-xs font-bold mb-1">رابط صورة\/فيديو الخلفية<\/label>\s*<input type="text" value=\{form\.cms\.heroBgImageUrl.*?\/>\s*<\/div>/,
  heroUpload
);

// Add file input for Promo Banner
const promoUpload = `
               <div className="md:col-span-2">
                 <label className="block text-xs font-bold mb-1">صورة البانر الترويجي (رفع أو رابط)</label>
                 <div className="flex gap-2">
                   <input type="text" placeholder="رابط مباشر..." value={form.cms.promoBannerImageUrl || ''} onChange={(e) => updateCms('promoBannerImageUrl', e.target.value)} className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-xs font-mono" />
                   <label className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs cursor-pointer flex items-center justify-center">
                     رفع ملف
                     <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                       const file = e.target.files?.[0];
                       if (!file) return;
                       try {
                         const { compressImage } = await import('../../utils/imageOptimizer.js');
                         const url = await compressImage(file, 1000, 600, 0.8);
                         updateCms('promoBannerImageUrl', url);
                         showToast('تم رفع الصورة وضغطها بنجاح', 'success');
                       } catch {
                         showToast('فشل رفع الصورة', 'error');
                       }
                     }} />
                   </label>
                 </div>
               </div>
`;

content = content.replace(
  /<div>\s*<label className="block text-xs font-bold mb-1">رابط صورة البانر \(اختياري\)<\/label>\s*<input type="text" value=\{form\.cms\.promoBannerImageUrl.*?\/>\s*<\/div>/,
  promoUpload
);

fs.writeFileSync('src/components/admin/CmsTab.tsx', content);
