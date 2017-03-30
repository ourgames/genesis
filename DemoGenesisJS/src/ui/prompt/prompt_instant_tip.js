require('base/datetime.js');
require('ui/base/base_ui_layer.js');

gu.ui.prompt.InstantTip = gu.ui.BaseUILayer.extend({
  configCSD: function () {
    this._super();
    this.csdName = res.promptInstantTip;
    this.controlNames.push('icon', 'title', 'message');
  },
  setup: function (option) {
    if (!option) { return; }
    this.option = option;
    this.controls.icon.visible = !!option.icon;
    if (option.icon) {
      this.controls.icon.initWithSpriteFrameName(option.icon);
    }
    this.controls.title.setString(option.title);
    this.controls.message.setString(option.message);
  },
  show: function () {
    this.visible = true;
    this.object.opacity = 255;
    this.object.scaleY = 1;

    this.schedule(this.fade, gu.game.INSTANT_TIP.DELAY);
    this.schedule(this.exit, 1.6);
  },
  fade: function () {
    this.unschedule(this.fade);
    this.object.runAction(new cc.Spawn([new cc.FadeTo(0.8, 0), new cc.ScaleTo(0.8, 1, 0.001)]));
  },
  exit: function() {
    this.unschedule(this.exit);
    this.visible = false;
  },
});
