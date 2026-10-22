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

## Container security updates

Use **Actions → containers → Run workflow** to rebuild the backend, web frontend, or both without changing app versions or submitting mobile builds to the stores. Select the branch or tag containing the compatible security patches. Leave **Deploy the containers after building** enabled to trigger deployment, or disable it to only build and publish the images.

The backend API version comes from `.release-please-manifest.json` in the selected ref. For example, rebuilding a ref whose backend version is `2.22.1` updates the image serving `/api/v2.22.1`, so existing installed apps receive the server fixes. Use a ref that preserves compatibility with that app version; the workflow does not override the API version of newer application code.

Manual runs tag images as `<commit-sha>-<run-id>-<run-attempt>` so rebuilding the same commit produces a new deployment tag. Builds pull the base images again and reuse the registry build cache. Deployment uses the existing `GH_PAT_ACTIONS_TRIGGER` secret and infrastructure workflows in `Calfur/calfur-dev`; follow their deployment run to confirm rollout.

The normal release workflow calls the same container workflow. It continues to deploy the backend automatically, publish the web image under the release commit SHA, and run the Android/iOS jobs. Web deployment after a normal release still uses **trigger-frontend-deployment** on the frontend release tag.

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
