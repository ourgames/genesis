gu.ui.TitleBackground = cc.LayerColor.extend({
  ctor: function (color, width, height) {
    this._super(color, width, height);
  },

  onEnter: function () {
    this._super();
    this.touchListener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: function (touch, event) {
        var pos = touch.getLocation();
        var target = event.getCurrentTarget();
        if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
          return true;
        }
        return false;
      },
      onTouchEnded: function (touch, event) {
        // go to next scene
        var scene = gu.manager.showcase.next();
        if (scene) { cc.director.replaceScene(scene); }
      }
    });
    cc.eventManager.addListener(this.touchListener, this);
  },

  onExit: function () {
    this._super();
    cc.eventManager.removeListener(this.touchListener);
  }
});

gu.ui.TitleLayer = cc.Layer.extend({
  titleNode: null,
  setTitle: function (title) {
    if (!title) { return; }
    this.titleNode.setString(title);
  },
  ctor: function () {
    this._super();

    // load CSD file
    var object = ccs.load(res.layerTitle).node;
    this.addChild(object);

    // get title node
    this.titleNode = object.getChildByName('labelTitle');
    cc.assert(this.titleNode, 'titleNode is null in TitleLayer.ctor()');

    var height = this.titleNode.getBoundingBoxToWorld().height;
    var titleBg = new gu.ui.TitleBackground(cc.color(225, 225, 225, 199), cc.winSize.width, height);
    titleBg.setPosition(0, cc.winSize.height * 0.95 - height * 0.5);
    this.addChild(titleBg, -1);
  },
});

gu.ui.BaseScene = cc.Scene.extend({
  title: '',

  createTitle: function () {
    var layer = new gu.ui.TitleLayer();
    this.addChild(layer);
    layer.setTitle(this.title);
  },

  // -- implement by subclasses
  createCanvas: function () { },

  // -- overrides
  onEnter: function () {
    this._super();
    this.createCanvas();
    this.createTitle();
  },
});
