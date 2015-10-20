var GelatoDialog = require('gelato/bootstrap/dialog');

/**
 * @class StudySettingsDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-close': 'handleClickClose',
        'vclick #button-save': 'handleClickSave'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {StudySettingsDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method getSelectedParts
     * @returns {Array}
     */
    getSelectedParts: function() {
        var parts = [];
        this.$('#field-parts :checked').each(function() {
            parts.push($(this).val());
        });
        return parts;
    },
    /**
     * @method getSettings
     * @returns {Object}
     */
    getSettings: function() {
        if (app.isJapanese()) {
            return {
                filteredJapaneseParts: this.getSelectedParts(),
                hideReading: this.$('#field-hide-reading input').is(':checked'),
                squigs: this.$('#field-squigs input').is(':checked'),
                teachingMode: this.$('#field-teaching-mode input').is(':checked')
            };
        } else {
            return {
                filteredChineseParts: this.getSelectedParts(),
                hideReading: this.$('#field-hide-reading input').is(':checked'),
                squigs: this.$('#field-squigs input').is(':checked'),
                teachingMode: this.$('#field-teaching-mode input').is(':checked')
            };
        }
    },
    /**
     * @method handleClickClose
     * @param {Event} event
     */
    handleClickClose: function(event) {
        event.preventDefault();
        this.trigger('close');
        this.close();
    },
    /**
     * @method handleClickSave
     * @param {Event} event
     */
    handleClickSave: function(event) {
        event.preventDefault();
        this.trigger('save', this.getSettings());
    }
});
