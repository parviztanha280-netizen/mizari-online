# SafarOnline runtime/build fixes

## Fixed
- Driver location permission now requests fine + coarse location and retries location automatically after permission grant.
- Admin complaints screen now exposes the existing close-complaint API action.
- GitHub Actions no longer asks setup-java to cache a Gradle Wrapper that the project intentionally does not contain.

## Verified in this environment
- Node syntax check: `node --check server/server.js`
- Java structural balance check: braces and parentheses balanced for all three MainActivity files.

## Not executable here
- Android APK compilation/runtime on a real device, because Android SDK/Gradle/ADB are unavailable in this environment.
