let Youtube = require("react-youtube").default;
let React = require("react");
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

class YoutubePlayer extends React.Component {

  constructor(props) {
    super(props);
    this.REFRESH_RATE = 500;
    this.OPTS = {
      height: '585',
      width: '960',
      playerVars: {
        autoplay: 1,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        rel: 0,
        showinfo: 0,
      },
    };
    this.VIDEO_TIME_EPSILON = 0.5;

    // youtube state constants from youtube iframe API
    // See: https://developers.google.com/youtube/iframe_api_reference
    this.YT_UNSTARTED = -1;
    this.YT_ENDED = 0;
    this.YT_PLAYING = 1;
    this.YT_PAUSED = 2;
    this.YT_BUFFERING = 3;
    this.YT_CUED = 5;

    this.player = null;
    this.expectedState = null;
    this.receivedState = null;
    this.state = {
      videoID: "T_V_6UBa8RQ",
    };
  }

  changeVideoID(id) {
    this.setState({
      videoID: id,
    });
  }

  getCurrentTime() {
    if (this.player === null) {
      return 0;
    } else {
      return this.player.getCurrentTime();
    }
  }

  onReady(event) {
    this.player = event.target;
    setTimeout(this.resolveStateDifferences.bind(this), this.REFRESH_RATE);
  }

  // resolveStateDifferences is called every this.REFRESH_RATE milliseconds, to synchronize the necessary states
  // (described below):
  //
  // There are three states to this component:
  // - video state (i.e. what the youtube player is actually showing)
  // - sync state (i.e. what the last known state is, needed to detect video state changes)
  // - received state (i.e. what the last state update received from elsewhere is)
  // Ideally, the three should be the same, but there are two cases where they can diverge:
  // - User changes video state
  //   - Sync state should be set to the new video state, then a message
  //     is sent out to change everyone else's received state
  // - Video state changes elsewhere, updating received state
  //   - Sync state and video state are changed to received state, received state is then set to null
  // Priority is given to received state: if it is not null, video and sync state are changed to it.
  // Otherwise, if it is null, the above procedure is followed to update other clients' received state

  resolveStateDifferences() {
    // If no received state, check if user has changed video state
    if (this.receivedState === null) {
      let videoState = this.getVideoState();

      // If expected state is null, the component hasn't been initialized
      // Otherwise, see if video state is the same as expected state
      if (this.expectedState !== null && !this.compareVideoState()) {
        console.log("SENDING:",videoState);
        this.props.sendVideoSyncMessage(videoState);
        this.expectedState = videoState;
        this.expectedState.timestamp = Date.now();
      }

    } else if (this.receivedState !== null) {
      let newState = this.receivedState;
      this.receivedState = null;
      this.setVideoState(newState);
      this.expectedState = newState;
      this.expectedState.timestamp = Date.now();
    }
    setTimeout(this.resolveStateDifferences.bind(this), this.REFRESH_RATE);
  }

  compareVideoState() {
    // TODO: handle different playback speeds?
    let expectedTime = this.expectedState.currentTime + 
      ((this.expectedState.playing) ? 0.001 * (Date.now() - this.expectedState.timestamp) : 0);
    if (Math.abs(this.player.getCurrentTime() - expectedTime) > this.VIDEO_TIME_EPSILON) {
      console.log("divergence", this.player.getCurrentTime(), expectedTime);
      return false;
    }
    // TODO: handle buffering, etc.
    if (
        (this.player.getPlayerState() === this.YT_PAUSED && this.expectedState.playing === true) ||
        (this.player.getPlayerState() === this.YT_PLAYING && this.expectedState.playing === false)) {
      console.log("not playing");
      return false;
    }
    if (this.player.getVolume() !== this.expectedState.volume) {
      console.log("volume");
      return false;
    }
    if (this.player.isMuted() !== this.expectedState.muted) {
      console.log("muted");
      return false;
    }
    return true;
  }

  getVideoState() { // TODO: needs to be refactored
    let playerState = this.player.getPlayerState();
    let playing = (playerState === this.YT_PLAYING);
    return {
      currentTime: this.player.getCurrentTime(),
      playing: playing,
      volume: this.player.getVolume(),
      muted: this.player.isMuted(),
    };
  }

  setVideoState(newState) {
    console.log("SETTING:",newState);
    this.player.seekTo(newState.currentTime);
    this.player.setVolume(newState.volume);
    if (newState.playing) {
      this.player.playVideo();
    } else {
      this.player.pauseVideo();
    }
    if (newState.muted) {
      this.player.mute();
    } else {
      this.player.unMute();
    }
  }

  syncState(newState) {
    this.receivedState = newState;
    return;
  }

  render() {
    return (
      <div ref={(e) => {this.videoPlayer = e;}} className="video-player" id="yt-player">
        <Youtube 
          videoId={this.state.videoID} 
          onReady={this.onReady.bind(this)} 
          opts={this.OPTS} />
      </div>
    );
  }
}

YoutubePlayer.propTypes = {
  sendVideoSyncMessage: React.PropTypes.func,
};

module.exports = YoutubePlayer;
