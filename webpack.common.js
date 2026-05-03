const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || "/";

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/html/index.html",
  filename: "./index.html",
});

module.exports = {
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: ASSET_PATH
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[name].[hash][ext]",
        },
      },
      // .css from node_modules and your code
      {
        test: /\.css$/i,
        exclude: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader'],
      },

      // .scss / .sass only
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'sass-loader', options: { implementation: require('sass-embedded') } },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    htmlPlugin,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public",
          to: ".",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
