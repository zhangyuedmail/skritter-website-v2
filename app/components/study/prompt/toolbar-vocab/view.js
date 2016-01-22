var GelatoComponent = require('gelato/component');
var VocabViewerDialog = require('dialogs1/vocab-viewer/view');

/**
 * @class StudyPromptToolbarVocab
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.dialog = null;
        this.prompt = options.prompt;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudyPromptToolbarVocab}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #button-vocab-audio': 'handleClickButtonVocabAudio',
        'vclick #button-vocab-ban': 'handleClickButtonVocabBan',
        'vclick #button-vocab-edit': 'handleClickButtonVocabEdit',
        'vclick #button-vocab-info': 'handleClickButtonVocabInfo',
        'vclick #button-vocab-star': 'handleClickButtonVocabStar'
    },
    /**
     * @method handleClickButtonVocabAudio
     * @param {Event} event
     */
    handleClickButtonVocabAudio: function(event) {
        event.preventDefault();
        this.prompt.reviews.vocab.play();
    },
    /**
     * @method handleClickButtonVocabBan
     * @param {Event} event
     */
    handleClickButtonVocabBan: function(event) {
        event.preventDefault();
        //TODO: ban specific items
    },
    /**
     * @method handleClickButtonVocabEdit
     * @param {Event} event
     */
    handleClickButtonVocabEdit: function(event) {
        event.preventDefault();
        if (this.prompt.editing) {
            this.prompt.editing = false;
            this.prompt.vocabDefinition.editing = false;
            this.prompt.vocabMnemonic.editing = false;
            this.prompt.shortcuts.registerAll();
            this.prompt.reviews.vocab.save({
                customDefinition: this.prompt.vocabDefinition.getValue(),
                mnemonic: this.prompt.vocabMnemonic.getValue()
            });
        } else {
            this.prompt.editing = true;
            this.prompt.vocabDefinition.editing = true;
            this.prompt.vocabMnemonic.editing = true;
            this.prompt.shortcuts.unregisterAll();
        }
        this.prompt.vocabDefinition.render();
        this.prompt.vocabMnemonic.render();
    },
    /**
     * @method handleClickButtonVocabInfo
     * @param {Event} event
     */
    handleClickButtonVocabInfo: function(event) {
        event.preventDefault();
        this.dialog = new VocabViewerDialog();
        this.dialog.load(this.prompt.reviews.vocab.id);
        this.dialog.open();
    },
    /**
     * @method handleClickButtonVocabStar
     * @param {Event} event
     */
    handleClickButtonVocabStar: function(event) {
        event.preventDefault();
        this.prompt.reviews.vocab.toggleStarred();
        this.prompt.reviews.vocab.save(null, {
            error: this.render.bind(this),
            success: this.render.bind(this)
        });
    }
});