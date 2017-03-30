/**
 * 建筑菜单管理类 Manager for building menus
 */

require('data/building_menu.js');
require('ui/view/city/building_menu.js');

(function () {
  var __private = {
    // 初始化 initiailize
    init: function (root) {
      this.root = root;
      this._loadRes();
    },
    // 加载资源 load resource
    _loadRes: function() {
      cc.spriteFrameCache.addSpriteFrames('res/pic/building/ui.plist');
    },
    reset: function () {
      this.root = null;
    },
    // 点击事件处理 Touch-event handler
    onClick: function (touch) {
      if (this.menu && this.menu.visible) {
        var ret = this.menu.onClick(touch);
        this.menu.close();
        return ret;
      }
      return false;
    },
    // 显示建筑对应的菜单 show menu for the building
    showMenu: function (building) {
      cc.log('control[' + building.name + '] is clicked.');

      if (!this.menu) {
        this.menu = new gu.ui.building.BuildingMenu();
        this.root.addMenu(this.menu);
      }
      var pos = cc.p(building.clickRange.x + building.clickRange.width * 0.5, building.clickRange.y + building.clickRange.height * 0.5);
      this.menu.setPosition(pos);
      var option = this._getMenuData(building);
      this.menu.setup(option);
      this.menu.buildingNode = building;
      this.menu.open();
    },
    // 获取对应建筑的菜单配置数据 get menu configuration for the building 
    _getMenuData: function (building) {
      var type = building.type;
      var menuData = gu.data.building.menu;
      gu.debug.assert(menuData, 'gu.data.building.menu in manager.building.getBuildingMenuOption()');
      if (!menuData) { return; }

      menuData = menuData[type];
      if (!menuData) {
        gu.log.e('type[' + type + '] not found in manager.building.getBuildingMenuOption()');
        return;
      }
      return menuData;
    },
  };

  // 创建buildingMenu对象 create buildingMenu
  gu.manager.buildingMenu = {};
  gu.util.linkPrivate([
    'init',
    'reset',
    'onClick',
    'showMenu',
  ], gu.manager.buildingMenu, __private);
} ());