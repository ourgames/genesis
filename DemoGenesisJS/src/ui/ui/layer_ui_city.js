require('ui/base/base_ui_layer.js');
require('ui/manager/manager_dialog.js');
require('ui/ui/city/control_building_queue.js');
require('ui/ui/city/control_hero_portrait.js');

gu.ui.ui.LayerUICity = gu.ui.BaseUILayer.extend({
  configCSD: function () {
    'use strict';
    this._super();
    this.controlNames.push(
      'hero', 'building_queue_1',
      'label_resource_food', 'label_resource_wood', 'label_resource_stone', 'label_resource_iron', 'label_gold',
      'icon_tip_quest', 'icon_tip_inventory', 'icon_tip_mail', 'icon_tip_alliance'
    );
    this.clickables.push(
      'btn_gold_shop',
      'btn_favorite', 'btn_skill',
      'btn_minimap', 'btn_quest', 'btn_inventory', 'btn_mail', 'btn_alliance'
    );
    this.csdName = res.layerUICity;
    this.treeNode.name = 'layer-ui-city';
  },
  loadCSD: function () {
    this._super();

    // load sub-view controls
    var ui = gu.ui.ui;
    this.buildingQueue1 = new ui.ControlBuildingQueue(this.controls.building_queue_1, this.treeNode);
    this.buildingQueue1.setType(this.buildingQueue1.TYPE.NORMAL);
    this.heroPortrait = new gu.ui.ui.ControlHeroPortrait(this.controls.hero, this.treeNode);
  },
  onEnter: function () {
    this._super();
    // this.scheduleUpdate();
  },
  onExit: function () {
    this._super();
    // this.unscheduleUpdate();
  },
  update: function (delta) {
    // this.buildingQueue1.update(delta);
  },
  onControlClicked: function (treeNode) {
    if (!this._super(treeNode)) { return false; }
    var name = treeNode.name;
    switch (name) {
      case 'btn_quest':
        // gu.manager.dialog.pop();
        break;
      case 'btn_mail':
        gu.manager.navigation.toBuilding(5);
        break;
      case 'btn_alliance':
        // todo: test code
        // gu.ui.layers.view.save();
        break;
      case 'btn_inventory':
        // todo: test code
        // gu.ui.layers.view.restore();
        break;
      default: break;
    }
  },
  updateResource: function (index, count) {
    var control;
    switch (index) {
      case 0: //food
        control = this.controls.label_resource_food; break;
      case 1: // wood
        control = this.controls.label_resource_wood; break;
      case 2: // stone
        control = this.controls.label_resource_stone; break;
      case 3: // iron
        control = this.controls.label_resource_iron; break;
      case 4: //gold
        control = this.controls.label_gold; break;
      default: break;
    }
    // todo: format number ?
    control.setString('' + count);
  },
  updateBottom: function (index, count) {
    var control;
    switch (index) {
      case 0: //quest
        control = this.controls.icon_tip_quest; break;
      case 1: // inventory
        control = this.controls.icon_tip_inventory; break;
      case 2: // mail
        control = this.controls.icon_tip_mail; break;
      case 3: // alliance
        control = this.controls.icon_tip_alliance; break;
      default: break;
    }
    control.visible = count > 0;
    control.setString('' + count);
  }
});