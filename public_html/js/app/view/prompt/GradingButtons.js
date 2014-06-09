define([
    'require.text!template/prompt-grading-buttons.html'
], function(template) {
    /**
     * @class PromptGradingButtons
     */
    var View = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(_.template(template, skritter.strings));
            return this;
        }
    });
    
    return View;
});