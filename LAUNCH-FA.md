# 🚕 راه‌اندازی واقعی میزاری آنلاین — قدم‌به‌قدم

این راهنما برای زمانی است که فقط گوشی در اختیار داری.

## مسیر A — ساخت APK از روی گوشی با GitHub
1. در GitHub یک Repository بساز.
2. تمام فایل‌های این پروژه را داخل Repository آپلود کن.
3. وارد تب **Actions** شو.
4. Workflow با نام **Build Android APKs** را انتخاب کن.
5. روی **Run workflow** بزن.
6. بعد از پایان اجرا، در بخش **Artifacts** سه فایل APK می‌بینی:
   - passenger
   - driver
   - admin

این APKها برای تست هستند.

## مسیر B — نسخه فروشگاهی Android
برای AAB امضاشده:
1. یک Android Keystore بساز.
2. فایل Keystore را Base64 کن.
3. در GitHub Repository → Settings → Secrets and variables → Actions این Secrets را بساز:
   - ANDROID_KEYSTORE_B64
   - ANDROID_KEYSTORE_PASSWORD
   - ANDROID_KEY_ALIAS
   - ANDROID_KEY_PASSWORD
4. در Actions، workflow **Android Release (signed)** را اجرا کن.
5. App موردنظر را انتخاب کن.
6. فایل AAB از Artifacts دریافت می‌شود.

> Keystore را داخل Repository آپلود نکن. اگر از بین برود، مدیریت نسخه‌های منتشرشده می‌تواند مشکل‌ساز شود.

## مسیر C — راه‌اندازی Backend روی VPS
1. یک VPS لینوکسی تهیه کن.
2. Docker و Docker Compose را نصب کن.
3. `backend/.env.production.example` را به `backend/.env.production` کپی کن.
4. مقادیر واقعی را وارد کن:
   - JWT_SECRET طولانی و تصادفی
   - ADMIN_PHONE
   - CORS_ORIGIN
   - اطلاعات سرویس OTP در صورت استفاده
5. گواهی TLS معتبر برای دامنه تهیه کن.
6. فایل‌های گواهی را در `deploy/nginx/certs/` قرار بده.
7. اجرا:
```bash
docker compose -f deploy/docker-compose.yml up -d --build
```
8. سلامت API را با `/api/health` بررسی کن.

## قبل از استفاده عمومی
- SMS/OTP واقعی را فعال کن.
- کلید نقشه و routing را تنظیم کن.
- Push Notification واقعی را متصل کن.
- Backup خودکار دیتابیس را فعال کن.
- HTTPS را بررسی کن.
- حساب Admin را ایمن کن.
- تست سفر واقعی با حداقل یک مسافر و یک راننده انجام بده.
- قوانین، مالیات، حریم خصوصی و الزامات محلی را قبل از انتشار بررسی کن.

## نکته مهم
این پروژه سورس و زیرساخت لازم را فراهم می‌کند، اما حساب‌های GitHub/Google Play، VPS، دامنه، SMS، Push، نقشه و پرداخت متعلق به مالک پروژه هستند و باید جداگانه پیکربندی شوند.
