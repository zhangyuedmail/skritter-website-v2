var GelatoDialog = require('gelato/dialog');
var VocabViewer = require('components/vocab-viewer/view');

/**
 * @class VocabDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.viewer = new VocabViewer();
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('dialogs/vocab/template'),
    /**
     * @method render
     * @returns {Vocabs}
     */
    render: function() {
        this.renderTemplate();
        this.viewer.setElement('#vocab-container').render();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-close': 'handleClickButtonClose'
    },
    /**
     * @method handleClickButtonClose
     * @param {Event} event
     */
    handleClickButtonClose: function(event) {
        event.preventDefault();
        app.closeDialog();
    },
    /**
     * @method handleLoadVocab
     */
    handleLoadVocab: function() {
        this.$('#loading-spinner').hide();
    },
    /**
     * @method remove
     * @returns {Vocabs}
     */
    remove: function() {
        this.viewer.remove();
        return GelatoDialog.prototype.remove.call(this);
    },
    /**
     * @method set
     * @param {String} [vocabId]
     */
    set: function(vocabId) {
        this.$('#loading-spinner').show();
        this.listenToOnce(this.viewer, 'load', this.handleLoadVocab);
        this.viewer.load(vocabId);
    }
});
