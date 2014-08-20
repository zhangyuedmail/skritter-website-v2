/**
 * @module Application
 */
define([
    "framework/GelatoCollection",
    "app/models/prompts/PromptStroke"
], function(GelatoCollection, PromptStroke) {
    /**
     * @class PromptCharacter
     * @extend GelatoCollection
     */
    var PromptCharacter = GelatoCollection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.stroke = undefined;
            this.variations = [];
        },
        /**
         * @property model
         * @type PromptStroke
         */
        model: PromptStroke,
        /**
         * @method getContainer
         * @param {Number} size
         * @returns {createjs.Container}
         */
        getContainer: function(size) {
            var container = new createjs.Container();
            for (var i = 0, length = this.length; i < length; i++) {
                container.addChild(this.at(i).inflateShape(size));
            }
            return container;
        },
        /**
         * @method setVariations
         * @param {DataStroke} stroke
         * @returns {PromptCharacter}
         */
        setVariations: function(stroke) {
            this.variations = [];
            this.stroke = stroke;
            var variations = stroke.get("strokes");
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var variation = new PromptCharacter();
                var position = 0;
                for (var b = 0, lengthB = variations[a].length; b < lengthB; b++) {
                    var stroke = new PromptStroke();
                    var data = variations[a][b];
                    var param = app.user.data.params.findWhere({strokeId: data[0]});
                    stroke.set({
                        data: data,
                        id: a + "|" + position,
                        position: position,
                        shape: app.assets.getStroke(data[0]),
                        strokeId: data[0],
                        variation: a
                    });
                    if (param && param.has("contains")) {
                        position += 2;
                    } else {
                        position += 1;
                    }
                    variation.add(stroke);
                }
                this.variations.push(variation);
            }
            return this;
        }
    });

    return PromptCharacter;
});