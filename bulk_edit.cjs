const fs = require('fs');

let content = fs.readFileSync('src/components/admin/ProductsTab.tsx', 'utf-8');

// Add state for selected products
content = content.replace(
  "const [editingProductId, setEditingProductId] = useState<string | null>(null);",
  "const [editingProductId, setEditingProductId] = useState<string | null>(null);\n  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);"
);

// Add bulk action functions
const bulkActionCode = `
  const handleBulkAction = async (action: 'delete' | 'inStock' | 'outOfStock' | 'clearanceOn' | 'clearanceOff') => {
    if (selectedProducts.length === 0) return;
    
    if (action === 'delete' && !window.confirm(\`هل أنت متأكد من حذف \${selectedProducts.length} منتج نهائياً؟\`)) return;

    try {
      // In a real app we'd have a bulk endpoint, but here we can loop or use a custom backend logic.
      // Assuming no bulk endpoint, we will execute sequentially.
      let successCount = 0;
      for (const id of selectedProducts) {
        if (action === 'delete') {
          const res = await fetch(\`/api/products/\${id}\`, { method: 'DELETE', headers: { Authorization: \`Bearer \${token}\` } });
          if (res.ok) successCount++;
        } else {
          const product = products.find(p => p.id === id);
          if (product) {
            let payload: any = {};
            if (action === 'inStock') payload.inStock = true;
            if (action === 'outOfStock') payload.inStock = false;
            if (action === 'clearanceOn') payload.isClearance = true;
            if (action === 'clearanceOff') payload.isClearance = false;
            
            const res = await fetch(\`/api/products/\${id}\`, { 
              method: 'PUT', 
              headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
              body: JSON.stringify(payload)
            });
            if (res.ok) successCount++;
          }
        }
      }
      showToast(\`تم تنفيذ الإجراء المجمع بنجاح لـ \${successCount} منتجات\`, 'success');
      setSelectedProducts([]);
      onRefresh();
    } catch {
      showToast('خطأ أثناء تنفيذ الإجراء المجمع', 'error');
    }
  };
`;

content = content.replace(
  "const handleToggleStock = async",
  bulkActionCode + "\n  const handleToggleStock = async"
);

// Add select all checkbox
content = content.replace(
  '<th className="py-3 px-4 text-start">تفاصيل المنتج</th>',
  `<th className="py-3 px-4 text-center w-12">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProducts(filteredProducts.map(p => p.id));
                          else setSelectedProducts([]);
                        }}
                      />
                    </th>\n<th className="py-3 px-4 text-start">تفاصيل المنتج</th>`
);

// Add individual checkbox
content = content.replace(
  '<td className="py-3 px-4">',
  `<td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedProducts.includes(prod.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProducts([...selectedProducts, prod.id]);
                          else setSelectedProducts(selectedProducts.filter(id => id !== prod.id));
                        }}
                      />
                    </td>\n<td className="py-3 px-4">`
);

// Add bulk edit toolbar
const bulkToolbarJsx = `
        {selectedProducts.length > 0 && (
          <div className="bg-[#120205] text-white p-3 rounded-xl flex items-center justify-between shadow-lg mb-4 animate-in slide-in-from-bottom-4">
            <span className="text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              تم تحديد {selectedProducts.length} منتج
            </span>
            <div className="flex gap-2">
              <select 
                className="bg-black/50 text-white text-xs border border-white/20 rounded-lg px-2 py-1 outline-hidden"
                onChange={(e) => {
                  const val = e.target.value;
                  if(val) {
                    handleBulkAction(val as any);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">إجراء مجمع (Bulk Edit)...</option>
                <option value="inStock">تعيين كمتوفر (In Stock)</option>
                <option value="outOfStock">تعيين كنافد (Out of Stock)</option>
                <option value="clearanceOn">تفعيل التصفية (Clearance)</option>
                <option value="clearanceOff">إلغاء التصفية</option>
                <option value="delete">حذف المحدد</option>
              </select>
              <button 
                onClick={() => setSelectedProducts([])}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                title="إلغاء التحديد"
              >
                <XCircle className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
`;

content = content.replace(
  '<div className="overflow-x-auto">',
  bulkToolbarJsx
);

fs.writeFileSync('src/components/admin/ProductsTab.tsx', content);
