/**
 * @module Framework
 */
define([], function() {
    return Backbone.Router.extend({
        /**
         * @class GelatoRouter
         * @extends Backbone.Router
         * @constructor
         */
        initialize: function() {
            this.currentView = undefined;
        },
        /**
         * @method after
         */
        after: function() {
            if (this.currentView) {
                this.currentView.$("input[type='checkbox']").bootstrapSwitch();
            }
        },
        /**
         * @method before
         */
        before: function() {
            if (this.currentView) {
                this.currentView.remove();
            }
            this.currentView = undefined;
        }
    });
});