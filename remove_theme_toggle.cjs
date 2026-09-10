const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
navbar = navbar.replace(
  /<button[\s\S]*?id="btn-theme-toggle"[\s\S]*?<\/button>/,
  ''
);
navbar = navbar.replace(
  /<button[\s\S]*?onClick=\{\(\) => setTheme\(theme === 'dark' \? 'light' : 'dark'\)\}[\s\S]*?<\/button>/g,
  ''
);
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let mobileNav = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf-8');
mobileNav = mobileNav.replace(
  /<button[\s\S]*?onClick=\{\(\) => setTheme\(theme === 'dark' \? 'light' : 'dark'\)\}[\s\S]*?<\/button>/g,
  ''
);
fs.writeFileSync('src/components/MobileBottomNav.tsx', mobileNav);
