# party-battle

## Platforms

- Web: https://party-battle.thirty-degrees.ch
- Android: https://play.google.com/store/apps/details?id=ch.thirty_degrees.party_battle
- IOS: https://apps.apple.com/us/app/party-battle/id6751968403

## Setup

- Create a config file .env.development inside /frontend-party-battle with the content:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:2567
EXPO_PUBLIC_FRONTEND_URL=http://localhost:8081
```

- To test the app on a physical device, change localhost to your IP. Then scan the QR code from the terminal with the Expo Go app.
- For building Android Java openjdk 21 is recommmended

## Tech stack

- TypeScript
- Colyseus

### Frontend

- Expo
- React Native
- Gluestack UI
- Nativewind

### Backend

- Node.js
