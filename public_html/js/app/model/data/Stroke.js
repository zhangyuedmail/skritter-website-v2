/**
 * @module Skritter
 * @submodule Models
 * @param PromptCharacter
 * @param PromptStroke
 * @author Joshua McFarland
 */
define([
    'collection/prompt/Character',
    'model/prompt/Stroke'
], function(PromptCharacter, PromptStroke) {
    /**
     * @class DataStroke
     */
    var Stroke = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'rune',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('stroke', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getCanvasCharacter
         * @returns {Backbone.Model}
         */
        getCanvasCharacter: function() {
            var character = new PromptCharacter();
            var targets = [];
            var variations = this.get('strokes');
            var rune = this.get('rune');
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var target = new PromptCharacter();
                var variation = variations[a];
                var position = 1;
                target.name = rune;
                target.variation = a + 1;
                for (var b = 0, lengthB = variation.length; b < lengthB; b++) {
                    var stroke = new PromptStroke();
                    var data = variation[b];
                    var bitmapId = data[0];
                    var params = skritter.params.findWhere({bitmapId: bitmapId});
                    stroke.set({
                        bitmapId: bitmapId,
                        corners: params ? params.get('corners') : [],
                        data: data,
                        deviations: params ? params.get('deviations') : [],
                        id: position + '|' + bitmapId,
                        kana: bitmapId >= 600 ? true : false,
                        position: position,
                        shape: skritter.assets.getStroke(bitmapId),
                        tone: rune === 'tones' ? a + 1 : undefined
                    });
                    if (params && params.has('contains')) {
                        stroke.set('contains', params.get('contains'));
                        position += 2;
                    } else {
                        position += 1;
                    }
                    target.add(stroke);
                }
                targets.push(target);
            }
            character.targets = rune === 'tones' ? targets : targets.reverse();
            return character;
        }
    });

    return Stroke;
});