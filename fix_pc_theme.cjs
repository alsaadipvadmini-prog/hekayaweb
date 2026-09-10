const fs = require('fs');
let pc = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');
pc = pc.replace(/backgroundColor:\s*theme === 'dark'\s*\?\s*product\.bgTint \|\| 'var\(--brand-cream\)'\s*:\s*product\.bgTint \|\| 'var\(--brand-cream\)',/g, "backgroundColor: product.bgTint || 'var(--brand-cream)',");
fs.writeFileSync('src/components/ProductCard.tsx', pc);
