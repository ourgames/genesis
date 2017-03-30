require('data/building_menu.js');
require('ui/view/city/building_menu.js');
require('ui/view/city/control_building.js');
require('ui/manager/manager_building_menu.js');

(function () {
  var __private = {
    // 初始化 initiailize
    init: function (buildingLayer, menuLayer) {
      this.buildingLayer = buildingLayer;
      
      this.uiHelper = gu.ui.helper;
      this.blockNodes = new Map();

      gu.manager.buildingMenu.init(menuLayer);
      gu.manager.buildingQueue.init();
    },

    // 在制定地块上创建建筑 create building on given block
    createBuilding: function (type, level, block) {
      gu.log.i('manager.building.createBuilding(' + type + ',' + level + ',' + block + ')');

      // 加载建筑的cocos对象 load cocos object of the building
      var building = this._loadBuildingCocosObject(type, level);
      if (!building) {
        gu.log.e('_loadBuildingCocosObject(' + type + ',' + level + ') failed.'); 
        return; }

      var parent = this.getBlockParent(block);
      if (!parent) {
        gu.log.e('parent object is null in manager.building.createBuilding()');
        return;
      }
      parent.removeAllChildren(true);
      parent.addChild(building);
      building.setPosition(0, 0);

      var name = type + '_' + (level || 0);

      // 创建新的建筑对象 create 
      var oldNode = this.getBlockNode(block);
      var touchRange = this.getTouchRange(building);
      var newNode = new gu.ui.building.ControlBuilding({
        // basic 
        name: name, object: building, clickRange: touchRange,
        // extra for building 
        type: type, block: block, level: level
      });
      this.blockNodes.set(block, newNode);

      if (!oldNode) {
        newNode.addToParent(this.buildingLayer.treeNode);
      }
      else { // 替换地块上原有的建筑对象 update old building on the block
        if (oldNode.name != newNode.name) {
          this.buildingLayer.replaceClickable(oldNode.name, newNode.name, building);
        }
        this.buildingLayer.treeNode.replaceChild(oldNode, newNode);
      }

      return newNode;
    },
    // 获取指定地块上的建筑对象  get building object by block
    getBuilding: function(block) {
      var building = this.blockNodes.get(block);
      if (!building) { return null; }

      return building;
    },
    reset: function () {
      this.menu = null;
      gu.manager.buildingMenu.reset();
      gu.manager.buildingQueue.reset();
    },
    onClick: function (touch) {
      return gu.manager.buildingMenu.onClick(touch);
    },
    getTouchRange: function (building) {
      if (!building || typeof (building.getChildByName) != 'function') {
        gu.log.e('building is not valid in manager.building.getTouchRange()');
        return cc.rect(0, 0, 0, 0);
      }
      var touchNode = building.getChildByName('node_touch');
      if (!touchNode) {
        gu.log.e('touchNode is not valid in manager.building.getTouchRange()');
        return cc.rect(0, 0, 0, 0);
      }
      return this.uiHelper.getBoundingBoxInLayer(this.buildingLayer, touchNode);
    },
    getBlockParent: function (block) {
      if (!this.buildingLayer || !this.buildingLayer.blocks) { return null; }
      return this.buildingLayer.blocks[block];
    },
    getBlockNode: function (block) {
      if (typeof (block) == 'undefined' || block === null) {
        gu.log.e('block is undefined or null in manager.building.getCurrentNode');
        return;
      }
      return this.blockNodes.get(block);
    },
    // compose building csd file name and load
    _loadBuildingCocosObject: function (type, level) {
      gu.debug.assert(type, 'type is invalid in BuildingManager.loadBuild()');
      if (!type) { return null; }
      var csdName = 'csd/building/building_' + type + (typeof (level) == 'undefined' ? '' : '_' + level) + '.json';

      var csd = ccs.load(csdName, '');
      return csd ? csd.node : null;
    },
  };
  gu.manager.building = {};
  gu.util.linkPrivate([
    'init',                 // (root, menuLayer)
    'createBuilding',       // (type, level, block)
    'getBuilding',          // (block)
    'onClick',              // (touch)
    'update',               // (delta)
    'reset'                 // (void)
  ], gu.manager.building, __private);
} ());