var GelatoModel = require('gelato/modules/model');
var PromptCharacter = require('collections/prompt-character');
var PromptStroke = require('models/prompt-stroke');

/**
 * @class DataStroke
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property idAttribute
     * @type String
     */
    idAttribute: 'rune',
    /**
     * @method getPromptCharacter
     * @returns {PromptCharacter}
     */
    getPromptCharacter: function() {
        var character = new PromptCharacter();
        var variations = _.clone(this.get('strokes'));
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
                var strokeParam = app.user.data.params.findWhere({strokeId: strokeId});
                var strokeContains = strokeParam.get('contains');
                stroke.set({
                    contains: strokeContains,
                    data: strokeData,
                    id: strokePosition + '-' + strokeId,
                    position: strokePosition,
                    shape: app.user.data.strokes.shapes.get(strokeId),
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
    }
});
