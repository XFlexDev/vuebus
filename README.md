# Bus Ticket App (Vue 3 + Ionic Vue)

A full demo bus-ticketing app with a native-looking UI, complete booking flow, tickets wallet, and a **fake** payment process.
It does **not** process real payments—everything is simulated for UI/UX and prototyping.

## Features
- Search: From/To + date
- Results list with realistic trip cards
- Trip details + seat map selection
- Passenger details
- Checkout + price breakdown
- Fake payment: card form, validation, simulated processing, simulated 3‑D Secure step
- Tickets wallet with QR code + ticket details
- Profile + settings + help screens
- State management with Pinia, routing with Vue Router

## Run locally
```bash
npm install
npm run dev
```

## Fake payment testing
- Any Luhn-valid card number will work in most cases.
- Special endings for deterministic outcomes:
  - ends with **0002** → decline
  - ends with **0003** → “3DS failed”
  - ends with **0001** → always succeed

Example valid test card: `4242 4242 4242 0001`

## Optional: native builds (Capacitor)
You can wrap this as a native app if you want:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Bus Ticket" "com.example.busticket"
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Then open the native projects (Android Studio / Xcode).

---
Made for prototyping / demos. Replace `src/services/payment.ts` with a real provider integration if you ever go production.
