const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');
content = content.replace(/bg-\[#F8F9FA\] border border-\[#E2E8F0\] text-white/g, 'bg-[#F8F9FA] border border-[#E2E8F0] text-[#111111]');
fs.writeFileSync('src/components/CheckoutModal.tsx', content);
