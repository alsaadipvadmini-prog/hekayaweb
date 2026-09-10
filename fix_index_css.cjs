const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(/--bg-main: #F8F9FA;/, '--bg-main: #ffffff;');
css = css.replace(/--card-bg: #FFFFFF;/, '--card-bg: #f8f9fa;');
css = css.replace(/--text-main: #111111;/, '--text-main: #111111;');
css = css.replace(/--accent: #800020;/, '--accent: #6b1d2f;');
fs.writeFileSync('src/index.css', css);

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/selection:bg-\[#111111\] selection:text-\[#111111\]/, 'selection:bg-[#e0e0e0] selection:text-[#111111]');
fs.writeFileSync('src/App.tsx', app);

