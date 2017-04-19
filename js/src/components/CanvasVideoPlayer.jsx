let React = require("react");
let VideoPlayer = require("./VideoPlayer/VideoPlayer");
let YoutubePlayer = require("./YoutubePlayer/YoutubePlayer");
let Canvas = require("./Canvas");
class CanvasVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.ws = new WebSocket(props.websocketAddr + props.roomId);
    this.received = false;
    this.videoType = "YOUTUBE"; // hardcoded for debugging
    this.state = {
      videoId: props.videoId,
    };
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
          this.canvas.canvasState.recvInitState(message.canvasState);
          break;
        case "SYNC_VIDEO":
          this.received = true;
          this.video.syncState(message.videoState);
          break;
        case "SYNC_CANVAS":
          // TODO: Not sure if I should pass it down two levels
          this.canvas.canvasState.recvCanvasMessage(JSON.parse(message.message));
          break;
      }
    }
  }

  componentDidMount() {
    this.bindSocket();
    window.requestAnimationFrame(this.drawCanvas.bind(this));
  }

  drawCanvas() {
    if (!this.canvas) {
      return;
    }
    this.canvas.draw();
    window.requestAnimationFrame(this.drawCanvas.bind(this));
  }

  renderVideoPlayer() {
    switch(this.videoType) {
      case "YOUTUBE":
        return (
          <YoutubePlayer
            ref={(vp) => {this.video = vp;}}
            sendVideoSyncMessage={this.sendVideoSyncMessage.bind(this)} 
            videoID={this.state.videoId} />
        );
        break;
      case "MP4":
        return (
          <VideoPlayer
            ref={(vp) => {this.video = vp;}}
            sendVideoSyncMessage={this.sendVideoSyncMessage.bind(this)} />
        );
        break;
      default:

    }

  }

  renderCanvas() {
    return (
      <Canvas
        ref={(c) => {this.canvas = c;}}
        sendDrawMessage={this.sendDrawMessage.bind(this)}
        sendEraseMessage={this.sendEraseMessage.bind(this)} />
    );
  }

  render() {
    return (
      <div className="main">
        <YoutubePlayer
          ref={(vp) => {this.video = vp;}}
          sendVideoSyncMessage={this.sendVideoSyncMessage.bind(this)} 
          videoId={this.state.videoId} />
        <Canvas
          ref={(c) => {this.canvas = c;}}
          sendCanvasMessage={this.sendCanvasMessage.bind(this)}
          getVideoTime={this.getVideoTime.bind(this)} />
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

  sendCanvasMessage(message) {
    let canvasMessage = JSON.stringify({
      messageType: "SYNC_CANVAS",
      message: message,
    });
    this.ws.send(canvasMessage);
  }

  getVideoTime() {
    return this.video.getCurrentTime();
  }
}

CanvasVideoPlayer.propTypes = {
  websocketAddr: React.PropTypes.string.isRequired,
  roomId: React.PropTypes.string.isRequired,
  videoId: React.PropTypes.string.isRequired,
};

module.exports = CanvasVideoPlayer;
