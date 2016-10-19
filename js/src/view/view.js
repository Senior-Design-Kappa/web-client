let Room = require("../components/room");
let $ = require("lib/jquery-3.1.1.min.js");
let React = require("react");
let ReactDOM = require("react-dom");

$(() => {
  ReactDOM.render(
    <Room />,
    document.getElementById('content')
  );
});
