/**
 * @class ScreenLoader
 * @constructor
 */
function ScreenLoader() {
  this.element = null;
  this.messages = [];
  this.template = require('./ScreenLoader.jade');
  this.timeout = null;
  this.render();
}

/**
 * @method clear
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.clear = function() {
  const messageContainer = this.element.querySelector('.screen-message-container');
  for (let i = 0, length = this.messages.length; i < length; i++) {
    messageContainer.removeChild(this.messages[i]);
    this.messages.shift();
  }
  this.element.querySelector('.screen-notice').innerHTML = '';
  return this;
};

/**
 * @param {Boolean} [immediate] whether to hide immediately without fading out
 * @method hide
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.hide = function(immediate) {
  const classString = 'fade-out' + (immediate ? ' now' : '');
  this.element.className = classString;

  this.timeout = setTimeout((function() {
    this.clear();
  }).bind(this), 500);

  return this;
};

/**
 * @method notice
 * @param {String} value
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.notice = function(value) {
  this.element.querySelector('.screen-notice').innerHTML = value;
  return this;
};

/**
 * @method post
 * @param {String} value
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.post = function(value) {
  const messageContainer = this.element.querySelector('.screen-message-container');
  if (value) {
    const newMessage = document.createElement('div');
    newMessage.className = 'screen-message';
    newMessage.innerHTML = value;
    if (this.messages.length) {
      const oldMessage = this.messages.shift();
      oldMessage.className += ' fade-out';
      messageContainer.insertBefore(newMessage, oldMessage);
      setTimeout(function() {
        messageContainer.removeChild(oldMessage);
      }, 1000);
    } else {
      messageContainer.appendChild(newMessage);
    }
    this.messages.push(newMessage);
  }
  return this;
};

/**
 * @method render
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.render = function() {
  const element = document.createElement('screen-loader');

  element.innerHTML = this.template();
  document.body.appendChild(element);
  this.element = element;

  return this;
};

/**
 * @param {Boolean} [immediate] whether to show immediately without fading in
 * @method show
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.show = function(immediate) {
  const classString = 'fade-in' + (immediate ? ' now' : '');

  clearTimeout(this.timeout);
  this.element.className = classString;

  return this;
};

module.exports = ScreenLoader;
