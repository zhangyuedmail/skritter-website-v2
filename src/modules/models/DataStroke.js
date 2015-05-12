/**
 * @module Application
 */
define([
    'core/modules/GelatoModel',
    'modules/collections/CanvasCharacter',
    'modules/models/CanvasStroke'
], function(GelatoModel, CanvasCharacter, CanvasStroke) {

    /**
     * @class DataStroke
     * @extends GelatoModel
     */
    var DataStroke = GelatoModel.extend({
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
         * @method getCanvasCharacter
         * @returns {CanvasCharacter}
         */
        getCanvasCharacter: function() {
            var character = new CanvasCharacter();
            var variations = _.clone(this.get('strokes'));
            var rune = this.get('rune');
            var targets = [];
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var target = new CanvasCharacter();
                var targetVariation = variations[a];
                var position = 1;
                target.position = a + 1;
                for (var b = 0, lengthB = targetVariation.length; b < lengthB; b++) {
                    var stroke = new CanvasStroke();
                    var strokeData = targetVariation[b];
                    var strokeId = strokeData[0];
                    var strokeParam = app.user.data.params.findWhere({strokeId: strokeId});
                    var strokeContains = strokeParam.get('contains');
                    stroke.set({
                        contains: strokeContains,
                        data: strokeData,
                        id: position + '-' + strokeId,
                        position: position,
                        shape: app.strokes.get(strokeId),
                        strokeId: strokeId,
                        tone: rune === 'tones' ? a + 1 : null
                    });
                    position += strokeContains.length || 1;
                    target.add(stroke);
                }
                targets.push(target);
            }
            character.targets = targets;
            character.writing = rune;
            return character;
        }
    });

    return DataStroke;

});