require('test/__base_scene.js');

gu.test.LayerTouch = gu.test.LayerBase.extend({
  count: 0,
  configCSD: function () {
    this._super();
    this.controlNames.push('buttonObj', 'spriteObj', 'labelInfo');
    this.csdName = res.layerTouch;
  },
  bindTouchEventToButton: function () {
    var self = this;
    this.controls.buttonObj.addTouchEventListener(function (obj, eventType) {
      switch (eventType) {
        case ccui.Widget.TOUCH_BEGAN:
          self.output('button onTouchBegan');
          break;
        case ccui.Widget.TOUCH_MOVED:
          self.output('button onTouchMoved');
          break;
        case ccui.Widget.TOUCH_ENDED:
          self.output('button onTouchEnded');
          break;
        case ccui.Widget.TOUCH_CANCELLED:
          self.output('button onTouchCancelled');
          break;
      }
    });
  },
  bindTouchEventToSprite: function () {
    var self = this;
    this.controls.spriteObj.touchListener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: function (touch, event) {
        var pos = touch.getLocation();
        var target = event.getCurrentTarget();
        if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
          self.output('sprite onTouchBegan');
          return true;
        }
        return false;
      },
      onTouchMoved: function (touch, event) {
        self.output('sprite onTouchMoved');
      },
      onTouchEnded: function (touch, event) {
        self.output('sprite onTouchEnded');
      }
    });
    cc.eventManager.addListener(this.controls.spriteObj.touchListener, this.controls.spriteObj);
  },
  onEnter: function () {
    this._super();
    this.bindTouchEventToButton();
    this.bindTouchEventToSprite();
  },
});
