gu.datetime = {
  // 把秒数转换成时分秒格式 00:00:00
  toTimeString: function (seconds) {
    if (!_.isFinite(seconds) || seconds <= 0) { return '00:00:00'; }

    var pad = function (value) {
      return value < 10 ? '0' + value.toFixed() : value.toFixed();
    };

    var dt = new Date(0, 0, 0, 0, 0, seconds);
    return pad(dt.getHours()) + ':' + pad(dt.getMinutes()) + ':' + pad(dt.getSeconds());
  }
};