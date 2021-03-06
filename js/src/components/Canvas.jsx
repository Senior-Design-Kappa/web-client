let React = require("react");
let CanvasUI = require("./CanvasUI");
let CanvasState = require("./CanvasState");
let Color = require("./Color");
let LineSegment = require("./LineSegment");
let Point = require("./Point");

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.WIDTH = 960;
    this.HEIGHT = 585;
    this.STROKE_STYLE = "black";
    this.FILL_STYLE = "black";
    this.LINE_WIDTH = 2;
    this.TTL = 5.0;
    this.ERASE_RADIUS = 8;

    this.canvasState = new CanvasState(this.WIDTH, this.HEIGHT, this.props.sendCanvasMessage);

    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;

    this.state = {
      whiteboardActive: true,
    };
  }

  componentDidMount() {
    this.mouseDown = false;

    this.canvas.addEventListener("mousemove", (e) => {
      this._processMouseEvent('move', e)
    }, false);
    this.canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this._processMouseEvent('down', e)
    }, false);
    this.canvas.addEventListener("mouseup", (e) => {
      this._processMouseEvent('up', e)
    }, false);
    this.canvas.addEventListener("mouseout", (e) => {
      this._processMouseEvent('out', e)
    }, false);

    this.pixel = this.ctx.createImageData(2, 2);
    for (var i = 0; i < 4; i++) {
      this.pixel.data[4 * i + 0] = 0;
      this.pixel.data[4 * i + 1] = 0;
      this.pixel.data[4 * i + 2] = 0;
      this.pixel.data[4 * i + 3] = 255;
    }

    this.eraser = this.ctx.createImageData(1, 1);
    this.eraser.data[0] = 0;
    this.eraser.data[1] = 0;
    this.eraser.data[2] = 0;
    this.eraser.data[3] = 0;
  }

  render() {
    let canvasClass = (this.state.whiteboardActive) ? "active" : "";
    return (
      <div className="whiteboard">
        <div id="canvas-ui">
          <CanvasUI
            ref={(c) => {this.ui = c;}} />
        </div>
        <canvas
          ref={(c) => {this.canvas = c; this.ctx = (this.canvas) ? this.canvas.getContext('2d') : null;}}
          id="whiteboard-canvas" width={this.WIDTH} height={this.HEIGHT} 
          className={canvasClass} />
      </div>
    );
  }
  
  _processMouseEvent(res, e) {
    let canvasRect = this.canvas.getBoundingClientRect();
    let mouseX = e.clientX - canvasRect.left;
    let mouseY = e.clientY - canvasRect.top;
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = mouseX;
      this.currY = mouseY;
      this.mouseDown = true;

      if (this.ui.state.mode == this.ui.DRAW_LINE) {
        let color = new Color(255, 255, 255);
        let videoTime = this.props.getVideoTime();
        this.addPoint(new Point(this.currX, this.currY, videoTime, videoTime + this.TTL, color));
      }
    }
    if (res == 'up' || res == "out") {
      this.mouseDown = false;
    }
    if (res == 'move') {
      if (this.mouseDown) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = mouseX;
        this.currY = mouseY;
        if (this.ui.state.mode == this.ui.DRAW_LINE) {
          let videoTime = this.props.getVideoTime();
          let color = new Color(255, 255, 255);
          this.addLine(new LineSegment(
            this.prevX, this.prevY, videoTime, this.currX, this.currY, videoTime + this.TTL, color
          ));
        } else if (this.ui.state.mode == this.ui.ERASE) {
          this.eraseSquare(this.currX, this.currY, this.props.getVideoTime());
        }
      }
    }
  }

  addPoint(point) {
    this.canvasState.addPoint(point);
  }

  addLine(line) {
    this.canvasState.addPoints(line.getPoints());
  }

  eraseSquare(x, y, time) {
    var erasePoints = [];
    for (var i = Math.max(0, x - this.ERASE_RADIUS); i <= Math.min(this.WIDTH, x + this.ERASE_RADIUS); i++) {
      for (var j = Math.max(0, y - this.ERASE_RADIUS); j <= Math.min(this.HEIGHT, y + this.ERASE_RADIUS); j++) {
        erasePoints.push({
          x: i,
          y: j,
          t1: time,
        });
      }
    }
    this.canvasState.erasePoints(erasePoints);
  }

  draw() {
    this._clear();
    this.canvasState.drawAt(this.props.getVideoTime(), this._drawPoint.bind(this));
  }

  _drawPoint(point) {
    this.ctx.fillStyle = "rgba(" + point.r + "," + point.g + "." + point.b + ",255)";
    this.ctx.fillRect(point.x, point.y, 1, 1);
  }
  

  _clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

Canvas.propTypes = {
  sendCanvasMessage: React.PropTypes.func,
  getVideoTime: React.PropTypes.func,
};

module.exports = Canvas;
