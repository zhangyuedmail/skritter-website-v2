/**
 * @module Skritter
 * @submodule Views
 * @param templateStudySettings
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study-settings.html'
], function(templateStudySettings) {
    /**
     * @class StudySettings
     */
    var Settings = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Settings.activeParts = [];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudySettings);
            Settings.activeParts = skritter.user.settings.activeParts();
            this.$('input').bootstrapSwitch();
            this.$('#parts #defn').bootstrapSwitch('state', Settings.activeParts.indexOf('defn') > -1);
            this.$('#parts #rdng').bootstrapSwitch('state', Settings.activeParts.indexOf('rdng') > -1);
            this.$('#parts #rune').bootstrapSwitch('state', Settings.activeParts.indexOf('rune') > -1);
            if (skritter.user.settings.isJapanese()) {
                this.$('#parts #tone').parent().parent().parent().hide();
            } else {
                this.$('#parts #tone').bootstrapSwitch('state', Settings.activeParts.indexOf('tone') > -1);
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Settings #study-settings-view #cancel-button': 'cancel',
            'click.Settings #study-settings-view #save-button': 'save'
        },
        /**
         * @method cancel
         * @param {Object} event
         */
        cancel: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method save
         * @param {Object} event
         */
        save: function(event) {
            Settings.activeParts = [];
            if (this.$('#parts #defn').bootstrapSwitch('state'))
                Settings.activeParts.push('defn');
            if (this.$('#parts #rdng').bootstrapSwitch('state'))
                Settings.activeParts.push('rdng');
            if (this.$('#parts #rune').bootstrapSwitch('state'))
                Settings.activeParts.push('rune');
            if (this.$('#parts #tone').bootstrapSwitch('state'))
                Settings.activeParts.push('tone');
            if (Settings.activeParts.length === 0) {
                skritter.modals.show('confirmation').set('.modal-header', false).set('.modal-body', 'You must enable at least one part!', 'text-center');
                return false;
            } else {
                skritter.user.settings.activeParts(Settings.activeParts);
            }
            skritter.router.back();
            event.preventDefault();
        }
    });
    
    return Settings;
});

