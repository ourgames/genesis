require('ui/base/base_csd_util.js');

(function () {
  var __private = gu.ui.BaseCSDUtil;

  // CSD Layer基类 base class of CSD layer 
  gu.ui.BaseCSDLayer = cc.Layer.extend({
    configCSD: function () { __private.configCSD.call(this); },
    loadCSD: function () { __private.loadCSD.call(this); },
    bindControlsByName: function () { __private.bindControlsByName.call(this); },
    ctor: function () { this._super(); return __private.init.call(this); },

    register: function (parentNode) { return __private.register.call(this, parentNode); },
    unregister: function () { __private.unregister.call(this); }
  });

  // CSD Node基类 base class of CSD Node
  gu.ui.BaseCSDNode = cc.Node.extend({
    configCSD: function () { __private.configCSD.call(this); },
    loadCSD: function () { __private.loadCSD.call(this); },
    bindControlsByName: function () { __private.bindControlsByName.call(this); },
    ctor: function () { this._super(); return __private.init.call(this); },

    register: function (parentNode) { return __private.register.call(this, parentNode); },
    unregister: function () { __private.unregister.call(this); }
  });

  // 如果封装类并不对应一个完整的csd文件，而是csd文件中的一个节点，
  gu.ui.BaseBindNode = cc.Class.extend({
    ctor: function (node, parentNodeData) {
      this.object = node;
      this.bindNodeEvents();
      this.configCSD();
      __private.bindControlsByName.call(this);
      this.register(parentNodeData);

      if (_.isFunction(this.init)) { this.init(); }
    },
    node: function () { return this.object; },
    configCSD: function () {
      __private.configCSD.call(this);
      this.treeNode.object = this.object;
    },
    register: function (parentNode) { return __private.register.call(this, parentNode); },
    unregister: function () { __private.unregister.call(this); },
    bindNodeEvents: function () { __private.bindNodeEvents.call(this); }
  });
} ());