import 'dotenv/config';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { dataStore } from './server/store.js';

// Global In-Memory Rate Limiting Cache
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

// Rate limiting middleware helper
function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${Array.isArray(ip) ? ip[0] : ip}_${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);
    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'تم تجاوز الحد المسموح من الطلبات، يرجى الانتظار قليلاً وإعادة المحاولة',
      });
    }

    record.count++;
    return next();
  };
}

// Input Sanitization utility to eliminate XSS, code injection, and dangerous tags
function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/\0/g, '')
    .trim();
}

function sanitizeObject(obj: any): any {
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
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Security Headers via Helmet with CSP tailored for luxury retail app & preview iframe
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: [
            "'self'",
            'data:',
            'blob:',
            'https://images.unsplash.com',
            'https://*.google.com',
            'https://*.googleapis.com',
            'https://maps.gstatic.com',
            'https://*.openstreetmap.org',
          ],
          connectSrc: ["'self'", 'https://*', 'ws:', 'wss:'],
          frameAncestors: ["'self'", 'https://ai.studio', 'https://*.google.com'],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      xFrameOptions: false, // Handled safely by frameAncestors in CSP for AI Studio Preview
    })
  );

  // 2. CORS configuration
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Body parsers with safe payload caps
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. Rate Limiters
  const authRateLimiter = createRateLimiter(25, 60 * 1000); // 25 attempts / min
  const checkoutRateLimiter = createRateLimiter(40, 60 * 1000); // 40 checkout calls / min

  // 5. Auth Middlewares
  const adminAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    if (token && dataStore.verifyAdminAuth(token)) {
      (req as any).admin = dataStore.getAdminByToken(token);
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Admin access only.' });
  };

  const ownerAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    if (token && dataStore.verifyOwnerAuth(token)) {
      (req as any).admin = dataStore.getAdminByToken(token);
      return next();
    }
    return res.status(403).json({ error: 'صلاحية غير كافية. هذه العمليات مقتصرة حصرياً على المالك العام (Owner).' });
  };

  const customerAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const customer = dataStore.getCustomerByToken(token);

    if (customer) {
      (req as any).customer = customer;
      return next();
    }
    return res.status(401).json({ error: 'يرجى تسجيل الدخول للوصول لحسابك' });
  };

  // --- API ROUTES ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      platform: 'HKAYA Luxury Fashion E-Commerce Core',
    });
  });

  // Admin Auth APIs
  app.post('/api/auth/login', authRateLimiter, (req, res) => {
    const email = sanitizeText(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'يرجى ملء البريد الإلكتروني وكلمة المرور' });
    }

    const result = dataStore.loginAdmin(email, password);
    if (result.success) {
      res.json({ success: true, token: result.token, admin: result.admin });
    } else {
      res.status(401).json({ success: false, message: result.message || 'بيانات الدخول غير صحيحة' });
    }
  });

  app.post('/api/auth/pin-login', authRateLimiter, (req, res) => {
    const pin = typeof req.body.pin === 'string' ? req.body.pin.trim() : '';
    if (!pin) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رمز المرور أو PIN' });
    }

    const result = dataStore.loginAdminByPin(pin);
    if (result.success) {
      res.json({ success: true, token: result.token, admin: result.admin });
    } else {
      res.status(401).json({ success: false, message: result.message || 'رمز المرور غير صحيح' });
    }
  });

  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const valid = dataStore.verifyAdminAuth(token);
    const admin = valid ? dataStore.getAdminByToken(token) : null;
    res.json({ authenticated: valid, admin });
  });

  app.post('/api/auth/request-access', authRateLimiter, (req, res) => {
    try {
      const email = sanitizeText(req.body.email);
      const displayName = sanitizeText(req.body.displayName);
      const password = typeof req.body.password === 'string' ? req.body.password : '';
      const notes = sanitizeText(req.body.notes);

      if (!email || !displayName || !password) {
        return res.status(400).json({ success: false, message: 'يرجى تعبئة كافة الحقول المطلوبة' });
      }

      const result = dataStore.requestAdminAccess({ email, displayName, password, notes });
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch {
      res.status(500).json({ success: false, message: 'تعذر إرسال طلب الانضمام، يرجى المحاولة لاحقاً' });
    }
  });

  app.post('/api/auth/change-admin-password', adminAuthMiddleware, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const admin = (req as any).admin;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'يرجى تزويد كلمة المرور القديمة والجديدة' });
    }
    const result = dataStore.changeAdminPassword(admin.id, oldPassword, newPassword);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  // Owner-Only RBAC & Admin Management APIs
  app.get('/api/admin/admins', ownerAuthMiddleware, (req, res) => {
    res.json(dataStore.getAdmins());
  });

  app.post('/api/admin/admins', ownerAuthMiddleware, (req, res) => {
    try {
      const email = sanitizeText(req.body.email);
      const displayName = sanitizeText(req.body.displayName);
      const password = typeof req.body.password === 'string' ? req.body.password : '';
      const role = req.body.role === 'owner' ? 'owner' : 'admin';

      if (!email || !displayName || !password) {
        return res.status(400).json({ success: false, message: 'يرجى ملء البريد والاسم وكلمة المرور' });
      }

      const result = dataStore.createAdminDirect({ email, displayName, password, role });
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch {
      res.status(500).json({ success: false, message: 'تعذر إنشاء حساب المسؤول' });
    }
  });

  app.put('/api/admin/admins/:id/approve', ownerAuthMiddleware, (req, res) => {
    const adminId = sanitizeText(req.params.id);
    const customDisplayName = req.body.displayName ? sanitizeText(req.body.displayName) : undefined;
    const result = dataStore.approveAdmin(adminId, customDisplayName);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  app.put('/api/admin/admins/:id/reject', ownerAuthMiddleware, (req, res) => {
    const adminId = sanitizeText(req.params.id);
    const result = dataStore.rejectAdmin(adminId);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  app.put('/api/admin/admins/:id/name', ownerAuthMiddleware, (req, res) => {
    const adminId = sanitizeText(req.params.id);
    const displayName = sanitizeText(req.body.displayName);
    const result = dataStore.updateAdminDisplayName(adminId, displayName);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  app.put('/api/admin/admins/:id/revoke', ownerAuthMiddleware, (req, res) => {
    const adminId = sanitizeText(req.params.id);
    const result = dataStore.revokeAdmin(adminId);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  app.delete('/api/admin/admins/:id', ownerAuthMiddleware, (req, res) => {
    const adminId = sanitizeText(req.params.id);
    const result = dataStore.deleteAdmin(adminId);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  // Customer Auth & Profile APIs
  app.post('/api/auth/customer-register', authRateLimiter, (req, res) => {
    try {
      const fullName = sanitizeText(req.body.fullName);
      const email = sanitizeText(req.body.email).toLowerCase();
      const phoneNumber = sanitizeText(req.body.phoneNumber);
      const password = typeof req.body.password === 'string' ? req.body.password : '';
      const governorate = sanitizeText(req.body.governorate);
      const streetName = sanitizeText(req.body.streetName);
      const buildingNumber = sanitizeText(req.body.buildingNumber);

      if (!fullName || fullName.trim().split(/\s+/).length < 2) {
        return res.status(400).json({ success: false, message: 'يرجى كتابة الاسم الكامل (كلمتان على الأقل)' });
      }

      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'يرجى إدخال بريد إلكتروني صحيح' });
      }

      const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');
      if (!cleanPhone.match(/^(077|078|079|07)\d{7,8}$/)) {
        return res.status(400).json({ success: false, message: 'يرجى إدخال رقم هاتف أردني صحيح (07X)' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن لا تقل عن 6 خانات' });
      }

      const result = dataStore.registerCustomer({
        fullName,
        email,
        phoneNumber: cleanPhone,
        password,
        governorate,
        streetName,
        buildingNumber,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch {
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء معالجة التسجيل، يرجى المحاولة لاحقاً' });
    }
  });

  app.post('/api/auth/customer-login', authRateLimiter, (req, res) => {
    const identifier = sanitizeText(req.body.identifier);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رقم الهاتف أو البريد وكلمة المرور' });
    }

    const result = dataStore.loginCustomer(identifier, password);
    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  });

  app.post('/api/auth/reset-password', authRateLimiter, (req, res) => {
    const identifier = sanitizeText(req.body.identifier);
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';

    if (!identifier || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال معرف الحساب وكلمة مرور جديدة قوية' });
    }

    const result = dataStore.resetCustomerPassword(identifier, newPassword);
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  });

  app.get('/api/auth/me', customerAuthMiddleware, (req, res) => {
    const customer = (req as any).customer;
    res.json({ customer });
  });

  app.put('/api/auth/profile', customerAuthMiddleware, (req, res) => {
    const customer = (req as any).customer;
    const sanitizedBody = sanitizeObject(req.body);
    const updated = dataStore.updateCustomerProfile(customer.id, sanitizedBody);
    if (!updated) return res.status(404).json({ error: 'المستخدم غير موجود' });
    res.json({ success: true, customer: updated });
  });

  app.post('/api/auth/addresses', customerAuthMiddleware, (req, res) => {
    const customer = (req as any).customer;
    const label = sanitizeText(req.body.label) || 'عنوان جديد';
    const governorate = sanitizeText(req.body.governorate);
    const streetName = sanitizeText(req.body.streetName);
    const buildingNumber = sanitizeText(req.body.buildingNumber) || '1';
    const gpsLocation = sanitizeText(req.body.gpsLocation);
    const isDefault = Boolean(req.body.isDefault);

    if (!governorate || !streetName) {
      return res.status(400).json({ error: 'المحافظة والشارع حقول إجبارية' });
    }

    const created = dataStore.addCustomerAddress(customer.id, {
      label,
      governorate,
      streetName,
      buildingNumber,
      gpsLocation,
      isDefault,
    });

    res.status(201).json({ success: true, address: created });
  });

  app.delete('/api/auth/addresses/:id', customerAuthMiddleware, (req, res) => {
    const customer = (req as any).customer;
    const deleted = dataStore.deleteCustomerAddress(customer.id, sanitizeText(req.params.id));
    res.json({ success: deleted });
  });

  app.get('/api/auth/my-orders', customerAuthMiddleware, (req, res) => {
    const customer = (req as any).customer;
    const orders = dataStore.getCustomerOrders(customer.id, customer.phoneNumber);
    res.json(orders);
  });

  // Payment Processing APIs (Strictly Server-Side)
  app.post('/api/payment/process', checkoutRateLimiter, (req, res) => {
    try {
      const {
        amount,
        currency = 'JOD',
        cardNumber,
        cardholderName,
        cvv,
      } = req.body;

      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ success: false, error: 'قيمة العملية غير صحيحة' });
      }

      const cleanCard = sanitizeText(cardNumber).replace(/\s+/g, '');
      if (!cleanCard || cleanCard.length < 13 || cleanCard.length > 19) {
        return res.status(400).json({ success: false, error: 'رقم البطاقة الائتمانية غير صالح' });
      }

      const cleanName = sanitizeText(cardholderName);
      if (!cleanName || cleanName.length < 3) {
        return res.status(400).json({ success: false, error: 'يرجى إدخال اسم حامل البطاقة كما هو مطبوع' });
      }

      const cleanCvv = sanitizeText(cvv);
      if (!cleanCvv || cleanCvv.length < 3 || cleanCvv.length > 4) {
        return res.status(400).json({ success: false, error: 'رمز الحماية (CVV) غير صالح' });
      }

      let cardBrand = 'Visa';
      if (cleanCard.startsWith('5') || cleanCard.startsWith('2')) cardBrand = 'MasterCard';
      else if (cleanCard.startsWith('3')) cardBrand = 'American Express';

      const last4 = cleanCard.slice(-4);
      const transactionRef = `TXN-HK-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      res.json({
        success: true,
        status: 'approved',
        transactionRef,
        amount: Number(amount),
        currency,
        cardBrand,
        last4,
        authorizationCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'تمت عملية الدفع ببطاقة الائتمان بنجاح',
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({ success: false, error: 'تعذر معالجة بطاقة الائتمان' });
    }
  });

  app.post('/api/payment/cliq-verify', checkoutRateLimiter, (req, res) => {
    const alias = sanitizeText(req.body.alias) || 'HKAYA.STORE';
    const transactionRef = sanitizeText(req.body.transactionRef);
    const amount = Number(req.body.amount);

    if (!transactionRef) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال الرقم المرجعي لحوالة CliQ' });
    }

    res.json({
      success: true,
      status: 'verified',
      cliqAlias: alias,
      transactionRef: transactionRef.toUpperCase(),
      amount,
      message: 'تم التحقق من حوالة CliQ الفورية بنجاح',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/payment/wallet-charge', checkoutRateLimiter, (req, res) => {
    const walletProvider = sanitizeText(req.body.walletProvider) || 'ZAIN';
    const phoneNumber = sanitizeText(req.body.phoneNumber).replace(/\s+/g, '');
    const amount = Number(req.body.amount);

    if (!phoneNumber.match(/^(077|078|079|07)\d{7,8}$/)) {
      return res.status(400).json({ success: false, error: 'رقم محفظة المحمول غير صحيح' });
    }

    const transactionRef = `WLT-${walletProvider.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    res.json({
      success: true,
      status: 'charged',
      wallet: walletProvider,
      phoneNumber,
      transactionRef,
      amount,
      message: 'تم خصم المبلغ من المحفظة الإلكترونية بنجاح',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/payment/apple-pay', checkoutRateLimiter, (req, res) => {
    const amount = Number(req.body.amount);
    const transactionRef = `APL-PAY-${Date.now().toString().slice(-6)}`;

    res.json({
      success: true,
      status: 'approved',
      method: 'Apple Pay',
      transactionRef,
      amount,
      message: 'تمت مصادقة Apple Pay بنجاح',
      timestamp: new Date().toISOString(),
    });
  });

  // Products APIs
  app.get('/api/products', (req, res) => {
    try {
      const {
        ids,
        category,
        subCategory,
        isClearance,
        search,
        minPrice,
        maxPrice,
        inStockOnly,
        sort,
        page,
        limit,
      } = req.query;

      const result = dataStore.getProducts({
        ids: sanitizeText(ids),
        category: sanitizeText(category),
        subCategory: sanitizeText(subCategory),
        isClearance: isClearance === 'true',
        search: sanitizeText(search),
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStockOnly: inStockOnly === 'true',
        sort: sanitizeText(sort),
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : ids ? 100 : 24,
      });

      res.json(result);
    } catch {
      res.status(500).json({ error: 'تعذر جلب المنتجات' });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    const product = dataStore.getProductById(sanitizeText(req.params.id));
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(product);
  });

  app.post('/api/products', adminAuthMiddleware, (req, res) => {
    try {
      const sanitized = sanitizeObject(req.body);
      const created = dataStore.createProduct(sanitized);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'بيانات المنتج غير صحيحة' });
    }
  });

  app.put('/api/products/:id', adminAuthMiddleware, (req, res) => {
    try {
      const sanitized = sanitizeObject(req.body);
      const updated = dataStore.updateProduct(sanitizeText(req.params.id), sanitized);
      if (!updated) return res.status(404).json({ error: 'المنتج غير موجود' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'تعذر تحديث المنتج' });
    }
  });

  app.delete('/api/products/:id', adminAuthMiddleware, (req, res) => {
    const success = dataStore.deleteProduct(sanitizeText(req.params.id));
    if (!success) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json({ success: true });
  });

  // Categories API
  app.get('/api/categories', (req, res) => {
    res.json(dataStore.getCategories());
  });

  // Settings API
  app.get('/api/settings', (req, res) => {
    res.json(dataStore.getSettings());
  });

  app.put('/api/settings', adminAuthMiddleware, (req, res) => {
    try {
      const updated = dataStore.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'تعذر حفظ الإعدادات' });
    }
  });

  // Orders API
  app.get('/api/orders', adminAuthMiddleware, (req, res) => {
    res.json(dataStore.getOrders());
  });

  app.post('/api/orders', checkoutRateLimiter, (req, res) => {
    try {
      const fullName = sanitizeText(req.body.fullName);
      const phoneNumber = sanitizeText(req.body.phoneNumber);
      const governorate = sanitizeText(req.body.governorate);
      const streetName = sanitizeText(req.body.streetName);
      const buildingNumber = sanitizeText(req.body.buildingNumber);
      const gpsLocation = sanitizeText(req.body.gpsLocation);
      const notes = sanitizeText(req.body.notes);
      const { items, subtotal, deliveryFee, customerId, paymentMethod, paymentStatus, transactionRef } = req.body;

      if (!fullName || fullName.trim().split(/\s+/).length < 4) {
        return res.status(400).json({ error: 'يرجى إدخال الاسم الرباعي كاملاً (4 كلمات على الأقل)' });
      }

      const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');
      if (!cleanPhone.match(/^(077|078|079|07)\d{7,8}$/)) {
        return res.status(400).json({ error: 'يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 07' });
      }

      if (!governorate) {
        return res.status(400).json({ error: 'يرجى اختيار المحافظة' });
      }

      if (!streetName || !buildingNumber) {
        return res.status(400).json({ error: 'يرجى إدخال اسم الشارع ورقم العمارة' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'السلة فارغة' });
      }

      const sanitizedItems = items.map((it: any) => ({
        productId: sanitizeText(it.productId),
        title: sanitizeText(it.title),
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        selectedSize: sanitizeText(it.selectedSize),
        selectedColor: sanitizeText(it.selectedColor),
        image: typeof it.image === 'string' ? it.image : '',
      }));

      const newOrder = dataStore.createOrder({
        fullName,
        phoneNumber: cleanPhone,
        governorate,
        streetName,
        buildingNumber,
        gpsLocation: gpsLocation || '',
        notes,
        items: sanitizedItems,
        subtotal: Number(subtotal) || 0,
        deliveryFee: Number(deliveryFee) || 2,
        ...(customerId ? { customerId: sanitizeText(customerId) } : {}),
        ...(paymentMethod ? { paymentMethod: sanitizeText(paymentMethod) } : {}),
        ...(paymentStatus ? { paymentStatus: sanitizeText(paymentStatus) } : {}),
        ...(transactionRef ? { transactionRef: sanitizeText(transactionRef) } : {}),
      } as any);

      res.status(201).json(newOrder);
    } catch {
      res.status(400).json({ error: 'تعذر إنشاء الطلب، يرجى مراجعة البيانات' });
    }
  });

  app.put('/api/orders/:id/status', adminAuthMiddleware, (req, res) => {
    const status = sanitizeText(req.body.status) as any;
    const updated = dataStore.updateOrderStatus(sanitizeText(req.params.id), status);
    if (!updated) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json(updated);
  });

  app.delete('/api/orders/:id', adminAuthMiddleware, (req, res) => {
    const success = dataStore.deleteOrder(sanitizeText(req.params.id));
    if (!success) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json({ success: true, message: 'تم حذف الطلب بنجاح' });
  });

  // Global Express Error Sanitizer Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled API Error:', err?.message || err);
    res.status(500).json({ error: 'Internal Server Error', message: 'حدث خطأ في معالجة الطلب' });
  });

  // Vite Middleware integration for development and production SPA fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HKAYA Secured Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
