require('data/game_config.js');
require('base/underscore.js');
require('ui/ui/layer_ui_city.js');

(function () {

  var __private = {
    setLayer: function (obj) {
      'use strict';
      var container = gu.ui.root;

      // check valid
      if (!container) { gu.log.e("gu.ui.root is null in gu.ui.factory.ui.replace()."); return; }
      this.level = gu.game.LAYER.UI;

      if (this.layer) {
        // remove old layer
        container.removeChildByTag(this.level);
        this.layer.unregister();
      }
      // create new layer
      if (_.isFinite(obj)) { obj = this.createLayer(obj); }
      gu.ui.layers.ui = this.layer = obj;
      if (!obj) { return; }

      container.addChild(obj, this.level, this.level);
      obj.treeNode.order = this.level;
      obj.register();

      this.debugDraw(obj);
    },

    createLayer: function (id) {
      'use strict';

      switch (id) {
        case gu.game.SCENE.LOADING:
          break;
        case gu.game.SCENE.CITY:
          return new gu.ui.ui.LayerUICity();
        case gu.game.SCENE.WORLD:
          break;
        default:
          gu.log.e("LayerFactoryUI.createLayer(), sceneId(" + id + ") is invalid.");
          break;
      }
    },
    reset: function () { this.layer = null; },
    debugDraw: function (obj) {
      'use strict';
      var canvas = gu.debug.canvas;
      canvas.clear();
      gu.ui.helper.enumerateNodes(null, function (node) {
        if (node && node.clickRange) {
          canvas.addRect(node.clickRange);
        }
      }, obj.treeNode, true);
    }
  };

  gu.ui.factory.ui = {
    setLayer: function (id) { __private.setLayer(id); },
    reset: function () { __private.reset(); }
  };

} ());
