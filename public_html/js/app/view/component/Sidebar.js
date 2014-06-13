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
        },
        /**
         * @property {Object} events
         */
        events: {
        }
    });

    return View;
});