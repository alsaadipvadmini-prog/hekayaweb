function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key];
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
}
console.log(sanitizeObject(['a', 'b', 'c']));
console.log(sanitizeObject({sizes: ['a', 'b', 'c']}));
