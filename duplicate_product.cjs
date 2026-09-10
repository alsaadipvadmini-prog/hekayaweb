const fs = require('fs');

let content = fs.readFileSync('src/components/admin/ProductsTab.tsx', 'utf-8');

// Add Copy icon import
content = content.replace(
  "Trash2,",
  "Trash2,\n  Copy,"
);

// Add handleDuplicate function
const handleDuplicateCode = `
  const handleDuplicateProduct = async (product: Product) => {
    const payload = {
      ...product,
      title: product.title + ' (نسخة)',
      id: undefined // Backend should generate new ID
    };
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('تم استنساخ المنتج بنجاح', 'success');
        onRefresh();
      } else {
        showToast('تعذر استنساخ المنتج', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };
`;

content = content.replace(
  "const handleDeleteProduct = async",
  handleDuplicateCode + "\n  const handleDeleteProduct = async"
);

// Add duplicate button to UI
const actionButtonsJsx = `<button
                        onClick={() => openEditProductModal(prod)}
                        className="p-2 text-neutral-600 hover:text-[#120205] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="تعديل المنتج"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(prod)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="استنساخ المنتج"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod)}`;

content = content.replace(
  /<button\s+onClick=\{\(\) => openEditProductModal\(prod\)\}[\s\S]*?<Edit2 className="w-4 h-4" \/>\s*<\/button>\s*<button\s+onClick=\{\(\) => handleDeleteProduct\(prod\)\}/m,
  actionButtonsJsx
);

fs.writeFileSync('src/components/admin/ProductsTab.tsx', content);
