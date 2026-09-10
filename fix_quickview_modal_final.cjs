const fs = require('fs');
let content = fs.readFileSync('src/components/QuickViewModal.tsx', 'utf-8');

const safeDefs = `  const isAr = language === 'ar';
  const product = quickViewProduct;
  const isWish = product ? isInWishlist(product.id) : false;

  const safeSizes = product ? (Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? product.sizes.split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []))) : [];
  const safeColors = product ? (Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? product.colors.split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []))) : [];
`;

content = content.replace(
  /const isAr = language === 'ar';\s*const product = quickViewProduct;\s*const isWish = product \? isInWishlist\(product\.id\) : false;/,
  safeDefs
);

// fix useEffect
content = content.replace(
  'setSelectedSize(product.sizes[0] || \'Standard\');',
  'setSelectedSize(safeSizes[0] || \'Standard\');'
);

content = content.replace(
  'setSelectedColor(product.colors[0] || \'#120205\');',
  'setSelectedColor(safeColors[0] || \'#120205\');'
);

fs.writeFileSync('src/components/QuickViewModal.tsx', content);
