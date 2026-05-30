const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: "./dist",
    },
    port: process.env.PORT || 3000,
    hot: true,
    open: false,
    historyApiFallback: true,
  },
  module: {
    rules: [
    ],
  },
});
