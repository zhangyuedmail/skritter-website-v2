const GelatoModel = require('gelato/model');

/**
 * @class ProgressStatModel
 * @extends {GelatoModel}
 */
const ProgressStatModel = GelatoModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'date',

  /**
   * @method getStudiedCount
   * @returns {Number}
   */
  getStudiedCount: function () {
    let count = 0;
    count += this.get('char').defn.studied.day;
    count += this.get('char').rdng.studied.day;
    count += this.get('char').rune.studied.day;
    count += this.get('char').tone.studied.day;
    count += this.get('word').defn.studied.day;
    count += this.get('word').rdng.studied.day;
    count += this.get('word').rune.studied.day;
    count += this.get('word').tone.studied.day;
    return count;
  },

  /**
   * @method hasBeenStudied
   * @returns {Boolean}
   */
  hasBeenStudied: function () {
    return this.getStudiedCount() > 0;
  },

});

module.exports = ProgressStatModel;
