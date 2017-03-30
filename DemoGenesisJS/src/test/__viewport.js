require('test/__base_scene.js');

gu.test.LayerViewPort = gu.test.LayerBase.extend({
  count: 0,
  configCSD: function () {
    this._super();
    this.controlNames.push('contentNode');
    this.csdName = res.layerViewport;
  },
  bindTouchEvent: function () {
    var _this = this;
    this.touchListener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ALL_AT_ONCE,
      swallowTouches: false,
      onTouchesBegan: function (touches, event) {
        _this.viewportHelper.onTouchesBegan(touches, event);
        return true;
      },
      onTouchesMoved: function (touches, event) {
        _this.viewportHelper.onTouchesMoved(touches, event);
      },
      onTouchesEnded: function (touches, event) {
        _this.viewportHelper.onTouchesEnded(touches, event);
      }
    });
    cc.eventManager.addListener(this.touchListener, this);
  },
  onEnter: function () {
    this._super();
    this.viewportHelper = new gu.ui.ViewportHelper();
    this.viewportHelper.init(this, this.controls.contentNode.getContentSize());//cc.p(3570, 2040));
    this.bindTouchEvent();
  },

  onExit: function () {
    this._super();
    this.touchListener = null;
  },
  update: function (delta) {
    this.viewportHelper.update(delta);
  }
});
