const fs = require('fs');

let adminPanel = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
adminPanel = adminPanel.replace(
  /<button\s*onClick=\{.*?setActiveTab\('theme'\).*?\s*className=\{.*?activeTab === 'theme'.*?\s*<Palette.*?التصميم والتوصيل.*?<\/button>/s,
  ''
);
adminPanel = adminPanel.replace(
  /\{activeTab === 'theme' && \(\s*<ThemeDeliveryTab\s*formData=\{formData\}\s*setFormData=\{setFormData\}\s*onSave=\{handleSaveSettings\}\s*\/>\s*\)\}/,
  ''
);
fs.writeFileSync('src/components/AdminPanel.tsx', adminPanel);
console.log("Admin panel updated to remove theme tab");
