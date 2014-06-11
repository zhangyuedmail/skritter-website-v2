define([
    'require.text!template/study-settings.html',
    'base/View'
], function(templateStudySettings, BaseView) {
    /**
     * @class StudySettings
     */
    var Settings = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
            this.activeParts = [];
            this.activeStyles = [];
            this.enabledParts = [];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudySettings);
            this.activeParts = skritter.user.getActiveParts();
            this.activeStyles = skritter.user.getActiveStyles();
            this.enabledParts = skritter.user.getEnabledParts();
            this.$('input.bootswitch').bootstrapSwitch();
            this.$('#general #audio').bootstrapSwitch('state', skritter.user.settings.get('audio'));
            this.$('#general #hide-due-count').bootstrapSwitch('state', skritter.user.settings.get('hideCounter'));
            this.$('#general #hide-timer').bootstrapSwitch('state', skritter.user.settings.get('hideTimer'));
            this.$('#general #raw-squigs').bootstrapSwitch('state', skritter.user.settings.get('squigs'));
            this.$('#general #teaching-mode').bootstrapSwitch('state', skritter.user.settings.get('teachingMode'));
            if (skritter.user.isChinese()) {
                this.$('#general #reading-style').bootstrapSwitch('state', skritter.user.settings.get('readingStyle') === 'pinyin' ? true : false);
            } else {
                this.$('#general #reading-style').parent().parent().parent().hide();
            }
            this.$('#parts #defn').bootstrapSwitch('state', this.activeParts.indexOf('defn') > -1);
            this.$('#parts #rdng').bootstrapSwitch('state', this.activeParts.indexOf('rdng') > -1);
            this.$('#parts #rune').bootstrapSwitch('state', this.activeParts.indexOf('rune') > -1);
            if (skritter.user.isJapanese()) {
                this.$('#parts #tone').parent().parent().parent().hide();
            } else {
                this.$('#parts #tone').bootstrapSwitch('state', this.activeParts.indexOf('tone') > -1);
            }
            this.$('#parts #defn').bootstrapSwitch('disabled', this.enabledParts.indexOf('defn') === -1);
            this.$('#parts #rdng').bootstrapSwitch('disabled', this.enabledParts.indexOf('rdng') === -1);
            this.$('#parts #rune').bootstrapSwitch('disabled', this.enabledParts.indexOf('rune') === -1);
            this.$('#parts #tone').bootstrapSwitch('disabled', this.enabledParts.indexOf('tone') === -1);
            if (skritter.user.isChinese()) {
                this.$('#styles #simp').bootstrapSwitch('state', this.activeStyles.indexOf('simp') > -1);
                this.$('#styles #trad').bootstrapSwitch('state', this.activeStyles.indexOf('trad') > -1);
            } else {
                this.$('#styles').hide();
            }
            BaseView.prototype.render.call(this).renderElements();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-cancel': 'cancel',
                'vclick .button-save': 'save'
            });
        },
        /**
         * @method cancel
         * @param {Object} event
         */
        cancel: function(event) {
            skritter.router.navigate('study', {replace: true, trigger: true});
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
            this.activeParts = [];
            this.activeStyles = [];
            skritter.user.settings.set('audio', this.$('#general #audio').prop('checked'));
            skritter.user.settings.set('hideCounter', this.$('#general #hide-due-count').prop('checked'));
            skritter.user.settings.set('hideTimer', this.$('#general #hide-timer').prop('checked'));
            skritter.user.settings.set('squigs', this.$('#general #raw-squigs').prop('checked'));
            skritter.user.settings.set('teachingMode', this.$('#general #teaching-mode').prop('checked'));
            skritter.user.settings.set('readingStyle', this.$('#general #reading-style').prop('checked') ? 'pinyin' : 'zhuyin');
            if (this.$('#parts #defn').bootstrapSwitch('state')) {
                this.activeParts.push('defn');
            }
            if (this.$('#parts #rdng').bootstrapSwitch('state')) {
                this.activeParts.push('rdng');
            }
            if (this.$('#parts #rune').bootstrapSwitch('state')) {
                this.activeParts.push('rune');
            }
            if (this.$('#parts #tone').bootstrapSwitch('state')) {
                this.activeParts.push('tone');
            }
            if (this.activeParts.length === 0) {
                skritter.modal.show('confirm').set('.modal-header', false).set('.modal-body', 'You must enable at least one part!', 'text-center');
                return false;
            }
            if (this.$('#styles #simp').bootstrapSwitch('state')) {
                this.activeStyles.push('simp');
            }
            if (this.$('#styles #trad').bootstrapSwitch('state')) {
                this.activeStyles.push('trad');
            }
            if (this.activeStyles.length === 0) {
                skritter.modal.show('confirm').set('.modal-header', false).set('.modal-body', 'You must enable at least one style!', 'text-center');
                return false;
            }
            skritter.user.setActiveParts(this.activeParts);
            skritter.user.setActiveStyles(['both'].concat(this.activeStyles));
            skritter.router.navigate('study', {replace: true, trigger: true});
            event.preventDefault();
        }
    });

    return Settings;
});

