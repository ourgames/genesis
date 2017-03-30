
gu.ui.building = gu.ui.building || {};
gu.ui.building.BuildingButton = cc.Class.extend({
  topType: { NONE: 0, INFO: 1, GOLD: 2 },
  midType: { NONE: 0, NORMAL: 1, GOLD: 2 },
  bottomType: { NONE: 0, NORMAL: 1, },

  ctor: function () {
    'use strict';

    this.csdName = res.buildingButton;
    this.name = 'building_button';
    this.controlNames = [
      'top_gold_amount',
      'top_gold_icon',
      'top_info',
      'mid_gold_amount',
      'mid_gold_icon',
      'mid_icon',
      'name',
      'bottom_info'];
    this.controls = {};
    this.uiHelper = gu.ui.helper;
    this.object = ccs.load(this.csdName, '').node;
    this.object.owner = this;
    this.controlNames.forEach(function (item, index, array) {
      this.controls[item] = this.uiHelper.findChildByName(this.object, item);
      cc.assert(this.controls[item], 'control[' + item + '] is null when configCSD() with file [' + this.csdName + ']');
    }, this);

    // option = { top : { type : 0 }, mid : { type : 1, icon : 'building_button_info.png', name : '信息' }, bottom : { type : 0 } };
    this.object.setup = function (option, id) {
      var _owner = this.owner;
      this.option = option;
      gu.debug.assert(option, 'option is not invalid in BuildingButton.init()');

      if (!option) { return; }
      this.id = id;

      // top
      _owner.controls.top_gold_amount.visible = option.top.type == _owner.topType.GOLD;
      _owner.controls.top_gold_icon.visible = option.top.type == _owner.topType.GOLD;
      _owner.controls.top_info.visible = option.top.type == _owner.topType.INFO;
      if (option.top.type == _owner.topType.GOLD) {
        _owner.controls.top_gold_amount.setString(option.top.gold_amount);
      }
      else if (option.top.type == _owner.topType.INFO) {
        _owner.controls.top_info.setString(option.top.info);
        this.topInfo = option.top.info;
      }

      // mid        
      _owner.controls.mid_gold_amount.visible = option.mid.type == _owner.midType.GOLD;
      _owner.controls.mid_gold_icon.visible = option.mid.type == _owner.midType.GOLD;
      _owner.controls.mid_icon.visible = option.mid.type == _owner.midType.NORMAL;
      if (option.mid.type == _owner.midType.NORMAL) {
        _owner.controls.mid_icon.initWithSpriteFrameName(option.mid.icon);
      }
      else if (option.mid.type == _owner.midType.GOLD) {
        _owner.controls.mid_gold_amount.setString(option.mid.gold_amount);
      }
      _owner.controls.name.setString(option.mid.name);
      this.name = option.mid.name;

      // bottom
      _owner.controls.bottom_info.visible = option.bottom.type == _owner.bottomType.NORMAL;
      if (option.bottom.type == _owner.midType.NORMAL) {
        _owner.controls.bottom_info.setString(option.bottom.info);
        this.bottomInfo = option.bottom.info;
      }
    };
    this.object.updateBottomInfo = function (info) {
      var _owner = this.owner;
      if (this.option.bottom.type != _owner.bottomType.NORMAL) {
        gu.log.w('BuildingButton.updateBottomInfo() is updated, but the bottom info is not visible.');
      }
      _owner.controls.bottom_info.setString(info);
    };
  },
  setup: function (option, id) {
    this.object.setup(option, id);
  },
  updateBottomInfo: function (info) {
    this.object.updateBottomInfo(info);
  }
});
