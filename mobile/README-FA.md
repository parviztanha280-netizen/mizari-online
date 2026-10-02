# ساخت اپ اندروید میزاری آنلاین

این پوشه برای ساخت سه اپ جداگانه است: مسافر، راننده و مدیریت.

## روش پیشنهادی با گوشی
1. پروژه را در GitHub قرار بده.
2. در GitHub وارد Actions شو.
3. workflow با نام **Build Android APKs** را انتخاب کن.
4. Run workflow را بزن.
5. یکی از `passenger / driver / admin` را انتخاب کن.
6. در `api_url` آدرس عمومی بک‌اند را با `/api` وارد کن؛ مثال: `https://api.example.com/api`.
7. بعد از پایان، از بخش Artifacts فایل APK را بگیر.

## نسخه فروشگاه
برای Play Store از workflow **Android Release (signed)** استفاده می‌شود و چهار Secret زیر لازم است:
- `ANDROID_KEYSTORE_B64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

کلید امضای اندروید را داخل GitHub repository قرار نده.
