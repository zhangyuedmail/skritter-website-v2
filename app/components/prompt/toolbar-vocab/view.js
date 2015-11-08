var Component = require('base/component');

/**
 * @class PromptToolbarVocab
 * @extends {Component}
 */
module.exports = Component.extend({
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