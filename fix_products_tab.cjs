const fs = require('fs');
let content = fs.readFileSync('src/components/admin/ProductsTab.tsx', 'utf-8');

// Fix handleSaveProduct
content = content.replace(
  'const sizesArr = form.sizes;',
  'const sizesArr = typeof form.sizes === "string" ? form.sizes.split(",").map(s => s.trim()).filter(Boolean) : form.sizes;'
);
content = content.replace(
  'const colorsArr = form.colors;',
  'const colorsArr = typeof form.colors === "string" ? form.colors.split(",").map(c => c.trim()).filter(Boolean) : form.colors;'
);

// Fix inputs to handle array-to-string
content = content.replace(
  'value={form.sizes}',
  'value={Array.isArray(form.sizes) ? form.sizes.join(", ") : form.sizes}'
);
content = content.replace(
  'value={form.colors}',
  'value={Array.isArray(form.colors) ? form.colors.join(", ") : form.colors}'
);

// Fix displaying in table rows
content = content.replace(
  '{prod.sizes ? prod.sizes.join(\', \') : \'-\'}',
  '{Array.isArray(prod.sizes) ? prod.sizes.join(\', \') : (prod.sizes || \'-\')}'
);

// Also fix in openNewProductModal (make it an array initially to match type)
// Actually, it doesn't matter because of the fix above, but just to be safe.

fs.writeFileSync('src/components/admin/ProductsTab.tsx', content);
