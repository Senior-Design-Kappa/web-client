let React = require("react");
class Play extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.isPlaying !== nextProps.isPlaying;
  }

  render() {
    return (
      <div
        ref={(e) => {this.playButton = e;}}
        id="play-button"
        className={"unselectable " + (this.props.isPlaying ? "playing" : "paused")}
        onClick={this.props.playPause}>
        {this.props.isPlaying ? "▌▌" : "►"}
      </div>
    );
  }
}
module.exports = Play;
