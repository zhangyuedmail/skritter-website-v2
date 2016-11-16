const Application = require('./application');

module.exports = (function() {

  function start() {
    window.ScreenLoader = new (require('startup/screen-loader/module'))();
    window.ScreenLoader.post('Loading application');

    window.app = new Application({rootSelector: 'body'});

    WebFont.load({
      custom: {
        families: ['DFKaiSho-Md', 'KaiTi', 'Roboto Slab', 'Ubuntu'],
        urls: window.cordova ? ['fonts-cordova.css'] : ['/fonts.css']
      }
    });

    window.app.start();
  }

  if (window.cordova) {
    document.addEventListener('deviceready', start, false);
  } else {
    $(document).ready(start);
  }

})();
