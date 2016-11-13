let React = require("react");
let VideoPlayer = require("./VideoPlayer/VideoPlayer")
let Canvas = require("./Canvas")
class CanvasVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.ws = new WebSocket(props.websocketAddr + props.roomId);
    this.received = false;
  }

  bindSocket() {
    this.ws.onopen = (e) => {
      this.ws.send(JSON.stringify({
        messageType: "INIT",
        message: "Connected"
      }));
    }

    this.ws.onmessage = (e) => {
      let message = JSON.parse(e.data);
      console.log(message);
      switch (message.messageType) {
        case "INIT":
          this.clientID = message.hash;
          this.video.syncState(message.videoState);
          this.canvas.processActions(message.actions);
        case "SYNC_VIDEO":
          this.received = true;
          this.video.syncState(message.videoState);
        case "SYNC_CANVAS":
          if (message.message == "DRAW_LINE") {
            this.canvas.drawLine(message.prevX, message.prevY, message.currX, message.currY);
          } else if (message.message == "ERASE") {
            this.canvas.eraseCircle(message.x, message.y, 20);
          } else if (message.message == "SYNC") {
            this.canvas.clear();
            this.canvas.drawLines(message.lines);
          }
      }
    }
  }

  componentDidMount() {
    this.bindSocket();
  }

  render() {
    return (
      <div className="main">
        <VideoPlayer
          ref={(vp) => {this.video = vp;}}
          sendVideoSyncMessage={this.sendVideoSyncMessage.bind(this)} />
        <Canvas
          ref={(c) => {this.canvas = c;}}
          sendDrawMessage={this.sendDrawMessage.bind(this)}
          sendEraseMessage={this.sendEraseMessage.bind(this)} />
      </div>
    );
  }

  sendVideoSyncMessage(state) {
    let videoMessage = JSON.stringify({
      messageType: "SYNC_VIDEO",
      message: "",
      videoState: {
        playing: state.playing,
        currentTime: state.currentTime,
        volume: state.volume,
        muted: state.muted,
      },
    });
    this.ws.send(videoMessage);
  }

  sendDrawMessage(prevX, prevY, currX, currY) {
    let drawMessage = JSON.stringify({
      messageType: "SYNC_CANVAS",
      message: "DRAW_LINE",
      prevX: prevX,
      prevY: prevY,
      currX: currX,
      currY: currY,
    });
    this.ws.send(drawMessage);
  }

  sendEraseMessage(x, y) {
    let eraseMessage = JSON.stringify({
      messageType: "SYNC_CANVAS",
      message: "ERASE",
      x: x,
      y: y,
    });
    this.ws.send(eraseMessage);
  }
}

module.exports = CanvasVideoPlayer;
