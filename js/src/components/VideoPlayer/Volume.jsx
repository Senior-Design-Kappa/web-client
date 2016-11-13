let React = require("react");
class Volume extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.volume !== nextProps.volume ||
           this.props.muted !== nextProps.muted;
  }

  seek(evt) {
    evt.preventDefault();
    evt.stopPropagation()
    this.seeking = true;
  }

  render() {
    return (
      <div className="volume-container">
        <div className="volume"
          ref={(e) => {this.volumeBar = e;}}
          onMouseDown={this.seek.bind(this)}>
          <div className="volume-time volume-fill" style={{'width': (this.props.volume * 100 + '%')}}/>
        </div>
      </div>
    );
  }


}
module.exports = Volume;
