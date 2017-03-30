require('base/debug.js');
require('ui/manager/manager_dialog.js');
require('ui/dialog/building/dialog_building_upgrade.js');

gu.ui.building.buildingMenuHandler = {
  eCommand: {
    UPGRADE: 'upgrade',
    INFO: 'info',
    TRAIN: 'train'
  },
  onMenu: function (buildingData, button) {
    gu.log.i('building button clicked with [' + button.id + ' | ' + button.name + ']');
    if (!this.levelData) { this.levelData = gu.data.building.level.getData(); }

    if (button.option.cmd == this.eCommand.UPGRADE) {
      var dialog = new gu.ui.dialog.DialogBuildingUpgrade();

      var entry = this.levelData[buildingData.type];
      var option = _.find(entry.detail, function (item) {
        return item.level == buildingData.level + 1;
      });
      option.title = entry.title;
      option.description = entry.description;
      dialog.setup(buildingData, option);
      gu.manager.dialog.open(dialog);
    }
  }
};