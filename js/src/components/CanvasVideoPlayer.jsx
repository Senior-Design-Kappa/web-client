let React = require("react");
let VideoPlayer = require("./VideoPlayer")
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
          this.video.setState(message.videoState);
          this.canvas.drawLines(message.lines);
        case "SYNC_VIDEO":
          this.received = true;
          this.video.setState(message.videoState);
        case "SYNC_CANVAS":
          if (message.message == "DRAW_LINE") {
            this.canvas.drawLine(message.prevX, message.prevY, message.currX, message.currY);
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
    this.style = {
      position: "relative",
    };
    return (
      <div className="main" style={this.style}>
        <VideoPlayer 
          ref={(vp) => {this.video = vp;}} 
          sendVideoSyncMessage={this.sendVideoSyncMessage.bind(this)} />
        <Canvas 
          ref={(c) => {this.canvas = c;}} 
          sendDrawMessage={this.sendDrawMessage.bind(this)} />
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
}

module.exports = CanvasVideoPlayer;
