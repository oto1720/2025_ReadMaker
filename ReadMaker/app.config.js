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
      "**/*"
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
        projectId: "your-expo-project-id"
      }
    },
    updates: {
      url: "https://u.expo.dev/your-expo-project-id"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
};