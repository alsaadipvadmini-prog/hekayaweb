const fs = require('fs');

const content = fs.readFileSync('src/components/admin/ProductsTab.tsx', 'utf-8');

const updatedContent = content.replace(
  /const handleSlotFileUpload = \(slotIndex: number, e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\s*\};/,
  `const handleSlotFileUpload = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { compressImage } = await import('../../utils/imageOptimizer.js');
      const compressedUrl = await compressImage(file);
      handleSlotImageChange(slotIndex, compressedUrl);
    } catch (err) {
      showToast('تعذر ضغط ورفع الصورة', 'error');
    }
  };`
);

fs.writeFileSync('src/components/admin/ProductsTab.tsx', updatedContent);
