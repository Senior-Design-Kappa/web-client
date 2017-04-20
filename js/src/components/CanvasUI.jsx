let React = require("react");
let CanvasUIButton = require("./CanvasUIButton");

class CanvasUI extends React.Component {
  constructor(props) {
    super(props);
    this.DRAW_LINE = 0;
    this.ERASE = 1;

    this.state = {
      mode: this.DRAW_LINE,
    };
  }

  onButtonClick(id) {
    this.setState({
      mode: id,
    });
  }

  isSelected(mode) {
    return this.state.mode === mode;
  }

  render() {
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
};

module.exports = CanvasUI;
