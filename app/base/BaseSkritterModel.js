const GelatoModel = require('gelato/model');

/**
 * @class BaseSkritterModel
 * @extends {GelatoModel}
 */
const BaseSkritterModel = GelatoModel.extend({

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

    GelatoModel.prototype.sync.call(this, method, model, options);
  },
});

module.exports = BaseSkritterModel;
