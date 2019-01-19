const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./client/index.js",
  mode: "development",
  watch: true,
  output: {
    path: path.join(__dirname, "client"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        ],
        exclude: [/node_modules/]
      }
    ]
  }
};
