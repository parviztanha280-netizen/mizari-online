# نسخه نهایی قابل Build — میزاری آنلاین

این پروژه شامل سه اپ وب/PWA و پوسته Android با Capacitor است:
- مسافر: af.mizari.online.passenger
- راننده: af.mizari.online.driver
- مدیریت: af.mizari.online.admin

## ساخت APK با گوشی
1. پروژه را در GitHub قرار بده.
2. Actions → Build all Android APKs → Run workflow.
3. در `api_url` آدرس عمومی Backend را وارد کن که با `/api` تمام شود.
4. بعد از پایان هر سه Artifact را دانلود کن.

## نسخه Release
برای انتشار فروشگاهی، keystore را خارج از مخزن نگه دار و فقط Secretهای امضای اندروید را در GitHub تنظیم کن.

## وضعیت فنی
این بسته سورس و workflow ساخت است؛ APK تولیدشده فقط بعد از اجرای GitHub Actions ایجاد می‌شود. سرویس‌های واقعی SMS، نقشه، Push، پرداخت و HTTPS باید با حساب/کلید واقعی متصل شوند.
