define([], function() {
    /**
     * @class DataVocab
     */
    var Vocab = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getAudioFileName
         * @returns {String}
         */
        getAudioFileName: function() {
            if (this.has('audio')) {
                return this.get('audio').replace('/sounds?file=', '');
            }
            return null;
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
            var containedVocabIds = this.has('containedVocabIds') ? this.get('containedVocabIds') : [];
            if (this.has('containedVocabIds')) {
                for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                    if (this.get('lang') === 'zh') {
                        characters.push(skritter.fn.mapper.fromBase(containedVocabIds[i]));
                    } else {
                        characters.push(containedVocabIds[i].split('-')[1]);
                    }
                }
            } else {
                var splitWriting = this.get('writing').split('');
                if (splitWriting.length === 1 && !skritter.fn.isKana(splitWriting[0])) {
                    characters.push(splitWriting[0]);
                }
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
            if (containedVocabIds && part === 'rune') {
                for (var a = 0, lengthA = containedVocabIds.length; a < lengthA; a++) {
                    containedItemIds.push(skritter.user.id + '-' + containedVocabIds[a] + '-' + part);
                }
            } else if (containedVocabIds && part === 'tone') {
                for (var b = 0, lengthB = containedVocabIds.length; b < lengthB; b++) {
                    var splitId = containedVocabIds[b].split('-');
                    containedItemIds.push(skritter.user.id + '-' + splitId[0] + '-' + splitId[1] + '-0-' + part);
                }
            }
            return containedItemIds;
        },
        /**
         * @method getDefinition
         * @returns {String}
         */
        getDefinition: function() {
            if (this.has('customDefinition') && this.get('customDefinition') !== '') {
                return this.get('customDefinition');
            } else if (this.get('definitions')[skritter.user.settings.get('sourceLang')]) {
                return this.get('definitions')[skritter.user.settings.get('sourceLang')];
            } else if (this.get('definitions').en) {
                return this.get('definitions').en;
            }
        },
        /**
         * @method getFontName
         * @returns {String}
         */
        getFontName: function() {
            return this.isChinese() ? 'simkai' : 'kaisho';
        },
        /**
         * @method fontClass
         * @returns {String}
         */
        getFontClass: function() {
            return this.isChinese() ? 'chinese-text' : 'japanese-text';            
        },
        /**
         * @method getReading
         * @param {Number} offset
         * @param {Boolean} mask
         * @param {Boolean} zhuyin
         * @returns {String}
         */
        getReading: function(offset, mask, zhuyin) {
            var element = '';
            var reading = this.get('reading');
            if (this.isChinese()) {
                reading = reading.indexOf(', ') === -1 ? [reading] : reading.split(', ');
                for (var a = 0, lengthA = reading.length; a < lengthA; a++) {
                    var position = 1;
                    var pieces = reading[a].match(/[a-z|A-Z]+[0-9]+|\s\.\.\.\s|\'/g);
                    var readingString = reading[a].replace(' ... ', '').replace("'", '').replace(' ', '');
                    element += "<span id='reading-" + (a + 1) + "' class='reading' data-reading='" + readingString + "'>";
                    for (var b = 0, lengthB = pieces.length; b < lengthB; b++) {
                        var piece = pieces[b];
                        var nakedPiece = pieces[b].replace(/[0-9]/g, '');
                        var formattedNakedPiece = zhuyin ? skritter.fn.pinyin.toZhuyin(nakedPiece + '1') : nakedPiece;
                        var formattedPiece = zhuyin ? skritter.fn.pinyin.toZhuyin(piece) : skritter.fn.pinyin.toTone(piece);
                        if (piece.indexOf(' ... ') === -1 && piece.indexOf("'") === -1) {
                            if (offset && position >= offset) {
                                if (mask) {
                                    element += "<span class='position-" + position + " reading-masked'>" + formattedNakedPiece + "</span>";
                                } else {
                                    element += "<span class='position-" + position + " reading-hidden'><span>" + formattedPiece + "</span></span>";
                                }
                            } else {
                                element += "<span class='position-" + position + "'>" + formattedPiece + "</span>";
                            }
                            position++;
                        } else {
                            element += "<span class='reading-filler'>" + piece + "</span>";
                        }
                    }
                    element += a + 1 >= reading.length ? "</span>" : "</span> , ";
                }
            } else {
                element += "<span class='reading-kana reading' data-reading='" + reading + "'>" + reading + "</span>";
            }
            return element;
        },
        /**
         * @method getSentence
         * @returns {Backbone.Model}
         */
        getSentence: function() {
            var sentence = skritter.user.data.sentences.get(this.get('sentenceId'));
            if (sentence) {
                return sentence;
            }
            return {};
        },
        /**
         * @method getStyle
         * @returns {String}
         */
        getStyle: function() {
            if (this.has('style') && this.get('style') !== 'both') {
                return this.get('style');
            }
            return false;
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
                        tones.push([skritter.fn.convertArrayToInt(reading[b].match(/[0-9]+/g))]);
                    }
                }
            }
            if (position && this.getCharacterCount() > 1) {
                return tones[position - 1];
            }
            return tones;
        },
        /**
         * @method getWriting
         * @param {Number} offset
         * @returns {String}
         */
        getWriting: function(offset) {
            var element = '';
            var position = 1;
            var actualCharacters = this.get('writing').split('');
            var containedCharacters = this.getCharacters();
            for (var i = 0, length = actualCharacters.length; i < length; i++) {
                var character = actualCharacters[i];
                if (containedCharacters.indexOf(character) === -1) {
                    element += "<span class='writing-filler'>" + character + "</span>";
                } else {
                    if (offset && position >= offset) {
                        element += "<span id='writing-" + position + "' class='writing-hidden'><span>" + character + "</span></span>";
                    } else {
                        element += "<span id='writing-" + position + "'>" + character + "</span>";
                    }
                    position++;
                }
            }
            return element;
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.get('lang') === 'zh' ? true : false;
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.get('lang') === 'ja' ? true : false;
        },
        /**
         * @method playAudio
         */
        playAudio: function() {
            if (this.has('audio')) {
                skritter.assets.playAudio(this.getAudioFileName());
            }
        }
    });

    return Vocab;
}); 