let React = require("react");
let VideoPlayerUI = require("./VideoPlayerUI");
const EVENTS = [
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting'
];

const FIRE_EVENTS = [
  'sync',
]

class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.video = {};
    this.audio = {};
    this.state = {
      networkState: 0,
      isPlaying: false,
      muted: false,
      volume: 50,
    };
    window.x = this; // DEBUGGING
  }

  componentDidMount() {

    this.videoPlayer.addEventListener('sync', (e) => {
      this.props.sendVideoSyncMessage(this.getSyncState());
    })
    EVENTS.forEach((event) => {
      this.video.addEventListener(event, (e) => {
        this.updateState();
        this.drawFrame();
      });
    })
  }

  componentWillUnmount() {
  }

  drawFrame() {
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  }

  play(sync) {
    this.video.play();
    this.updateCanvas = setInterval(this.drawFrame.bind(this), 100/6);
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  pause(sync) {
    this.video.pause();
    clearInterval(this.updateCanvas);
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  playPause() {
    if (!this.video.paused) {
      this.pause(false);
    } else {
      this.play(false);
    }
  }

  seek(time, force) {
    this.video.currentTime = time;
    if (force) {
      this.updateState();
    }
  }

  setVolume(volume, force) {
    this.video.volume = volume;
    if (force) {
      this.updateState();
    }
  }

  mute() {
    this.video.mute = true;
  }

  unmute() {
    this.video.mute = false;
  }

  toggleMute() {
    this.video.mute = !this.video.mute;
  }

  getSyncState() { // TODO: needs to be refactored
    return {
      currentTime: this.state.currentTime,
      playing: !this.video.paused,
    };
  }

  syncState(newState) { // TODO: needs to be refactored
    this.video.currentTime = newState.currentTime;
    if (newState.playing) {
      this.play(true);
    } else {
      this.pause(true);
    }
  }

  updateState() { // TODO: needs to be refactored
    this.state = {
      duration: this.video.duration,
      currentTime: this.video.currentTime,
      isPlaying: !this.video.paused,
      muted: this.video.muted,
      volume: this.video.volume,
      buffered: this.video.buffered,
      percentagePlayed: this.video.currentTime / this.video.duration * 100,
    };
    this.videoPlayerUI.setState(this.state);
  }

  renderPlayerUI() {
    let uiProps = {
      playPause: this.playPause.bind(this),
      setVolume: this.setVolume.bind(this),
      seek: this.seek.bind(this),
      mute: this.mute.bind(this),
      unmute: this.unmute.bind(this),
      toggleMute: this.toggleMute.bind(this),
      state: this.state,
    };
    return (
      <VideoPlayerUI
        ref={(e) => {this.videoPlayerUI = e;}}
        {...uiProps} />
    );
  }

  renderPlayerSources() {
    return (
      <video ref={(e) => {this.video = e;}} id="source-video" controls style={{display: "none"}}>
        <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"/>
      </video>
    );
  }

  renderPlayerCanvas() {
    return (
      <canvas ref={(e) => {this.canvas = e; this.ctx = this.canvas.getContext('2d');}}
        id="video-canvas" width="800" height="600" />
    );
  }

  render() {
    return (
      <div ref={(e) => {this.videoPlayer = e;}} id="video-player">
        {this.renderPlayerCanvas()}
        {this.renderPlayerSources()}
        {this.renderPlayerUI()}
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  sendVideoSyncMessage: React.PropTypes.func,
};

module.exports = VideoPlayer;