require('base/datetime.js');
require('ui/base/base_csd_layer.js');
require('ui/manager/manager_event.js');
require('ui/manager/manager_building_queue.js');

gu.ui.ui.ControlBuildingQueue = gu.ui.BaseBindNode.extend({
  TYPE: { NORMAL: 0, GOLD: 1 },
  index: 0,
  oldDuration: 0,
  configCSD: function () {
    this._super();
    this.controlNames.push('label_duration', 'iron_hammer', 'gold_hammer');
  },
  init: function () {
    this.controls.label_duration.visible = false;
    this.setType(this.TYPE.NORMAL);
  },
  setType: function (type) {
    this.controls.iron_hammer.visible = type === this.TYPE.NORMAL;
    this.controls.gold_hammer.visible = type === this.TYPE.GOLD;
  },
  onProgress: function (queue) {
    if (!queue) { return; }

    this.controls.label_duration.visible = true;
    this.controls.label_duration.setString(gu.datetime.toTimeString(queue.duration));
  },
  onDone: function () {
    this.controls.label_duration.visible = false;
  },
  on: function (event) {
    if (!event) { return; }
    switch (event.type) {
      case 'building.upgrade.progress':
        if (event.index == this.index) { this.onProgress(event.data); }
        break;
      case 'building.upgrade.done':
        if (event.index == this.index) { this.onDone(event.data); }
        break;
      default: break;
    }
  },
  onEnter: function () {
    gu.manager.event.bind(this, 'building.upgrade.progress');
    gu.manager.event.bind(this, 'building.upgrade.done');
  },
  onExit: function () {
    gu.manager.event.unbind(this);
  }
});
