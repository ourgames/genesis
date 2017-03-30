require('base/util.js');
require('data/game_config.js');
require('ui/prompt/prompt_instant_tip.js');

(function () {
  var __layers = {
    INSTANT_TIP : 10,
  };
  var __private = {
    closeAll: function () {

    },
    init: function () {
      if (this.root) {
        this.closeAll();
      }
      else {
        this.root = cc.Node.create();
        this.level = gu.game.LAYER.PROMPT;
        this.register();
        gu.ui.layers.prompt = this.root;
        gu.ui.root.addChild(this.root, this.level, this.level);
      }
    },
    showInstantTip: function (option) {
      if (!this.instantTip) {
        this.instantTip = new gu.ui.prompt.InstantTip();
        this.instantTip.x = cc.winSize.width / 2;
        this.instantTip.y = cc.winSize.height * 0.3;
        this.root.addChild(this.instantTip, __layers.INSTANT_TIP, __layers.INSTANT_TIP);
      }
      this.instantTip.setup(option);
      this.instantTip.show();
    },
    reset: function () {
      this.root = null;
    },
    register: function () {
      this.root.treeNode = new gu.ui.TreeNode({ name: 'layer_prompt', obj: this.root, order: this.level });
    },
  };
  gu.manager.prompt = {};

  gu.util.linkPrivate([
    'closeAll',
    'reset',
    'showInstantTip',
    'init'
  ], gu.manager.prompt, __private);

} ());