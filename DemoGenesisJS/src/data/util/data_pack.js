gu.data.DataPack = cc.Class.extend({
  ctor: function(data) {
    this.getData = this._getData.bind(this, data);
  },
  _getData: function(data, path) {
    if (!path) { return this.clone(data); }

    var arr = path.split('.');
    var len = arr.length;
    for(var i = 0; i < len; i++) {
      if (!path) { break; }
      if (gu.inspector.isNullOrUndefined(data)) { return data; }
      data = data[arr[i]];
    }
    return this.clone(data);
  },
  clone: function(data) {
    return JSON.parse(JSON.stringify(data));
  }
});