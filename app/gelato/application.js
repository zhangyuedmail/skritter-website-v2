/**
 * @class GelatoApplication
 * @extends {Backbone.Model}
 */
var GelatoApplication = Backbone.Model.extend({
  /**
   * @method getHeight
   * @returns {Number}
   */
  getHeight: function() {
    return Backbone.$('gelato-application').height();
  },
  /**
   * @method getLocalStorage
   * @param {String} key
   */
  getLocalStorage: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  /**
   * @method getPlatform
   * @returns {String}
   */
  getPlatform: function() {
    return window.device ? window.device.platform : 'Website';
  },
  /**
   * @method getSetting
   * @param {String} key
   * @returns {Boolean|Number|Object|String}
   */
  getSetting: function(key) {
    return JSON.parse(localStorage.getItem('application-' + key));
  },
  /**
   * @method getWidth
   * @returns {Number}
   */
  getWidth: function() {
    return Backbone.$('gelato-application').width();
  },
  /**
   * @method isAndroid
   * @returns {Boolean}
   */
  isAndroid: function() {
    return this.getPlatform() === 'Android';
  },
  /**
   * @method isDevelopment
   * @returns {Boolean}
   */
  isDevelopment: function() {
    return location.hostname === 'localhost';
  },
  /**
   * @method isIOS
   * @returns {Boolean}
   */
  isIOS: function() {
    return this.getPlatform() === 'iOS';
  },
  /**
   * @method isLandscape
   * @returns {Boolean}
   */
  isLandscape: function() {
    return this.getWidth() > this.getHeight();
  },
  /**
   * @method isMobile
   * @returns {Boolean}
   */
  isMobile: function() {
    return false;
  },
  /**
   * @method isPortrait
   * @returns {Boolean}
   */
  isPortrait: function() {
    return this.getWidth() <= this.getHeight();
  },
  /**
   * @method isProduction
   * @returns {Boolean}
   */
  isProduction: function() {
    return location.hostname !== 'localhost';
  },
  /**
   * @method isWebsite
   * @returns {Boolean}
   */
  isWebsite: function() {
    return this.getPlatform() === 'Website';
  },
  /**
   * @method locale
   * @param {String} path
   * @param {String} [code]
   * @returns {*}
   */
  locale: function(path, code) {
    var locale = {};
    try {
      locale = require('locale/' + code || app.get('locale'));
    } catch (error) {
      locale = require('locale/default');
    }
    return _.get(locale, path);
  },
  /**
   * @method reload
   * @param {Boolean} [forcedReload]
   */
  reload: function(forcedReload) {
    location.reload(forcedReload);
  },
  /**
   * @method getLocalStorage
   * @param {String} key
   */
  removeLocalStorage: function(key) {
    localStorage.removeItem(key);
  },
  /**
   * @method removeSetting
   * @param {String} key
   */
  removeSetting: function(key) {
    localStorage.removeItem('application-' + key);
  },
  /**
   * @method setLocalStorage
   * @param {String} key
   * @param {Array|Number|Object|String} value
   */
  setLocalStorage: function(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  /**
   * @method setSetting
   * @param {String} key
   * @param {Boolean|Number|Object|String} value
   */
  setSetting: function(key, value) {
    localStorage.setItem('application-' + key, JSON.stringify(value));
  }
});

module.exports = GelatoApplication;
