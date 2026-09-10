const fs = require('fs');
let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

content = content.replace(
  'const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || \'Standard\');',
  'const safeSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === "string" ? product.sizes.split(",").map(s=>s.trim()) : []);\n  const [selectedSize, setSelectedSize] = useState<string>(safeSizes[0] || \'Standard\');'
);

content = content.replace(
  'const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || \'#120205\');',
  'const safeColors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === "string" ? product.colors.split(",").map(c=>c.trim()) : []);\n  const [selectedColor, setSelectedColor] = useState<string>(safeColors[0] || \'#120205\');'
);

fs.writeFileSync('src/components/ProductCard.tsx', content);
