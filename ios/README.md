# glowup for iPhone

SwiftUI app, iOS 26+, built with Xcode 27. First run `ios/scripts/fetch-mediapipe.sh` to download MediaPipe (about 370 MB, kept out of Git). Then open `ios/Glowup.xcodeproj`, choose an iPhone simulator, and press Run. Source folders are synchronized, so new files under `Glowup/` and `GlowupTests/` are picked up automatically.

```sh
xcodebuild -project ios/Glowup.xcodeproj -scheme Glowup -destination 'platform=iOS Simulator,name=iPhone 17' test
```

## Implemented

- Overview, Scan, Progress and Membership tabs in the liquid-glass blue palette, using the supplied logo. The app icon is cropped from `docs/references/Glowup Liquid Glass Logo.pdf`.
- Skin questionnaire with the same fields and limits as `lib/contracts.ts`. It encodes to the API v1 JSON shape. "Acne" is an extra concern option that the website does not have yet.
- Photo selection (Photos picker or front camera) and on-device MediaPipe Face Landmarker 1.0.0. It uses the same `face_landmarker.task` model and options as `public/face-worker.js`.
- The three facial proportions, ported from `lib/face/geometry.ts`: same landmark indices, pose limits, error messages and definitions. The face mesh is drawn over the photo. Numbers can be saved to Progress on request.
- Local progress history ported from `lib/progress.ts`: up to 30 check-ins, ordering, replacement by ID and comparison. It is stored in `UserDefaults` under `glowup.progress.v1`.
- Locked membership preview with the proposed Essential and Plus tiers. Purchase buttons are disabled.

## Not yet built

- **Real-photo validation.** The geometry is unit-tested, but MediaPipe has not yet been verified end to end on a real photo on iPhone. Run `TEST_RUNNER_GLOWUP_FACE_PHOTO=/path/to/photo.jpg xcodebuild … test` with a consented photo, and compare the values with the website for the same image.
- **Analysis.** API v1 trusts private-host headers, which a native app cannot use. It needs native authentication and a production API first. Never embed the provider key in the app.
- **Subscriptions.** Create the App Store Connect products, add StoreKit 2 purchase/restore, and verify transactions server-side. See `docs/subscriptions.md`.
- Progress cards and sharing, real-photo and physical-device testing, and privacy disclosures.
- Signing: set your Apple Developer team in Xcode before running on a physical iPhone. The bundle ID `com.mgasparin.glowup` is a placeholder.
