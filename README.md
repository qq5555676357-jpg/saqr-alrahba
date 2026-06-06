# نظام محاسبي شامل - Comprehensive Accounting System

نظام محاسبي متكامل مبني على Express.js و SQLite

## الميزات

- ✅ إدارة الحسابات (Chart of Accounts)
- ✅ قيود يومية (Journal Entries)
- ✅ الفواتير (Invoices)
- ✅ العملاء والموردين (Customers & Suppliers)
- ✅ التقارير المحاسبية (Financial Reports)
- ✅ المصادقة والتفويض (Authentication & Authorization)

## التثبيت

```bash
npm install
cp .env.example .env
```

## التشغيل

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### الحسابات
- `GET /api/chart-of-accounts` - قائمة الحسابات
- `GET /api/chart-of-accounts/hierarchy` - التسلسل الهرمي
- `POST /api/chart-of-accounts` - إنشاء حساب
- `PUT /api/chart-of-accounts/:id` - تحديث حساب
- `DELETE /api/chart-of-accounts/:id` - حذف حساب

### القيود اليومية
- `GET /api/journal-entries` - قائمة القيود
- `POST /api/journal-entries` - إنشاء قيد
- `GET /api/journal-entries/:id` - تفاصيل القيد
- `POST /api/journal-entries/:id/post` - ترحيل القيد

### الفواتير
- `GET /api/invoices` - قائمة الفواتير
- `POST /api/invoices` - إنشاء فاتورة
- `GET /api/invoices/:id` - تفاصيل الفاتورة
- `PUT /api/invoices/:id` - تحديث فاتورة
- `POST /api/invoices/:id/post` - ترحيل فاتورة

### التقارير
- `GET /api/reports/trial-balance` - ميزان المراجعة
- `GET /api/reports/balance-sheet` - الميزانية العمومية
- `GET /api/reports/income-statement` - قائمة الدخل
- `GET /api/reports/ledger/:accountId` - دفتر الأستاذ
