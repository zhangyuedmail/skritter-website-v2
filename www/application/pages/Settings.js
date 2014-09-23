/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/desktop/settings.html'
], function(BasePage, TemplateDesktop) {
    /**
     * @class PageSettings
     * @extends BasePage
     */
    var PageSettings = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.settings.title;
            this.settings = app.user.settings;
            this.activeParts = [];
            this.activeStyles = [];
            this.enabledParts = [];
        },
        /**
         * @method render
         * @returns {PageSettings}
         */
        render: function() {
            this.$el.html(this.compile(TemplateDesktop));
            this.undelegateEvents();
            this.activeParts = this.settings.getActiveParts();
            this.activeStyles = this.settings.getActiveStyles();
            this.enabledParts = this.settings.getEnabledParts();
            this.elements.partDefn = this.$('#parts #defn');
            this.elements.partRdng = this.$('#parts #rdng');
            this.elements.partRune = this.$('#parts #rune');
            this.elements.partTone = this.$('#parts #tone');
            this.elements.readingStyle = this.$('#general #reading-style');
            this.elements.styleSimp = this.$('#parts #simp');
            this.elements.styleTrad = this.$('#parts #trad');
            this.renderElements();
            this.delegateEvents();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageSettings}
         */
        renderElements: function() {
            if (app.user.isChinese()) {
                this.elements.readingStyle.bootstrapSwitch('state', this.settings.get('readingStyle') === 'pinyin' ? true : false);
            } else {
                this.elements.readingStyle.parent().parent().parent().hide();
            }
            this.elements.partDefn.bootstrapSwitch('state', this.activeParts.indexOf('defn') > -1);
            this.elements.partRdng.bootstrapSwitch('state', this.activeParts.indexOf('rdng') > -1);
            this.elements.partRune.bootstrapSwitch('state', this.activeParts.indexOf('rune') > -1);
            if (app.user.isJapanese()) {
                this.elements.partTone.parent().parent().hide();
            } else {
                this.elements.partTone.bootstrapSwitch('state', this.activeParts.indexOf('tone') > -1);
            }
            this.elements.partDefn.bootstrapSwitch('disabled', this.enabledParts.indexOf('defn') === -1);
            this.elements.partRdng.bootstrapSwitch('disabled', this.enabledParts.indexOf('rdng') === -1);
            this.elements.partRune.bootstrapSwitch('disabled', this.enabledParts.indexOf('rune') === -1);
            this.elements.partTone.bootstrapSwitch('disabled', this.enabledParts.indexOf('tone') === -1);
            if (app.user.isChinese()) {
                this.elements.styleSimp.bootstrapSwitch('state', this.activeStyles.indexOf('simp') > -1);
                this.elements.styleTrad.bootstrapSwitch('state', this.activeStyles.indexOf('trad') > -1);
            } else {
                this.$('#styles').hide();
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'switchChange.bootstrapSwitch #parts': 'updateParts',
            'switchChange.bootstrapSwitch #styles': 'updateStyles'
        }),
        /**
         * @method updateParts
         * @param {Event} event
         */
        updateParts: function(event) {
            event.preventDefault();
            this.activeParts = [];
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
            this.settings.setActiveParts(this.activeParts);
        },
        /**
         * @method updateParts
         * @param {Event} event
         */
        updateStyles: function(event) {
            event.preventDefault();
            this.activeStyles = [];
            if (this.$('#styles #simp').bootstrapSwitch('state')) {
                this.activeStyles.push('simp');
            }
            if (this.$('#styles #trad').bootstrapSwitch('state')) {
                this.activeStyles.push('trad');
            }
            this.settings.setActiveStyles(['both'].concat(this.activeStyles));
        }
    });

    return PageSettings;
});
