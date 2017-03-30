require('base/util.js');
require('data/game_config.js');

(function () {

  var __private = {
    stack: [],
    closeAll: function () {

    },
    init: function () {
      if (this.root) {
        this.closeAll();
      }
      else {
        this.root = cc.Node.create();
        this.level = gu.game.LAYER.DIALOG;
        this.register();
        gu.ui.layers.dialog = this.root;
        gu.ui.root.addChild(this.root, this.level, this.level);
      }
    },
    open: function (dialog) {
      this.stack.push(dialog);
      this.root.addChild(dialog);
      dialog.register();
      gu.ui.factory.ui.setLayer(dialog.getUI());
      dialog.onOpen();
    },
    pop: function () {
      var dialogCount = this.stack.length;
      if (dialogCount < 1) { return; }
      var dialog = this.stack.pop();
      dialog.onClose();
      dialog.unregister();
      dialog.removeFromParent(true);
      dialogCount--;
      if (dialogCount > 0) {
        dialog = this.stack[dialogCount - 1];
        gu.ui.factory.ui.setLayer(dialog.getUI());
      }
      else {
        gu.ui.factory.ui.setLayer(gu.game.SCENE.CITY);
      }
    },
    reset: function () {
      this.root = null;
    },
    register: function () {
      this.root.treeNode = new gu.ui.TreeNode({ name: 'layer_dialog', obj: this.root, order: this.level });
    },
  };
  gu.manager.dialog = {};

  gu.util.linkPrivate([
    'closeAll', //
    'reset',    //
    'open',     // (dialog)
    'pop',      // 
    'init'      //
  ], gu.manager.dialog, __private);

} ());