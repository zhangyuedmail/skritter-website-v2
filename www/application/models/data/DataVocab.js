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
         * @method getCharacterCount
         * @returns {Number}
         */
        getCharacterCount: function() {
            return this.getCharacters().length;
        },
        /**
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            var characters = [];
            if (this.has('containedVocabIds')) {
                var containedVocabs = this.getContainedVocabs();
                for (var i = 0, length = containedVocabs.length; i < length; i++) {
                    characters.push(containedVocabs[i].get('writing'));
                }
            } else {
                characters.push(this.get('writing'));
            }
            return characters;
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
         * @method getContainedVocabs
         * @returns {Array}
         */
        getContainedVocabs: function() {
            var vocabs = [];
            var containedIds = this.get('containedVocabIds');
            for (var i = 0, length = containedIds.length; i < length; i++) {
                vocabs.push(app.user.data.vocabs.get(containedIds[i]));
            }
            return vocabs;
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
         * @method getTones
         * @param {Number} position
         * @returns {Array}
         */
        getTones: function(position) {
            var tones = [];
            var reading = this.get('reading');
            if (reading.indexOf(', ') === -1) {
                reading = reading.match(/[0-9]+/g);
                for (var a = 0, lengthA = reading.length; a < lengthA; a++) {
                    tones.push([parseInt(reading[a], 10)]);
                }
            } else {
                reading = reading.split(', ');
                for (var b = 0, lengthB = reading.length; b < lengthB; b++) {
                    tones.push([app.fn.arrayToInt(reading[b].match(/[0-9]+/g))]);
                }
            }
            return _.flatten(this.getCharacterCount() > 1 ? tones[position - 1] : tones);
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
