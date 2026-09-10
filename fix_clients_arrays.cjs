const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(
    /typeof product.sizes === "string" \? product.sizes.split\("\,"\).map\(s=>s.trim\(\)\) : \[\]/g,
    'typeof product.sizes === "string" ? product.sizes.split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : [])'
  );
  content = content.replace(
    /typeof product.colors === "string" \? product.colors.split\("\,"\).map\(c=>c.trim\(\)\) : \[\]/g,
    'typeof product.colors === "string" ? product.colors.split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : [])'
  );
  fs.writeFileSync(file, content);
}

fixFile('src/components/QuickViewModal.tsx');
fixFile('src/components/ProductCard.tsx');

let productsTab = fs.readFileSync('src/components/admin/ProductsTab.tsx', 'utf-8');
// For ProductsTab, we can fix the row rendering
productsTab = productsTab.replace(
  /{Array.isArray\(prod.sizes\) \? prod.sizes.join\(\', \'\) : \(prod.sizes \|\| \'-\'\)}/g,
  '{Array.isArray(prod.sizes) ? prod.sizes.join(", ") : (prod.sizes && typeof prod.sizes === "object" ? Object.values(prod.sizes).join(", ") : (prod.sizes || "-"))}'
);
fs.writeFileSync('src/components/admin/ProductsTab.tsx', productsTab);

