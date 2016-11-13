let React = require("react");
class Volume extends React.Component {

  constructor(props) {
    super(props);
    this.props.moveEventHandlers.push((evt) => {
      if (this.changing) {
        let box = this.volumeBar.getBoundingClientRect();
        let dist = evt.pageX - box.left;
        let newPercentage = Math.max(0.0, Math.min(1.0, dist / box.width));
        this.props.setVolume(newPercentage, true);
      }
    });
    this.props.upEventHandlers.push((evt) => {
      if (this.changing) {
        this.changing = false;
        let box = this.volumeBar.getBoundingClientRect();
        let dist = evt.pageX - box.left;
        let newPercentage = Math.max(0.0, Math.min(1.0, dist / box.width));
        this.props.setVolume(newPercentage, true);
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.volume !== nextProps.volume ||
           this.props.muted !== nextProps.muted;
  }

  onChange(evt) {
    evt.preventDefault();
    evt.stopPropagation()
    this.changing = true;
  }

  toggleMute(evt) {
    this.props.toggleMute(true);
  }

  render() {
    return (
      <div className="volume-container unselectable">
        <div className="volume-button"
          onClick={this.toggleMute.bind(this)}/>
        <div className="volume"
          ref={(e) => {this.volumeBar = e;}}
          onMouseDown={this.onChange.bind(this)}>
          <div className="volume-value volume-fill" style={{'width': (!this.props.muted ? this.props.volume * 100 : 0) + '%'}}/>
        </div>
      </div>
    );
  }


}
module.exports = Volume;
