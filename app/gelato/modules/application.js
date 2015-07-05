/**
 * @class GelatoApplication
 * @extends {Backbone.Model}
 */
module.exports = Backbone.Model.extend({
    /**
     * @method closeDialog
     */
    closeDialog: function() {
        if (this.dialog) {
            this.dialog.close();
            this.dialog = null;
        }
    },
    /**
     * @method getHeight
     * @returns {Number}
     */
    getHeight: function() {
        return $(window).height();
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
        return $(window).width();
    },
    /**
     * @method isDevelopment
     * @returns {Boolean}
     */
    isDevelopment: function() {
        return location.hostname === 'localhost';
    },
    /**
     * @method isProduction
     * @returns {Boolean}
     */
    isProduction: function() {
        return location.hostname !== 'localhost';
    },
    /**
     * @method openDialog
     */
    openDialog: function(name, options) {
        if (!this.dialog) {
            this.dialog = new (require('dialogs/' + name + '/view'));
            this.dialog.open(options);
        }
    },
    /**
     * @method reload
     */
    reload: function() {
        location.reload(true);
    },
    /**
     * @method removeSetting
     * @param {String} key
     */
    removeSetting: function(key) {
        localStorage.removeItem('application-' + key);
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
