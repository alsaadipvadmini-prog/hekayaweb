const fs = require('fs');
let content = fs.readFileSync('src/components/admin/ProductsTab.tsx', 'utf-8');

// Replace the size and colors string with arrays in the state.
content = content.replace(
  /sizes: 'S, M, L, XL',/,
  "sizes: ['S', 'M', 'L', 'XL'],"
).replace(
  /colors: '#120205, #FFFFFF, #000000',/,
  "colors: ['#120205', '#FFFFFF', '#000000'],"
);

content = content.replace(
  /sizes: product\.sizes \? product\.sizes\.join\(\', \'\) : \'S, M, L, XL\',/,
  "sizes: product.sizes || ['S', 'M', 'L', 'XL'],"
).replace(
  /colors: product\.colors \? product\.colors\.join\(\', \'\) : \'#120205, #FFFFFF\',/,
  "colors: product.colors || ['#120205', '#FFFFFF'],"
);

content = content.replace(
  /const sizesArr = form\.sizes\s*\.split\(\',\'\)\s*\.map\(\(s\) => s\.trim\(\)\)\s*\.filter\(Boolean\);/,
  "const sizesArr = form.sizes;"
).replace(
  /const colorsArr = form\.colors\s*\.split\(\',\'\)\s*\.map\(\(c\) => c\.trim\(\)\)\s*\.filter\(Boolean\);/,
  "const colorsArr = form.colors;"
);

// We need to update the interface of form state but it's inferred.

const jsxToReplace = `<div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المقاسات المتاحة (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="S, M, L, XL, XXL أو 37, 38, 39, 40"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    أكواد الألوان (HEX codes مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    placeholder="#120205, #FFFFFF, #FF0000"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-hidden font-mono"
                  />
                </div>`;

const regexJsx = /<div className="md:col-span-2">\s*<label.*?المقاسات المتاحة[\s\S]*?<\/div>\s*<div>\s*<label.*?أكواد الألوان[\s\S]*?<\/div>/m;

const newJsx = `
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    المقاسات المتاحة (Sizes)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(form.sizes) && form.sizes.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-neutral-100 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border border-neutral-200">
                        {s}
                        <button type="button" onClick={() => setForm({...form, sizes: form.sizes.filter((_, i) => i !== idx)})} className="text-rose-500 hover:text-rose-700 font-bold ml-1">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      id="newSizeInput"
                      placeholder="أضف مقاس (e.g. S, 38)" 
                      className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-hidden"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !form.sizes.includes(val)) {
                            setForm({...form, sizes: [...form.sizes, val]});
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <button type="button" onClick={() => {
                        const input = document.getElementById('newSizeInput') as HTMLInputElement;
                        if(input && input.value.trim() && !form.sizes.includes(input.value.trim())) {
                          setForm({...form, sizes: [...form.sizes, input.value.trim()]});
                          input.value = '';
                        }
                      }} 
                      className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl"
                    >
                      إضافة
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    الألوان المتاحة (Colors)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(form.colors) && form.colors.map((c, idx) => (
                      <span key={idx} className="px-3 py-1 bg-neutral-100 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border border-neutral-200">
                        <span className="w-3 h-3 rounded-full border border-neutral-300" style={{backgroundColor: c}}></span>
                        {c}
                        <button type="button" onClick={() => setForm({...form, colors: form.colors.filter((_, i) => i !== idx)})} className="text-rose-500 hover:text-rose-700 font-bold ml-1">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      id="newColorPicker"
                      className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer"
                    />
                    <button type="button" onClick={() => {
                        const input = document.getElementById('newColorPicker') as HTMLInputElement;
                        if(input && input.value && !form.colors.includes(input.value)) {
                          setForm({...form, colors: [...form.colors, input.value]});
                        }
                      }} 
                      className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl"
                    >
                      أضف لون (Swatch)
                    </button>
                  </div>
                </div>
`;

content = content.replace(regexJsx, newJsx);

fs.writeFileSync('src/components/admin/ProductsTab.tsx', content);
