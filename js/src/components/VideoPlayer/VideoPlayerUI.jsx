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
  //
  // <div id="player-progress">
  //   <div ref={(e) => {this.progressBar = e;}} id="player-progress-bar" />
  //   <div ref={(e) => {this.playerTime = e;}} id="player-time" />
  // </div>
  // <div id="left-player-controls">
  //   <div ref={(e) => {this.playButton = e;}} id="play-button" className="unselectable"/>
  //   <div id="player-volume">
  //     <button ref={(e) => {this.volumeButton = e;}} id="player-volume-button" />
  //     <div ref={(e) => {this.volumeSlider = e;}} id="player-volume-slider" />
  //   </div>
  // </div>
  // <div id="right-player-controls">
  //   <button ref={(e) => {this.playerSettings = e;}} id="player-settings" />
  //   <button ref={(e) => {this.fullScreen = e;}} id="full-screen" />
  // </div>
module.exports = VideoPlayerUI;
