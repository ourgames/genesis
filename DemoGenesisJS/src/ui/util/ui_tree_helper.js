require('base/math.js');
require('base/debug.js');
require('base/underscore.js');

gu.ui.helper = {
  // find child recursively with name
  findChildByName: function (node, name) {
    'use strict';
    var child;
    var children = node.children;
    var length = children.length;
    for (var i = 0; i < length; i++) {
      child = children[i];
      if (child.getName() == name) { return child; }

      child = this.findChildByName(child, name);
      if (child) { return child; }
    }
    return null;
  },
  getNodeBoundary: function(node) {
    var boundary = node.getBoundingBox();
    if (boundary.width === 0) {
      var width = 52 * node.scaleX;
      var height = 52 * node.scaleY;

      boundary = cc.rect(node.getPosition().x - width * 0.5, node.getPosition().y - height * 0.5,
        width, height);
    }
    return boundary;
  },
  enumerateNodes: function (check, callback, startNode, findAndContinue) {
    'use strict';
    if (!startNode || !startNode.children) { return null; }

    if (startNode.children.needSort) {
      startNode.children.sort(function (a, b) {
        if (!a || !_.isFinite(a.order)) { return 1; }
        if (!b || !_.isFinite(b.order)) { return -1; }

        if (a.order <= b.order) { return 1; }
        if (a.order > b.order) { return -1; }
      });
      startNode.children.needSort = 0;
    }
    var length = startNode.children.length;
    for (var i = 0; i < length; i++) {
      var node = startNode.children[i];
      var checkResult = null;
      if ((!check) || (checkResult = check(node))) {
        if (callback) { callback(node, checkResult); }
        if (!findAndContinue) { return node; }
      }
      var child = this.enumerateNodes(check, callback, node);
      if (check && child) { return child; }
    }
    return null;
  },
  getGlobalBoundingBox: function (node) {
    gu.debug.assert(node);
    if (!node) { return cc.rect(0, 0, 0, 0); }

    var boundary = this.getNodeBoundary(node);
    var parent = node.getParent();

    if (parent) {
      var origin = parent.convertToWorldSpace(cc.p(boundary.x, boundary.y));
      var destin = parent.convertToWorldSpace(cc.p(boundary.x + boundary.width, boundary.y + boundary.height));

      boundary = cc.rect(origin.x, origin.y, destin.x - origin.x, destin.y - origin.y);
    }
    return boundary;
  },
  getBoundingBoxInLayer: function (layer, node) {
    gu.debug.assert(layer && node, "layer or node is null in gu.ui.helper.getBoundingBoxInLayer()");
    if (!layer || !node) { return null; }
    var boundary = this.getGlobalBoundingBox(node);

    var origin = layer.convertToNodeSpace(cc.p(boundary.x, boundary.y));
    var destin = layer.convertToNodeSpace(cc.p(boundary.x + boundary.width, boundary.y + boundary.height));

    boundary = cc.rect(origin.x, origin.y, destin.x - origin.x, destin.y - origin.y);

    return boundary;
  },
};


