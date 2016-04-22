var ChinesePodLesson = require('models/chinesepod-lesson');
var SkritterCollection = require('base/skritter-collection');

/**
 * @class ChinesePodLessons
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
  /**
   * @property model
   * @type {Vocablist}
   */
  model: ChinesePodLesson,
  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    return response.ChinesePodLists;
  },
  /**
   * @property url
   * @type {String}
   */
  url: 'cpod/lessons'
});
