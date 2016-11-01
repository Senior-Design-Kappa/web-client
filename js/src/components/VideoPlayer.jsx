let React = require("react");
class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.playing = false;
    this.video.style.display = "none";
    this.video.load();
    this.audio.load();

    this.video.addEventListener('canplay', () => {
      this.drawFrame();
    });
    if (this.video.readyState >= 2) {
  		self.drawFrame();
  	}

    this.canvas.addEventListener('click', () => {
      this.playPause();
      this.props.sendVideoSyncMessage(this.getState());
    });

    this.video.addEventListener('timeupdate', () => {
  		this.drawFrame();
  	});

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
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  getState() {
    return {
      currentTime: this.video.currentTime,
      playing: this.playing
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
    let time = Date.now()
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
    this.videoCanvasStyle = {
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 0
    };
    return (
      <div ref={(vp) => {this.videoPlayer = vp;}} className="videoPlayer">
        <canvas ref={(c) => {this.canvas = c; this.ctx = this.canvas.getContext('2d');}}
          id="videoCanvas" width="800" height="600" style={this.videoCanvasStyle} />
        <video ref={(v) => {this.video = v;}} id="sourceVideo" controls>
          <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"/>
        </video>
        <audio ref={(a) => {this.audio = a;}} id="sourceAudio">
          <source src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4"/>
        </audio>
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  sendVideoSyncMessage: React.PropTypes.func,
}

module.exports = VideoPlayer;
