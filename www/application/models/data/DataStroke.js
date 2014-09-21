/**
 * @module Application
 */
define([
   'framework/BaseModel',
    'prompts/CanvasCharacter',
    'prompts/CanvasStroke'
], function(BaseModel, CanvasCharacter, CanvasStroke) {
    /**
     * @class DataStroke
     * @extends BaseModel
     */
    var DataStroke = BaseModel.extend({
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
            var targets = [];
            var variations = this.get('strokes');
            var rune = this.get('rune');
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var target = new CanvasCharacter();
                var variation = variations[a];
                var position = 1;
                target.name = rune;
                target.variation = a + 1;
                for (var b = 0, lengthB = variation.length; b < lengthB; b++) {
                    var data = variation[b];
                    var stroke = new CanvasStroke();
                    var strokeId = data[0];
                    var param = app.user.data.params.findWhere({strokeId: strokeId});
                    stroke.set({
                        data: data,
                        id: position + '|' + strokeId,
                        position: position,
                        strokeId: strokeId
                    });
                    if (param && param.has('contains')) {
                        stroke.set('contains', param.get('contains'));
                        position += 2;
                    } else {
                        position += 1;
                    }
                    target.add(stroke);
                }
                targets.push(target);
            }
            character.targets = targets;
            return character;
        }
    });

    return DataStroke;
});
