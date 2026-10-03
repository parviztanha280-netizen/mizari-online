# SafarOnline QA Report — v4.3

## Static verification completed

- Passenger, Driver, and Admin Android projects are present.
- Application IDs:
  - `com.safaronline.passenger`
  - `com.safaronline.driver`
  - `com.safaronline.admin`
- `compileSdk` / `targetSdk`: 35.
- Android Gradle Plugin: 8.7.3.
- Cloud workflow provisions Java 21, Android SDK 35, Build Tools 35.0.0, and Gradle 8.10.2.
- All three Android manifests contain launcher activities and required network permissions.
- Required referenced resources (`logo`, `AppTheme`, `network_security_config`) are present in all three apps.
- Java source scan found no raw newlines inside string literals.
- `server/server.js`: `node --check` passed.
- `tools/build_all.sh`: `bash -n` passed.
- Main API route set is present for authentication, fares, rides, driver state/location, earnings, admin stats, driver verification, and complaints.
- Ride status transitions are guarded by role and transition rules in the server.

## Not executed in this environment

- Android APK compilation: unavailable because Android SDK/Gradle are not installed here.
- APK installation/emulator/device testing: unavailable because no Android SDK/ADB is installed here.
- Live backend integration test: Node dependencies are not installed in the package and this environment cannot reliably download them.

## Final acceptance gate

1. Run the GitHub Actions workflow `.github/workflows/android-build.yml`.
2. Confirm all three APK artifacts are produced.
3. Install the APKs on Android devices/emulators.
4. Run an end-to-end passenger → driver → admin ride test.
5. Fix only issues revealed by the real build/device test.
