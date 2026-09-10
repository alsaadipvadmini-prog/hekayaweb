const fs = require('fs');
let content = fs.readFileSync('src/components/WishlistDrawer.tsx', 'utf-8');
content = content.replace(/product\.sizes\.split/g, '(product.sizes as any).split');
content = content.replace(/product\.colors\.split/g, '(product.colors as any).split');
fs.writeFileSync('src/components/WishlistDrawer.tsx', content);

content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');
content = content.replace(/product\.sizes\.split/g, '(product.sizes as any).split');
content = content.replace(/product\.colors\.split/g, '(product.colors as any).split');
fs.writeFileSync('src/context/AppContext.tsx', content);
