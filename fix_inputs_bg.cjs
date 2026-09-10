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
  
  // Find <input and <textarea and add bg-[#ffffff] if not already present
  // But wait, there are too many ways input is structured. 
  // Let's just do a specific sed for className="w-full...
  content = content.replace(/className="w-full px-3 py-2 border/g, 'className="w-full px-3 py-2 bg-[#ffffff] border');
  content = content.replace(/className="w-full px-4 py-2 rounded-xl border/g, 'className="w-full px-4 py-2 bg-[#ffffff] rounded-xl border');
  content = content.replace(/className="flex-1 px-3 py-2 border/g, 'className="flex-1 px-3 py-2 bg-[#ffffff] border');

  fs.writeFileSync(file, content);
}
console.log("Inputs updated");
