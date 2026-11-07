# Fitness App — foundation (reconstructed)

This commit reconstructs the foundation milestone before core workout implementation. No historical Git checkpoint existed; this is not a byte-for-byte recovery of an old commit. Expo SDK58, TypeScript strict, Train/Progress tabs, three sample exercises and workout preview. No active sessions, persistence, XP, backend, AI or camera.

## Run on iPhone

Use Node24.22.2 and Expo Go supporting SDK58. Computer and phone must share Wi-Fi.

```sh
npm ci
npm start -- --clear
```

Scan the new QR in Expo Go. Keep Metro running. No API key or paid Apple Developer membership needed.

## Checks

```sh
npm run typecheck
npm run lint
npx expo export --platform all
```

Runtime on iPhone13/SDK58 has not been verified. Previous Simulator results documented in docs relate to SDK57.
