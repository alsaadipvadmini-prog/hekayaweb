const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const newSanitize = `function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  const sanitized = { ...obj } as any;
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeText(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
}`;

content = content.replace(
  /function sanitizeObject<T extends Record<string, any>>\(obj: T\): T {[\s\S]*?return sanitized;\n}/,
  newSanitize
);

fs.writeFileSync('server.ts', content);
