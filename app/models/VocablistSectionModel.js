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
   * @method urlRoot
   * @returns {String}
   */
  urlRoot: function () {
    return 'vocablists/' + this.vocablistId + '/sections';
  },

});

module.exports = VocablistSectionModel;
