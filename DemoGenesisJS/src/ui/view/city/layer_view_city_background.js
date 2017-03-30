require('ui/util/viewport_helper.js');
require('ui/manager/manager_building.js');

(function () {

  // private static 
  var __BLOCK_COUNT = 27;
  // private static

  gu.ui.view.LayerViewCityBackground = gu.ui.BaseCSDLayer.extend({
    configCSD: function () {
      'use strict';
      this._super();

      this.csdName = res.layerViewCity;
      this.name = 'view_city_background';
    },
    loadCSD: function () {
      this._super();
      // sort building blocks
      this.blocks = {};
      var sortBlocks = [];
      var blockCount = __BLOCK_COUNT;
      var uiHelper = gu.ui.helper;
      for (var i = 0; i < blockCount; i++) {
        var name = 'block_' + i;
        var obj = uiHelper.findChildByName(this.object, name);
        cc.assert(obj, 'blocks[' + name + '] is null in LayerViewCityBackground');
        this.blocks[i] = obj;
        sortBlocks.push(obj);
      }
      // sort blocks by position
      sortBlocks.sort(function (a, b) {
        if (!a || !b) { return 0; }

        var posA = a.getPosition();
        var posB = b.getPosition();

        if (posA.y < posB.y) { return -1; }
        if (posA.y == posB.y && posA.x < posB.x) { return -1; }

        return 1;
      });
      for (var j = 0; j < blockCount; j++) {
        sortBlocks[j].setLocalZOrder(j);
      }
    },
    replaceClickable: function (oldName, newName, object) {
      if (oldName == newName) { return; }
      var i = this.clickables.indexOf(oldName);
      if (i < 0) {
        this.clickables.push(newName);
      }
      else {
        this.controls[oldName] = null;
        this.clickables[i] = newName;
      }
      if (object) { this.controls[newName] = object; }
    },
    register: function (parentNode) {
      this.treeNode.addToParent(parentNode);
    },
  });

} ());