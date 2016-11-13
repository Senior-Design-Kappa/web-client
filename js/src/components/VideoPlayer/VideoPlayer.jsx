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

const FRAME_RATE = 5;

class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.video = {};
    this.audio = {};
    this.timeStamp = Date.now();
  }

  componentDidMount() {
    window.x = this;
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

  loop() {
    let delta = Date.now() - this.timeStamp
    if (delta > FRAME_RATE) {
      this.drawFrame();
      if (!this.video.paused) {
        this.animationFrame = requestAnimationFrame(() => {this.loop()});
      } else {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  }

  play(sync) {
    this.video.play();
    this.loop();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  pause(sync) {
    this.video.pause();
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

  seek(time, force, sync) {
    this.video.currentTime = time;
    if (force) {
      this.updateState();
    }
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  setVolume(volume, force, sync) {
    this.video.volume = volume;
    if (force) {
      this.updateState();
    }
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  mute(sync) {
    this.video.mute = true;
    this.updateState();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  unmute(sync) {
    this.video.mute = false;
    this.updateState();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  toggleMute(force) {
    this.video.muted = !this.video.muted;
    if (force) {
      this.updateState();
    }
  }

  getSyncState() { // TODO: needs to be refactored
    return {
      currentTime: this.video.currentTime,
      playing: !this.video.paused,
      volume: this.video.volume,
      muted: this.video.muted,
    };
  }

  syncState(newState) { // TODO: needs to be refactored
    this.video.currentTime = newState.currentTime;
    this.setVolume(newState.volume, true, true);
    console.log(newState);
    if (newState.playing) {
      this.play(true);
    } else {
      this.pause(true);
    }
    if (newState.muted) {
      this.mute(true);
    } else {
      this.unmute(true);
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
        {...uiProps}
        />
    );
  }

  renderPlayerSources() {
    return (
      <video ref={(e) => {this.video = e;}} id="source-video" controls style={{display: "none"}}>
        <source src="https://r5---sn-a8au-2iae.googlevideo.com/videoplayback?requiressl=yes&id=8d4e35c609b91464&itag=22&source=webdrive&ttl=transient&app=explorer&ip=2607:f470:22:10:3c9f:5cba:79be:eaf6&ipbits=8&expire=1479014531&sparams=expire,id,ip,ipbits,itag,mm,mn,ms,mv,pl,requiressl,source,ttl&signature=384177741746F2102724E78866451628B648685F.5E6DEE4EEC68E31908BF82F6AB7B985188C07C70&key=cms1&pl=32&cms_redirect=yes&mm=31&mn=sn-a8au-2iae&ms=au&mt=1479001048&mv=m" type="video/mp4"/>
      </video>
    );
  }

  renderPlayerCanvas() {
    return (
      <canvas ref={(e) => {this.canvas = e; this.ctx = this.canvas.getContext('2d');}}
        className="video-canvas" width="800" height="600" />
    );
  }

  render() {
    return (
      <div ref={(e) => {this.videoPlayer = e;}} className="video-player">
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
