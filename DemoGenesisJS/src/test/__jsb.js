require('base/locale.js');
require('test/__base_scene.js');
require('data/net_protocol.js');

cc.defineGetterSetter(PseudoResponse.prototype, 'code', PseudoResponse.prototype.getCode, PseudoResponse.prototype.setCode);
cc.defineGetterSetter(PseudoResponse.prototype, 'content', PseudoResponse.prototype.getContent, PseudoResponse.prototype.setContent);

gu.test.LayerJSB = gu.test.LayerBase.extend({
  manager: null,
  configCSD: function () {
    this._super();
    this.csdName = res.layerJSBinding;
    this.controlNames.push('labelInfo');
    this.buttons.push('buttonSync', 'buttonAsync');
  },
  onClick: function (button) {
    if (button == 'buttonSync') { return this.onButtonSyncClicked(); }
    if (button == 'buttonAsync') { return this.onButtonAsyncClicked(); }
  },
  onButtonSyncClicked: function () {
    this.output('sync button clicked');
    var self = this;
    this.manager.connect('127.0.0.1', '8077', function (code, text) {
      self.output('DataManager.connect() [' + code + '|' + text + ']');
    });
  },
  onButtonAsyncClicked: function () {
    this.output('async button clicked');
    this.output('DataManager.request()');
    var self = this;
    var requestHead = {
      type: MsgType.c2s_test_data
    };
    var request = {
      color: 0xFF00,
      name: 'test data name',
      temp: 'test data temp',
      weight: 'test data weight',
      halo: 'test data halo',
      trail: 'test data trail'
    };
    this.manager.request(JSON.stringify(requestHead), JSON.stringify(request), function (code, response) {
      self.output('Response is (' + code + ') ' + '[' + response + ']');
    });
  },
  ctor: function () {
    this._super();
    this.manager = DataManager.instance();
    return true;
  }
});
