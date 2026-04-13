const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Stub out react-native-maps on web to prevent native-only import errors
const originalResolver = config.resolver;
config.resolver = {
  ...originalResolver,
  resolveRequest: (context, moduleName, platform) => {
    if (platform === "web" && moduleName === "react-native-maps") {
      return {
        filePath: require.resolve("./src/stubs/react-native-maps.js"),
        type: "sourceFile",
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
