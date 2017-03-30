require('base/o2s.js');
require('base/log.js');
require('base/util.js');

gu.debug = {
  assert: cc.assert,
  // 打印当前调用栈 print calling stack
  trace: function () {
    var stack = gu.o2s.fStack(new Error().stack);
    gu.log.i(' ---------- [ callstack ] ----------\n' + stack);
    stack.forEach(function(value) {
      gu.log.i('     at ' + value);
    });
  },
};
