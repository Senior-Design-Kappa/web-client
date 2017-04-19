let React = require("react");
let CanvasVideoPlayer = require("./CanvasVideoPlayer");

class Room extends React.Component {
  render() {
    return (
      <div className="main">
        <CanvasVideoPlayer 
          websocketAddr={this.props.websocketAddr} 
          roomId={this.props.roomId} 
          videoId={this.props.videoId} />
      </div>
    );
  }
}

module.exports = Room;
