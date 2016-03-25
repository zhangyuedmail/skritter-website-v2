var GelatoDialog = require('gelato/dialog');
var Vocab = require('models/vocab');

/**
 * @class VocabCreatorDialog
 * @extends {GelatoDialog}
 */
var VocabCreatorDialog = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {
        this.vocabId = null;
        this.writing = null;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-add-word': 'handleClickButtonAddWord',
        'vclick #button-cancel': 'handleClickButtonCancel'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocabCreatorDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        this.close();
    },
    /**
     * @method handleClickButtonAddWord
     * @param {Event} event
     */
    handleClickButtonAddWord: function(event) {
        var self = this;
        var formData = this.getFormData();
        event.preventDefault();
        this.$('#error-message').empty();
        if (_.isEmpty(formData.reading)) {
            this.$('#error-message').text('A reading is required.');
            return;
        }
        if (_.isEmpty(formData.definitions)) {
            this.$('#error-message').text('A definition is required.');
            return;
        }
        new Vocab({
            definitions: {
                en: this.$('#word-definition-input').val()
            },
            reading: this.$('#word-reading-input').val(),
            writing: this.writing
        }).post(function(error, vocab) {
            if (error) {
                //TODO: display errors from server
                console.error(error);
            } else {
                self.trigger('vocab', vocab);
                self.close();
            }
        });
    },
    /**
     * @method getFormData
     * @returns {Object}
     */
    getFormData: function() {
        return {
            definitions:  this.$('#word-definition-input').val(),
            reading: this.$('#word-reading-input').val(),
            writing: this.writing
        };
    },
    /**
     * @method open
     * @param {Object} options
     */
    open: function(options) {
        this.vocabId = app.fn.mapper.toBase(options.writing);
        this.writing = options.writing;
        return GelatoDialog.prototype.open.call(this, options);
    }
});

module.exports = VocabCreatorDialog;
