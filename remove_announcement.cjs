const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove AnnouncementBar component
content = content.replace(/const AnnouncementBar: React\.FC = \(\) => \{[\s\S]*?\}\;\n\n/g, '');

// Remove <AnnouncementBar /> usage
content = content.replace(/<AnnouncementBar \/>\n\s*/g, '');

fs.writeFileSync('src/App.tsx', content);
