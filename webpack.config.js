var path = require("path");

module.exports = {
  context: "./js/",
  entry: "./build/view/view.js",
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
