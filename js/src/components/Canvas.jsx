let React = require("react");
let CanvasUI = require("./CanvasUI");

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

    this.pixel = this.ctx.createImageData(1, 1);
    this.pixel.data[0] = 0;
    this.pixel.data[1] = 0;
    this.pixel.data[2] = 0;
    this.pixel.data[3] = 255;

    this.eraser = this.ctx.createImageData(1, 1);
    this.eraser.data[0] = 0;
    this.eraser.data[1] = 0;
    this.eraser.data[2] = 0;
    this.eraser.data[3] = 0;
  }

  draw() {
    let points = this.drawLine(this.prevX, this.prevY, this.currX, this.currY);
    if (points.length > 0) {
      this.props.sendDrawMessage(points);
    }
  }

  erase() {
    let points = this.eraseSquare(this.currX, this.currY, 20);
    if (points.length > 0) {
      this.props.sendEraseMessage(points);
    }
  }

  erasePixel(x, y) {
    this.ctx.putImageData(this.eraser, x, y);
  }

  erasePoints(points) {
    for (var i = 0; i < points.length; i++) {
      let point = points[i];
      this.erasePixel(point[0], point[1]);
    }
  }

  eraseSquare(x, y, r) {
    var ret = [];
    for (var i = x - r; i <= x + r; i++) {
      for (var j = y - r; j <= y + r; j++) {
        this.erasePixel(i, j);
        ret.push([i, j]);
      }
    }
    return ret;
  }

  drawPixel(x, y) {
    this.ctx.putImageData(this.pixel, x, y);
  }

  drawPoints(points) {
    for (var i = 0; i < points.length; i++) {
      let point = points[i];
      this.drawPixel(point[0], point[1]);
    }
  }

  drawLine(prevX, prevY, currX, currY) {
    let dx = currX - prevX;
    let dy = currY - prevY;
    let xdel = (dx > 0) ? 1 : -1;
    let ydel = (dy > 0) ? 1 : -1;
    var ret = [];
    if (dx == 0) {
      for (var y = Math.min(prevY, currY); y <= Math.max(prevY, currY); y++) {
        this.drawPixel(currX, y);
        ret.push([currX, y]);
      }
      return ret;
    }
    let err = -1.0;
    let derr = Math.abs(dy / dx);
    var y = prevY;
    for (var x = prevX; x != currX + xdel; x += xdel) {
      this.drawPixel(x, y);
      ret.push([x, y]);
      err += derr;
      while (err >= 0.0) {
        y += ydel;
        err -= 1.0;
        this.drawPixel(x, y);
        ret.push([x, y]);
      }
    }
    return ret;
  }

  drawLines(lines) {
    for (var i = 0; i < lines.length; i++) {
      let line = lines[i];
      this.drawLine(line.prevX, line.prevY, line.currX, line.currY);
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
        if (this.ui.state.mode == this.ui.DRAW_LINE) {
          this.draw();
        } else if (this.ui.state.mode == this.ui.ERASE) {
          this.erase();
        }
      }
    }
  }

  render() {
    return (
      <div className="whiteboard">
        <div id="canvas-ui">
          <CanvasUI
            ref={(c) => {this.ui = c;}} />
        </div>
        <canvas
          ref={(c) => {this.canvas = c; this.ctx = this.canvas.getContext('2d');}}
          id="whiteboard-canvas" width="800" height="600" />
      </div>
    );
  }
}

Canvas.propTypes = {
  sendDrawMessage: React.PropTypes.func,
  sendEraseMessage: React.PropTypes.func,
};

module.exports = Canvas;
