let React = require("react");
let Play = require("./Play");
let ProgressBar = require("./ProgressBar");

class VideoPlayerUI extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="player-controls">
        <Play
          {...this.props}
          {...this.state}/>
        <ProgressBar
          {...this.props}
          {...this.state}
          />
      </div>
    );
  }
}

module.exports = VideoPlayerUI;
