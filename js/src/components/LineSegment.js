
let Point = require("./Point");

class LineSegment {
  constructor(x1, y1, t1, x2, y2, t2, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.t1 = t1;
    this.x2 = x2;
    this.y2 = y2;
    this.t2 = t2;
    this.color = color;
  }

  getPoints() {
    // Bresenham's line algorithm
    let dx = this.x2 - this.x1;
    let dy = this.y2 - this.y1;;
    let xdel = (dx > 0) ? 1 : -1;
    let ydel = (dy > 0) ? 1 : -1;
    var ret = [];
    if (dx == 0) {
      for (var y = Math.min(this.y1, this.y2); y <= Math.max(this.y1, this.y2); y++) {
        ret.push(new Point(this.x1, y, this.t1, this.t2, this.color));
      }
      return ret;
    }
    let err = -1.0;
    let derr = Math.abs(dy / dx);
    var y = this.y1;
    for (var x = this.x1; x != this.x2 + xdel; x += xdel) {
      ret.push(new Point(x, y, this.t1, this.t2, this.color));
      err += derr;
      while (err >= 0.0) {
        y += ydel;
        err -= 1.0;
        ret.push(new Point(x, y, this.t1, this.t2, this.color));
      }
    }
    return ret;
  }
}

module.exports = LineSegment;
