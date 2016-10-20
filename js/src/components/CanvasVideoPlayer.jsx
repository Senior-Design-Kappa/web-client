let React = require("react");
let VideoPlayer = require("./VideoPlayer")
let Canvas = require("./Canvas")
class CanvasVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.roomID = window.location.href.split("/").pop()
    this.ws = new WebSocket("ws://localhost:8000/connect/" + this.roomID);
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
      }
    }
  }

  componentDidMount() {
    let fireSyncEvent = (e) => {
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
    this.video.videoPlayer.addEventListener("vp-pause", fireSyncEvent, true);
    this.video.videoPlayer.addEventListener("vp-play", fireSyncEvent, true);
  }

  render() {
    return (
      <div className="main">
        <VideoPlayer ref={(vp) => {this.video = vp;}} />
        <Canvas />
      </div>
    );
  }
}

module.exports = CanvasVideoPlayer;
