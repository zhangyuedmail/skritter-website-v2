var GelatoModel = require('gelato/modules/model');

/**
 * @class UserCredentials
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.on('change', this.cache);
    },
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        created: 0,
        expires_in: 0,
        user_id: 'guest'
    },
    /**
     * @method cache
     * @returns {UserCredentials}
     */
    cache: function() {
        app.user.setLocalData('credentials', this.toJSON());
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
        return this.getExpires() < moment().unix();
    },
    /**
     * @method load
     * @returns {UserCredentials}
     */
    load: function() {
        var credentials = app.user.getLocalData('credentials');
        if (credentials) {
            this.set(credentials, {silent: true});
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
            self.set('created', moment().unix());
            self.set(result, {merge: true});
            callbackSuccess();
        }, function(error) {
            callbackError(error);
        });
    }
});
