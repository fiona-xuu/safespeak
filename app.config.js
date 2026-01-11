import "dotenv/config";
import appJson from "./app.json";

export default ({ config }) => {
  const baseConfig = appJson.expo ?? config;

  return {
    ...baseConfig,
    extra: {
      ...baseConfig.extra,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
    },
  };
};
