var ProgressDialog = require('dialogs/progress/view');

module.exports = {
    /**
     * Initializes the action object runAction uses to serially process words
     * @method beginVocabAction
     * @param {String} action
     * @param {Vocabs} vocabs
     */
    beginVocabAction: function(action, vocabs) {
        if (!_.contains(['ban', 'unban'], action)) {
            throw new Error('Action must be "ban" or "unban"');
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
     * @method runVocabAction
     */
    runVocabAction: function() {
        var vocab = this.action.queue.shift();
        if (!vocab) {
            return this.finishVocabAction();
        }
        if (this.action.name === 'ban') {
            if (vocab.isBanned()) {
                return this.runVocabAction();
            }
            vocab.toggleBanned();
        }
        else if (this.action.name === 'unban') {
            if (!vocab.isBanned()) {
                return this.runVocabAction();
            }
            vocab.toggleBanned();
        }
        else {
            return this.finishVocabAction();
        }
        var attrs = {
            id: vocab.id,
            bannedParts: vocab.get('bannedParts')
        };
        vocab.save(attrs, { patch: true, 'method': 'PUT' });
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
    }
}
