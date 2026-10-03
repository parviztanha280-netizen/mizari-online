# ساخت APKهای سفرآنلاین

این نسخه برای GitHub Actions آماده شده است. Workflow در مسیر `.github/workflows/android-build.yml` قرار دارد و هر سه APK را در یک اجرا می‌سازد.

### خروجی‌ها
- `SafarOnlinePassenger-debug.apk`
- `SafarOnlineDriver-debug.apk`
- `SafarOnlineAdmin-debug.apk`

### اجرا
1. این پوشه را به یک repository در GitHub منتقل کنید.
2. وارد **Actions** شوید.
3. Workflow با نام **Build SafarOnline Android APKs** را اجرا کنید.
4. بعد از سبز شدن Build، از بخش **Artifacts** فایل `SafarOnline-APKs` را دریافت کنید.

این مرحله فقط Build است؛ «تست واقعی» زمانی اعلام می‌شود که APKها روی Android نصب و اجرا شوند و چرخه Passenger → Driver → Admin با Backend بررسی شود.
