gu.ui.BaseUILayer = gu.ui.BaseCSDLayer.extend({
  configCSD: function () {
    'use strict';
    this._super();
    this.tree = new gu.ui.Tree(this.treeNode);
  },
  bindTouchEvent: function () {
    'use strict';
    var _this = this;
    this.touchListener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        var ret = !!_this.tree.onTouchBegan(touch, event);
        return ret || _this.checkLayerRange();
      },
      onTouchMoved: function (touch, event) {
        _this.tree.onTouchMoved(touch, event);
      },
      onTouchEnded: function (touch, event) {
        _this.tree.onTouchEnded(touch, event);
      }
    });
    cc.eventManager.addListener(this.touchListener, this);
  },
  onEnter: function () {
    'use strict';
    this._super();
    this.bindTouchEvent();
  },

  onExit: function () {
    'use strict';
    this._super();
    this.touchListener = null;
  },
  onControlClicked: function (treeNode) {
    if (!this.controls[treeNode.name] || !this.controls[treeNode.name].visible) {
      return false;
    }
    cc.log('control[' + treeNode.name + '] is clicked.');
    return true;
  },
  checkLayerRange: function () { return false; }
});