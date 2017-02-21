let Color = require("./Color");
let Point = require("./Point");

class CanvasState {
  constructor(width, height, sendCanvasMessage) {
    this.points = {};
    this.currentTime = 0.0;
    this.width = width;
    this.height = height;
    this.sendCanvasMessage = sendCanvasMessage;

    this.EPSILON = 0.000001;
  }

  addPoint(point) {
    this._addPoint(point);
    // TODO: optimize this
    // TODO: also do some stuff with sending lines/erases directly I guess?
    this.sendCanvasMessage(JSON.stringify({
      type: "POINTS",
      points: [this._pointToMessage(point)],
    }));
  }

  _pointToMessage(point) {
    return {
      x: point.x,
      y: point.y,
      t1: point.t1,
      t2: point.t2,
      r: point.color.r,
      g: point.color.g,
      b: point.color.b,
    }
  }

  _addPoint(point) {
    let loc = [point.x, point.y];
    if (this.points[loc] === undefined) {
      this.points[loc] = [];
    }
    this.points[[point.x, point.y]].push(point);
  }

  addPoints(points) {
    var msgPoints = [];
    for (var i = 0; i < points.length; i++) {
      let point = points[i];
      this._addPoint(point);
      msgPoints.push(this._pointToMessage(point));
    }
    this.sendCanvasMessage(JSON.stringify({
      type: "POINTS",
      points: msgPoints,
    }));
  }

  erasePoint(point) {
    this._erasePoint(point);
    this.sendCanvasMessage(JSON.stringify({
      type: "ERASE",
      points: [point],
    }));
  }

  erasePoints(points) {
    for (var i = 0; i < points.length; i++) {
      this._erasePoint(points[i]);
    }
    // TODO: make this less hacky, maybe have an actual class?
    this.sendCanvasMessage(JSON.stringify({
      type: "ERASE",
      points: points,
    }));
  }

  _erasePoint(erasePoint) {
    let loc = [erasePoint.x, erasePoint.y];
    if (this.points[loc] === undefined) {
      return;
    }
    for (var i = 0; i < this.points[loc].length; i++) {
      let point = this.points[loc][i];
      if (point.x == erasePoint.x && point.y == erasePoint.y && 
          point.t1 <= erasePoint.t1 && erasePoint.t1 <= point.t2) {
        point.t2 = erasePoint.t1 - this.EPSILON;
      }
    }
  }

  drawAt(time, drawPoint) {
    this._drawState(time, drawPoint);
    this.currentTime = time;
  }

  recvInitState(state) {
    for (var i = 0; i < state.points.length; i++) {
      let point = state.points[i];
      this._addPoint(new Point(
        point.x, point.y, point.t1, point.t2, new Color(point.r, point.g, point.b)
      ));
    }
  }

  recvCanvasMessage(message) {
    if (message.type == "POINTS") {
      for (var i = 0; i < message.points.length; i++) {
        let point = message.points[i];
        this._addPoint(new Point(
          point.x, point.y, point.t1, point.t2, new Color(point.r, point.g, point.b)
        ));
      }
    } else if (message.type == "ERASE") {
      for (var i = 0; i < message.points.length; i++) {
        this._erasePoint(message.points[i]);
      }
    }
  }

  _clear(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  }

  _drawDiffs(ctx, time) {
  }

  _drawState(time, drawPoint) {
    Object.keys(this.points).forEach((key) => {
      for (var i = 0; i < this.points[key].length; i++) {
        let point = this.points[key][i];
        if (point.t1 <= time && time <= point.t2) {
          drawPoint(point);
        }
      }
    });
  }
}

module.exports = CanvasState;
