window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
window.Backbone = require('backbone');

window.async = require('async');
window.CalHeatMap = require('cal-heatmap');
window.moment = require('moment');
window.wanakana = require('wanakana');
window.WebFont = require('webfontloader');

require('babel-polyfill');
require('bootstrap');
require('bootstrap-daterangepicker');
require('bootstrap-notify');
require('bootstrap-switch');
require('d3');
require('highcharts');
require('howler');
require('jqueryui');
require('moment-timezone');

const Application = require('./application');

module.exports = (function() {

  function start() {
    window.ScreenLoader = new (require('../startup/screen-loader/module'))();
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
    if (window.MobileAccessibility) {
      window.MobileAccessibility.usePreferredTextZoom(false);
    }

    document.addEventListener('deviceready', start, false);
  } else {
    $(document).ready(start);
  }

})();
