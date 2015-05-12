/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserAuthentication
     * @extends GelatoModel
     */
    var UserAuthentication = GelatoModel.extend({
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
        defaults: {
            created: 0,
            expires_in: 0
        },
        /**
         * @method cache
         * @returns {UserAuthentication}
         */
        cache: function() {
            localStorage.setItem(app.user.getDataPath('authentication', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method getExpires
         * @returns {Number}
         */
        getExpires: function() {
            return this.get('created') + this.get('expires_in');
        },
        /**
         * @method isExpired
         * @returns {Boolean}
         */
        isExpired: function() {
            return this.getExpires() < Moment().unix();
        },
        /**
         * @method load
         * @returns {UserAuthentication}
         */
        load: function() {
            var authentication = localStorage.getItem(app.user.getDataPath('authentication', false));
            if (authentication) {
                this.set(JSON.parse(authentication), {silent: true});
            }
            return this;
        },
        /**
         * @method refresh
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        refresh: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.refreshToken(this.get('refresh_token'), function(result) {
                self.authentication.set('created', Moment().unix());
                self.authentication.set(result, {merge: true});
                callbackSuccess();
            }, function(error) {
                callbackError(error);
            });
        }
    });

    return UserAuthentication;

});