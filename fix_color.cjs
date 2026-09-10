const fs = require('fs');

let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');
content = content.replace(
  /<label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">/,
  '<label className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">'
);
content = content.replace(
  /<span className="text-\[11px\] text-emerald-400 flex items-center gap-1">/,
  '<span className="text-[11px] text-emerald-600 flex items-center gap-1">'
);
fs.writeFileSync('src/components/CheckoutModal.tsx', content);

