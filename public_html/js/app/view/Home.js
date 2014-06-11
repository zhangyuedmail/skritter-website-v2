define([
    'require.text!template/home.html',
    'base/View'
], function(template, BaseView) {
    /**
     * @class Home
     */
    var View = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            BaseView.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            window.document.title = "Home - Skritter";
            this.$el.html(_.template(template, skritter.strings));
            BaseView.prototype.render.call(this).renderElements();
            this.elements.dueCount.text(skritter.user.scheduler.getDueCount(true));
            if (skritter.user.data.reviews.length > 1) {
                this.elements.buttonSync.show();
            } else {
                this.elements.buttonSync.hide();
            }
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            BaseView.prototype.renderElements.call(this);
            this.elements.dueCount = this.$('.due-count');
            this.elements.listCount = this.$('.list-count');
            this.elements.buttonSync = this.$('.button-sync');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'vclick .button-sync': 'handleSyncClicked'
            });
        },
        /**
         * @method handleSyncClicked
         * @param {Object} event
         */
        handleSyncClicked: function(event) {
            event.preventDefault();
        }
    });
    
    return View;
    
});