var GelatoDialog = require('gelato/dialog');

/**
 * @class VocablistSettingsDialog
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
            throw new Error('VocablistSettingsDialog requires a vocablist passed in!')
        }
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('dialogs/vocablist-settings/template'),
    /**
     * @method render
     * @returns {VocablistSettingsDialog}
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
        'vclick #close-btn': 'handleClickCloseButton',
        'vclick #save-btn': 'handleClickSaveButton'
    },
    /**
     * @method handleClickCloseButton
     * @param {Event} event
     */
    handleClickCloseButton: function(event) {
        this.close();
    },
    /**
     * @method handleClickSaveButton
     */
    handleClickSaveButton: function () {
        var getVals = function(el) { return $(el).val(); };

        this.vocablist.set('studyingMode', this.$el.find('input[name="studyingMode"]:checked').val());

        this.vocablist.set('partsStudying', $.map(this.$el.find('input[name="partsStudying"]:checked'), getVals));

        this.vocablist.set('limitSentenceParts', this.$el.find('input[name="limitSentenceParts"]').is(':checked'));

        var studyAllListWritingsEl = this.$el.find('input[name="studyAllListWritings"]');
        if (studyAllListWritingsEl.length) {
            this.vocablist.set('studyAllListWritings', studyAllListWritingsEl.is(':checked'));
        }

        var currentSectionSelect = this.$el.find('input[name="currentSection"]');
        if (currentSectionSelect.length) {
            this.vocablist.set('currentSection', currentSectionSelect.val());
        }

        var skipSectionsInputs = this.$el.find('input[name="sectionsSkipping"]');
        if (skipSectionsInputs.length) {
            var skippingInputs =  skipSectionsInputs.filter(':not(:checked)');
            this.vocablist.set('sectionsSkipping', $.map(skippingInputs, getVals));
        }

        var autoSectionMovementEl = this.$el.find('input[name="autoSectionMovement"]');
        if (autoSectionMovementEl.length) {
            this.vocablist.set('autoSectionMovement', autoSectionMovementEl.is(':not(:checked)'));
        }

        //this.vocablist.save();
        this.close();
    }
});
