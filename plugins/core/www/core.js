var exec = require('cordova/exec');

module.exports = {
  isPackageInstalled: function(packageName, callback) {
    exec(
      function() {
        typeof callback === 'function' && callback(true);
      },
      function() {
        typeof callback === 'function' && callback(false);
      },
      'SkritterPlugin',
      'isPackageInstalled',
      [packageName]
    );
  },
  openGooglePlay: function(packageName) {
    exec(null, null, 'SkritterPlugin', 'openGooglePlay', [packageName]);
  },
  openHanpingLite: function(text) {
    exec(null, null, 'SkritterPlugin', 'openHanpingLite', [text]);
  },
  openHanpingPro: function(text) {
    exec(null, null, 'SkritterPlugin', 'openHanpingPro', [text]);
  },
  openHanpingYue: function(text) {
    exec(null, null, 'SkritterPlugin', 'openHanpingYue', [text]);
  },
  openPleco: function(text) {
    exec(null, null, 'SkritterPlugin', 'openPleco', [text]);
  }
};
