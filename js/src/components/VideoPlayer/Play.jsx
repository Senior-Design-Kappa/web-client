let React = require("react");
class Play extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isPlaying !== nextProps.isPlaying;
  }

  render() {
    return (
      <div
        ref={(e) => {this.playButton = e;}}
        className={"play-button unselectable " + (this.props.isPlaying ? "playing" : "paused")}
        onClick={this.props.playPause}>
        {this.props.isPlaying ? "▌▌" : "►"}
      </div>
    );
  }
}
module.exports = Play;
