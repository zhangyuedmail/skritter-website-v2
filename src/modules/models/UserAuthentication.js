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
        defaults: {},
        /**
         * @method cache
         * @returns {UserAuthentication}
         */
        cache: function() {
            localStorage.setItem(app.user.getDataPath('authentication', false), JSON.stringify(this.toJSON()));
            return this;
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
        }
    });

    return UserAuthentication;

});