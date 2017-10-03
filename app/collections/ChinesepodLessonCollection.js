const ChinesePodLessonModel = require('models/ChinesepodLessonModel');
const BaseSkritterCollection = require('base/BaseSkritterCollection');

/**
 * @class ChinesePodLessonCollection
 * @extends {BaseSkritterCollection}
 */
const ChinesePodLessonCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {ChinesePodLessonModel}
   */
  model: ChinesePodLessonModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'cpod/lessons',

  /**
   * @method parse
   * @param {Object} response
   * @returns Array
   */
  parse: function(response) {
    return response.ChinesePodLists;
  },
});

module.exports = ChinesePodLessonCollection;
