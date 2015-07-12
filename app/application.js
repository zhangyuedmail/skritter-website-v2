var GelatoApplication = require('gelato/modules/application');
var Api = require('models/api');
var User = require('models/user');

/**
 * @class Application
 * @extends {GelatoApplication}
 */
module.exports = GelatoApplication.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.api = new Api();
        this.user = new User();
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        canvasSize: 450,
        date: '{!date!}',
        language: '{!application-language!}',
        name: '{!application-name!}',
        timestamp: '{!timestamp!}',
        version: '{!application-version!}'
    },
    /**
     * @method getLanguage
     * @returns {String}
     */
    getLanguage: function() {
        return this.get('language');
    },
    /**
     * @method getTemplate
     * @returns {Object}
     */
    getTemplate: function() {
        return {
            app: this.toJSON(),
            user: this.user.toJSON()
        };
    },
    /**
     * @method isChinese
     * @returns {Boolean}
     */
    isChinese: function() {
        return this.get('language') === 'zh';
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.get('language') === 'ja';
    },
    /**
     * @method start
     */
    start: function() {
        this.user.load();
        Backbone.history.start({pushState: true});
    }
});
