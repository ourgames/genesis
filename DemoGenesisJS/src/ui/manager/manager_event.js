require('base/util.js');

(function () {

  var __type = 'manager.event';
  var __private = {
    handlers: new Map(),
    queue: [],
    count: 0,

    bind: function (obj, event) {
      if (!obj || !event) { return; }
      var entry = this.handlers.get(event);
      if (!entry) {
        entry = new Set();
        this.handlers.set(event, entry);
      }
      if (!entry.has(obj)) {
        entry.add(obj);
        this.count++;
      }
      // gu.log.o(this, __type, this.stringifyReplacer);
    },
    unbind: function (obj) {
      if (!obj) { return; }
      var entry;
      this.handlers.forEach(function (entry, key) {
        if (entry && entry.delete(obj)) { this.count--; }
      }, this);
      //  gu.log.o(this, __type, this.stringifyReplacer);
    },
    stringifyReplacer: function (key, obj) {
      if (key == 'parent' || key == 'treeNode') {
        return gu.o2s.simple(obj);
      }
      return obj;
    },
    // event object : { event : type, data : data, sender : sender}
    emit: function (event) {
      // push to queue, send in next frame
      this.queue.push(event);
    },
    update: function (delta) {
      if (this.queue.length < 1) { return; }

      this.queue.forEach(function (event) {
        var entry = this.handlers.get(event.type);
        if (!entry) { return; }

        entry.forEach(function (obj) {
          obj.on(event);
        }, this);
      }, this);
      this.queue = [];
    },
    reset: function () {
      this.handlers.clear();
      this.queue = [];
    },
  };

  gu.manager.event = {};

  gu.util.linkPrivate([
    'bind',     // (obj, eventType)
    'unbind',   // (obj)
    'emit',     // (event)
    'reset',    // 
    'update'    // (delta)
  ], gu.manager.event, __private);

} ());