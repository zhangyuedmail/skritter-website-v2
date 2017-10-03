const GelatoCollection = require('gelato/collection');

/**
 * @class BaseSkritterCollection
 * @extends {GelatoCollection}
 */
const BaseSkritterCollection = GelatoCollection.extend({

  /**
   * @method headers
   * @returns {Object}
   */
  headers: function () {
    return app.user.session.getHeaders();
  },

  /**
   * @method sync
   * @param {String} method
   * @param {Model} model
   * @param {Object} options
   */
  sync: function (method, model, options) {
    options.headers = _.result(this, 'headers');

    if (!options.url) {
      options.url = app.getApiUrl() + _.result(this, 'url');
    }

    GelatoCollection.prototype.sync.call(this, method, model, options);
  },
});

module.exports = BaseSkritterCollection;
