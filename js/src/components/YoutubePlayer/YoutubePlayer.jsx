import Youtube from "react-youtube";
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
    this.state = {
      videoID: "HAIDqt2aUek",
      player: null,
    };

  }

  componentDidMount() {
    window.x = this;
    this.videoPlayer.addEventListener('sync', (e) => {
      this.props.sendVideoSyncMessage(this.getSyncState());
    })
  }

  onReady(event) {
    console.log("Youtube video ready!");
    this.setState({
      player: event.target,
    });
  }


  play(sync) {
    this.state.player.playVideo();
    this.loop();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  pause(sync) {
    this.state.player.pauseVideo();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  playPause() {
    if (this.state.player.getPlayerState() == 1) {
      this.pause(false);
    } else {
      this.play(false);
    }
  }

  seekTo(time, sync) {
    this.state.player.setCurrentTime(time);
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  setVolume(volume, sync) {
    this.state.player.setVolume(volume);
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  mute(sync) {
    this.state.player.mute();
    this.updateState();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }

  unmute(sync) {
    this.state.player.unmute();
    this.updateState();
    if (!sync) {
      this.videoPlayer.dispatchEvent(new Event('sync'));
    }
  }


  getSyncState() { // TODO: needs to be refactored
    return {
      currentTime: this.state.player.getCurrentTime(),
      playing: this.state.player.getPlayerState() == 1,
      volume: this.state.player.getVolume(),
      muted: this.state.player.isMuted(),
    };
  }

  syncState(newState) { // TODO: needs to be refactored
    this.seekTo(newState.currentTime);
    this.setVolume(newState.volume, true);
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


  render() {
    return (
      <div ref={(e) => {this.videoPlayer = e;}} className="video-player">
        <Youtube videoID={this.state.videoID} onReady={this.onReady.bind(this)} />
      </div>
    );
  }
}

YoutubePlayer.propTypes = {
  sendVideoSyncMessage: React.PropTypes.func,
};

module.exports = YoutubePlayer;
