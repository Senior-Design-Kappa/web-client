let React = require("react");

let BUTTON_WIDTH = 30;
let BUTTON_HEIGHT = 30;
let ICON_WIDTH = 22;
let ICON_HEIGHT = 22;

class CanvasUIButton extends React.Component {
  constructor(props) {
    super(props);
    this.img = props.img;
  }

  render() {
    let selectedClass = this.props.isSelected() ? "selected" : "";
    let buttonStyle = {
      left: this.props.x,
      top: this.props.y,
    };
    return (
      <div 
        className={`canvas-ui-button ${selectedClass}`} 
        style={buttonStyle} 
        onClick={this.props.onClick} >
        <img src={this.img} />
      </div>
    );
  }
}

CanvasUIButton.proTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  onClick: React.PropTypes.func.isRequired,
  isSelected: React.PropTypes.func.isRequired,
};

module.exports = CanvasUIButton;
