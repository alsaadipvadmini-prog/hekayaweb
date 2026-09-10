const fs = require('fs');

const content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

const updatedContent = content
  .replace(
    /const { language, theme, setCurrentCategory, setIsClearanceView } = useApp\(\);/,
    `const { language, theme, settings, setCurrentCategory, setIsClearanceView } = useApp();`
  )
  .replace(
    /'متجر حكاية الأردني للأزياء والموضة الفاخرة. فصّل على كيفك واستنقِ يا كشخة من أحدث صيحات الموضة العالمية بخامات مختارة بعناية.'/g,
    `settings?.cms?.footerDescriptionAr || 'متجر حكاية الأردني للأزياء والموضة الفاخرة.'`
  )
  .replace(
    /'المملكة الأردنية الهاشمية - عمان'/g,
    `settings?.cms?.contactLocationAr || 'المملكة الأردنية الهاشمية - عمان'`
  )
  .replace(
    /<span>079 812 3456<\/span>/g,
    `<span>{settings?.cms?.contactPhone || '079 812 3456'}</span>`
  )
  .replace(
    /'متجر حكاية للأزياء. جميع الحقوق محفوظة.'/g,
    `settings?.cms?.footerCopyrightText || 'متجر حكاية للأزياء. جميع الحقوق محفوظة.'`
  );

fs.writeFileSync('src/components/Footer.tsx', updatedContent);
