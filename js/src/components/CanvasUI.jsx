let React = require("react");

let BUTTON_WIDTH = 30;
let BUTTON_HEIGHT = 30;
let ICON_WIDTH = 22;
let ICON_HEIGHT = 22;

class Button {
  constructor(x, y, mode, imgSrc, getMode) {
    this.x = x;
    this.y = y;
    this.mode = mode;
    this.img = new Image();
    this.img.src = imgSrc;
    this.getMode = getMode;
  }

  drawButton(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, BUTTON_WIDTH, BUTTON_HEIGHT);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = this.getButtonBorder();
    ctx.stroke();
    let drawIcon = () => {
      ctx.drawImage(
        this.img, 
        this.x + (BUTTON_WIDTH - ICON_WIDTH) / 2, this.y + (BUTTON_HEIGHT - ICON_HEIGHT) / 2, 
        ICON_WIDTH, ICON_HEIGHT);
    };

    // TODO: not quite sure if this code handles failed image loads correctly
    if (this.img.complete) {
      drawIcon();
    } else {
      this.img.onload = drawIcon;
    }
  }

  getButtonBorder() {
    return (this.mode == this.getMode()) ? 4 : 1;
  }

  isInBox(x, y) {
    return (x >= this.x && x <= this.x + BUTTON_WIDTH && y >= this.y && y <= this.y + BUTTON_HEIGHT);
  }
}

class CanvasUI extends React.Component {
  constructor(props) {
    super(props);
    this.DRAW_LINE = 0;
    this.ERASE = 1;

    this.state = {
      mode: this.DRAW_LINE,
    };

    let getMode = () => { 
      return this.state.mode; 
    };

    this.buttons = [
      new Button(15, 15, this.DRAW_LINE, "/imgs/glyphicons-31-pencil.png", getMode.bind(this)),
      new Button(15, 60, this.ERASE, "/imgs/glyphicons-551-erase.png", getMode.bind(this)),
    ];
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  componentDidMount() {
    this.setupButtons();
    this.drawUI();
  }

  componentDidUpdate() {
    this.drawUI();
  }

  drawUI() {
    this.clear();
    for (var i = 0; i < this.buttons.length; i++) {
      let button = this.buttons[i];
      button.drawButton(this.ctx);
    }
  }

  setupButtons() {
    this.canvas.addEventListener('click', (e) => {
      let canvasRect = this.canvas.getBoundingClientRect();
      let x = e.clientX - canvasRect.left;
      let y = e.clientY - canvasRect.top;
      for (var i = 0; i < this.buttons.length; i++) {
        let button = this.buttons[i];
        if (button.isInBox(x, y)) {
          this.setState({
            mode: button.mode,
          });
          break;
        }
      }
    }, false);
  }

  render() {
    return (
      <canvas 
        ref={(c) => {
          this.canvas = c; 
          if (this.canvas != null) {
            this.ctx = this.canvas.getContext('2d');
          }
        }}
        id="canvasUI"
        width="60" height="105"
      />
    );
  }
}

CanvasUI.propTypes = {
};

module.exports = CanvasUI;
