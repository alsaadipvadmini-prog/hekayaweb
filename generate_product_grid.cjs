const fs = require('fs');

const content = fs.readFileSync('src/components/ProductGrid.tsx', 'utf-8');

const updatedContent = content
  .replace(/useApp\(\);/, 'useApp();\n  const { settings } = useApp();')
  .replace(
    /نتائج البحث عن:/g, 
    'نتائج البحث عن:' // Just leave as is, not part of CMS
  )
  .replace(
    /<h2 className="font-italic-luxury font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-\[\#111111\]">/,
    `<h2 className="font-italic-luxury font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-[#111111]">{settings?.cms?.sectionFeaturedTitleAr || 'التشكيلة الرئيسية'} - `
  );
  
fs.writeFileSync('src/components/ProductGrid.tsx', updatedContent);
