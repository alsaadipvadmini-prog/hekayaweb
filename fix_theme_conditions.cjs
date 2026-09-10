const fs = require('fs');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('.tsx') || name.endsWith('.ts')) {
        files.push(name);
      }
    }
  }
  return files;
}

const allFiles = getFiles('src');

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // QuickViewModal fixes
  if (file.includes('QuickViewModal.tsx')) {
    content = content.replace(/theme === 'dark' \? 'bg-\[#121212\] border border-white\/10' : 'bg-\[#f8f9fa\] border border-\[#e0e0e0\]'/g, "'bg-[#f8f9fa] border border-[#e0e0e0]'");
    content = content.replace(/theme === 'dark' \? 'text-white' : 'text-\[#111111\]'/g, "'text-[#111111]'");
    content = content.replace(/theme === 'dark' \? 'text-neutral-400' : 'text-neutral-500'/g, "'text-neutral-500'");
    content = content.replace(/theme === 'dark' \? 'text-neutral-300' : 'text-neutral-600'/g, "'text-neutral-600'");
  }

  // ProductCard fixes
  if (file.includes('ProductCard.tsx')) {
    content = content.replace(/theme === 'dark'\s*\?\s*'bg-\[#121212\] border-\[#e0e0e0\]'\s*:\s*'bg-\[#f8f9fa\] border-\[#e0e0e0\] shadow-sm hover:shadow-md'/g, "'bg-[#f8f9fa] border-[#e0e0e0] shadow-sm hover:shadow-md'");
    // Wait, let's just do a simpler replace or leave it alone since the dark mode toggle isn't there, theme will always be light.
    // If the theme is always light, these conditions will naturally fall back to the right part.
    // However, the user said "DO NOT include, render, or keep any Theme Switcher... Theme MUST be 100% static".
    // I will replace `theme === 'dark' ? X : Y` with `Y`.
    content = content.replace(/theme === 'dark'\s*\?\s*'[^']*'\s*:\s*('[^']*')/g, "$1");
  }

  // Same for ProductGrid, ClearanceView
  content = content.replace(/theme === 'dark'\s*\?\s*'[^']*'\s*:\s*('[^']*')/g, "$1");

  fs.writeFileSync(file, content);
}
console.log("Theme conditions updated");
