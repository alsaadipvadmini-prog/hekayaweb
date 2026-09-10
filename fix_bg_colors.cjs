const fs = require('fs');
const glob = require('fs').readdirSync;

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
  
  // Replace all bg-white and bg-[#ffffff] with bg-[#f8f9fa]
  content = content.replace(/bg-white/g, 'bg-[#f8f9fa]');
  content = content.replace(/bg-\[#ffffff\]/gi, 'bg-[#f8f9fa]');

  fs.writeFileSync(file, content);
}
console.log("Backgrounds updated");
