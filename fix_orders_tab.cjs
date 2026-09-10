const fs = require('fs');

let content = fs.readFileSync('src/components/admin/OrdersTab.tsx', 'utf-8');

const exportFunc = `
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Governorate', 'Street', 'Building', 'Status', 'Total', 'Items'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => {
        const itemsList = o.items.map(i => \`\${i.title} (\${i.selectedSize}, \${i.selectedColor}) x\${i.quantity}\`).join(' | ');
        return [\`"\${o.orderNumber}"\`, \`"\${new Date(o.createdAt).toLocaleDateString('en-US')}"\`, \`"\${o.fullName}"\`, \`"\${o.phoneNumber}"\`, \`"\${o.governorate}"\`, \`"\${o.streetName}"\`, \`"\${o.buildingNumber}"\`, \`"\${o.status}"\`, o.total, \`"\${itemsList}"\`].join(',');
      })
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', \`orders_export_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

content = content.replace(/const totalRevenue = orders.reduce/g, exportFunc + '\n  const totalRevenue = orders.reduce');

content = content.replace(
  /<div className="flex items-center gap-2">\s*<button\s*onClick=\{onRefresh\}/,
  `<div className="flex items-center gap-2">\n        <button onClick={handleExportCSV} className="p-2 bg-[#111111] text-white hover:bg-[#6b1d2f] rounded-lg transition-colors cursor-pointer" title="تصدير الطلبات CSV">\n          <FileDown className="w-4 h-4" />\n        </button>\n        <button\n          onClick={onRefresh}`
);

// Order status options
content = content.replace(
  /<option value="pending">بانتظار التأكيد<\/option>[\s\S]*?<option value="cancelled">ملغي<\/option>/,
  `<option value="pending">طلب جديد (New)</option>\n                        <option value="shipped">مع كابتن الشحن (In Transit)</option>\n                        <option value="completed">تم التسليم (Delivered)</option>\n                        <option value="cancelled">ملغي (Cancelled)</option>`
);

fs.writeFileSync('src/components/admin/OrdersTab.tsx', content);

