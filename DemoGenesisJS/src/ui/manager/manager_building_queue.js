require('ui/manager/manager_event.js');
require('base/util.js');

(function () {

  var __private = {
    queue: [],
    max: 1,
    add: function (item) {
      var found = false;
      for (var i = 0; i < this.max; i++) {
        if (!this.queue[i]) {
          this.queue[i] = item;
          found = true;
        }
      }
      if (!found) {
        if (this.queue.length >= this.max) { return; }
        this.queue.push(item);
      }
      item.duration = item.time;
    },
    update: function (delta) {
      for (var i = 0; i < this.max; i++) {
        var item = this.queue[i];
        if (!item) continue;

        var old = item.duration.toFixed();
        item.duration -= delta;
        if (item.duration.toFixed() != old) {
          if (item.duration <= 0) {
            this.queue[i] = null;
            gu.manager.event.emit({ type: 'building.upgrade.done', index: i, data: item });
          }
          else {
            gu.manager.event.emit({ type: 'building.upgrade.progress', index: i, data: item });
          }
        }
      }
    },
    getItem: function (index) {
      if (!_.isFinit(index) || index < 0) { gu.log.w('index is invalid in getDuration()'); return; }
      if (index >= this.queue.length) { gu.log.w('index >= this.queue.length in getDuration()'); return; }

      return this.queue[index];
    },
    reset: function () { this.queue = []; this.max = 1; },
    toString: function () {
      var str = '[manager.buildingQueue [';
      for (var i = 0; i < this.max; i++) {
        str += i + ':' + _.pairs(this.queue[i]) + ' ';
      }
      str += ']]';
      return str;
    }
  };

  gu.manager.buildingQueue = {
    init: function () {
      gu.manager.event.bind(this, 'building.upgrade_start');
    },
    on: function (event) {
      switch (event.type) {
        case 'building.upgrade_start':
          this.add(event.data);
          break;
        default: break;
      }
    },
  };

  gu.util.linkPrivate([
    'add',
    'update',
    'getDuration',
    'reset',
    'toString'
  ], gu.manager.buildingQueue, __private);

} ());