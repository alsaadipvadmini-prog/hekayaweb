const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const sizeReplacement = `const safeSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? product.sizes.split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []));
    const size = selectedSize || safeSizes[0] || 'Standard';`;

const colorReplacement = `const safeColors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? product.colors.split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []));
    const color = selectedColor || safeColors[0] || '#120205';`;

content = content.replace(/const size = selectedSize \|\| product\.sizes\[0\] \|\| 'Standard';/g, sizeReplacement);
content = content.replace(/const color = selectedColor \|\| product\.colors\[0\] \|\| '#120205';/g, colorReplacement);

fs.writeFileSync('src/context/AppContext.tsx', content);
