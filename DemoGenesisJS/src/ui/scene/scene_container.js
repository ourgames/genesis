require('ui/util/layer_debug.js');
require('ui/factory/layer_factory_prompt.js');
require('ui/factory/layer_factory_ui.js');
require('ui/factory/layer_factory_view.js');
require('ui/manager/manager_navigation.js');
require('ui/manager/manager_dialog.js');
require('ui/manager/manager_event.js');
require('ui/manager/manager_prompt.js');

gu.ui.scene.SceneContainer = gu.ui.BaseScene.extend({
  title: gu.locale.text.view_city,

  createCanvas: function () {
    'use strict';
    this.uiHelper = gu.ui.helper;
    gu.debug.canvas = new gu.ui.LayerDebug();
    gu.debug.canvas.install(this);

    gu.ui.root = this;
    gu.manager.navigation.toScene(gu.game.SCENE.CITY);
  },
  toScene: function (sceneId) {
    'use strict';

    //this.uiHelper.cleanCurrentSceneData();

    gu.manager.prompt.init();
    gu.manager.dialog.init();
    gu.ui.factory.ui.setLayer(sceneId);
    gu.ui.factory.view.setLayer(sceneId);

    // todo: raise scene loading-finished event
  },
  update: function (delta) {
    gu.manager.event.update(delta);
    gu.manager.buildingQueue.update(delta);
  },
  onEnter: function () {
    this._super();
    this.scheduleUpdate();
  },
  onExit: function () {
    'use strict';
    this._super();
    this.unscheduleUpdate();
    gu.manager.prompt.reset();
    gu.manager.dialog.reset();
    gu.ui.factory.view.reset();
    gu.ui.factory.ui.reset();
  }
});
