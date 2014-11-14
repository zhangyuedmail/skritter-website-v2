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
            this.elements.adjStudyKana = this.$('#adjustments #study-kana');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageSettings}
         */
        renderElements: function() {
            this.undelegateEvents();
            this.elements.adjAudio.bootstrapSwitch('state', this.settings.get('volume') ? true : false);
            this.elements.adjHeisig.bootstrapSwitch('state', this.settings.get('showHeisig'));
            this.elements.adjHideReading.bootstrapSwitch('state', this.settings.get('hideReading'));
            this.elements.adjRawSquigs.bootstrapSwitch('state', this.settings.get('squigs'));
            if (app.user.isChinese()) {
                this.elements.adjReadingStyle.bootstrapSwitch('state', this.settings.get('readingStyle') === 'pinyin' ? true : false);
            } else {
                this.elements.adjReadingStyle.parent().parent().hide();
            }
            if (app.user.isJapanese()) {
                this.elements.adjStudyKana.bootstrapSwitch('state', this.settings.get('studyKana'));
            } else {
                this.elements.adjStudyKana.parent().parent().hide();
            }
            this.delegateEvents();
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
         * @method toggleStudyKana
         */
        toggleStudyKana: function() {
            var self = this;
            var toggleState = self.elements.adjStudyKana.bootstrapSwitch('state');
            app.analytics.trackEvent('Settings', 'click', 'study_kana');
            app.dialogs.show().element('.message-title').text((toggleState ? 'Enabling' : 'Disabling') + ' Kana');
            app.dialogs.element('.message-text').text('');
            async.series([
                function(callback) {
                    self.settings.set('studyKana', toggleState).update(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    app.user.data.items.downloadAll(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    app.dialogs.element('.message-title').text('Something went wrong.');
                    app.dialogs.element('.message-text').text('Check your connection and click reload.');
                    app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                    app.dialogs.element('.message-confirm button').on('vclick', function() {
                        app.reload();
                    });
                } else {
                    app.reload();
                }
            });

        },
        /**
         * @method updateAdjustments
         * @param {Event} event
         */
        updateAdjustments: function(event) {
            event.preventDefault();
            if (!this.settings.equals('studyKana', this.elements.adjStudyKana.bootstrapSwitch('state'))) {
                this.toggleStudyKana();
            }
            this.settings.set({
                hideReading: this.elements.adjHideReading.bootstrapSwitch('state'),
                readingStyle: this.elements.adjReadingStyle.bootstrapSwitch('state') ? 'pinyin' : 'zhuyin',
                showHeisig: this.elements.adjHeisig.bootstrapSwitch('state'),
                squigs: this.elements.adjRawSquigs.bootstrapSwitch('state'),
                volume: this.elements.adjAudio.bootstrapSwitch('state') ? 1 : 0
            }).update();
        }
    });

    return PageSettings;
});
