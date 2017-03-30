require('data/game_config.js');

gu.ui.LayerDebug = cc.Layer.extend({
  defaultConfig: {},
  ctor: function () {
    this._super();
    this.defaultConfig.LINE_WIDTH = 0;
    this.defaultConfig.LINE_COLOR = cc.color(0, 0, 0, 0);
    this.defaultConfig.FILL_COLOR = cc.color(0, 225, 225, 50);
    this.defaultConfig.DOT_RADIUS = 5;
  },
  clear: function () {
    this.canvas.clear();
  },
  addNots: function (points, radius, color) {
    radius = radius || this.defaultConfig.DOT_RADIUS;
    color = color || this.defaultConfig.FILL_COLOR;
    this.canvas.drawDot(points, radius, color);
  },
  addLine: function (from, to, lineWidth, color) {
    lineWidth = lineWidth || this.defaultConfig.LINE_WIDTH;
    color = color || this.defaultConfig.LINE_COLOR;
    this.canvas.drawSegment(from, to, lineWidth, color);
  },
  addRect: function (rect, fillColor, lineWidth, lineColor) {
    fillColor = fillColor || this.defaultConfig.FILL_COLOR;
    lineWidth = lineWidth || this.defaultConfig.LINE_WIDTH;
    lineColor = lineColor || this.defaultConfig.LINE_COLOR;
    this.canvas.drawRect(
      cc.p(rect.x, rect.y), 
      cc.p(rect.x + rect.width, rect.y + rect.height), 
      fillColor, 
      lineWidth, 
      lineColor
    );
  },
  onEnter: function () {
    this._super();
    this.canvas = cc.DrawNode.create();
    this.addChild(this.canvas);
  },
  onExit: function () {
    this._super();
  },
  install: function (container) {
    var level = gu.game.LAYER.DEBUG;
    container.addChild(this, level, level);
  }
});