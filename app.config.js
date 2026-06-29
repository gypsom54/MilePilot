/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: 'MilePilot',
    slug: 'milepilot',
    version: '1.0.0',
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
      bundleIdentifier: 'com.zipcab.milepilot',
      buildNumber: '2',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'MilePilot uses your location to record business journeys while you are working.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'MilePilot uses background location so mileage continues recording when your phone is locked during a shift.',
        NSLocationAlwaysUsageDescription:
          'MilePilot uses background location so mileage continues recording when your phone is locked during a shift.',
        NSMotionUsageDescription:
          'MilePilot may use motion activity to detect when you are driving and improve mileage tracking accuracy.',
        UIBackgroundModes: ['location', 'fetch', 'remote-notification'],
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.zipcab.milepilot',
      versionCode: 1,
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
        'ACTIVITY_RECOGNITION',
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
        },
      },
    },
    plugins: [
      'expo-dev-client',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'MilePilot uses your location to record business journeys while you are working.',
          locationAlwaysAndWhenInUsePermission:
            'MilePilot uses background location so mileage continues recording when your phone is locked during a shift.',
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
      [
        'expo-notifications',
        {
          color: '#0D6BFF',
          defaultChannel: 'milepilot',
          enableBackgroundRemoteNotifications: true,
        },
      ],
    ],
    extra: {
      eas: {
        projectId:
          process.env.EAS_PROJECT_ID || 'ecc05803-756a-44d8-a12e-d99cbc9b24b6',
      },
      webAppUrl:
        process.env.WEB_APP_URL ||
        'https://app.milepilot.uk/?runtime=expo&v=8.16.0',
    },
  },
};
