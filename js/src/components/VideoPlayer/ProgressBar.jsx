let React = require("react");

class Progress extends React.Component {

  constructor(props) {
    super(props);
    this.props.moveEventHandlers.push((evt) => {
      if (this.changing) {
        let box = this.progressBar.getBoundingClientRect();
        let dist = evt.pageX - box.left;
        let newPercentage = Math.max(0.0, Math.min(1.0, dist / box.width));
        this.props.seek(newPercentage * this.props.duration, true);
      }
    });
    this.props.upEventHandlers.push((evt) => {
      if (this.changing) {
        this.changing = false;
        let box = this.progressBar.getBoundingClientRect();
        let dist = evt.pageX - box.left;
        let newPercentage = Math.max(0.0, Math.min(1.0, dist / box.width));
        this.props.seek(newPercentage * this.props.duration, true);
      }
    });
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

  onChange(evt) {
    evt.preventDefault();
    evt.stopPropagation()
    this.changing = true;
  }

  render() {
    return (
      <div className="progress-bar-container">
        <div className="progress-bar"
          ref={(e) => {this.progressBar = e;}}
          onMouseDown={this.onChange.bind(this)}
          >
          <div className="progress-bar-time progress-bar-fill" style={{'width': (this.props.percentagePlayed + '%')}}/>
        </div>
      </div>
    );
  }

}
module.exports = Progress;
