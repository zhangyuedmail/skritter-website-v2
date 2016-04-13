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
            throw new Error('Invalid action, must be one of: '
                + availableVocabActions.join(', '));
        }
        if (!vocabs.size()) {
            return;
        }

        var progressDialog = new ProgressDialog();
        progressDialog.render().open();

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
        if (!vocab.getMnemonicText()) {
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
        if (!vocab.get('starred')) {
            return null;
        }
        return {starred: false};
    },
    /**
     * @method runVocabAction
     */
    runVocabAction: function() {
        var vocab = this.action.queue.shift();
        if (!vocab) {
            return this.finishVocabAction();
        }
        var vocabAttrs = null;
        if (this.action.name === 'ban') {
            vocabAttrs = this.banVocabAction(vocab);
        }
        if (this.action.name === 'unban') {
            vocabAttrs = this.unbanVocabAction(vocab);
        }
        if (this.action.name === 'delete-mnemonic') {
            vocabAttrs = this.deleteVocabMnemonicAction(vocab);
        }
        if (this.action.name === 'remove-star') {
            vocabAttrs = this.removeStarVocabAction(vocab);
        }
        if (!vocabAttrs) {
            return this.finishVocabAction();
        }
        vocabAttrs.id = vocab.id;
        vocab.save(vocabAttrs, {patch: true, 'method': 'PUT'});
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
