let Color = require("./Color");
let Point = require("./Point");

class CanvasState {
  constructor(width, height, sendCanvasMessage) {
    this.points = [];
    this.currentTime = 0.0;
    this.width = width;
    this.height = height;
    this.sendCanvasMessage = sendCanvasMessage;
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
    this.points.push(point);
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

  drawAt(time, drawPoint) {
    this._drawState(time, drawPoint);
    this.currentTime = time;
  }

  recvInitState(state) {
    for (var i = 0; i < state.points.length; i++) {
      let point = state.points[i];
      this.points.push(new Point(
        point.x, point.y, point.t1, point.t2, new Color(point.r, point.g, point.b)
      ));
    }
  }

  recvCanvasMessage(message) {
    if (message.type == "POINTS") {
      for (var i = 0; i < message.points.length; i++) {
        let point = message.points[i];
        this.points.push(new Point(
          point.x, point.y, point.t1, point.t2, new Color(point.r, point.g, point.b)
        ));
      }
    }
  }

  _clear(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  }

  _drawDiffs(ctx, time) {
  }

  _drawState(time, drawPoint) {
    for (var i = 0; i < this.points.length; i++) {
      let point = this.points[i];
      if (point.t1 <= time && time <= point.t2) {
        drawPoint(point);
      }
    }
  }
}

module.exports = CanvasState;
