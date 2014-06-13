define([
    'base/View'
], function(BaseView) {
    /**
     * @class Sidebar
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
            this.loadElements();
            return this;
        },
        /**
         * @method loadElements
         */
        loadElements: function() {
            this.elements.sidebar = this.$el;
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (this.elements) {
                if (this.elements && this.elements.sidebar.hasClass('expanded')) {
                    this.elements.sidebar.removeClass('expanded');
                    this.elements.sidebar.hide('slide', {direction: 'left'}, 200);
                } else {
                    this.elements.sidebar.addClass('expanded');
                    this.elements.sidebar.show('slide', {direction: 'left'}, 200);
                }
            }
        }
    });

    return View;
});