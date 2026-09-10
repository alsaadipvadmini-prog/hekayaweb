const fs = require('fs');
let content = fs.readFileSync('src/components/WishlistDrawer.tsx', 'utf-8');

const replacementSizes = `const sizesList = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? product.sizes.split(",").map(s=>s.trim()) : (product.sizes && typeof product.sizes === "object" ? Object.values(product.sizes) : []));
    const defaultSize = sizesList[0] || 'Standard';`;

const replacementColors = `const colorsList = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? product.colors.split(",").map(c=>c.trim()) : (product.colors && typeof product.colors === "object" ? Object.values(product.colors) : []));
    const defaultColor = colorsList[0] || '#120205';`;

content = content.replace(/const defaultSize = product\.sizes\[0\] \|\| 'Standard';/g, replacementSizes);
content = content.replace(/const defaultColor = product\.colors\[0\] \|\| '#120205';/g, replacementColors);

fs.writeFileSync('src/components/WishlistDrawer.tsx', content);
