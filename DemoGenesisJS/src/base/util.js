(function () {

  // -----------------------------base64-------------------------------------
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error();
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';
  // -----------------------------base64-------------------------------------

  gu.util = {
    linkPrivate: function (functionArray, publicObj, privateObj) {
      if (!functionArray || !publicObj || !privateObj) { return; }
      functionArray.forEach(function (functionName) {
        this[functionName] = function () {
          return privateObj[functionName].apply(privateObj, arguments);
        };
      }, publicObj);
    },
    getAppPath : function () {
      if (!this.appPath) {
        // sample: /Users/hoolai/Library/.../DemoGenesisJS-mobile.app/src/base/util.js
        var temp = jsb.fileUtils.fullPathForFilename('base/util.js');
        this.appPath = temp.substr(0, temp.indexOf('/src/base/util.js'));
      }
      return this.appPath;
    },
    isUTF8: function (bytes) {
      var i = 0;
      while (i < bytes.length) {
        if (// ASCII
          bytes[i] == 0x09 || bytes[i] == 0x0A || bytes[i] == 0x0D ||
          (0x20 <= bytes[i] && bytes[i] <= 0x7E)) {
          i += 1;
          continue;
        }

        if ((// non-overlong 2-byte
          (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
          (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
        )) {
          i += 2;
          continue;
        }

        if ((// excluding overlongs
          bytes[i] == 0xE0 &&
          (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
          (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
        ) ||
          (// straight 3-byte
            ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
              bytes[i] == 0xEE ||
              bytes[i] == 0xEF) &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
          ) ||
          (// excluding surrogates
            bytes[i] == 0xED &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
          )) {
          i += 3;
          continue;
        }

        if ((// planes 1-3
          bytes[i] == 0xF0 &&
          (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
          (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
          (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
        ) ||
          (// planes 4-15
            (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
            (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
          ) ||
          (// plane 16
            bytes[i] == 0xF4 &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
            (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
          )) {
          i += 4;
          continue;
        }
        return false;
      }
      return true;
    },

    // -----------------------------base64 below-------------------------------------
    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    btoa: function (input) {
      for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next input index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        input.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
      ) {
        charCode = input.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
          throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    },

    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    atob: function (input) {
      input = input.replace(/=+$/, '');
      if (input.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = input.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
      }
      return output;
    },
  };
  // -----------------------------base64 above-------------------------------------
} ());
