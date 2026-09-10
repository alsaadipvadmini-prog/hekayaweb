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
  
  // 1. Remove all gold tones if any are left
  content = content.replace(/#d4af37/gi, '#111111');
  content = content.replace(/#c5a059/gi, '#111111');

  // 2. Main Backgrounds: Pure White (#ffffff)
  // Cards, Modals, Sidebars, Dropdowns, Containers: #f8f9fa
  
  // Let's replace any instances where #6b1d2f is used NOT in a hover state
  // We'll replace bg-[#6b1d2f] with bg-[#111111] except hover:bg-[#6b1d2f]
  content = content.replace(/(?<!hover:)bg-\[#6b1d2f\]/g, 'bg-[#111111]');
  content = content.replace(/text-\[#6b1d2f\]/g, 'text-[#111111]');
  content = content.replace(/border-\[#6b1d2f\]/g, 'border-[#111111]');
  content = content.replace(/fill-\[#6b1d2f\]/g, 'fill-[#111111]');
  content = content.replace(/from-\[#6b1d2f\]/g, 'from-[#111111]');
  content = content.replace(/to-\[#6b1d2f\]/g, 'to-[#111111]');
  content = content.replace(/ring-\[#6b1d2f\]/g, 'ring-[#111111]');

  // For buttons, ensure they match the required style
  // We'll look for "Add to Cart" and similar buttons to enforce:
  // "background: transparent; border: 1px solid #111111; color: #111111; on hover: bg #6b1d2f text white"
  
  // Let's replace border-[#E2E8F0] with border-[#e0e0e0]
  content = content.replace(/border-\[#E2E8F0\]/gi, 'border-[#e0e0e0]');
  content = content.replace(/border-neutral-200/g, 'border-[#e0e0e0]');
  content = content.replace(/border-neutral-300/g, 'border-[#e0e0e0]');
  content = content.replace(/border-white\/5/g, 'border-[#e0e0e0]');

  // Fix up buttons that might have been changed to bg-[#111111] when they should be transparent
  // Specifically in ProductCard and QuickViewModal and CheckoutModal
  fs.writeFileSync(file, content);
}
console.log("Colors enforced");
