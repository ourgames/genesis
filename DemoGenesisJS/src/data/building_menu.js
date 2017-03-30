require('data/building_type.js');

(function () {

  var __private = {
    BUTTON_ICON: {
      INFO: 'building_buttons_icon_info.png',
      UPGRADE: 'building_buttons_icon_upgrade.png'
    }
  };

  gu.data.building.menu = {
    city_hall: {
      title: '主城', buttons: [
        { cmd: 'info', top: { type: 0 }, mid: { type: 1, icon: __private.BUTTON_ICON.INFO, name: '信息' }, bottom: { type: 0 } },
        { cmd: 'upgrade', top: { type: 0 }, mid: { type: 1, icon: __private.BUTTON_ICON.UPGRADE, name: '升级' }, bottom: { type: 0 } },
        { cmd: 'train', top: { type: 0 }, mid: { type: 2, gold_amount: '255', name: '训练' }, bottom: { type: 0 } }
      ]
    },
    range: {
      title: '靶场', buttons: [
        { cmd: 'accelerate', top: { type: 2, gold_amount: '125' }, mid: { type: 2, gold_amount: '255', name: '加速' }, bottom: { type: 1, info: '100天' } },
        { cmd: 'info', top: { type: 1, info: '详细信息' }, mid: { type: 1, icon: __private.BUTTON_ICON.INFO, name: '信息' }, bottom: { type: 0 } },
        { cmd: 'upgrade', top: { type: 0 }, mid: { type: 1, icon: __private.BUTTON_ICON.UPGRADE, name: '升级' }, bottom: { type: 0 } },
        { cmd: 'train', top: { type: 0 }, mid: { type: 2, gold_amount: '255', name: '训练' }, bottom: { type: 0 } }
      ]
    },
    stable: {
      title: '马厩', buttons: [
        { cmd: 'accelerate', top: { type: 2, gold_amount: '125' }, mid: { type: 2, gold_amount: '255', name: '加速' }, bottom: { type: 1, info: '100天' } },
        { cmd: 'info', top: { type: 1, info: '详细信息' }, mid: { type: 1, icon: __private.BUTTON_ICON.INFO, name: '信息' }, bottom: { type: 0 } },
        { cmd: 'upgrade', top: { type: 0 }, mid: { type: 1, icon: __private.BUTTON_ICON.UPGRADE, name: '升级' }, bottom: { type: 0 } },
        { cmd: 'train', top: { type: 0 }, mid: { type: 2, gold_amount: '255', name: '训练' }, bottom: { type: 0 } },
        { cmd: 'lotto', top: { type: 0 }, mid: { type: 2, gold_amount: '255', name: '抽奖' }, bottom: { type: 0 } }
      ]
    },
    barracks: {
      title: '兵营', buttons: [
        { cmd: 'accelerate', top: { type: 2, gold_amount: '125' }, mid: { type: 2, gold_amount: '255', name: '加速' }, bottom: { type: 1, info: '100天' } },
        { cmd: 'info', top: { type: 1, info: '详细信息' }, mid: { type: 1, icon: __private.BUTTON_ICON.INFO, name: '信息' }, bottom: { type: 0 } },
        { cmd: 'upgrade', top: { type: 0 }, mid: { type: 1, icon: __private.BUTTON_ICON.UPGRADE, name: '升级' }, bottom: { type: 0 } },
        { cmd: 'train', top: { type: 0 }, mid: { type: 2, gold_amount: '255', name: '训练' }, bottom: { type: 0 } }
      ]
    }
  };

} ());
