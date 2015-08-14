var GelatoModel = require('gelato/model');

/**
 * @class Api
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @property defaults
     * @type {Object}
     */
    defaults: {
        domain: location.hostname.indexOf('.cn') > -1 ? '.cn' : '.com',
        root: 'https://beta.skritter',
        version: 0
    },
    /**
     * @method getLoginCredentials
     * @returns {String}
     */
    getLoginCredentials: function() {
        switch (app.getPlatform()) {
            case 'Android':
                return 'c2tyaXR0ZXJhbmRyb2lkOmRjOTEyYzAzNzAwMmE3ZGQzNWRkNjUxZjBiNTA3NA==';
            case 'iOS':
                return 'c2tyaXR0ZXJpb3M6NGZmYjFiZDViYTczMWJhNTc1YWI4OWYzYzY5ODQ0';
            default:
                return 'c2tyaXR0ZXJ3ZWI6YTI2MGVhNWZkZWQyMzE5YWY4MTYwYmI4ZTQwZTdk';
        }
    },
    /**
     * @method getLoginHeaders
     * @returns {Object}
     */
    getLoginHeaders: function() {
        return {'Authorization': 'basic ' + this.getLoginCredentials()};
    },
    /**
     * @method getUserCredentials
     * @returns {String}
     */
    getUserCredentials: function() {
        return app.user.auth.get('access_token');
    },
    /**
     * @method getUserHeaders
     * @returns {Object}
     */
    getUserHeaders: function() {
        return {'Authorization': 'bearer ' + this.getUserCredentials()};
    },
    /**
     * @method getClientId
     * @returns {String}
     */
    getClientId: function() {
        switch (app.getPlatform()) {
            case 'Android':
                return 'skritterandroid';
            case 'iOS':
                return 'skritterios';
            default:
                return 'skritterweb';
        }
    },
    /**
     * @method getUrl
     */
    getUrl: function() {
        return this.get('root') + this.get('domain') + '/api/v' + this.get('version') + '/';
    }
});
