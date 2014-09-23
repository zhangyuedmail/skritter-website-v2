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
         * @param {Number} [startFrom]
         * @param {Object} [options]
         * @returns {String}
         */
        getReading: function(startFrom, options) {
            var html = '';
            var position = 1;
            var fillers = [" ... ", "'"];
            options = options ? options : {};
            options.hide = options.hide ? options.hide : false;
            options.mask = options.mask ? options.mask : false;
            options.zhuyin = options.zhuyin ? options.zhuyin : false;
            var segments = app.fn.segmentReading(this.get('reading'));
            for (var a = 0, lengthA = segments.length; a < lengthA; a++) {
                var segment = segments[a];
                html += "<div class='reading-" + (a + 1) + "'>";
                for (var b = 0, lengthB = segment.length; b < lengthB; b++) {
                    var piece = segment[b];
                    if (fillers.indexOf(piece) === -1) {
                        var pieceMasked = piece.replace(/[1-5]/g, '');
                        var pieceMaskedZhuyin = app.fn.pinyin.toZhuyin(pieceMasked + '5');
                        var pieceTone = app.fn.pinyin.toTone(piece);
                        var pieceZhuyin = app.fn.pinyin.toZhuyin(piece);
                        if (!startFrom || startFrom > position) {
                            html += "<span class='position-" + position + "'>";
                            html += options.zhuyin ? pieceZhuyin : pieceTone;
                            html += "</span>";
                        } else {
                            if (options.hide) {
                                html += "<span class='position-" + position + " reading-button'><span>";
                                html += options.zhuyin ? pieceMaskedZhuyin : pieceMasked;
                                html += "</span></span>";
                            } else if (options.mask) {
                                html += "<span class='position-" + position + " reading-masked'><span>";
                                html += options.zhuyin ? pieceMaskedZhuyin : pieceMasked;
                                html += "</span></span>";
                            } else {
                                html += "<span class='position-" + position + " reading-hidden'>";
                                html += "<span>" + piece + "</span></span>";
                            }
                        }
                        position++;
                    } else {
                        html += "<span class='reading-filler'>" + piece + "</span>";
                    }

                }
                html += "</div>";
            }
            return html;
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
         * @param {Number} [startFrom]
         * @returns {String}
         */
        getWriting: function(startFrom) {
            var html = '';
            var position = 1;
            var allCharacters = this.get('writing').split('');
            var containedCharacters = this.getCharacters();
            for (var i = 0, length = allCharacters.length; i < length; i++) {
                var character = allCharacters[i];
                if (containedCharacters.indexOf(character) > -1) {
                    if (!startFrom || startFrom > position) {
                        html += "<span id='writing-" + position + "'>" + character + "</span>";
                    } else {
                        html += "<span id='writing-" + position + "' class='writing-hidden'>";
                        html += "<span>" + character + "</span></span>";
                    }
                    position++;
                } else {
                    html += "<span class='writing-filler'>" + character + "</span>";
                }
            }
            return html;
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.get('lang') === 'zh';
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.get('lang') === 'ja';
        }
    });

    return DataVocab;
});
