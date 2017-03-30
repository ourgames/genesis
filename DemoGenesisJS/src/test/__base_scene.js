require('ui/base/base_scene.js');
require('ui/base/base_csd_layer.js');
require('ui/util/layer_debug.js');

(function () {
  gu.test.LayerBase = gu.ui.BaseCSDLayer.extend({
    configCSD: function () {
      this._super();
      this.buttons = this.buttons || [];
    },
    bindControlsByName: function () {
      this._super();

      var util = gu.ui.BaseCSDUtil;
      util.bindControls(this, this.buttons);
    },

    // output
    MSG_CACHE_MAX: 24,
    msgCache: [],
    output: function (str) {
      this.msgCache.push(str);
      if (this.msgCache.length > this.MSG_CACHE_MAX) { this.msgCache.shift(); }
      this.controls.labelInfo.string = this.msgCache.join('\n');
    },

    // event-bindings
    onEnter: function () {
      this._super();
      this.bindTouchEventToButton();
      this.scheduleUpdate();
      if (this.controls.labelInfo) { this.controls.labelInfo.setString(''); }
    },
    onExit: function () {
      this._super();
      this.unscheduleUpdate();
    },
    update: function (delta) { },
    bindTouchEventToButton: function () {
      var self = this;
      this.buttons.forEach(function (button) {
        this.controls[button].addTouchEventListener(function (obj, eventType) {
          switch (eventType) {
            case ccui.Widget.TOUCH_ENDED:
              self.onClick(button);
              break;
          }
        });
      }, this);
    },
    onClick: function (button) { }
  });

  gu.test.SceneBase = gu.ui.BaseScene.extend({
    ctor: function (contentLayer, title) {
      this._super();
      this.title = title;
      this.contentLayer = contentLayer;
    },
    createCanvas: function () {
      this.addChild(this.contentLayer);
    }
  });
} ());