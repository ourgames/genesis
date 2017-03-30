// basic geometry functions

gu.math = gu.math || {};

// function for points 
gu.math.p = {
  add: function (pt, value) {
    if (!pt) { gu.log.e('invalid point in gu.math.p.add()'); return; }
    if (_.isNumber(value)) {
      if (!_.isFinite(value)) { gu.log.e('invalid value in gu.math.p.add()'); return; }
      return cc.p(pt.x + value, pt.y + value);
    }
    else {
      if (!value) { gu.log.e('invalid pt2 in gu.math.p.add()'); return; }
      if (!_.isFinite(value.x)) { gu.log.e('invalid pt2.x in gu.math.p.add()'); return; }
      if (!_.isFinite(value.y)) { gu.log.e('invalid pt2.y in gu.math.p.add()'); return; }
      return cc.p(pt.x + value.x, pt.y + value.y);
    }
  },
  minus: function (pt, value) {
    if (!pt) { gu.log.e('invalid point in gu.math.p.minus()'); return; }
    if (_.isNumber(value)) {
      if (!_.isFinite(value)) { gu.log.e('invalid value in gu.math.p.minus()'); return; }
      return cc.p(pt.x - value, pt.y - value);
    }
    else {
      if (!value) { gu.log.e('invalid pt2 in gu.math.p.minus()'); return; }
      if (!_.isFinite(value.x)) { gu.log.e('invalid pt2.x in gu.math.p.minus()'); return; }
      if (!_.isFinite(value.y)) { gu.log.e('invalid pt2.y in gu.math.p.minus()'); return; }
      return cc.p(pt.x - value.x, pt.y - value.y);
    }
  },
  mul: function (pt, time) {
    if (!pt) { gu.log.e('invalid point in gu.math.p.mul()'); return; }

    if (!_.isFinite(time)) { gu.log.e('invalid time in gu.math.p.mul()'); return; }
    return cc.p(pt.x * time, pt.y * time);
  },
  lessThan: function (pt, numValue) {
    if (!pt) { gu.log.e('invalid point in gu.math.p.lessThan()'); return; }
    return Math.abs(pt.x) < numValue && Math.abs(pt.y) < numValue;
  },
  // make sure the point be within the rect boundary
  setInRect: function (point, rect) {
    if (!point) { gu.log.e('invalid point in gu.math.p.setInRect()'); return; }
    if (!rect) { gu.log.e('invalid boundary in gu.math.p.setInRect()'); return; }

    var right = rect.x + rect.width;
    var top = rect.y + rect.height;
    var newPt = point;

    if (newPt.x > right) { newPt.x = right; }
    if (newPt.x < rect.x) { newPt.x = rect.x; }
    if (newPt.y > top) { newPt.y = top; }
    if (newPt.y < rect.y) { newPt.y = rect.y; }

    return newPt;
  },
  // calculate distance of 2 points
  distance: function (point1, point2) {
    if (!point1) { gu.log.e('invalid point1 in gu.math.p.distance()'); return; }
    if (!point2) { gu.log.e('invalid point2 in gu.math.p.distance()'); return; }

    return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y));
  },
};

gu.math.rect = {
  mid: function (rect) {
    if (!rect) { gu.log.e('invalid rect in gu.math.rect.mid()'); return; }
    return cc.p(rect.x + rect.width * 0.5, rect.y + rect.height * 0.5);
  },
  origin: function (rect) {
    if (!rect) { gu.log.e('invalid rect in gu.math.rect.origin()'); return; }
    return cc.p(rect.x, rect.y);
  },
  destin: function (rect) {
    if (!rect) { gu.log.e('invalid rect in gu.math.rect.destin()'); return; }
    return cc.p(rect.x + rect.width, rect.y + rect.height);
  }
};
