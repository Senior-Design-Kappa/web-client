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
      currentTime: this.video.currentTime,
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
        {...uiProps}
        />
    );
  }

  renderPlayerSources() {
    return (
      <video ref={(e) => {this.video = e;}} id="source-video" controls style={{display: "none"}}>
        <source src="https://r13---sn-ab5l6nld.googlevideo.com/videoplayback?requiressl=yes&id=7c45b7b3fede2d87&itag=37&source=webdrive&ttl=transient&app=explorer&ip=165.123.179.30&ipbits=8&expire=1479001163&sparams=expire,id,ip,ipbits,ipbypass,itag,mm,mn,ms,mv,nh,pl,requiressl,source,ttl&signature=7DF18CF13ABD32988BABC2A90AA12CB503E548A6.81AC2568A589BB1BC4819BBCE82D2E8680A81C50&key=cms1&pl=16&cm2rm=sn-a8au-2iae7z&req_id=70df4960142ea3ee&redirect_counter=2&cms_redirect=yes&ipbypass=yes&mm=30&mn=sn-ab5l6nld&ms=nxu&mt=1478990661&mv=m&nh=IgpwcjAzLmxnYTA3KgkxMjcuMC4wLjE" type="video/mp4"/>
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
