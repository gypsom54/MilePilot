# Fix: Invalid UUID appId / REPLACE_WITH_EAS_PROJECT_ID

If `eas credentials` or `eas build` fails with **Invalid UUID appId**, the project has a placeholder ID instead of a real Expo project.

## Fix on Windows (PowerShell)

```powershell
cd C:\Users\hanna\MilePilot
git pull origin cursor/expo-eas-native-ae00
```

Open `app.config.js` and confirm there is **no** line containing `REPLACE_WITH_EAS_PROJECT_ID`.

Then re-link the project:

```powershell
eas init
```

When prompted:
- **Create a new project** → name it **MilePilot**
- Accept linking this directory

`eas init` writes a real UUID like `a1b2c3d4-e5f6-7890-abcd-ef1234567890` into your config.

Verify:

```powershell
eas project:info
```

Then continue:

```powershell
eas credentials
eas build --platform ios --profile preview
```

## If eas init says "already linked" with bad ID

1. Edit `app.config.js` — remove the entire `eas: { projectId: ... }` block under `extra`
2. Save the file
3. Run `eas init` again

Or create the project on https://expo.dev → New Project → copy the Project ID → add to `app.config.js`:

```javascript
extra: {
  eas: {
    projectId: 'your-real-uuid-here',
  },
  webAppUrl: 'https://app.milepilot.uk/?runtime=expo&v=8.11.0',
},
```
