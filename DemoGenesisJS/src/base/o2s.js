require('base/inspector.js');

(function () {

  var __type = gu.inspector;
  var __private = {
    // config for object stringify
    oConfig: {
      maxFunction: 30,
      selfFunctionOnly: true,
    },
    // convert object to simple string
    simple: function (obj) {
      if (obj.__instanceId) { return '[object ' + obj.__instanceId + ']'; }
      return '[object ' + __type.t(obj) + ']';
    },
    // convert point to string with description
    sPt: function (pt, des) {
      if (!pt) { return this.sNil(pt, des); }
      return '[' + (des || 'point') + ' x: ' + this.sNum(pt.x) + ', y: ' + this.sNum(pt.y) + ']';
    },
    // convert rect to string with description
    sRect: function (rect, des) {
      if (!rect) { return this.sNil(rect, des); }
      return '[' + (des || 'rect') + ' x: ' + this.sNum(rect.x) + ', y: ' + this.sNum(rect.y) + ', w: ' + this.sNum(rect.width) + ', h:' + this.sNum(rect.height) + ']';
    },
    // convert null or undefined to string with description
    sNil: function (o, des) {
      return des ? ('[' + des + ': ' + obj + ']') : ('' + o);
    },
    //  convert any object to JSON string
    sAny: function (obj, stack, replacer) {
      var type = __type.t(obj);
      switch (type) {
        case 'undefined': return this.sNull();
        case 'string': return this.sStr(obj);
        case 'number': return this.sNum(obj);
        case 'boolean': return this.sBool(obj);
        case 'Object': case 'object': return this.sObj(obj, stack, replacer);
        case 'Array': return this.sArray(obj, stack, replacer);
        case 'Map': return this.sMap(obj, stack, replacer);
        case 'Set': return this.sSet(obj, stack, replacer);
        case 'Error': return this.sErr(obj);
        case 'Date': case 'RegExp': return '"' + obj.toString() + '"';
        default:
          if (__type.isCocos(obj)) { return this.sCocos(obj, stack, replacer); }
          var str = obj.toString();
          if (str) { return str; }
          return '"[object ' + type + ']"';
      }
    },
    //  convert Object to JSON string
    sObj: function (obj, stack, replacer) {
      stack = stack || new Set();
      if (stack.has(obj)) { return this.sStr(this.simple(obj)); }
      stack.add(obj);
      var str = '{';
      var first = true;
      var functions = null;
      var shouldOutputFunctions = (!this.oConfig.selfFunctionOnly || stack.size == 1) && this.oConfig.maxFunction > 0;
      for (var key in obj) {
        if (obj.visibleKeys && visibleKeys.indexOf(key) < 0) { continue; }
        if (obj.invisibleKeys && invisibleKeys.indexOf(key) >= 0) { continue; }
        var value = obj[key];
        if (__type.t(value) == 'function') {
          if (shouldOutputFunctions) {
            functions = functions || [];
            if (functions.length < this.oConfig.maxFunction + 1) {
              functions.push(functions.length == this.oConfig.maxFunction ? '...' : key);
            }
          }
          continue;
        }
        if (!first) { str += ','; } else { first = false; }
        if (replacer) {
          value = replacer(key, value);
        }
        str += '"' + key + '":' + this.sAny(value, stack, replacer);
      }

      if (functions) {
        if (!first) { str += ','; }
        str += '"function" : ' + this.sArray(functions);
      }
      str += '}';
      return str;
    },
    // convert undefined to json value
    sNull: function () {
      return 'null';
    },
    // convert boolean to string
    sBool: function (bool) {
      return '' + bool;
    },
    // convert number to formatted string
    sNum: function (num) {
      if (typeof (num) == 'undefined') { return 'null'; }
      if (Number.isNaN(num)) { return '"NaN"'; }
      if (!Number.isFinite(num)) { return '"Infinite"'; }
      if (Number.isInteger(num)) { return num.toFixed(0); }

      return num.toFixed(2);
    },
    // bracket string with ""
    sStr: function (str) {
      return '"' + str + '"';
    },
    // convert Array to JSON string
    sArray: function (arr, stack, replacer) {
      stack = stack || new Set();
      if (stack.has(arr)) { return this.sStr(this.simple(arr)); }
      stack.add(arr);
      var str = '[';
      var first = true;
      arr.forEach(function (obj) {
        if (!first) { str += ','; } else { first = false; }
        str += this.sAny(obj, stack, replacer);
      }, this);
      str += ']';
      return str;
    },
    // convert Map to JSON string
    sMap: function (map, stack, replacer) {
      stack = stack || new Set();
      if (stack.has(map)) { return this.sStr(this.simple(map)); }
      stack.add(map);
      var str = '{';
      var first = true;
      map.forEach(function (obj, key) {
        if (!first) { str += ','; } else { first = false; }
        str += '"' + key + '":';
        str += this.sAny(obj, stack, replacer);
      }, this);
      str += '}';
      return str;
    },
    // convert Set to JSON string
    sSet: function (set, stack, replacer) {
      return this.sArray(set, stack, replacer);
    },
    sCocos: function (obj, stack, replacer) {
      if (__type.props(obj).length == 1) { return this.sStr(obj.toString()); }
      return this.sObj(obj, stack, replacer);
    },
    sErr: function(err) {
      if (!err) { return '""'; }
      return this.sObj({ 
        file: err.fileName.replace(gu.util.getAppPath(), ''), 
        line: err.lineNumber, 
        column: err.columnNumber, 
        msg: err.message, 
        stack: this.fStack(err.stack)
      });
    },
    fStack: function(stack) {
      stack = stack.split('\n');
      var appPath = gu.util.getAppPath();
      stack.forEach(function(value, index, arr) {
        if(!value) { return; }
        arr[index] = value.replace(appPath, ' ');
      });
      return stack;//.join('\n');
    },
    sFunErr: function(reason, arglist, error) {
      error.message = { reason: reason, arguments: arglist ? Array.from(arglist) : [] };
      return this.sErr(error);
    }
  };

  gu.o2s = {};

  [
    'simple',   // convert object to simple string
    'sPt',      // convert point to string with description
    'sRect',    // convert rect to string with description
    'sNil',     // convert null or undefined to string with description
    'sAny',     //  convert any object to JSON string
    'sObj',     //  convert Object to JSON string
    'sBool',    // convert boolean to string
    'sNum',     // convert number to formatted string
    'sStr',     // bracket string with ""
    'sArray',   // convert Array to JSON string
    'sMap',     // convert Map to JSON string
    'sSet',     // convert Set to JSON string
    'sErr',     // convert Error to JSON string
    'fStack',// format stack string of Error
    'sFunErr',  // compose a function error and convert it to string
  ].forEach(function (value) {
    this[value] = function () { return __private[value].apply(__private, arguments); };
  }, gu.o2s);

} ());
