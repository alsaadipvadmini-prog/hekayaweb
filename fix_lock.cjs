const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
content = content.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, (match, p1) => {
  let items = p1.split(',').map(s => s.trim()).filter(Boolean);
  let uniqueItems = [...new Set(items)];
  return `import { ${uniqueItems.join(', ')} } from 'lucide-react';`;
});
fs.writeFileSync('src/components/AdminPanel.tsx', content);
