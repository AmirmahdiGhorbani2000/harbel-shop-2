# فروشگاه اینترنتی گیاهان دارویی

## معرفی

پلتفرم کامل فروشگاهی برای عرضه گیاهان دارویی و فرآورده‌های طبیعی با تمرکز بر معماری مدرن، امنیت و مقیاس‌پذیری. این پروژه شامل اپلیکیشن کاربری، پنل مدیریت پیشرفته و درگاه پرداخت زرین‌پال است.

## تکنولوژی‌ها

### بک‌اند
- Node.js و Express.js
- MongoDB با Mongoose
- JWT برای احراز هویت مبتنی بر توکن
- درگاه پرداخت زرین‌پال با قابلیت تست sandbox
- ساختار REST API استاندارد

### فرانت‌اند
- React 18 با Vite
- Redux Toolkit برای مدیریت state
- React Router v6
- Tailwind CSS
- طراحی واکنش‌گرا با پشتیبانی کامل از RTL

## معماری

پروژه از الگوی لایه‌بندی شده پیروی می‌کند:

```

Controllers (منطق تجاری) → Models (لایه داده) → Routes (API Endpoints)

```

جداسازی کامل Frontend و Backend از طریق REST API با فایل‌های محیطی مجزا.

## قابلیت‌ها

### بخش کاربری
- احراز هویت کامل (ثبت‌نام، ورود، مدیریت پروفایل)
- مرور محصولات با فیلتر، جستجو و مرتب‌سازی
- سبد خرید پویا با قابلیت مدیریت آیتم‌ها
- پرداخت امن از طریق زرین‌پال
- تاریخچه سفارشات

### پنل مدیریت
- داشبورد آماری با نمایش KPI
- CRUD کامل محصولات، دسته‌بندی‌ها و کاربران
- مدیریت سفارشات با تغییر وضعیت
- نقش‌های دسترسی (Admin / User)

## نصب و راه‌اندازی

```bash
git clone https://github.com/AmirmahdiGhorbani2000/harbel-shop-2.git
cd harbel-shop
npm run install:all
```

### بک‌اند

```bash
cd backend
cp .env.example .env
npm run dev
```

### فرانت‌اند

```bash
cd frontend
npm run dev
```

### داده‌های اولیه

```bash
cd backend
npm run seed:all
```

### ادمین پیش‌فرض:

```
email: admin@herbalshop.com
password: admin123456
```

## متغیرهای محیطی

### بک‌اند

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/herbal_shop
JWT_SECRET=your_jwt_secret
ZARINPAL_MERCHANT_ID=your_merchant_id
FRONTEND_URL=http://localhost:5173
```

### فرانت‌اند

```
VITE_API_URL=http://localhost:5000/api
```

## ساختار پروژه

```
herbal-shop/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── utils/
├── docker-compose.yml
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | ثبت‌نام کاربر |
| `POST` | `/api/auth/login` | ورود کاربر |
| `GET` | `/api/products` | دریافت محصولات با فیلتر |
| `GET` | `/api/products/:id` | جزئیات محصول |
| `POST` | `/api/cart/add` | افزودن به سبد خرید |
| `POST` | `/api/payment/request` | درخواست پرداخت |
| `GET` | `/api/admin/stats` | آمار کلی |

## اجرا با Docker

```bash
docker-compose up
```

## امنیت

- هش کردن رمز عبور با bcrypt
- JWT با انقضای ۳۰ روزه
- محافظت از روت‌های ادمین
- اعتبارسنجی ورودی‌ها
- محدودیت حجم آپلود فایل

## لایسنس

GNU General Public License v3.0 
## حمایت
اگر این پروژه رو دوست داشتید لطفا ستاره بدید.

