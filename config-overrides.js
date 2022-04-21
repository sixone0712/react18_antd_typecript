const { override, addBabelPreset, addWebpackAlias } = require("customize-cra");
const rewireReactHotLoader = require("react-app-rewire-hot-loader-for-customize-cra");
const path = require("path");

module.exports = override(
  addBabelPreset("@emotion/babel-preset-css-prop"),
  rewireReactHotLoader(),
  addWebpackAlias({
    "react-dom": "@hot-loader/react-dom",
    "~": path.resolve(__dirname, "./src"),
  })
);
