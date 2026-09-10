const fs = require('fs');

let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

// Remove isSolidButton declaration
content = content.replace(
  /const isSolidButton = index % 3 === 0 \|\| index % 5 === 0;\s*/,
  ""
);

// Replace the button classes
content = content.replace(
  /className=\{`w-full py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xs \$\{\s*isSolidButton\s*\?\s*'[^']+'\s*:\s*'[^']+'\s*\}`\}/,
  'className="w-full py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xs bg-transparent text-[#120205] border border-[#120205] hover:bg-[#120205] hover:text-white"'
);

fs.writeFileSync('src/components/ProductCard.tsx', content);
