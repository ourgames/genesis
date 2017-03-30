require('ui/view/city/building_button.js');
require('ui/view/city/building_menu_handler.js');

gu.ui.building.BuildingMenu = gu.ui.BaseCSDLayer.extend({
  layout: {
    three: {
      pos: [{ x: 108.00, y: -104.0 }, { x: 0.00, y: -124.0 }, { x: -108.00, y: -104.0 }]
    },
    four: {
      pos: [{ x: 145.00, y: -88.0 }, { x: 50.00, y: -124.0 }, { x: -50.00, y: -124.0 }, { x: -145.00, y: -88.0 }]
    },
    five: {
      pos: [{ x: 206.00, y: -78.0 }, { x: 108.00, y: -114.0 }, { x: 0.00, y: -136.0 }, { x: -108.00, y: -114.0 }, { x: -206.00, y: -78.0 }]
    },
  },
  eAnimationSetting: {
    mode: {
      NONE: 0,
      OPEN: 1,
      CLOSE: 2
    },
    DURATION: 0.25,
    // |_________           |
    // |________|______     |
    // |  x  |________|_____|
    // |        x  |________|
    // |              x  | y|
    // total duration = x * count + y
    POST_PERCENT_X: 0.2,
  },
  animation: {},
  configCSD: function () {
    'use strict';
    this._super();

    this.animation.mode = this.eAnimationSetting.mode.NONE;
    this.csdName = res.buildingMenu;
    this.name = 'building_menu';
    this.controlNames.push('title_background', 'menu_background', 'title');
  },
  // option = { buttons[ {}, {}, {} ] };
  setup: function (option) {
    if (!option) {
      gu.log.e('option is not invalid in BuildingMenu.init()');
      return;
    }
    if (!option.buttons) {
      gu.log.e('option.buttons is not invalid in BuildingMenu.init()');
      return;
    }
    if (this.option) {
      for (var i = 0, count = this.option.buttons.length; i < count; i++) {
        this.controls['button_' + i].visible = false;
      }
    }
    this.option = option;
    this.controls.title.setString(this.option.title);
    var buttonCount = option.buttons.length;
    switch (buttonCount) {
      case 3:
        this.currentLayout = this.layout.three;
        break;
      case 4:
        this.currentLayout = this.layout.four;
        break;
      case 5:
        this.currentLayout = this.layout.five;
        break;
      default:
        gu.log.e('option.buttons.length [' + buttonCount + ']is not invalid in BuildingMenu.init(), which should be in [3, 5]');
        return;
    }
    this._createButtons();
  },
  onClick: function (touch) {
    // convert to local coordinate
    var point = this.object.convertTouchToNodeSpace(touch);
    // check each button
    var buttonPos = this.currentLayout.pos;
    var hitIndex = this.currentLayout.pos.findIndex(function (value) {
      return gu.math.p.distance(point, value) <= 50;
    });
    // emit event
    if (hitIndex < 0) { return false; }
    var button = this.controls['button_' + hitIndex];
    if (button) {
      gu.ui.building.buildingMenuHandler.onMenu(this.buildingNode, button);
    }
    return true;
  },
  open: function () {
    if (this.animation.mode == this.eAnimationSetting.mode.NONE) {
      this.scheduleUpdate();
    }
    this.visible = true;
    this.animation.mode = this.eAnimationSetting.mode.OPEN;
    this.animation.duration = this.eAnimationSetting.DURATION;
  },
  close: function () {
    if (this.animation.mode == this.eAnimationSetting.mode.CLOSE) {
      return;
    }
    if (this.animation.mode == this.eAnimationSetting.mode.NONE) {
      this.scheduleUpdate();
    }
    this.animation.mode = this.eAnimationSetting.mode.CLOSE;
    this.animation.duration = this.eAnimationSetting.DURATION;
  },
  onExit: function () {
    this._super();
    this.unscheduleUpdate();
  },
  update: function (delta) {
    switch (this.animation.mode) {
      case this.eAnimationSetting.mode.NONE:
        return;
      case this.eAnimationSetting.mode.OPEN:
        this._doAnimationOpen(delta);
        break;
      case this.eAnimationSetting.mode.CLOSE:
        this._doAnimationClose(delta);
        break;
    }
  },
  _createButtons: function () {
    var buttons = this.option.buttons;
    var buttonCount = buttons.length;
    for (var i = 0; i < buttonCount; i++) {
      var button = this.controls['button_' + i];
      if (!button) {
        button = (new gu.ui.building.BuildingButton()).object;
        button.setAnchorPoint(cc.p(0.5, 0, 5));
        this.object.addChild(button);
        this.controls['button_' + i] = button;
      }
      button.visible = true;
      button.setup(buttons[i], i);
    }
  },
  _doAnimationOpen: function (delta) {
    this.animation.duration -= delta;
    if (this.animation.duration < 0.01) { this.animation.duration = 0; }

    var percent = 1.0 - this.animation.duration / this.eAnimationSetting.DURATION;

    // titile
    this.controls.title.opacity = percent * 255; // valid opacity (0 ~ 255)
    this.controls.title_background.scaleX = percent;

    // background
    this.controls.menu_background.opacity = percent * 255;// valid opacity (0 ~ 255)

    // buttons
    var buttons = this.option.buttons;
    var buttonCount = buttons.length;
    var postPercentX = this.eAnimationSetting.POST_PERCENT_X;
    var total = postPercentX * buttonCount + (1 - postPercentX);
    for (var i = 0; i < buttonCount; i++) {
      var start = i * postPercentX / total;
      var end = start + (1 - postPercentX) / total;
      var buttonAniPercent = percent > start ? (percent - start) / (end - start) : 0;
      if (buttonAniPercent > 1) { buttonAniPercent = 1; }

      var button = this.controls['button_' + i];
      var toPos = this.currentLayout.pos[i];
      var offset = 80;
      var pos = cc.p(toPos.x, offset * (1 - buttonAniPercent) + toPos.y);
      button.setPosition(pos);
      button.scale = buttonAniPercent;
    }
    if (this.animation.duration < 0.01) {
      this.animation.mode = this.eAnimationSetting.mode.NONE;
      this.unscheduleUpdate();
    }
  },
  _doAnimationClose: function (delta) {
    this.animation.duration -= delta;
    if (this.animation.duration < 0.01) { this.animation.duration = 0; }

    var percent = this.animation.duration / this.eAnimationSetting.DURATION;

    // titile
    this.controls.title.opacity = percent * 255;// valid opacity (0 ~ 255)
    this.controls.title_background.scaleX = percent;

    // background
    this.controls.menu_background.opacity = percent * 255;// valid opacity (0 ~ 255)

    // buttons
    var buttons = this.option.buttons;
    var buttonCount = buttons.length;
    for (var i = 0; i < buttonCount; i++) {
      var button = this.controls['button_' + i];
      button.setScale(percent);
    }
    if (this.animation.duration < 0.01) {
      this.animation.mode = this.eAnimationSetting.mode.NONE;
      this.visible = false;
      this.unscheduleUpdate();
    }
  }
});