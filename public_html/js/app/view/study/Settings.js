/**
 * @module Skritter
 * @submodule Views
 * @param templateStudySettings
 * @author Joshua McFarland
 */
define([
    'require.text!template/study-settings.html'
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
            Settings.enabledParts = [];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudySettings);
            Settings.activeParts = skritter.user.settings.getActiveParts();
            Settings.enabledParts = skritter.user.settings.getEnabledParts();
            this.$('input.bootswitch').bootstrapSwitch();
            this.$('#general #audio').bootstrapSwitch('state', skritter.user.settings.get('audio'));
            this.$('#general #hide-due-count').bootstrapSwitch('state', skritter.user.settings.get('hideDueCount'));
            this.$('#general #hide-timer').bootstrapSwitch('state', skritter.user.settings.get('hideTimer'));
            this.$('#general #raw-squigs').bootstrapSwitch('state', skritter.user.settings.get('squigs'));
            this.$('#general #teaching-mode').bootstrapSwitch('state', skritter.user.settings.get('teachingMode'));
            this.$('#parts #defn').bootstrapSwitch('state', Settings.activeParts.indexOf('defn') > -1);
            this.$('#parts #rdng').bootstrapSwitch('state', Settings.activeParts.indexOf('rdng') > -1);
            this.$('#parts #rune').bootstrapSwitch('state', Settings.activeParts.indexOf('rune') > -1);
            if (skritter.user.settings.isJapanese()) {
                this.$('#parts #tone').parent().parent().parent().hide();
            } else {
                this.$('#parts #tone').bootstrapSwitch('state', Settings.activeParts.indexOf('tone') > -1);
            }
            this.$('#parts #defn').bootstrapSwitch('disabled', Settings.enabledParts.indexOf('defn') === -1);
            this.$('#parts #rdng').bootstrapSwitch('disabled', Settings.enabledParts.indexOf('rdng') === -1);
            this.$('#parts #rune').bootstrapSwitch('disabled', Settings.enabledParts.indexOf('rune') === -1);
            this.$('#parts #tone').bootstrapSwitch('disabled', Settings.enabledParts.indexOf('tone') === -1);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click #view-study-settings .button-cancel': 'cancel',
            'click #view-study-settings .button-save': 'save'
        },
        /**
         * @method cancel
         * @param {Object} event
         */
        cancel: function(event) {
            skritter.router.navigate('study', {trigger: true, replace: true});
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method save
         * @param {Object} event
         */
        save: function(event) {
            Settings.activeParts = [];
            skritter.user.settings.set('audio', this.$('#general #audio').prop('checked'));
            skritter.user.settings.set('hideDueCount', this.$('#general #hide-due-count').prop('checked'));
            skritter.user.settings.set('hideTimer', this.$('#general #hide-timer').prop('checked'));
            skritter.user.settings.set('squigs', this.$('#general #raw-squigs').prop('checked'));
            skritter.user.settings.set('teachingMode', this.$('#general #teaching-mode').prop('checked'));
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
            }
            skritter.user.settings.setActiveParts(Settings.activeParts);
            skritter.user.scheduler.load(function() {
                skritter.user.scheduler.sort();
                skritter.router.navigate('study', {trigger: true, replace: true});
            });
            event.preventDefault();
        }
    });
    
    return Settings;
});

