define([
    'view/prompt/Prompt'
], function(Prompt) {
    /**
     * @class Rdng
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        }
    });
    
    return Rdng;
});