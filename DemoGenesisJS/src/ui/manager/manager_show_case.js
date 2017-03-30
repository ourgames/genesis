require('ui/base/base_scene.js');
require('ui/base/base_csd_layer.js');
require('base/locale.js');

require('ui/scene/scene_container.js');

require('test/__particle.js');
require('test/__jsb.js');
require('test/__viewport.js');
require('test/__touch.js');
require('test/__grammar.js');

(function () {
  var __ = gu.test;
  var __private = {
    index: 0,
    factory: [
      function () { return new __.SceneBase(new __.LayerGrammar(), gu.locale.text.grammar); },
      function () { return new gu.ui.scene.SceneContainer(); },
      function () { return new __.SceneBase(new __.LayerTouch(), gu.locale.text.touch_event); },
      function () { return new __.SceneBase(new __.LayerParticle(), gu.locale.text.particle); },
      function () { return new __.SceneBase(new __.LayerViewPort(), gu.locale.text.viewport); },
      function () { return new __.SceneBase(new __.LayerJSB(), gu.locale.text.jsbinding); },
    ],
    next: function () {
      var scene = this.factory[this.index++]();
      if (this.index >= this.factory.length) { this.index = 0; }
      return scene;
    }
  };
  gu.manager.showcase = {
    next: function () { return __private.next(); }
  };
})();

