require('ui/base/base_csd_util.js');

(function() {
var __RADIUS = 35;
var __CENTER = { x: 0, y: 67 };

gu.ui.building.BalloonButton = gu.ui.BaseCSDNode.extend({
  configCSD: function() {
    this._super();
    this.csdName = res.builidngBalloonButton;
    this.controlNames.push('icon');
  },
  loadCSD: function() {
    this._super();
    this.clickRange = cc.rect(__CENTER.x - __RADIUS, __CENTER.y - __RADIUS, __RADIUS * 2, __RADIUS * 2);
  },
  setup: function(option) {

  },
  hittest: function(touch) {
    var point = this.object.convertTouchToNodeSpace(touch); 
    return this.clickRange && cc.rectContainsPoint(this.clickRange, point);
  }
});

} ());
