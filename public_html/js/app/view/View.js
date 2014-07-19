define([], function() {
    /**
     * @class View
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.elements = {};
        },
        /**
         * @property {Object} events
         */
        events: {
            'vclick .button-back': 'handleClickButtonBack'
        },
        /**
         * @method disableForm
         * @param {String} selector
         */
        disableForm: function(selector) {
            this.$((selector ? selector + ' ': '') + ':input').prop('disabled', true);
        },
        /**
         * @method enableForm
         * @param {String} selector
         */
        enableForm: function(selector) {
            this.$((selector ? selector: ' ') + ':input').prop('disabled', false);
        },
        /**
         * @method handleClickButtonBack
         * @param {Object} event
         */
        handleClickButtonBack: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method preloadFont
         * @returns {View}
         */
        preloadFont: function() {
            if (skritter.user.getLanguageCode() === 'zh') {
                this.$('.font-preloader').addClass('chinese-text');
            } else {
                this.$('.font-preloader').addClass('japanese-text');
            }
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
        },
        /**
         * @method replaceCharacterFont
         */
        replaceCharacterFont: function() {
            $('.character-font').addClass(skritter.user.getFontClass());
        },
        /**
         * @method setTitle
         * @param {String} title
         * @returns {View}
         */
        setTitle: function(title) {
            window.document.title = title + ' - Skritter';
            if (skritter.fn.hasCordova()) {
                navigator.analytics.trackView(title);
            }
            return this;
        }
    });

    return View;
});