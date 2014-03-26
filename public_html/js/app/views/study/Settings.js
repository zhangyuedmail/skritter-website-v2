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
            this.$('input.bootswitch').bootstrapSwitch();
            this.$('#general #audio').bootstrapSwitch('state', skritter.user.settings.get('audio'));
            this.$('#parts #defn').bootstrapSwitch('state', Settings.activeParts.indexOf('defn') > -1);
            this.$('#parts #rdng').bootstrapSwitch('state', Settings.activeParts.indexOf('rdng') > -1);
            this.$('#parts #rune').bootstrapSwitch('state', Settings.activeParts.indexOf('rune') > -1);
            this.$('#parts #raw-squigs').prop('checked', skritter.user.settings.get('squigs'));
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
            skritter.user.settings.set('audio', this.$('#general #audio').prop('checked'));
            if (this.$('#parts #defn').bootstrapSwitch('state'))
                Settings.activeParts.push('defn');
            if (this.$('#parts #rdng').bootstrapSwitch('state'))
                Settings.activeParts.push('rdng');
            if (this.$('#parts #rune').bootstrapSwitch('state'))
                Settings.activeParts.push('rune');
            skritter.user.settings.set('squigs', this.$('#parts #raw-squigs').prop('checked'));
            if (this.$('#parts #tone').bootstrapSwitch('state'))
                Settings.activeParts.push('tone');
            if (Settings.activeParts.length === 0) {
                skritter.modals.show('confirmation').set('.modal-header', false).set('.modal-body', 'You must enable at least one part!', 'text-center');
                return false;
            }
            skritter.user.settings.activeParts(Settings.activeParts);
            skritter.router.back();
            event.preventDefault();
        }
    });
    
    return Settings;
});

