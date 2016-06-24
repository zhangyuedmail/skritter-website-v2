var SkritterModel = require('base/skritter-model');
/**
 * @class VocablistHistory
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
  getChangedDate: function() {
    return this.get('secondsAgo');
  }
});
