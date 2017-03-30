require('ui/base/base_ui_layer.js');
require('ui/manager/manager_dialog.js');

gu.ui.ui.LayerUIDialog = gu.ui.BaseUILayer.extend({
  configCSD: function () {
    'use strict';
    this._super();
    this.controlNames.push(
      'label_resource_stone',
      'label_resource_iron',
      'label_resource_food',
      'label_resource_wood'
    );
    this.clickables.push(
      'btn_back'
    );
    this.treeNode.name = 'layer-ui-dialog';
    this.csdName = res.layerUIDialog;
  },
  onControlClicked: function (treeNode) {
    if (!this._super(treeNode)) { return false; }

    switch (treeNode.name) {
      case 'btn_back':
        gu.manager.dialog.pop();
        break;
      default: break;
    }
  },
});