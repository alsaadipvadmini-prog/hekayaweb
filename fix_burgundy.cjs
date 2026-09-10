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
  
  // Replace #6b1d2f with #2b0508 globally
  content = content.replace(/#6b1d2f/gi, '#2b0508');
  content = content.replace(/#800020/gi, '#2b0508');

  // Let's also check for red tones: bg-rose-700, text-rose-500, bg-red-500, etc.
  content = content.replace(/bg-rose-[3456789]00/gi, 'bg-[#111111]');
  content = content.replace(/text-rose-[3456789]00/gi, 'text-[#111111]');
  content = content.replace(/text-red-[3456789]00/gi, 'text-[#111111]');
  content = content.replace(/bg-red-[3456789]00/gi, 'bg-[#111111]');
  
  // If there's a theme switcher button, we should remove it.
  // We'll search for it manually later if needed.

  fs.writeFileSync(file, content);
}
console.log("Burgundy and red updated");
