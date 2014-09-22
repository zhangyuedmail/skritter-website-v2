/**
 * @module Application
 */
define([
   'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataVocab
     * @extends BaseModel
     */
    var DataVocab = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            containedVocabIds: []
        },
        /**
         * @method getCanvasCharacters
         * @returns {Array}
         */
        getCanvasCharacters: function() {
            //TODO: clean this up and handle errors
            var canvasCharacters = [];
            var stroke;
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds.length) {
                for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                    stroke = app.user.data.vocabs.get(containedVocabIds[i]).getStroke();
                    if (stroke) {
                        canvasCharacters.push(stroke.getCanvasCharacter());
                    }
                }
            } else {
                stroke = this.getStroke();
                if (stroke) {
                    canvasCharacters.push(stroke.getCanvasCharacter());
                }
            }
            return canvasCharacters;
        },
        /**
         * @method getContainedItemIds
         * @param {String} part
         * @returns {Array}
         */
        getContainedItemIds: function(part) {
            var containedItemIds = [];
            var containedVocabIds = this.get('containedVocabIds');
            for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                if (part === 'tone') {
                    var splitId = containedVocabIds[i].split('-');
                    containedItemIds.push(app.user.id + '-' + splitId[0] + '-' + splitId[1] + '-0-' + part);
                } else {
                    containedItemIds.push(app.user.id + '-' + containedVocabIds[i] + '-' + part);
                }
            }
            return containedItemIds;
        },
        /**
         * @method getDefinition
         * @returns {String}
         */
        getDefinition: function() {
            var customDefinition = this.get('customDefinition');
            var definition = this.get('definitions')[app.user.settings.get('sourceLang')];
            if (customDefinition && customDefinition !== '') {
                return this.get('customDefinition');
            } else if (definition) {
                return definition;
            } else {
                return this.get('definitions').en;
            }
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return app.fn.pinyin.toTone(this.get('reading'));
        },
        /**
         * @method getStroke
         * @returns {DataStroke}
         */
        getStroke: function() {
            return app.user.data.strokes.get(this.get('writing'));
        },
        /**
         * @method getWriting
         * @returns {String}
         */
        getWriting: function() {
            return this.get('writing');
        }
    });

    return DataVocab;
});
