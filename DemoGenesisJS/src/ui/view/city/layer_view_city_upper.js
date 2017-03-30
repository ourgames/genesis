
gu.ui.view.LayerViewCityUpper = gu.ui.BaseCSDLayer.extend({
  configCSD: function () {
    'use strict';
    this._super();

    this.csdName = res.layerViewCityUpper;
    this.name = 'view_city_upper';
  },
  register: function (parentNode) {
    this.treeNode.addToParent(parentNode);
  },
  addMenu: function (menu) {
    this.addChild(menu);
  }
});
