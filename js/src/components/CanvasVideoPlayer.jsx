let React = require("react");
let VideoPlayer = require("./VideoPlayer")
let Canvas = require("./Canvas")
class CanvasVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.roomID = window.location.href.split("/").pop()
    this.ws = new WebSocket("ws://localhost:8000/connect/" + this.roomID);
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="main">
        <VideoPlayer />
        <Canvas />
      </div>
    );
  }
}

module.exports = CanvasVideoPlayer;
