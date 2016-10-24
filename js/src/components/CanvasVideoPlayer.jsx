let React = require("react");
let VideoPlayer = require("./VideoPlayer")
let Canvas = require("./Canvas")
class CanvasVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.ws = new WebSocket(props.websocketAddr + props.roomId);
    this.bindSocket();
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
      switch (message.messageType) {
        case "INIT":
          this.clientID = message.hash;
        case "SYNC_VIDEO":
          this.received = true;
          this.video.setState(message.videoState);
        case "SYNC_CANVAS":
          if (message.message == "DRAW_LINE") {
            this.canvas.drawLine(message.prevX, message.prevY, message.currX, message.currY);
          } else if (message.message == "SYNC") {
            this.canvas.clear();
            for (var i = 0; i < message.lines.length; i++) {
              let line = message.lines[i];
              this.canvas.drawLine(line.prevX, line.prevY, line.currX, line.currY);
            }
          }
      }
    }
  }

  componentDidMount() {
    let fireVideoSyncEvent = (e) => {
      let state = JSON.stringify({
        messageType: "SYNC_VIDEO",
        message: "",
        videoState: this.video.getState()
      });
      if (!this.received) { // do not fire if the change was from a sync
        this.ws.send(state);
      }
      this.received = false;
    }
    this.video.videoPlayer.addEventListener("vp-pause", fireVideoSyncEvent, true);
    this.video.videoPlayer.addEventListener("vp-play", fireVideoSyncEvent, true);
  }

  render() {
    return (
      <div className="main">
        <VideoPlayer 
          ref={(vp) => {this.video = vp;}} />
        <Canvas 
          ref={(c) => {this.canvas = c;}} 
          sendDrawMessage={this.sendDrawMessage.bind(this)} />
      </div>
    );
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
