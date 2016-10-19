let React = require("react");
let VideoPlayer = require("./VideoPlayer")
let Canvas = require("./Canvas")
class CanvasVideoPlayer extends React.Component {
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
