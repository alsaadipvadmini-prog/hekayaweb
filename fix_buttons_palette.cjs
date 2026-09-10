const fs = require('fs');
let card = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

// Target the add to cart button
card = card.replace(
  /className="w-full py-3 rounded-xl text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-2 bg-transparent text-\[#111111\] border border-\[#111111\] hover:bg-\[.*?\] hover:text-white"/,
  'className="w-full py-3 rounded-xl text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white"'
);
fs.writeFileSync('src/components/ProductCard.tsx', card);

let qvm = fs.readFileSync('src/components/QuickViewModal.tsx', 'utf-8');
qvm = qvm.replace(
  /className="flex-1 py-4 px-6 rounded-xl bg-transparent text-\[#111111\] border border-\[#111111\] hover:bg-\[.*?\] hover:text-white font-bold text-sm tracking-wider active:scale-95 transition-colors flex items-center justify-center gap-2"/,
  'className="flex-1 py-4 px-6 rounded-xl bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white font-bold text-sm tracking-wider active:scale-95 transition-colors flex items-center justify-center gap-2"'
);
// Also for whatsapp button
qvm = qvm.replace(
  /className="w-14 h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors active:scale-95"/,
  'className="w-14 h-14 rounded-xl bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white flex items-center justify-center transition-colors active:scale-95"'
);
fs.writeFileSync('src/components/QuickViewModal.tsx', qvm);

console.log("Card buttons palette enforced");
