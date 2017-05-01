var ProgressDialog = require('dialogs/progress/view');

var availableVocabActions = [
  'ban',
  'unban',
  'delete-mnemonic',
  'remove-star'
];

module.exports = {
  /**
   * @method banVocabAction
   * @param {Vocab} vocab
   * @returns {Object|null} Vocab attrs to be saved, if any
   */
  banVocabAction: function(vocab) {
    if (vocab.isBanned()) {
      return null;
    }

    vocab.banAll();

    return {bannedParts: vocab.get('bannedParts')};
  },

  /**
   * Initializes the action object runAction uses to serially process words
   * @method beginVocabAction
   * @param {String} action
   * @param {Vocabs} vocabs
   */
  beginVocabAction: function(action, vocabs) {
    if (!_.includes(availableVocabActions, action)) {
      throw new Error('Invalid action, must be one of: ' + availableVocabActions.join(', '));
    }

    if (!vocabs.size()) {
      return;
    }

    const progressDialog = new ProgressDialog().render().open();

    this.action = {
      name: action,
      queue: vocabs,
      total: vocabs.size(),
      dialog: progressDialog
    };

    this.runVocabAction();
  },

  /**
   * @method deleteVocabMnemonicAction
   * @param {Vocab} vocab
   * @returns {Object|null} Vocab attrs to be saved, if any
   */
  deleteVocabMnemonicAction: function(vocab) {
    const mnemonic = vocab.get('mnemonic') || {};

    if (!mnemonic.text) {
      return null;
    }

    return {mnemonic: {text: ''}};
  },

  /**
   * @method removeStarVocabAction
   * @param {Vocab} vocab
   * @returns {Object|null} Vocab attrs to be saved, if any
   */
  removeStarVocabAction: function(vocab) {
    if (!vocab.has('starred')) {
      return null;
    }

    return {starred: false};
  },

  /**
   * @method runVocabAction
   */
  runVocabAction: function() {
    const vocab = this.action.queue.shift();

    if (!vocab) {
      return this.finishVocabAction();
    }

    let vocabAttrs = null;

    switch (this.action.name) {
      case 'ban':
        vocabAttrs = this.banVocabAction(vocab);
        break;
      case 'unban':
        vocabAttrs = this.unbanVocabAction(vocab);
        break;
      case 'delete-mnemonic':
        vocabAttrs = this.deleteVocabMnemonicAction(vocab);
        break;
      case 'remove-star':
        vocabAttrs = this.removeStarVocabAction(vocab);
        break;
    }

    if (!vocabAttrs) {
      return this.finishVocabAction();
    }

    vocabAttrs.id = vocab.id;
    vocab.save(vocabAttrs, {method: 'PUT', patch: true});

    this.listenToOnce(vocab, 'sync', function() {
      this.action.dialog.setProgress(100 * (this.action.total - this.action.queue.size()) / this.action.total);
      this.runVocabAction();
    });
  },

  /**
   * @method finishVocabAction
   */
  finishVocabAction: function() {
    this.action.dialog.close();
    this.action = {};
    this.trigger('vocab-action-complete');
  },

  /**
   * @method unbanVocabAction
   * @param {Vocab} vocab
   * @returns {Object|null} Vocab attrs to be saved, if any
   */
  unbanVocabAction: function(vocab) {
    if (!vocab.isBanned()) {
      return null;
    }

    vocab.unbanAll();

    return {bannedParts: vocab.get('bannedParts')};
  }
}
