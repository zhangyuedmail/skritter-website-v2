const SkritterModel = require('base/BaseSkritterModel');
// const VocabModel = require('models/VocabModel');

/**
 * @class VocablistSectionModel
 * @extends {SkritterModel}
 */
const VocablistSectionModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property initialize
   * @param {Object} options
   */
  initialize: function (options) {
    this.vocablistId = _.result(options, 'vocablistId');
  },

  /**
   * @method getUniqueVocabIds
   * @returns {Array}
   */
  getUniqueVocabIds: function () {
    let vocabIds = _.map(this.get('rows'), 'vocabId');
    let tradVocabIds = [];

    if (app.getLanguage() === 'zh') {
      tradVocabIds = _.map(this.get('rows'), 'tradVocabId');
    }

    return _.uniq(vocabIds.concat(tradVocabIds));
  },

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function (response) {
    return response.VocabListSection || response;
  },

  /**
   * @method sync
   * @param {String} method
   * @param {Model} model
   * @param {Object} options
   */
  sync: function (method, model, options) {
    options.headers = _.result(this, 'headers');

    if (method === 'read' && app.config.useV2Gets.vocablists) {
      options.url = app.getApiUrl(2) + 'gae/vocablists/' + this.vocablistId + '/sections/' + this.get('id');
    }

    SkritterModel.prototype.sync.call(this, method, model, options);
  },

  /**
   * @method url
   * @returns {String}
   */
  url: function () {
    return app.getApiUrl() + 'vocablists/' + this.vocablistId + '/sections/' + this.get('id');
  },

});

module.exports = VocablistSectionModel;
