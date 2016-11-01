let React = require("react");

class Canvas extends React.Component {
  constructor(props) {
    super(props);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  componentDidMount() {
    this.flag = false;
    this.dot_flag = false;
    this.strokeStyle = "black";
    this.fillStyle = "black";
    this.lineWidth = 2;
    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;

    this.canvas.addEventListener("mousemove", (e) => {
      this.findxy('move', e)
    }, false);
    this.canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.findxy('down', e)
    }, false);
    this.canvas.addEventListener("mouseup", (e) => {
      this.findxy('up', e)
    }, false);
    this.canvas.addEventListener("mouseout", (e) => {
      this.findxy('out', e)
    }, false);
  }

  draw() {
    this.drawLine(this.prevX, this.prevY, this.currX, this.currY);
    this.props.sendDrawMessage(this.prevX, this.prevY, this.currX, this.currY);
  }

  drawLine(prevX, prevY, currX, currY) {
    this.ctx.beginPath();
    this.ctx.moveTo(prevX, prevY);
    this.ctx.lineTo(currX, currY);
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawLines(lines) {
    for (var i = 0; i < lines.length; i++) {
      let line = lines[i];
      this.drawLine(line.prevX, line.prevY, line.currX, line.currY);
      console.log(line);
    }
  }

  findxy(res, e) {
    let canvasRect = this.canvas.getBoundingClientRect();
    let mouseX = e.clientX - canvasRect.left;
    let mouseY = e.clientY - canvasRect.top;
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = mouseX;
      this.currY = mouseY;
      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
        this.dot_flag = false;
      }
    }
    if (res == 'up' || res == "out") {
      this.flag = false;
    }
    if (res == 'move') {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = mouseX;
        this.currY = mouseY;
        this.draw();
      }
    }
  }

  render() {
    this.style = {
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 1
    };
    return (
      <div className="whiteboard">
        <canvas style={this.style} ref={(c) => {this.canvas = c; this.ctx = this.canvas.getContext('2d');}}
          id="whiteboardCanvas" width="800" height="550" />
      </div>
    );
  }
}

Canvas.propTypes = {
  sendDrawMessage: React.PropTypes.func,
};

module.exports = Canvas;
