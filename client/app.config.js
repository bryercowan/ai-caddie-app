module.exports = ({ config }) => ({
  ...config,
  name: "mobile-caddie-app",
  slug: "mobile-caddie-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.google_api_key || ""
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    config: {
      googleMaps: {
        apiKey: process.env.google_api_key || ""
      }
    }
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router"
  ],
  experiments: {
    typedRoutes: true
  }
});
