var path = require("path");
var webpack = require("webpack");

var MINIFY = false;

module.exports = {
  context: "./",
  entry: {
		room: path.resolve("./js/src/app.js"),
		login: path.resolve("./js/src/view/loginView.js"),
		loggedInHeader: path.resolve("./js/src/view/loggedInHeaderView.js"),
	},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["latest", "react"],
        },
      },
    ],
  },
  output: {
    path: "./js/webpack/",
    filename: "[name].bundle.js",
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
    extensions: ["", ".js", ".jsx"],
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules"),
  }
};
