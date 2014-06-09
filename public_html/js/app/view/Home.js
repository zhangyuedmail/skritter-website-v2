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
            return this;
        },
        /**
         * @method renderElements
         */
        renderElements: function() {
            BaseView.prototype.renderElements.call(this);
            this.elements.dueCount = this.$('.due-count');
            this.elements.listCount = this.$('.list-count');
        },
        /**
         * @property {Object} events
         */
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
            });
        }
    });
    
    return View;
    
});