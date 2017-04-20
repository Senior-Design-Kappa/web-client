let React = require("react");
let CanvasUIButton = require("./CanvasUIButton");

class CanvasUI extends React.Component {
  constructor(props) {
    super(props);
    this.DRAW_LINE = 0;
    this.ERASE = 1;

    this.state = {
      active: true,
      mode: this.DRAW_LINE,
    };
  }

  onButtonClick(id) {
    /*if (id === 0) {
      this.toggleActive();
    } else {
      this.setState({
        mode: id,
      });
    }*/
    this.setState({
      mode: id,
    });
  }

  toggleActive() {
    let newActive = !this.state.active;
    this.props.setWhiteboardActive(newActive);
    this.setState({
      active: newActive,
    });
  }

  isSelected(mode) {
    return this.state.mode === mode;
  }

  render() {
    /*let inactiveButtonImages = [
      "/imgs/glyphicons-235-brush.png",
    ];
    let activeButtonImages = [
      "/imgs/glyphicons-208-remove.png", 
      "/imgs/glyphicons-31-pencil.png", 
      "/imgs/glyphicons-551-erase.png",
    ];
    let buttonImages = (this.state.active) ? activeButtonImages : inactiveButtonImages;*/
    let buttonImages = [
      "/imgs/glyphicons-31-pencil.png", 
      "/imgs/glyphicons-551-erase.png",
    ];
    let buttons = buttonImages.map(
      (img, i) => {
        return (
          <CanvasUIButton 
            key={i}
            img={img} 
            x={15} y={45 * i + 15} 
            onClick={() => ((ii) => this.onButtonClick.bind(this)(ii))(i)}
            isSelected={() => ((ii) => this.isSelected.bind(this)(ii))(i)}
            />
        );
      }
    );
    let uiHeight = buttonImages.length * 45 + 45;
    return (
      <div 
        style={{
          width: 60,
          height: uiHeight,
        }} 
        className="canvas-ui">
        {buttons}
      </div>
    );
  }
}

CanvasUI.propTypes = {
  setWhiteboardActive: React.PropTypes.func.isRequired,
};

module.exports = CanvasUI;
