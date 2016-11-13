let Room = require("../components/Room");
let $ = require("lib/jquery-3.1.1.min.js");
let React = require("react");
let ReactDOM = require("react-dom");

$(() => {
  var content = document.getElementById('content');
  var websocketAddr = content.getAttribute('websocketAddr');
  var roomId = content.getAttribute('roomId');
  ReactDOM.render(
    <Room websocketAddr={websocketAddr} roomId={roomId} />,
    content
  );
});
