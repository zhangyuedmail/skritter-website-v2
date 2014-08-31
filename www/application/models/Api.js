/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class Api
     * @extend BaseModel
     */
    var Api = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            clientId: 'mcfarljwapiclient',
            clientSecret: 'e3872517fed90a820e441531548b8c',
            root: 'https://beta.skritter',
            tld: location.host.indexOf('.cn') === -1 ? '.com' : '.cn',
            version: 0
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            $.ajax({
                url: this.getBaseUrl() + 'oauth2/token',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    grant_type: 'password',
                    client_id: this.get('clientId'),
                    username: username,
                    password: password
                }
            }).done(function(data) {
                callback(data, data.statusCode);
            }).fail(function(error) {
                callback(error, error.status);
            });
        },
        /**
         * @method beforeSend
         * @param {jqXHR} xhr
         */
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', this.getCredentials());
        },
        /**
         * @method getBaseUrl
         * @returns {String}
         */
        getBaseUrl: function() {
            return this.get('root') + this.get('tld') + '/api/v' + this.get('version') + '/';
        }
    });

    return Api;
});