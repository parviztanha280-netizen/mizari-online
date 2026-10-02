# میزاری آنلاین — نسخه 7.0.0

این بسته آخرین نسخه قابل تحویل پروژه در این مرحله است و سه اپ، Backend، PWA، Socket.IO، Docker/NGINX و مسیر ساخت Android با Capacitor را یکجا دارد.

## سه محصول
- `apps/passenger` — اپ مسافر
- `apps/driver` — اپ راننده
- `apps/admin` — پنل مدیریت
- `backend` — API و منطق سفر

## بررسی خودکار
در ریشه پروژه:
```bash
node scripts/check-project.js
```
این دستور Syntax فایل‌های JavaScript و JSON بودن manifestها را بررسی می‌کند.

## ساخت Android
ساخت پروژه Android و Release در GitHub Actions انجام می‌شود تا لازم نباشد Android SDK روی گوشی کاربر نصب شود.

برای Release امضاشده باید Secrets زیر در GitHub Repository تنظیم شوند:
- `ANDROID_KEYSTORE_B64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

کلید خصوصی عمداً داخل ZIP نیست.

## مواردی که فقط با حساب/زیرساخت واقعی فعال می‌شوند
این‌ها کد آماده یا نقطه اتصال دارند، اما فعال‌سازی نهایی نیازمند اطلاعات واقعی است:
- SMS/OTP provider
- Push provider
- API key سرویس نقشه و routing
- دامنه و TLS
- VPS/Cloud database و storage
- حساب Google Play و Apple Developer
- درگاه پرداخت افغانستان، در صورت استفاده

## وضعیت مهم
این بسته «نسخه کامل سورس و زیرساخت آماده استقرار» است، نه ادعای انتشار عمومی یا فعال بودن سرویس‌های بیرونی. قبل از استفاده واقعی باید تست امنیت، تست بار، پشتیبان‌گیری، مانیتورینگ و تأیید قوانین محلی انجام شود.
