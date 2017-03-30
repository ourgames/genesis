/**
 * 
 */

gu.ui.BaseCSDUtil = {
  init: function () {
    this.configCSD();
    this.loadCSD();
    return true;
  },
  // 配置csd相关参数  prepare configurations for CSD loading 
  configCSD: function () {
    // 需要引用的csd节点名称 name of the csd nodes that need to use later  
    this.controlNames = this.controlNames || [];
    // 需要处理点击事件的csd节点名称 name of the csd nodes that need to handle touch(click) event
    this.clickables = this.clickables || [];
    // 添加到controlNames和clickables的名字，可以通过this.controls.controlName来直接引用（基类会使用bindControlsByName()填充到this.controls)。
    // the csd nodes that added to controlNames and clickables, can be used with the style this.controls.controlName
    // (the names can be filled into this.controls with bindControlsByName())
    this.controls = this.controls || {};
    // gu.ui.tree是一个精简掉只有显示功能没有交互行为的节点后的一个ui树。
    // 每个需要处理点击事件的节点需要通过treeNode属性把自己注册到ui树上。
    // 具体的注册过程可以参考下面的register()函数
    // gu.ui.tree is a ui tree without the node not interacting and display only.
    // Every node handling touch event registers itself into the ui tree with treeNode.
    // processs of the registeration can be found in register() below
    this.treeNode = new gu.ui.TreeNode({ object: this });

    // 子类需要配置的属性包括 this.csdName, this.treeNode.name
    // sub-class should set these attributes: this.csdName, this.treeNode.name 
  },
  // 加载csd文件并完成配置 load CSD file and config
  loadCSD: function () {
    this.object = ccs.load(this.csdName, '').node;
    this.addChild(this.object);
    this.treeNode.name = this.treeNode.name || this.csdName;

    this.bindControlsByName();
  },
  // 把controlNames和clickables中的控件名字和对应的控件配置到this.controls中
  // set the name-control mapping of the controls in controlNames and clickables to this.controls
  bindControlsByName: function () {
    // bind controls with name
    var util = gu.ui.BaseCSDUtil;
    util.bindControls(this, this.controlNames);
    util.bindControls(this, this.clickables);
  },
  bindControls: function (obj, arr) {
    var uiHelper = gu.ui.helper;
    arr.forEach(function (item, index, array) {
      this.controls[item] = uiHelper.findChildByName(this.object, item);
      cc.assert(this.controls[item], 'control[' + item + '] is null when bindControls() with file [' + this.csdName + ']');
    }, obj);
  },
  // 为this.clickables中的每个控件生成TreeNode节点并注册到ui树上
  // create TreeNode for each control in this.clickables, then register it into the ui tree.
  register: function (parentNode) {
    var uiHelper = gu.ui.helper;
    if (parentNode) { this.treeNode.addToParent(parentNode); }

    if (!this.clickables || this.clickables.length === 0) { return; }

    this.clickables.forEach(function (name, index, array) {
      var obj = this.controls[name];
      new gu.ui.TreeNode({
        name: name,
        object: obj,
        clickRange: uiHelper.getGlobalBoundingBox(obj),
        onClick: function (current) {
          return function () {
            if (current && _.isFunction(current.onControlClicked)) {
              current.onControlClicked(this);
            }
            else {
              gu.log.i('control[' + this.name + '] is clicked.');
            }
          };
        } (this)
      }).addToParent(this.treeNode);
    }, this);
  },
  // 从ui树上卸载对应的TreeNode
  // remove TreeNode from ui tree.
  unregister: function () {
    this.treeNode.removeFromParent();
  },
  // 绑定当前对象的一些方法(onExit等)到对应cocos2d对象的对应方法上，这样在cocos2d对象调用这些方法时，也会调用当前对象的对应方法
  // bind some functions of current object to corresponding cocos2d object's corresponding function,
  // so when these functions of cocos2d object are called, the functions of current object is also called.
  bindNodeEvents: function () {
    var _this = this;
    ['onExit', 'onEnter'].forEach(function (value) {
      var oldFunc = _this.object[value];
      _this.object[value] = function () {
        if (_.isFunction(oldFunc)) { oldFunc.call(this); }
        var func = _this[value];
        if (_.isFunction(func)) { func.call(_this); }
      };
    });
  }
};