const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const replacement = `
export const AdminPanelInner = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <div className="bg-[#ffffff] p-8 rounded-2xl shadow-xl border border-[#E2E8F0] w-full max-w-md text-center">
          <Lock className="w-12 h-12 text-[#111111] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#111111] mb-6">لوحة التحكم الإدارية</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passcode === '1234') setIsAuthenticated(true);
            else alert('رمز مرور خاطئ');
          }}>
            <input 
              type="password" 
              placeholder="أدخل رمز المرور (1234)" 
              value={passcode} 
              onChange={e => setPasscode(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#111111] focus:outline-none mb-4 text-center font-mono tracking-widest text-lg" 
            />
            <button type="submit" className="w-full py-3 bg-[#111111] hover:bg-[#6b1d2f] text-white rounded-xl font-bold transition-colors">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-right" dir="rtl">
`;

content = content.replace(
  /export const AdminPanelInner = \(\) => \{[\s\S]*?return \(\n\s*<div className="min-h-screen bg-\[\#F8F9FA\] flex flex-col md:flex-row font-sans text-right" dir="rtl">/,
  replacement
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
