/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/settings.html'
], function(BasePage, TemplateMobile) {
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
        },
        /**
         * @method render
         * @returns {PageSettings}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.adjAudio = this.$('#adjustments #audio');
            this.elements.adjHeisig = this.$('#adjustments #heisig');
            this.elements.adjHideReading = this.$('#adjustments #hide-reading');
            this.elements.adjRawSquigs = this.$('#adjustments #raw-squigs');
            this.elements.adjReadingStyle = this.$('#adjustments #reading-style');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageSettings}
         */
        renderElements: function() {
            this.elements.adjAudio.bootstrapSwitch('state', this.settings.get('audio'));
            this.elements.adjHeisig.bootstrapSwitch('state', this.settings.get('showHeisig'));
            this.elements.adjHideReading.bootstrapSwitch('state', this.settings.get('hideReading'));
            this.elements.adjRawSquigs.bootstrapSwitch('state', this.settings.get('squigs'));
            if (app.user.isChinese()) {
                this.elements.adjReadingStyle.bootstrapSwitch('state', this.settings.get('readingStyle') === 'pinyin' ? true : false);
            } else {
                this.elements.adjReadingStyle.parent().parent().hide();
            }
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'switchChange.bootstrapSwitch #adjustments': 'updateAdjustments'
        }),
        /**
         * @method updateAdjustments
         * @param {Event} event
         */
        updateAdjustments: function(event) {
            event.preventDefault();
            this.settings.set({
                audio: this.elements.adjAudio.bootstrapSwitch('state'),
                hideReading: this.elements.adjHideReading.bootstrapSwitch('state'),
                readingStyle: this.elements.adjReadingStyle.bootstrapSwitch('state') ? 'pinyin' : 'zhuyin',
                showHeisig: this.elements.adjHeisig.bootstrapSwitch('state'),
                squigs: this.elements.adjRawSquigs.bootstrapSwitch('state')
            });
        }
    });

    return PageSettings;
});
