var GelatoDialog = require('gelato/dialog');

/**
 * @class VocablistRemoveDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {
        this.vocablist = options.vocablist;
        if (!this.vocablist) {
            throw new Error('VocablistRemoveDialog requires a vocablist passed in!')
        }
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('dialogs/vocablist-remove/template'),
    /**
     * @method render
     * @returns {VocablistRemoveDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #confirm-btn': 'handleClickConfirmButton',
        'vclick #cancel-btn': 'handleClickCancelButton'
    },
    /**
     * @method handleClickCloseButton
     * @param {Event} e
     */
    handleClickCancelButton: function(e) {
        this.close();
    },
    /**
     * @method handleClickSaveButton
     * @param {Event} e
     */
    handleClickConfirmButton: function (e) {
        this.vocablist.set('studyingMode', 'not studying');
        this.close();
    }
});
