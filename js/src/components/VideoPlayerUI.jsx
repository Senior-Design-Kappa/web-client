let React = require("react");
class VideoPlayerUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
    };
  }

  componentDidMount() {
    this.playButton.innerHTML = "►";
    this.playButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.props.playPause();
      if (!this.props.getState().playing) {
        this.playButton.innerHTML = "►";
      } else {
        this.playButton.innerHTML = "▌▌";
      }
    });

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
      <div id="player-controls">
        <div id="player-progress">
          <div ref={(e) => {this.progressBar = e;}} id="player-progress-bar" />
          <div ref={(e) => {this.playerTime = e;}} id="player-time" />
        </div>
        <div id="left-player-controls">
          <div ref={(e) => {this.playButton = e;}} id="play-button" className="unselectable"/>
          <div id="player-volume">
            <button ref={(e) => {this.volumeButton = e;}} id="player-volume-button" />
            <div ref={(e) => {this.volumeSlider = e;}} id="player-volume-slider" />
          </div>
        </div>
        <div id="right-player-controls">
          <button ref={(e) => {this.playerSettings = e;}} id="player-settings" />
          <button ref={(e) => {this.fullScreen = e;}} id="full-screen" />
        </div>
      </div>
    );
  }
}
module.exports = VideoPlayerUI;
