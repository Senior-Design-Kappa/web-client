var path = require("path");
var webpack = require("webpack");

var MINIFY = false;

module.exports = {
  context: "./js/",
  entry: "./build/app.js",
  output: {
    path: "./js/",
    filename: "bundle.js",
  },
  plugins: MINIFY ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : [],
  resolve: {
    root: [
      path.resolve("./js/"),
    ],
  },
};
