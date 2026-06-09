module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          "react-compiler": true,
        },
      ],
    ],
    plugins: [
      [
        "react-native-unistyles/plugin",
        {
          root: "./",
        },
      ],
      ["react-native-worklets/plugin", { processNestedWorklets: true }],
    ],
  };
};
