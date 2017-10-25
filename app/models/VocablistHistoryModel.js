const SkritterModel = require('base/BaseSkritterModel');

/**
 * @class VocablistHistoryModel
 * @extends {SkritterModel}
 */
const VocablistHistoryModel = SkritterModel.extend({

  getChangedDate: function () {
    return moment().subtract(this.get('secondsAgo'), 'seconds').calendar();
  },

  /**
   * Generates a localized string to describe the change that
   * this model represents.
   * @return {String}
   */
  getChanges: function () {
    const d = this.get('deltas');

    if (d.renamed && d.renamed.length) {
      const oldName = d.renamed[0] || '(empty)';
      const newName = d.renamed[1] || '(empty)';

      return app.locale('dialogs.vocablistHistory.renamed')
        .replace('#{oldName}', oldName)
        .replace('#{newName}', newName);
    }

    if (d.added.length) {
      if (d.new_words && d.new_words.length) {
        return app.locale('dialogs.vocablistHistory.addedNewWords')
          .replace('#{num}', d.new_words.length);
      }
      return app.locale('dialogs.vocablistHistory.addedSection')
        .replace('#{section}', d.added[0]);
    }

    if (d.removed && d.removed.length) {
      return app.locale('dialogs.vocablistHistory.removed')
        .replace('#{removed}', d.removed[0]);
    }

    return app.locale('dialogs.vocablistHistory.unknownChange');
  },
});

module.exports = VocablistHistoryModel;
