const fs = require('fs');

let file = 'src/components/QuickViewModal.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/className="w-full py-3\.5 bg-\[#111111\] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-\[#6b1d2f\] transition-colors disabled:opacity-50 shadow-sm"/, 'className="w-full py-3.5 bg-transparent text-[#111111] border border-[#111111] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#6b1d2f] hover:text-white transition-colors disabled:opacity-50 shadow-sm"');

fs.writeFileSync(file, content);
console.log("Updated QVM buttons");
