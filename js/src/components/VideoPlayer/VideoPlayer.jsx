let React = require("react");
let VideoPlayerUI = require("./VideoPlayerUI");

class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.video = {};
    this.audio = {};
  }

  componentDidMount() {
    this.playing = false;
    this.video.style.display = "none";
    this.video.load();
    this.audio.load();

    this.uiUpdateInterval = setInterval(this.updateVideoPlayerUI.bind(this), 500);

    this.video.addEventListener('canplay', () => {
      this.updateVideoPlayerUI();
      this.drawFrame();
    });
    if (this.video.readyState >= 2) {
  		self.drawFrame();
  	}

    this.videoPlayer.addEventListener('vp-play', () => {
      this.props.sendVideoSyncMessage(this.getState());
    });

    this.videoPlayer.addEventListener('vp-pause', () => {
      this.props.sendVideoSyncMessage(this.getState());
    });

    this.video.addEventListener('timeupdate', () => {
  		this.drawFrame();
  	});
  }

  componentWillUnmount() {
    clearInterval(this.uiUpdateInterval);
  }

  drawFrame() {
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  }

  play() {
    this.lastTime = Date.now();
    this.playing = true;
    this.loop();
    this.audio.currentTime = this.video.currentTime;
		this.audio.play();
    this.videoPlayer.dispatchEvent(new Event("vp-play"));
  }

  pause() {
    this.playing = false;
    this.audio.pause();
    this.videoPlayer.dispatchEvent(new Event("vp-pause"));
  }

  playPause() {
    console.log("i'm being called");
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateVideoPlayerUI() {
    // this.videoPlayerUI.updateTime(this.video.currentTime, this.video.duration);
    this.videoPlayerUI.setState({
      currentTime: this.video.currentTime,
      duration: this.video.duration,
      isPlaying: this.playing,
    });
  }

  getState() {
    return {
      currentTime: this.video.currentTime,
      playing: this.playing,
    };
  }

  setState(newState) {
    this.video.currentTime = newState.currentTime;
    if (newState.playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  loop() {
    let time = Date.now();
    let elapsed = (time - this.lastTime) / 1000;

  	if(elapsed >= (1 / 60)) {
  		this.video.currentTime = this.video.currentTime + elapsed;
  		this.lastTime = time;
  		// Resync audio and video if they drift more than 300ms apart
  		if(Math.abs(this.audio.currentTime - this.video.currentTime) > 0.3){
  			this.audio.currentTime = this.video.currentTime;
  		}
  	}
    if (this.video.currentTime >= this.video.duration) {
  		this.playing = false;
  		this.video.currentTime = 0;
  	}
    if (this.playing) {
      this.animationFrame = requestAnimationFrame(() => {this.loop()});
    } else {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  render() {
    return (
      <div ref={(e) => {this.videoPlayer = e;}} className="video-player">
        <canvas ref={(e) => {this.canvas = e; this.ctx = this.canvas.getContext('2d');}}
          id="video-canvas" width="800" height="600" />
        <video ref={(e) => {this.video = e;}} id="source-video" controls>
          <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"/>
        </video>
        <audio ref={(e) => {this.audio = e;}} id="source-audio">
          <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"/>
        </audio>
        <VideoPlayerUI
          ref={(e) => {this.videoPlayerUI = e;}}
          playPause={this.playPause.bind(this)} />
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  sendVideoSyncMessage: React.PropTypes.func,
};

module.exports = VideoPlayer;
