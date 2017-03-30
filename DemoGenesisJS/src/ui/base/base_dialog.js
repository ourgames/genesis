require('ui/base/base_ui_layer.js');

gu.ui.BaseDialog = gu.ui.BaseUILayer.extend({
  checkLayerRange: function () { return true; },
  getUI: function () { return new gu.ui.ui.LayerUIDialog(); },
  close: function () { gu.manager.dialog.pop(); }
});