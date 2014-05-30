define([
    'model/prompt/Stroke'
], function(Stroke) {
    /**
     * @class PromptCharacter
     */
    var Character = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {CanvasStroke} model
         */
        model: Stroke
    });

    return Character;
});