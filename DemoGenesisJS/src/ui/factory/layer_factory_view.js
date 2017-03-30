require('data/game_config.js');
require('ui/view/city/layer_view_city.js');

(function () {
  var __private = {
    setLayer: function (obj) {
      'use strict';

      var container = gu.ui.root;

      // check valid
      if (!container) { gu.log.e("gu.ui.root is null in gu.ui.factory.view.setLayer()."); return; }

      this.level = gu.game.LAYER.VIEW;

      // remove old layer
      container.removeChildByTag(this.level);

      // create new layer
      if (_.isFinite(obj)) { obj = this.createLayer(obj); }
      gu.ui.layers.view = this.layer = obj;
      if (!this.layer) { return; }

      container.addChild(this.layer, this.level, this.level);
      obj.treeNode.order = this.level;
      this.layer.register();
    },
    createLayer: function (sceneId) {
      'use strict';

      switch (sceneId) {
        case gu.game.SCENE.LOADING:
          break;
        case gu.game.SCENE.CITY:
          return new gu.ui.view.LayerViewCity();
        case gu.game.SCENE.WORLD:
          break;
        default:
          gu.log.e("LayerFactoryView.createLayer(), sceneId(" + sceneId + ") is invalid.");
          break;
      }
    },
    reset: function () { this.layer = null; }
  };

  gu.ui.factory.view = {
    setLayer: function (obj) { __private.setLayer(obj); },
    reset: function () { __private.reset(); }
  };

} ());