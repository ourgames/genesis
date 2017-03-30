/**
 * 
 */

(function () {

  var __type = {
    // typeof的定制版 customized version of typeof
    t: function (obj) {
      if (obj === null) { return 'null'; }
      if (obj instanceof Error) { return 'Error'; }
      
      var type = typeof obj;
      if (type == 'undefined') { return type; }
      if (['number', 'boolean', 'string', 'function', 'symbol'].indexOf(type) >= 0) {
        return type;
      }
      if (type != 'object') { return type; }
      if (Array.isArray(obj)) { return 'Array'; }
      
      var objStr = obj.toString();
      var len = objStr.length;
      // if it is like '[object Sprite]'
      if (len < 32 && objStr.indexOf('[object ') === 0) {
        var temp = objStr.substr(8, len - 9); // 9 is the length of '[object '
        return temp;
      }

      return 'object';
    },
    // 是否是cocos2d对象 is a cocos2d object or not
    isCocos: function (obj) {
      if (!obj) { return false; }
      return !!obj.__nativeObj;
    },
    // 对象是否是[typeName]指定类型 is the object the [typeName] or not
    isType: function (obj, typeName) {
      if (!obj) { return false; }
      return this.t(obj) == typeName;
    },
    isUndefined: function (obj) { return obj == void 0; },
    isNull: function (obj) { return this.isType(obj, 'null'); },
    isFunction: function (obj) { return this.isType(obj, 'function'); },
    isNullOrUndefined: function (obj) { return this.isNull(obj) || this.isUndefined(obj); },
    isNumber: function (obj) { return this.isType(obj, 'number'); },
    isBoolean: function (obj) { return this.isType(obj, 'boolean'); },
    isString: function (obj) { return this.isType(obj, 'string'); },
    isSymbol: function (obj) { return this.isType(obj, 'symbol'); },
    isArray: function (obj) { return this.isType(obj, 'Array'); },
    isMap: function (obj) { return this.isType(obj, 'Map'); },
    isSet: function (obj) { return this.isType(obj, 'Set'); },
    isDate: function (obj) { return this.isType(obj, 'Date'); },
    isRegExp: function (obj) { return this.isType(obj, 'RegExp'); },
    isError: function (obj) { return this.isType(obj, 'Error'); },

    // 获取对象的所有属性 get all properties of the object
    props: function (obj) {
      if (!obj) { return; }
      var keys = [];
      for (var key in obj) {
        if (!this.isFunction(obj[key])) { keys.push(key); }
      }
      return keys;
    },
    // 获取对象的所有函数 get all functions of the object
    functions: function (obj) {
      if (!obj) { return; }
      var keys = [];
      for (var key in obj) {
        if (this.isFunction(obj[key])) { keys.push(key); }
      }
      return keys;
    }
  };

  gu.inspector = {};
  [
    't',
    'isType',
    'isUndefined',
    'isNull',
    'isNullOrUndefined',
    'isCocos',
    'isFunction',
    'isNumber',
    'isString',
    'isSymbol',
    'isArray',
    'isMap',
    'isSet',
    'isDate',
    'isRegExp',
    'props',
    'functions'
  ].forEach(function (value) {
    this[value] = function () { return __type[value].apply(__type, arguments); };
  }, gu.inspector);

} ());