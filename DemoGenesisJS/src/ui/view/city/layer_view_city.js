require('ui/util/viewport_helper.js');
require('ui/util/layer_debug.js');
require('ui/view/city/layer_view_city_upper.js');
require('ui/view/city/layer_view_city_background.js');
require('ui/manager/manager_building.js');
require('data/building_list.js');

gu.ui.view.LayerViewCity = gu.ui.BaseCSDLayer.extend({
  harvestTouchIndex: -1,
  configCSD: function () {
    'use strict';
    this._super();

    this.viewSize = cc.size(3570, 2040);
    this.name = 'layer-view-city';

    // clickRange includes all the screen to customize the event handling
    this.treeNode.clickRange = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
    this.treeNode.onClick = this.onClick;
  },
  loadCSD: function () {
    'use strict';

    // 城市下层，包括建筑、树木等
    // create background, which including buildings, trees and so on
    this.layerBackground = new gu.ui.view.LayerViewCityBackground();
    // 调用bake方法缓存图层的绘制内容以改善性能 bake to cache the layer to optimize rendering
    // this.layerBackground.bake();

    // 城市上层，包括天气，飞鸟等
    // create upper layer, which including weather, birds and so on
    this.layerUpper = new gu.ui.view.LayerViewCityUpper();
    // 辅助debug显示的图层 just for debug, show something on top of the layer
    this.layerDebug = new gu.ui.LayerDebug();

    // 添加到根节点 add them to root
    this.root = cc.Node.create();
    this.root.addChild(this.layerBackground);
    this.root.addChild(this.layerUpper);
    this.root.addChild(this.layerDebug);
    this.addChild(this.root);

    // viewportHelper是根据查找对象的contentNode节点并进行控制的，所以这里给contentNode属性赋值
    // make root the 'contentNode', so the viewportHelper can control it
    this.controls.contentNode = this.root;

    var buildingManager = gu.manager.building;
    buildingManager.init(this.layerBackground, this.layerUpper);
    var buildingList = gu.data.building.initList.getData('');
    for (var x = 0, count = buildingList.length; x < count; x++) {
      var info = buildingList[x];
      buildingManager.createBuilding(info.type, info.level, info.block);
    }
  },
  bindTouchEvent: function () {
    'use strict';
    var _this = this;

    this.touchListener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ALL_AT_ONCE,
      swallowTouches: false,
      onTouchesBegan: function (touches, event) {
        // 找出第一个点击到采集按钮的触摸点 get the first harvest touch
        var harvestNode = null;
        var touch = null;
        for (var i = 0, len = touches.length; i < len; ++i) {
          harvestNode = _this.checkHarvest(touches[i]);
          if (harvestNode) {
            harvestNode.onHarvest();
            _this.harvestTouchIndex = i;
            touches.splice(i, 1); break;
          }
        }
        // 剩下的触摸点用于点击拖放等其他操作 left touches to handle click/viewport
        var touchCount = touches.length;
        if (touchCount === 0) { return; }
        // leave remains touches to handle click/viewport
        if (touchCount == 1) {
          _this.clickDownPos = touches[0].getLocation();
        }
        // 事件传递给viewportHelper进行拖拽/缩放 pass event to viewportHelper to do the dragging/zooming
        _this.viewportHelper.onTouchesBegan(touches, event);
        return true;
      },
      onTouchesMoved: function (touches, event) {
        // 找出第一个点击到采集按钮的触摸点 get the first harvest touch
        if (_this.harvestTouchIndex >= 0) {
            _this.harvest(touches[_this.harvestTouchIndex]);
            touches.splice(_this.harvestTouchIndex, 1);
        } 
        // 剩下的触摸点用于点击拖放等其他操作 left touches to handle click/viewport
        var touchCount = touches.length;
        if (touchCount === 0) { return; }

        // 事件传递给viewportHelper进行拖拽/缩放 pass event to viewportHelper to do the dragging/zooming
        _this.viewportHelper.onTouchesMoved(touches, event);
      },
      onTouchesEnded: function (touches, event) {
        // 找出第一个点击到采集按钮的触摸点 get the first harvest touch
        if (_this.harvestTouchIndex >= 0) {
            touches.splice(_this.harvestTouchIndex, 1);
            _this.harvestTouchIndex = -1;
        } 

        // 剩下的触摸点用于点击拖放等其他操作 left touches to handle click/viewport
        var touchCount = touches.length;
        if (touchCount === 0) { return; }

        if (touches.length == 1) {
          if (gu.math.p.distance(_this.clickDownPos, touches[0].getLocation()) < 5) {
            _this.onClick(touches[0]);
          }
        }
        // 事件传递给viewportHelper进行拖拽/缩放 pass event to viewportHelper to do the dragging/zooming
        _this.viewportHelper.onTouchesEnded(touches, event);
      }
    });
    cc.eventManager.addListener(this.touchListener, this);
  },
  onEnter: function () {
    'use strict';
    this._super();

    // 创建并绑定到一个视图控制器 bind to ViewportHelper
    this.viewportHelper = new gu.ui.ViewportHelper();
    this.viewportHelper.init(this, this.viewSize);
    this.viewportHelper.onUpdate = this.onViewUpdate;
    this.viewportHelper.onNavFinished = this.onNavFinished;
    this.bindTouchEvent();

    // 开启帧事件 tick
    this.scheduleUpdate();
  },
  onExit: function () {
    'use strict';
    this._super();

    // 清理事件和对象 clean up
    this.unscheduleUpdate();
    this.touchListener = null;
    this.viewportHelper = null;

    gu.manager.building.reset();
  },
  update: function (delta) {
    this.viewportHelper.update(delta);
  },
  onClick: function (touch) {
    'use strict';

    // handle building menus
    if (gu.manager.building.onClick(touch)) { return; }

    // convert to local coordinate and hit-test
    var point = this.controls.contentNode.convertTouchToNodeSpace(touch);
    var result = gu.ui.helper.enumerateNodes(
      function (node) {
        if (!node) { return false; }
        if (gu.inspector.isFunction(node.hittest)) { return node.hittest(point, touch); }
        return node && node.clickRange && cc.rectContainsPoint(node.clickRange, point);
      },
      function (node, hittestResult) {
        node.onClick(hittestResult);
      },
      this.treeNode);
  },
  checkHarvest: function (touch) {
    return gu.ui.helper.enumerateNodes(
      function (node) {
        if (!node) { return false; }
        if (gu.inspector.isFunction(node.hitHarvest)) { return node.hitHarvest(touch); }
      }, null, this.treeNode);
  },
  harvest: function(touch) {
    var harvestNode = this.checkHarvest(touch);
    if (harvestNode) { harvestNode.onHarvest(); }
  },
  register: function () {
    // 注册子图层 register sub-layers
    this.layerUpper.register(this.treeNode);
    this.layerBackground.register(this.treeNode);
  },
  // 绘制注册控件的区域 draw position of each registered control
  onViewUpdate: function (_this) {
    _this.layerDebug.clear();
    gu.ui.helper.enumerateNodes(null, function (node) {
      if (node && node.clickRange) {
        _this.layerDebug.addRect(node.clickRange);
      }
    }, _this.treeNode, true);
  },
  focus: function (boundary, to) {
    this.viewportHelper.focus(boundary, to);
  },
  save: function () {
    this.viewportHelper.save();
  },
  restore: function (duration) {
    this.viewportHelper.restore(duration);
  },
});