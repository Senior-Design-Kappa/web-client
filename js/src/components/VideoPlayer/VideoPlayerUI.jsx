let React = require("react");
let Play = require("./Play");
let ProgressBar = require("./ProgressBar");
let Volume = require("./Volume")

class VideoPlayerUI extends React.Component {

  constructor(props) {
    super(props);
    this.eventHandlers = {
      moveEventHandlers: [],
      upEventHandlers: [],
    };
    window.addEventListener('mouseup', (evt) => {
      this.eventHandlers.upEventHandlers.forEach((f) => {
        f(evt);
      })
    });

    window.addEventListener('mousemove', (evt) => {
      this.eventHandlers.moveEventHandlers.forEach((f) => {
        f(evt);
      })
    });

    this.state = this.props.state;
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.state);
  }

  render() {
    return (
      <div className="player-controls">
        <Play
          isPlaying={this.state.isPlaying}
          playPause={this.props.playPause}
          />
        <ProgressBar
          percentagePlayed={this.state.percentagePlayed}
          duration={this.state.duration}
          seek={this.props.seek}
          {...this.eventHandlers}
          />
        <Volume
          volume={this.state.volume}
          muted={this.state.muted}
          toggleMute={this.props.toggleMute}
          setVolume={this.props.setVolume}
          {...this.eventHandlers}
          />
      </div>
    );
  }
}

module.exports = VideoPlayerUI;
