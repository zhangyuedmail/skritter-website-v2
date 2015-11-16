var Model = require('base/model');
var PromptCharacter = require('collections/prompt-character');
var PromptStroke = require('models/prompt-stroke');

/**
 * @class Stroke
 * @extends {Model}
 */
module.exports = Model.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'rune',
    /**
     * @method getPromptCharacter
     * @returns {PromptCharacter}
     */
    getPromptCharacter: function() {
        var character = new PromptCharacter();
        var variations = this.clone().get('strokes');
        var rune = this.get('rune');
        var targets = [];
        for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
            var target = new PromptCharacter();
            var targetVariation = variations[a];
            var strokePosition = 0;
            target.position = a;
            for (var b = 0, lengthB = targetVariation.length; b < lengthB; b++) {
                var stroke = new PromptStroke();
                var strokeData = targetVariation[b];
                var strokeId = strokeData[0];
                var strokeParams = this.collection.params.where({strokeId: strokeId});
                var strokeContains = strokeParams[0].get('contains');
                var strokeShape = this.collection.shapes.get(strokeId);
                stroke.set({
                    contains: strokeContains,
                    data: strokeData,
                    id: strokePosition + '-' + strokeId,
                    params: strokeParams,
                    position: strokePosition,
                    shape: strokeShape,
                    strokeId: strokeId,
                    tone: rune === 'tones' ? a + 1 : null
                });
                strokePosition += strokeContains.length || 1;
                target.add(stroke);
            }
            targets.push(target);
        }
        character.targets = targets;
        character.writing = rune;
        return character;
    },
    /**
     * @method isKana
     * @returns {Boolean}
     */
    isKana: function() {
        return app.fn.isKana(this.get('rune'));
    }
});
