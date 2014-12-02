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
            this.elements.settingAudio = this.$('#audio');
            this.elements.settingAudioTTS = this.$('#audio-tts');
            this.elements.settingAutoAdd = this.$('#auto-add');
            this.elements.settingAutoAddLimit = undefined;
            this.elements.settingHeisig = this.$('#heisig');
            this.elements.settingHideReading = this.$('#hide-reading');
            this.elements.settingRawSquigs = this.$('#raw-squigs');
            this.elements.settingReadingStyle = this.$('#reading-style');
            this.elements.settingStudyKana = this.$('#study-kana');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageSettings}
         */
        renderElements: function() {
            this.undelegateEvents();
            this.elements.settingAudio.bootstrapSwitch('state', this.settings.get('volume') ? true : false);
            this.elements.settingAudioTTS.bootstrapSwitch('state', this.settings.get('audioTTS'));
            this.elements.settingAutoAdd.bootstrapSwitch('state', this.settings.get('autoAdd'));
            this.elements.settingHeisig.bootstrapSwitch('state', this.settings.get('showHeisig'));
            this.elements.settingHideReading.bootstrapSwitch('state', this.settings.get('hideReading'));
            this.elements.settingRawSquigs.bootstrapSwitch('state', this.settings.get('squigs'));
            if (app.user.isChinese()) {
                this.elements.settingReadingStyle.bootstrapSwitch('state', this.settings.get('readingStyle') === 'pinyin' ? true : false);
            } else {
                this.elements.settingReadingStyle.parent().parent().hide();
            }
            if (app.user.isJapanese()) {
                this.elements.settingStudyKana.bootstrapSwitch('state', this.settings.get('studyKana'));
            } else {
                this.elements.settingStudyKana.parent().parent().hide();
            }
            this.elements.settingAutoAddLimit = new Slider('#daily-limit-slider');
            this.elements.settingAutoAddLimit.setValue(this.settings.get('autoAddLimit'));
            this.updateAutoAddLimitSlider({value: this.settings.get('autoAddLimit')});
            this.delegateEvents();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'slide #daily-limit-slider': 'updateAutoAddLimitSlider',
            'switchChange.bootstrapSwitch #audio': 'toggleSettings',
            'switchChange.bootstrapSwitch #auto-add': 'toggleSettings',
            'switchChange.bootstrapSwitch #heisig': 'toggleSettings',
            'switchChange.bootstrapSwitch #hide-reading': 'toggleSettings',
            'switchChange.bootstrapSwitch #raw-squigs': 'toggleSettings',
            'switchChange.bootstrapSwitch #reading-style': 'toggleSettings',
            'switchChange.bootstrapSwitch #study-kana': 'toggleStudyKana'
        }),
        /**
         * @method toggleStudyKana
         * @param {Event} event
         */
        toggleStudyKana: function(event) {
            event.preventDefault();
            var self = this;
            app.analytics.trackEvent('Settings', 'click', 'study_kana');
            app.user.data.toggleKana(function() {
                app.reload();
            }, function() {
                self.renderElements();
            });
        },
        /**
         * @method toggleSettings
         * @param {Event} event
         */
        toggleSettings: function(event) {
            event.preventDefault();
            this.settings.set({
                autoAdd: this.elements.settingAutoAdd.bootstrapSwitch('state'),
                hideReading: this.elements.settingHideReading.bootstrapSwitch('state'),
                readingStyle: this.elements.settingReadingStyle.bootstrapSwitch('state') ? 'pinyin' : 'zhuyin',
                showHeisig: this.elements.settingHeisig.bootstrapSwitch('state'),
                squigs: this.elements.settingRawSquigs.bootstrapSwitch('state'),
                volume: this.elements.settingAudio.bootstrapSwitch('state') ? 1 : 0
            }).update();
        },
        /**
         * @method updateAutoAddLimitSlider
         * @param {Event|Object} event
         */
        updateAutoAddLimitSlider: function(event) {
            this.settings.set('autoAddLimit', event.value);
            $('#daily-limit-slider-label').text(event.value);
        }
    });

    return PageSettings;
});
