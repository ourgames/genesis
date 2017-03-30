/**
 * 建筑升级对话框 building upgrade dialog
 */
require('ui/ui/layer_ui_dialog.js');
require('ui/base/base_dialog.js');
require('data/building_level.js');
require('ui/manager/manager_event.js');

gu.ui.dialog.DialogBuildingUpgrade = gu.ui.BaseDialog.extend({
  /**
   * 配置csd相关参数  prepare configurations for CSD loading 
   */
  configCSD: function () {
    // 不能省略基类的方法调用 can't be omitted
    this._super();
    // 后续方法需要引用的控件 controls to be used later
    this.controlNames.push(
      // 背景中建筑微缩的位置 mini-view
      'miniview',
      // 左上区域 top left
      'level', 'name',
      // 右上区域 top right
      'next_level_label', 'next_level', 'next_level_new_value', 'next_level_new_feature', 'next_level_description',
      // 中间的面板 mid panel
      'panel_title', 'mid_list',
      // 底部的面板 bottom
      'gold_amount', 'button_gold_label', 'button_normal_label', 'button_normal_time'
    );
    // treeNode.name只是便于在调试中识别节点，具体内容无所谓
    // treeNode.name is just used to identify the node when debugging, which could be any string
    this.treeNode.name = 'dialog-buiding-upgrade';

    // 可以点击的空间名字 controls can react click event
    this.clickables.push(
      'new_feature_next', 'new_feature_prev',
      'button_gold', 'button_normal'
    );

    // 非常重要：对应的csd文件名，这个名字被封装在 src/resource.js 文件中
    // very important：the csd filename to load，which is defined in src/resource.js
    this.csdName = res.dialogBuildinigUpgrade;
  },

  /**
   * 根据配置构建对话框的内部状态 setup dialog with option
   * 
   * @param {gu.ui.building.ControlBuilding} building 对应的建筑 the building
   * @param {any} option 构建参数 dialog options
   * @returns void
   */
  setup: function (building, option) {
    if (!building) {
      gu.log.functionError('building is null', arguments, new Error());
      return;
    }
    if (!option) {
      gu.log.functionError('option is null', arguments, new Error());
      return;
    }

    this.building = building;
    this.option = option;

    if (!this.levelInfoType) { this.levelInfoType = gu.data.building.level.getData('LEVEL_INFO_TYPE'); }
    this.controls.level.setString(building.level);
    this.controls.name.setString(building.name);
    this.controls.next_level_new_feature.visible = option.info.type == this.levelInfoType.FEATURE;
    this.controls.new_feature_next.visible = option.info.type == this.levelInfoType.FEATURE;
    this.controls.new_feature_prev.visible = option.info.type == this.levelInfoType.FEATURE;
    // todo: add feature items;
    this.controls.next_level_description.visible = option.info.type == this.levelInfoType.DESCRIPTION;
    if (this.controls.next_level_description.visible) {
      this.controls.next_level_description.setString(option.description);
    }
    this.controls.next_level_new_value.visible = option.info.type == this.levelInfoType.VALUE;
    // todo: add value items;
    this.controls.panel_title.setString(option.title);
    this.controls.gold_amount.setString(option.gold);
    this.controls.button_normal_time.setString(option.time);

    this._checkUpgradeCondition();
  },
  /**
  * 对话框打开之前需要做的处理 operations needed before dialog openning
  */
  onOpen: function () {
    // 聚焦到建筑的动画  animation of focusing to building
    gu.ui.layers.view.save();
    var viewPos = gu.ui.helper.getGlobalBoundingBox(this.controls.miniview);
    gu.ui.layers.view.focus(this.building.clickRange, viewPos);
  },
  /**
  * 对话框打开之后需要做的处理 operations needed after dialog openning
  */
  onClose: function () {
    // 恢复窗口打开前的视角 restore viewport to the state before dialog opening 
    gu.ui.layers.view.restore(gu.game.ANIMATION_DURATION.VIEW_RESTORE);
  },
  /**
   * 对话框点击事件处理函数 event handled when member of this.clickables is clicked
   * @param {gu.ui.TreeNode} treeNode 被点击的节点
   * @returns
   */
  onControlClicked: function (treeNode) {
    // 需要调用基类的处理，例如屏蔽了不可见控件对事件的响应 
    // functions of super-class is needed, e.g. screening out controls in invisible state 
    if (!this._super(treeNode)) { return false; }

    var name = treeNode.name;
    // 根据名字区分具体是this.clickable中的哪一个控件被点击了
    // by name we can tell which control is clicked
    switch (name) {
      case 'button_normal':
        gu.manager.event.emit({
          type: 'building.upgrade_start',
          data: {
            type: this.building.type,
            level: this.building.level,
            block: this.building.block,
            time: this.option.time
          }
        });
        this.close();
        break;
      case 'button_gold':
        break;
    }
  },
 /**
 * 判断升级条件是否满足 check whether the upgrade condition is met
 */
  _checkUpgradeCondition: function () {

  },
});
