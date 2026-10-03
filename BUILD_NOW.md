# SafarOnline — Build final APKs

This release contains three independent Android applications:

- `android/SafarOnlinePassenger` — passenger
- `android/SafarOnlineDriver` — driver
- `android/SafarOnlineAdmin` — admin

## Required build environment

- JDK 17 or 21
- Android SDK Platform 35
- Android SDK Build-Tools 35.x
- Gradle 8.7+ (or Android Studio with Gradle sync)

## Build with Android Studio

Open each of the three project folders separately. Let Gradle sync, then choose **Build > Generate App Bundles or APKs > Generate APKs**.

The expected application IDs are:

- `com.safaronline.passenger`
- `com.safaronline.driver`
- `com.safaronline.admin`

## Build from terminal

From each project directory:

```text
gradle assembleDebug
```

The debug APK will be under `app/build/outputs/apk/debug/`.

## Backend

From `server/`:

```text
npm install
npm start
```

The default API is `http://localhost:3000/api`.

For a physical Android phone, set the API field in the app to the computer's LAN address, for example `http://192.168.1.10:3000/api`.

For an Android emulator, the default `http://10.0.2.2:3000/api` is used.

## Demo credentials

- OTP: `123456`
- Admin username: `admin`
- Admin password: `1234567`

These are **demo credentials only**. Replace OTP/authentication and admin authentication before production deployment.
