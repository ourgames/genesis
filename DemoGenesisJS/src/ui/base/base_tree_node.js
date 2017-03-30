require('base/math.js');
require('base/debug.js');
require('base/underscore.js');

(function () {

  var __type = 'TreeNode';

  gu.ui.TreeNode = cc.Class.extend({
    // name : name of the node
    // object : cocos2d object
    // parent : parent node
    // children : children nodes
    // onClick : click-event handler
    // clickRange : valid range for click-event,
    // order : z-order

    ctor: function (obj) {
      if (!obj) { return; }
      _.keys(obj).forEach(function (value) {
        this[value] = obj[value];
      }, this);
    },
    // register node to ui tree for navigation and other stuff
    addToParent: function (parent) {
      'use strict';
      if (!parent) { return; }
      parent.children = parent.children || [];
      parent.children.push(this);
      parent.children.needSort = true;
      this.parent = parent;
    },
    removeFromParent: function () {
      var parent = this.parent;
      if (!parent) { return; }
      parent.children = _.without(parent.children, this);
    },
    replaceChild: function (oldChild, newChild) {
      if (!this.children) { return; }
      var count = this.children.length;
      for (var i = 0; i < count; i++) {
        if (this.children[i] == oldChild) {
          this.children[i] = newChild;
          return;
        }
      }
    },
    getType: function () {
      return __type;
    }
  });
} ());

(function () {

  var __type = "Tree";
  gu.ui.Tree = cc.Class.extend({
    ctor: function (root) {
      if (root) {
        this.root = root;
      }
      else {
        this.reset();
      }
    },
    reset: function () {
      this.root = { children: [] };
    },
    // single-touch event handler - began
    onTouchBegan: function (touch, event) {
      'use strict';
      var point = touch.getLocation();
      var _this = this;
      return !!(gu.ui.helper.enumerateNodes(
        function (data) {
          return data && data.clickRange && cc.rectContainsPoint(data.clickRange, point);
        },
        function (data) {
          _this.touchingNode = data;
        },
        this.root));
    },
    // single-touch event handler - moved
    onTouchMoved: function (touch, event) {
      'use strict';
    },
    // single-touch event handler - end
    onTouchEnded: function (touch, event) {
      'use strict';

      var point = touch.getLocation();
      var _this = this;
      gu.ui.helper.enumerateNodes(
        function (data) {
          return data && data.clickRange && cc.rectContainsPoint(data.clickRange, point);
        },
        function (data) {
          if (_this.touchingNode == data) {
            if (data && data.onClick) {
              data.onClick(touch);
            }
          }
        }, this.root);
      this.touchingNode = null;
    },
    getType: function () { return __type; }
  });
} ());