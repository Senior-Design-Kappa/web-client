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
  'vp-play',
  'vp-pause',
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

    FIRE_EVENTS.forEach((event) => {
      this.videoPlayer.addEventListener(event, (e) => {
        this.props.sendVideoSyncMessage(this.getSyncState());
      });
    });

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

  play() {
    this.video.play();
    this.videoPlayer.dispatchEvent(new Event("vp-play"));
    this.updateCanvas = setInterval(this.drawFrame.bind(this), 100/6);
  }

  pause() {
    this.video.pause();
    this.videoPlayer.dispatchEvent(new Event("vp-pause"));
    clearInterval(this.updateCanvas);
  }

  playPause() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  getSyncState() {
    return {
      currentTime: this.state.currentTime,
      playing: this.state.isPlaying,
    };
  }

  syncState(newState) {
    this.video.currentTime = newState.currentTime;
    if (newState.isPlaying) {
      this.play();
    } else {
      this.pause();
    }
  }

  updateState() {
    this.state = {
      duration: this.video.duration,
      currentTime: this.video.currentTime,
      isPlaying: !this.video.paused,
      muted: this.video.muted,
      volume: this.video.volume,
      buffered: this.video.buffered,
    };
    this.videoPlayerUI.setState(this.state);
  }

  renderPlayerUI() {
    let uiProps = {
      playPause: this.playPause.bind(this),
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
