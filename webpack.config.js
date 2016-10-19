var path = require("path");

module.exports = {
  context: "./js/",
  entry: "./build/app.js",
  output: {
    path: "./js/",
    filename: "bundle.js",
  },
  resolve: {
    root: [
      path.resolve("./js/"),
    ],
  },
};
