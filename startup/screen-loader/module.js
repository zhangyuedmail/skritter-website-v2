/**
 * @class ScreenLoader
 * @constructor
 */
function ScreenLoader() {
    this.element = null;
    this.messages = [];
    this.template = require('./template');
    this.render();
}

/**
 * @method clear
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.clear = function() {
    var messageContainer = this.element.querySelector('.message-container');
    for (var i = 0, length = this.messages.length; i < length; i++) {
        messageContainer.removeChild(this.messages[i]);
        this.messages.shift();
    }
    return this;
};

/**
 * @method hide
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.hide = function() {
    this.element.className = 'fade-out';
    setTimeout((function() {
        this.clear();
    }).bind(this), 500);
    return this;
};

/**
 * @method post
 * @param {String} value
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.post = function(value) {
    var messageContainer = this.element.querySelector('.message-container');
    if (value) {
        var newMessage = document.createElement('div');
        newMessage.className = 'message';
        newMessage.innerHTML = value;
        if (this.messages.length) {
            var oldMessage = this.messages.shift();
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
    var element = document.createElement('screen-loader');
    element.innerHTML = this.template();
    document.body.appendChild(element);
    this.element = element;
    return this;
};

/**
 * @method show
 * @returns {ScreenLoader}
 */
ScreenLoader.prototype.show = function() {
    this.clear();
    this.element.className = 'fade-in';
    return this;
};

module.exports = ScreenLoader;
