const fs = require('fs');

let content = fs.readFileSync('src/components/admin/SecurityTab.tsx', 'utf-8');

content = content.replace(
  "</form>\n            {/* System & Utility Controls */}",
  "</form>\n      </div>\n      {/* System & Utility Controls */}"
);

fs.writeFileSync('src/components/admin/SecurityTab.tsx', content);
