require('data/game_config.js');
require('ui/manager/manager_building.js');
require('ui/manager/manager_dialog.js');

(function () {
  __private = {
    TYPE: {
      NONE: 0,
      SCENE: 1,
      BUILD: 2,
      DIALOG: 3,
      AREA: 4
    },

    // navigation history, used to 'go back'
    history: [],
    // current position, todo: change to LOADING
    currentPosition: { scene: gu.game.SCENE.CITY },

    // switch to another scene
    toScene: function (sceneId) {
      gu.ui.root.toScene(sceneId);
    },
    // go to a building
    toBuilding: function (block) {
      if (!block) { return; }
      if (this.currentPosition.scene != gu.game.SCENE.CITY) {
        this.deferredDestin = { type: this.TYPE.BUILD, id: block };
        toScene(gu.game.SCENE.CITY);
        return; // navigation will continue after scene switch event is received.
      }

      if (this.deferredDestin) { this.deferredDestin.type = this.TYPE.NONE; }
      this.closeAllDialogs();
      this.focusBuilding(block);
    },
    // go to a dialog
    toDialog: function (dialogId, ctrlName, param) {
      // check the resource

    },
    // go to a position in world view
    toArea: function (x, y) {

    },
    // event handlers
    _onSceneOpen: function (sceneId) {

    },
    _onSceneClosed: function (sceneId) {

    },
    _onDialogOpen: function (dlg) {

    },
    _onDialogClosed: function (dlg) {

    },
    closeAllDialogs: function () {
      gu.manager.dialog.closeAll();
    },
    focusBuilding: function (block) {
      var building = gu.manager.building.getBuilding(block);
      if (!building) {
        gu.log.i('build of block [' + building + '] cannot be found by manager.building.getBuilding()');
        return;
      }

      gu.ui.layers.view.focus(building.clickRange);
    }
  };

  gu.manager.navigation = {
    toScene: function (sceneId) { __private.toScene(sceneId); },
    toBuilding: function (type) { __private.toBuilding(type); },
    toArea: function (x, y) { __private.toArea(x, y); }
  };

} ());