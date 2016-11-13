let React = require("react");
let Play = require("./Play");
let ProgressBar = require("./ProgressBar");

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

  }

  componentDidMount() {
  }


  render() {
    return (
      <div className="player-controls">
        <Play
          {...this.props}
          {...this.state} />
        <ProgressBar
          {...this.props}
          {...this.state}
          {...this.eventHandlers}
          />
        
      </div>
    );
  }
}

module.exports = VideoPlayerUI;
