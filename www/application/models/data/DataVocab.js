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
         * @method initialize
         */
        initialize: function() {
            //TODO: this should be removed when handled by server
            if (this.isJapanese() && this.has('containedVocabIds')) {
                this.set('containedVocabIds', _.without(this.get('containedVocabIds'), 'ja-～-0'));
            }
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.user.data.flagVocabUpdate(this.id);
            app.storage.putItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getAudio
         * @returns {Boolean|String}
         */
        getAudio: function() {
            if (this.has('audio')) {
                return app.isNative() ? this.get('audio').replace('/sounds?file=', '') : this.get('audio');
            }
            return false;
        },
        /**
         * @method getCanvasCharacter
         * @returns {CanvasCharacter}
         */
        getCanvasCharacter: function() {
            return this.getStroke() ? this.getStroke().getCanvasCharacter() : undefined;
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
                var containedVocabIds = this.get('containedVocabIds');
                for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                    if (this.isChinese()) {
                        characters.push(app.fn.mapper.fromBase(containedVocabIds[i]));
                    } else {
                        characters.push(containedVocabIds[i].split('-')[1]);
                    }
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
            if (this.has('containedVocabIds')) {
                var containedVocabIds = this.get('containedVocabIds');
                for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                    var containedVocabId = containedVocabIds[i];
                    var containedSplit = containedVocabId.split('-');
                    if (part === 'rune') {
                        containedItemIds.push(app.user.id + '-' + containedVocabId + '-' + part);
                    } else if (parseInt(containedSplit[2], 10) > 1) {
                        containedItemIds.push(app.user.id + '-' + containedVocabId + '-' + part);
                    } else {
                        containedItemIds.push(app.user.id + '-' + containedSplit[0] + '-' + containedSplit[1] + '-0-' + part);
                    }
                }
            }
            return containedItemIds;
        },
        /**
         * @method getContainedRows
         * @returns {String}
         */
        getContainedRows: function() {
            var containedHTML = '';
            var containedVocabs = _.without(this.getContainedVocabs(), undefined);
            containedHTML += "<table class='table-contained'><tbody>";
            for (var a = 0, lengthA = containedVocabs.length; a < lengthA; a++) {
                var vocabItem = containedVocabs[a];
                containedHTML += "<tr id='writing-" + vocabItem.get('writing') + "'>";
                containedHTML += "<td class='writing asian-font'>" + vocabItem.get('writing') + '</td>';
                containedHTML += "<td class='reading'>" + vocabItem.getReading() + '</td>';
                containedHTML += "<td class='definition'>" + vocabItem.getDefinition() + '</td>';
                containedHTML += "</tr>";
            }
            containedHTML += "</tbody></table>";
            return containedHTML;
        },
        /**
         * @method getContainedVocabs
         * @returns {Array}
         */
        getContainedVocabs: function() {
            var vocabs = [];
            var containedIds = this.has('containedVocabIds') ? this.get('containedVocabIds') : [this.id];
            for (var i = 0, length = containedIds.length; i < length; i++) {
                vocabs.push(this.collection.get(containedIds[i]));
            }
            return vocabs;
        },
        /**
         * @method getDecomp
         * @param {Boolean|DataDecomp}
         */
        getDecomp: function() {
            if (this.getCharacters().length === 1) {
                var decomp = app.user.data.decomps.get(this.getCharacters()[0]);
                if (decomp && !decomp.get('atomic')) {
                    return decomp;
                }
            }
            return false;
        },
        /**
         * @method getDefinition
         * @param {Boolean} [skipFormat]
         * @returns {String}
         */
        getDefinition: function(skipFormat) {
            var customDefinition = this.get('customDefinition');
            var definition = this.get('definitions')[app.user.settings.get('sourceLang')];
            if (customDefinition && customDefinition !== '') {
                definition = this.get('customDefinition');
            } else if (definition) {
                definition = definition;
            } else {
                definition = this.get('definitions').en;
            }
            return skipFormat ? definition : app.fn.textToHTML(definition);
        },
        /**
         * @method getKana
         * @returns {Array}
         */
        getKana: function() {
            return _.without(this.get('writing').split('').map(function(value) {
                return app.fn.isKana(value) ? value : false;
            }), false);
        },
        /**
         * @method getMnemonicText
         * @returns {String}
         */
        getMnemonicText: function() {
            return app.fn.textToHTML(this.get('mnemonic') ? this.get('mnemonic').text : '');
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
            var fillers = [" ... ", "'", " "];
            var segments = [];
            //TODO: fix for single character prompts with multiple readings
            startFrom = startFrom ? startFrom : false;
            options = options ? options : {};
            options.hide = options.hide ? options.hide : false;
            options.hideKana = options.hideKana ? options.hideKana : [];
            options.mask = options.mask ? options.mask : false;
            options.style = options.style === 'zhuyin' ? true : false;
            html += "<div class='reading-block'>";
            if (this.isChinese()) {
                segments = app.fn.segmentReading(this.get('reading'));
                for (var a = 0, lengthA = segments.length; a < lengthA; a++) {
                    var segment = segments[a];
                    html += "<div class='reading-" + (a + 1) + "'>";
                    for (var b = 0, lengthB = segment.length; b < lengthB; b++) {
                        var piece = segment[b];
                        if (fillers.indexOf(piece) === -1) {
                            var pieceMasked = piece.replace(/[1-5]/g, '').replace('lv', 'lü');
                            var pieceMaskedZhuyin = app.fn.pinyin.toZhuyin(pieceMasked + '5');
                            var pieceTone = app.fn.pinyin.toTone(piece);
                            var pieceZhuyin = app.fn.pinyin.toZhuyin(piece);
                            if (!startFrom || startFrom > position) {
                                if (!startFrom && options.hide) {
                                    html += "<span class='position-" + position + " reading-button'><span>";
                                    html += options.style ? pieceMaskedZhuyin : pieceMasked;
                                    html += "</span></span>";
                                } else {
                                    html += "<span class='position-" + position + "'>";
                                    html += options.style ? pieceZhuyin : pieceTone;
                                    html += "</span>";
                                }
                            } else {
                                if (options.hide) {
                                    html += "<span class='position-" + position + " reading-button'><span>";
                                    html += options.style ? pieceMaskedZhuyin : pieceMasked;
                                    html += "</span></span>";
                                } else if (options.mask) {
                                    html += "<span class='position-" + position + " reading-masked'><span>";
                                    html += options.style ? pieceMaskedZhuyin : pieceMasked;
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
                    if (a < segments.length - 1) {
                        html += ", ";
                    }
                    html += "</div>";
                }
            } else {
                segments = this.get('reading').split('');
                html += "<span class='reading-1'>";
                for (var c = 0, lengthC = segments.length; c < lengthC; c++) {
                    var segment = segments[c];
                    if (options.hideKana.indexOf(segment) === -1) {
                        html += "<span class='position-" + position + "'>" + segment + "</span>";
                    } else {
                        html += "<span class='position-" + position + "'><span> - </span></span>";
                    }
                    position++;
                }
                html += "</span>";
            }
            return html + '</div>';
        },
        /**
         * @method getStroke
         * @returns {DataStroke}
         */
        getStroke: function() {
            return app.user.data.strokes.get(this.get('writing'));
        },
        /**
         * @method getStyle
         * @returns {String}
         */
        getStyle: function() {
            var activeStyles = app.user.settings.getActiveStyles();
            var style = this.get('style');
            if (style && ['both', 'none'].indexOf(style) === -1 &&
                activeStyles.indexOf('simp') > -1 && activeStyles.indexOf('trad') > -1) {
                return style;
            }
            return '';
        },
        /**
         * @method getTones
         * @param {Number} position
         * @returns {Array}
         */
        getTones: function(position) {
            var tones = [];
            var reading = this.get('reading');
            if (this.isChinese()) {
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
            }
            return tones;
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
            html += "<div class='writing-block'>";
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
            return html + '</div>';
        },
        /**
         * @method isBanned
         * @returns {Boolean}
         */
        isBanned: function() {
            return this.get('bannedParts').length ? true : false;
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
        },
        /**
         * @method isStarred
         * @returns {Boolean}
         */
        isStarred: function() {
            return this.get('starred');
        },
        /**
         * @method playAudio
         * @returns {Boolean}
         */
        playAudio: function() {
            if (this.getAudio()) {
                app.assets.playAudio(this.getAudio());
                return true;
            }
            return false;
        }
    });

    return DataVocab;
});
