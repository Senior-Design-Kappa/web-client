let React = require("react");
let Chat = require("./chat");
let CanvasVideoPlayer = require("./CanvasVideoPlayer");

class Room extends React.Component {
  render() {
    return (
      <div className="main">
        <CanvasVideoPlayer websocketAddr={this.props.websocketAddr} roomId={this.props.roomId} />
        <Chat />
      </div>
    );
  }
}

module.exports = Room;
