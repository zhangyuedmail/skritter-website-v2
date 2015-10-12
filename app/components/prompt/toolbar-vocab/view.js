var GelatoComponent = require('gelato/component');

/**
 * @class PromptToolbarVocab
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.prompt = options.prompt;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {PromptToolbarVocab}
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
        'click #button-vocab-audio': 'handleClickButtonVocabAudio',
        'click #button-vocab-ban': 'handleClickButtonVocabBan',
        'click #button-vocab-edit': 'handleClickButtonVocabEdit',
        'click #button-vocab-info': 'handleClickButtonVocabInfo',
        'click #button-vocab-star': 'handleClickButtonVocabStar'
    },
    /**
     * @method handleClickButtonVocabAudio
     * @param {Event} event
     */
    handleClickButtonVocabAudio: function(event) {
        event.preventDefault();
        this.trigger('click:audio');
    },
    /**
     * @method handleClickButtonVocabBan
     * @param {Event} event
     */
    handleClickButtonVocabBan: function(event) {
        event.preventDefault();
        this.trigger('click:ban');
    },
    /**
     * @method handleClickButtonVocabEdit
     * @param {Event} event
     */
    handleClickButtonVocabEdit: function(event) {
        event.preventDefault();
        this.trigger('click:edit');
    },
    /**
     * @method handleClickButtonVocabInfo
     * @param {Event} event
     */
    handleClickButtonVocabInfo: function(event) {
        event.preventDefault();
        this.trigger('click:info');
    },
    /**
     * @method handleClickButtonVocabStar
     * @param {Event} event
     */
    handleClickButtonVocabStar: function(event) {
        event.preventDefault();
        this.trigger('click:star');
    }
});