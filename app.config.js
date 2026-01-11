import "dotenv/config";
import appJson from "./app.json";

export default ({ config }) => {
  const baseConfig = appJson.expo ?? config;

  return {
    ...baseConfig,
    plugins: [
      ...(baseConfig.plugins || []),
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ],
    ios: {
      ...baseConfig.ios,
      infoPlist: {
        ...(baseConfig.ios?.infoPlist || {}),
        NSLocationWhenInUseUsageDescription: "This app needs access to your location."
      }
    },
    android: {
      ...baseConfig.android,
      permissions: [
        ...(baseConfig.android?.permissions || []),
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    },
    extra: {
      ...baseConfig.extra,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
    },
  };
};