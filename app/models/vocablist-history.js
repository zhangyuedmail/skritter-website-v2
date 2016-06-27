var SkritterModel = require('base/skritter-model');
/**
 * @class VocablistHistory
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
  getChangedDate: function() {
    return moment().subtract(this.get('secondsAgo'), 'seconds').calendar();
  },

  getChanges: function() {
    var d = this.get('deltas');
    if (d.added.length) {
      if (d.new_words && d.new_words.length) {
        return 'Added ' + d.new_words.length + ' new words';
      }
      return 'Added ' + d.added[0];
    }

    if (d.removed.length) {
      return 'Removed ' + d.removed[0];
    }

    return 'Made a change to the list.';
  }
});
