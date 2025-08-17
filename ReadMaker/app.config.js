export default {
  expo: {
    name: "ReadMaker",
    slug: "readmaker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*",
      "native/rust/dictionaries/**/*"  // 既存パスをそのまま指定
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.readmaker.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.readmaker.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
      eas: {
                projectId: "YOUR_ACTUAL_PROJECT_ID"
      }
    },
    updates: {
      url: "https://u.expo.dev/YOUR_ACTUAL_PROJECT_ID"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
};