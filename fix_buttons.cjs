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
  
  // Any button that has bg-[#111111] AND hover:bg-[#6b1d2f] 
  // Let's replace: bg-[#111111] text-[#111111] with bg-transparent text-[#111111] border border-[#111111]
  // Or bg-[#111111] text-white with bg-transparent text-[#111111] border border-[#111111]
  // And hover:bg-[#6b1d2f] with hover:bg-[#6b1d2f] hover:text-white
  // A regex that matches the class name string if it contains bg-[#111111] and hover:bg-[#6b1d2f]

  // Instead of complex regex, let's just fix the bad states:
  content = content.replace(/bg-\[#111111\] hover:bg-\[#6b1d2f\] text-\[#111111\]/g, 'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white');
  content = content.replace(/bg-\[#111111\] text-\[#111111\]/g, 'bg-[#111111] text-white');
  content = content.replace(/bg-transparent text-\[#111111\] border border-\[#111111\] hover:bg-\[#6b1d2f\] hover:text-white hover:bg-\[#6b1d2f\]/g, 'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white');

  // Let's globally enforce the button palette on any class containing hover:bg-[#6b1d2f]
  // if it has bg-[#111111] we replace it with bg-transparent border border-[#111111] text-[#111111]
  content = content.replace(/bg-\[#111111\] hover:bg-\[#6b1d2f\] text-white/g, 'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white');
  
  // Some might be text-white bg-[#111111]
  content = content.replace(/text-white bg-\[#111111\] hover:bg-\[#6b1d2f\]/g, 'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white');
  
  // Just to catch other variations
  content = content.replace(/bg-\[#111111\] text-white hover:bg-\[#6b1d2f\]/g, 'bg-transparent text-[#111111] border border-[#111111] hover:bg-[#6b1d2f] hover:text-white');
  
  fs.writeFileSync(file, content);
}
console.log("Buttons updated");
