var Application = require('./application');

module.exports = (function() {

  function start() {
    window.ScreenLoader = new (require('startup/screen-loader/module'))();
    window.ScreenLoader.post('Loading application');

    window.app = new Application();
    window.app.start();
  }

  if (window.cordova) {
    document.addEventListener('deviceready', start, false);
  } else {
    $(document).ready(start);
  }
})();
