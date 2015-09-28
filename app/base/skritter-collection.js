var GelatoCollection = require('gelato/collection');

/**
 * @class SkritterCollection
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @property cursor
     * @type {String}
     */
    cursor: null,
    /**
     * @method headers
     * @returns {Object}
     */
    headers: function() {
        return app.user.session.getHeaders();
    },
    /**
     * @method sync
     * @param {String} method
     * @param {GelatoModel} model
     * @param {Object} options
     */
    sync: function(method, model, options) {
        options.headers = _.result(this, 'headers');
        if (!options.url) {
            options.url = app.getApiUrl() + _.result(this, 'url');
        }
        GelatoCollection.prototype.sync.call(this, method, model, options);
    }
});
