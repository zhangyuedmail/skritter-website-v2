/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserAuth
     * @extends GelatoModel
     */
    var UserAuth = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method cache
         * @returns {UserAuth}
         */
        cache: function() {
            localStorage.setItem(app.user.getCachePath('auth', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         * @returns {UserAuth}
         */
        load: function(callbackSuccess, callbackError) {
            var item = localStorage.getItem(app.user.getCachePath('auth', false));
            if (item) {
                this.set(JSON.parse(item), {silent: true});
            }
            if (typeof callbackSuccess === 'function') {
                callbackSuccess();
            }
            return this;
        }
    });

    return UserAuth;

});