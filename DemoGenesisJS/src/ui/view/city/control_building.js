require('ui/base/base_csd_util.js');
require('ui/base/base_tree_node.js');
require('ui/manager/manager_event.js');
require('ui/view/city/building_balloon_button.js');

(function () {

  var __csdUtil = gu.ui.BaseCSDUtil;
  var __type = 'ControlBuilding';
  var __hitType = {
    NONE:           0,  // 没有点击到 not hit at all
    BUILDING:       1,  // 点击到建筑主体 the building body is hit
    BALLOON_BUTTON: 2,  // 点击到建筑上面的浮动按钮 the balloon button is hit
  };
  gu.ui.building.ControlBuilding = gu.ui.TreeNode.extend({
    ctor: function (obj) {
      this._super(obj);
      this.bindNodeEvents();
      this.configCSD();
      __csdUtil.bindControlsByName.call(this);

      this.setup();
    },
    bindNodeEvents: function () { __csdUtil.bindNodeEvents.call(this); },
    configCSD: function () {
      this.controls = {};
      this.controlNames = ['node_sprite', 'node_level', 'node_touch'];
      this.clickables = [];
    },
    setup: function () {
      // 内层粒子效果 inner layer of particle effect 
      this.layerInnerParticle = cc.Node.create();
      this.object.addChild(this.layerInnerParticle);
      this.layerStatus = cc.Node.create();
      this.object.addChild(this.layerStatus);

      // 点击范围 touch range marking node
      var touchNode = this.controls.node_touch;
      var boundary = gu.ui.helper.getNodeBoundary(touchNode);

      // 浮动按钮 balloon button      
      var balloonButton = new gu.ui.building.BalloonButton();
      balloonButton.setup({ icon: '' });
      balloonButton.y = boundary.y + boundary.height + touchNode.y;
      this.layerStatus.addChild(balloonButton);
      this.controls.balloonButton = balloonButton;

      // 外层动画效果 outter layer of animation
      this.layerOutterAnimate = cc.Node.create();
      this.object.addChild(this.layerOutterAnimate);

      // 升级的粒子动画 particle animation of building upgrade
      this.effectUpgrade = new cc.ParticleSystem(res.particleBuildingUpgradeDone);
      this.effectUpgrade.setAnchorPoint(cc.p(0.5, 0.5));
      this.effectUpgrade.visible = false;
      this.layerInnerParticle.addChild(this.effectUpgrade);

      gu.manager.event.bind(this, 'building.upgrade.done');
    },
    ShowballoonButton: function(show) {
        this.balloonButtonNode.visible = !!show;
    },
    onUpgradeDone: function () {
      gu.manager.prompt.showInstantTip({ icon: '', title: 'Upgrade finished', message: 'The building is successfully upgraded to lv. 2.' });
      this.effectUpgrade.visible = true;
      this.effectUpgrade.resetSystem();
    },
    on: function (event) {
      if (!event) { return; }
      switch (event.type) {
        case 'building.upgrade.done':
          if (event.data &&
            event.data.type == this.type &&
            event.data.block == this.block) {
            this.onUpgradeDone();
          }
          break;
        default: break;
      }
    },
    onExit: function () {
      gu.manager.event.unbind(this);
    },
    hittest: function (point, touch) {
      // 点的坐标是相对整个可拖动的城市大图层的 point is the touch coordinate of the whole city view 
      if (this.clickRange && cc.rectContainsPoint(this.clickRange, point)) {
        gu.log.i('__hitType.BUILDING');
        return __hitType.BUILDING;
      }
      return __hitType.NONE;
    },
    // 测试是否点击到了收获按钮 hit-test for harvest button 
    hitHarvest: function(touch) {
      var balloon = this.controls.balloonButton;
      if (!balloon.visible || balloon.getMode != gu.ui.building.BalloonButton.HARVEST) { return false; }
      if (this.controls.balloonButton.hittest(touch)) {
        gu.log.i('__hitType.BALLOON_BUTTON'); 
        return true;
      }
    },
    onClick: function (hittestResult) {
      switch(hittestResult) {
        case __hitType.BUILDING:
          // 显示建筑菜单 show building menu
          gu.manager.buildingMenu.showMenu(this);
          break;
        case __hitType.BALLOON_BUTTON:
          break;
        default: break;
      }
    },
    onHarvest: function() {
      gu.log.i(this.type + ' onHarvest');
      this.controls.balloonButton.visible = false;
    }
  });
} ());