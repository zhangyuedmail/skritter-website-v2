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
            var variations = this.clone().get('strokes');
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
                    //TODO: fix this after data params reformat
                    var strokeParam = app.user.data.params.findWhere({strokeId: strokeId});
                    var strokeContains = strokeParam.get('contains');
                    stroke.set({
                        contains: strokeContains,
                        data: strokeData,
                        id: position + '-' + strokeId,
                        position: position,
                        shape: app.strokes.get(strokeId),
                        strokeId: strokeId
                    });
                    position += strokeContains.length || 1;
                    target.add(stroke);
                }
                targets.push(target);
            }
            character.name = this.get('rune');
            character.targets = targets;
            return character;
        }
    });

    return DataStroke;

});