const fs = require('fs');

let content = fs.readFileSync('src/components/admin/CmsTab.tsx', 'utf-8');

const newContent = `
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#111111]">تعديل النصوص العامة (Global Text CMS)</h3>
          {formData.cms?.globalTextMap && Object.entries(formData.cms.globalTextMap).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-bold text-neutral-600 block">{key}</label>
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleTextMapChange(key, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#111111] focus:outline-none text-xs"
              />
            </div>
          ))}
        </div>
`;

content = content.replace(/\{renderInput\('checkoutNoticeAr', 'ملاحظة صفحة الدفع', 'textarea'\)\}/, `{renderInput('checkoutNoticeAr', 'ملاحظة صفحة الدفع', 'textarea')}
${newContent}
`);

// Add handleTextMapChange
content = content.replace(/const handleCmsChange =/, `
  const handleTextMapChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      cms: {
        ...prev.cms,
        globalTextMap: {
          ...prev.cms.globalTextMap,
          [key]: value,
        }
      }
    }));
  };
  
  const handleCmsChange =`);

fs.writeFileSync('src/components/admin/CmsTab.tsx', content);

