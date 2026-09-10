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
  
  // Replace colors
  content = content.replace(/#120205/gi, '#111111');
  content = content.replace(/#3B020D/gi, '#6b1d2f'); // replace burgundy light with restricted hover burgundy
  content = content.replace(/#5A0A19/gi, '#6b1d2f');
  content = content.replace(/#800020/gi, '#6b1d2f');
  content = content.replace(/#d4af37/gi, '#111111');
  content = content.replace(/#c5a059/gi, '#111111');
  content = content.replace(/amber-400/gi, 'neutral-800');
  content = content.replace(/amber-500/gi, 'neutral-900');
  content = content.replace(/emerald-400/gi, 'neutral-800');
  content = content.replace(/emerald-500/gi, 'neutral-900');
  content = content.replace(/emerald-600/gi, 'neutral-900');
  content = content.replace(/rose-300/gi, 'neutral-800');
  content = content.replace(/rose-400/gi, 'neutral-900');
  content = content.replace(/rose-500/gi, 'neutral-900');
  content = content.replace(/rose-950/gi, 'neutral-100');
  content = content.replace(/bg-rose-50/gi, 'bg-neutral-50');

  // Some borders
  content = content.replace(/border-neutral-800/gi, 'border-[#E2E8F0]');
  content = content.replace(/border-neutral-700/gi, 'border-[#E2E8F0]');
  content = content.replace(/border-white\/5/gi, 'border-[#E2E8F0]');
  
  // Backgrounds that were dark
  content = content.replace(/bg-neutral-900/gi, 'bg-[#F8F9FA]');
  content = content.replace(/bg-neutral-950/gi, 'bg-[#ffffff]');

  fs.writeFileSync(file, content);
}
console.log("Colors replaced");
