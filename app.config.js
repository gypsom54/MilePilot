/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: 'MilePilot',
    slug: 'milepilot',
    version: '8.11.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    scheme: 'milepilot',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#031126',
    },
    assetBundlePatterns: ['assets/web/**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.milepilot.app',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'MilePilot uses location to record your business journeys while you are working.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'MilePilot uses background location so your mileage can continue recording when your phone is locked.',
        NSLocationAlwaysUsageDescription:
          'MilePilot uses background location so your mileage can continue recording when your phone is locked.',
        UIBackgroundModes: ['location', 'fetch'],
        ITSAppUsesNonExemptEncryption: false,
      },
      config: {
        // react-native-maps uses Apple Maps on iOS by default (no Google key required)
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      package: 'com.milepilot.app',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#031126',
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'FOREGROUND_SERVICE',
        'FOREGROUND_SERVICE_LOCATION',
        'POST_NOTIFICATIONS',
        'WAKE_LOCK',
      ],
    },
    plugins: [
      'expo-dev-client',
      'expo-asset',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'MilePilot uses location to record your business journeys while you are working.',
          locationAlwaysAndWhenInUsePermission:
            'MilePilot uses background location so your mileage can continue recording when your phone is locked.',
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
      [
        'expo-notifications',
        {
          color: '#0D6BFF',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'REPLACE_WITH_EAS_PROJECT_ID',
      },
      /**
       * MilePilot UI loads from this URL inside the Expo WebView.
       * Deploy frontend/ to Cloudflare, or set WEB_APP_URL to a local dev server.
       * Bundled assets/web/ is synced for future offline use.
       */
      webAppUrl:
        process.env.WEB_APP_URL ||
        'https://app.milepilot.uk/?runtime=expo&v=8.11.0',
    },
  },
};
