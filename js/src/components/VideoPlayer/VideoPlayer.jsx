let React = require("react");
let VideoPlayerUI = require("./VideoPlayerUI");
let Youtube = require("react-youtube").default;

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
    this.tempState = null;
    this.video = null;
    this.audio = {};
    this.timeStamp = Date.now();

    // Youtube API opts
    this.OPTS = {
      height: '585',
      width: '960',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        rel: 0,
        showinfo: 0,
      },
    };
    // youtube state constants from youtube iframe API
    // See: https://developers.google.com/youtube/iframe_api_reference
    this.YT_UNSTARTED = -1;
    this.YT_ENDED = 0;
    this.YT_PLAYING = 1;
    this.YT_PAUSED = 2;
    this.YT_BUFFERING = 3;
    this.YT_CUED = 5;


    this.state = {
      isPlaying: false,
      muted: false,
      currentTime: 0, 
      volume: 0,
      videoId: props.videoId,
    };
  }

  componentDidMount() {
    // NOTE: due to the way the youtube player works, use onReady instead of this
  }

  componentWillUnmount() {
  }

  getCurrentTime() {
    if (this.video === null) {
      return 0;
    } else {
      return this.video.getCurrentTime();
    }
  }

  loop() {
    let delta = Date.now() - this.timeStamp;
    this.timeStamp = Date.now();
    if (delta > FRAME_RATE) {
      this.updateProgress();
    }
    if (this.state.isPlaying) {
      this.animationFrame = requestAnimationFrame(this.loop.bind(this));
    } else {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  onReady(event) {
    window.x = this;
    this.video = event.target;

    this.videoPlayer.addEventListener('sync', (e) => {
      this.props.sendVideoSyncMessage(this.getSyncState());
    })
    EVENTS.forEach((event) => {
      this.video.addEventListener(event, (e) => {
        this.updateProgress();
      });
    })
    this.loop();

    if (this.tempState !== null) {
      this.syncState(this.tempState);
      this.tempState = null;
    }
  }

  play(sync) {
    this.setState({
      isPlaying: true,
    }, () => {
      if (!sync) {
        this.videoPlayer.dispatchEvent(new Event('sync'));
      }
    });
    this.video.playVideo();
    this.loop();
  }

  pause(sync) {
    this.setState({
      isPlaying: false,
    }, () => {
      if (!sync) {
        this.videoPlayer.dispatchEvent(new Event('sync'));
      }
    });
    this.video.pauseVideo();
  }

  playPause() {
    if (this.state.isPlaying) {
      this.pause(false);
    } else {
      this.play(false);
    }
  }

  seek(time, force, sync) {
    this.video.seekTo(time, true);
    if (force) {
      // We track this time separately, since the YouTube player getCurrentTime has some delay
      this.syncTime = time;
      this.setState({
        currentTime: time,
      }, () => {
        if (!sync) {
          this.videoPlayer.dispatchEvent(new Event('sync'));
        }
        this.loop();
      });
    }
  }

  setVolume(volume, force, sync) {
    this.video.setVolume(volume);
    if (force) {
      this.setState({
        volume: volume,
      }, () => {
        if (!sync) {
          this.videoPlayer.dispatchEvent(new Event('sync'));
        }
      });
    }
  }

  mute(sync) {
    this.video.mute();
    this.setState({
      muted: true,
    }, () => {
      if (!sync) {
        this.videoPlayer.dispatchEvent(new Event('sync'));
      }
    });
  }

  unmute(sync) {
    this.video.unMute();
    this.setState({
      muted: false,
    }, () => {
      if (!sync) {
        this.videoPlayer.dispatchEvent(new Event('sync'));
      }
    });
  }

  toggleMute(force) {
    if (this.state.muted) {
      this.unmute(false);
    } else {
      this.mute(false);
    }
  }

  sendSync() {
    this.props.sendVideoSyncMessage(this.getSyncState());
  }

  getSyncState() { // TODO: needs to be refactored
    let ret = {
      currentTime: this.syncTime || this.video.getCurrentTime(),
      playing: this.state.isPlaying,
      volume: this.state.volume,
      muted: this.state.muted,
    };
    this.syncTime = undefined;
    return ret;
  }

  syncState(newState) { // TODO: needs to be refactored
    if (this.video === null) {
      this.tempState = newState;
      return;
    }
    this.seek(newState.currentTime, true, true);
    this.setVolume(newState.volume, true, true);
    console.log("received:", newState);
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

  updateProgress() {
    this.setState({
      percentagePlayed: this.video.getCurrentTime() / this.video.getDuration() * 100,
      duration: this.video.getDuration(),
    });
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
      <Youtube 
        videoId={this.state.videoId} 
        onReady={this.onReady.bind(this)} 
        opts={this.OPTS} />
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
        {this.renderPlayerSources()}
        {this.renderPlayerUI()}
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  sendVideoSyncMessage: React.PropTypes.func,
  videoId: React.PropTypes.string.isRequired,
};

module.exports = VideoPlayer;
