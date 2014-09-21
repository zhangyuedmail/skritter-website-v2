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
                    var stroke = new CanvasStroke();
                    var data = variation[b];
                    var bitmapId = data[0];
                    var params = app.user.data.params.findWhere({strokeId: bitmapId});
                    stroke.set({
                        bitmapId: bitmapId,
                        data: data,
                        id: position + '|' + bitmapId,
                        kana: bitmapId >= 600 ? true : false,
                        position: position,
                        shape: app.assets.getStroke(bitmapId),
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

    return DataStroke;
});
