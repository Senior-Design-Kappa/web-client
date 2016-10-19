let React = require("react");
let Chat = require("./Chat");
let CanvasVideoPlayer = require("./CanvasVideoPlayer");

class Room extends React.Component {
  render() {
    return (
      <div className="main">
        <CanvasVideoPlayer />
        <Chat />
      </div>
    );
  }
}

module.exports = Room;
