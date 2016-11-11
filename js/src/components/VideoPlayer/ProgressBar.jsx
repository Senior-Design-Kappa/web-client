let React = require("react");
class Progress extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.seek !== nextProps.seek ||
          //  this.props.percentageBuffered !== nextProps.percentageBuffered ||
           this.percentagePlayed !== nextProps.percentagePlayed ||
           this.props.duration !== nextProps.duration;
  }


  timeToString(sec) {
    sec = Math.floor(sec);
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (seconds < 10) {
      seconds = "0"+seconds;
    }
    if (hours > 0) {
      if (minutes < 10) {
        minutes = "0"+minutes;
      }
      return hours+':'+minutes+':'+seconds;
    } else {
      return minutes+':'+seconds;
    }
  }

  updateTime(currentTime, duration) {
    this.playerTime.innerHTML = this.timeToString(currentTime) + "/" + this.timeToString(duration);
  }

  render() {
    return (
      <div id="progress-bar-container">
        <div id="progress-bar">
          <span id="progress-bar-time" className="progress" />
          <span id="progress-bar-buffer" className="progress" />
        </div>
      </div>
    );
  }

}
module.exports = Progress;
