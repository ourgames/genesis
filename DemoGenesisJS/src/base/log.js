/**
 * 日志类 Log 
 */

require('base/o2s.js');

(function () {
  gu.log = {
    e: cc.error,    // 按Error级别输出日志 output log as Error
    w: cc.warn,     // 按Warning级别输出日志 output log as Warning
    i: cc.log,      // 按Info级别输出日志 output log as Info
    
    /**
     * 用info级别打印一个对象的内容 convert object to a JSON string and output as info log
     * 如果设置了replacer，转换器在检查对象的每个属性和子属性时，都会尝试调用replacer(属性名, 属性值)，如果返回值不为空，则使用replacer的返回内容作为对应属性的字符串化结果。
     * if replacer is set, for each property and sub-property of the object, the translation tries calling replacer(propertyName, propertyValue).
     *   if return value of the function is not empty,  the translation use it as the result for the property.
     * 
     * @param {any} obj
     * @param {string} des 对象的描述 description of the object
     * @param {function (key, value)} replacer 自定义替换函数，根据key, value返回自定义的字符串 customize function: with key/value return customized string 
     */
    o: function (obj, des, replacer) {
      this.i((des ? des + ' = ' : '') + gu.o2s.sAny(obj, null, replacer));
    },

    /**
     * 使用error级别打印函数内的错误，包括错误原因，函数参数值，位置和堆栈
     * print error in a function, including reason, parameters, position and calling stack
     * 
     * @param {any} reason 错误的原因描述 description of the problem
     * @param {argument} arglist 应该总是传入arguments，代表调用位置所在函数的参数列表 should always be arguments, which is the argument list of the calling function
     * @param {Error} error 值应该总是new Error()因为它会包含调用位置的调用堆栈 should always be new Error(), which contains full calling stack
     */
    functionError: function(reason, arglist, error) {
      this.e(gu.o2s.sFunErr(reason, arglist, error));
    }
  };
} ());
