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
         * @method preloadFont
         */
        preloadFont: function() {
            if (!this.$('#font-preloader').length) {
                this.$el.append("<div id='font-preloader'></div>");
            }
            if (skritter.user.getLanguageCode() === 'zh') {
                this.$('#font-preloader').text('力').addClass('chinese-text');
            } else {
                this.$('#font-preloader').text('力').addClass('japanese-text');
            }
        },
        /**
         * @method disableForm
         */
        disableForm: function() {
            this.$(':input').prop('disabled', true);
        },
        /**
         * @method enableForm
         */
        enableForm: function() {
            this.$(':input').prop('disabled', false);
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