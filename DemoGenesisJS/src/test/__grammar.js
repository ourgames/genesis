require('test/__base_scene.js');

gu.test.LayerGrammar = gu.test.LayerBase.extend({
  count: 0,
  delta: 0,
  configCSD: function () {
    this._super();
    this.csdName = res.layerGrammar;
    this.controlNames.push('labelInfo');
    this.buttons.push('buttonDynamicProperty', 'buttonMapReduce', 'buttonGenerator', 'buttonTrace', 'buttonTest');
  },
  onClick: function (button) {
    // gu.log.i(this.gen.next().value);

    var func = this['on' + button];
    if (gu.inspector.isFunction(func)) { func.call(this); }
  },
  onbuttonDynamicProperty: function () {
    // number can't have dynamic property
    try {
      var a = 1;
      a.foo = function () { return 4; };
      a.value = 3;
      gu.debug.assert(gu.inspector.isUndefined(a.foo));
      gu.debug.assert(gu.inspector.isUndefined(a.value));
      this.output('dynamic property of Number is supported');
    }
    catch (err) {
      this.output('dynamic property of Number is not supported');
    }
  },
  onbuttonMapReduce: function () {
    try {
      var e = [0, 2, 4, 8].reduce(function (a, b, i, array) { return a + b; }, 1);
      cc.log(e);
      this.output('map-reduce of Array is supported');
    }
    catch (err) {
      this.output('map-reduce of Array is not supported');
    }
  },
  onbuttonTrace: function () {
    gu.debug.trace();
    this.output('stack trace is printed in log');
  },
  onbuttonGenerator: function () {
    var _this = this;
    try {
      /* jshint ignore:start */
      var genFun = function* () {
        yield _this.count++;
      };
      var gen = genFun();
      gu.log.i(gen.next().value);
      this.output('generator is supported');
      /* jshint ignore:end */
    }
    catch (err) {
      this.output('generator is not supported');
    }
  },
  onbuttonTest: function () {
    // preserved
    try {
      var a = new Number(1);
      a.b = 3717;
      gu.log.i(a.b);

      var b = 1;
      b.a = 3555;
      gu.log.i(b.a);
    }
    catch(err) { 
      gu.log.o(err);
    }
  }
});
