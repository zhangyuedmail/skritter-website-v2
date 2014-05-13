/**
 * @module Skritter
 * @submodule Models
 * @param Item
 * @author Joshua McFarland
 */
define([
    'model/data/Item'
], function(Item) {
    /**
     * @class DataVocab
     */
    var Vocab = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            if (this.get('lang') === 'zh') {
                return true;
            }
            return false;
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            if (this.get('lang') === 'ja') {
                return true;
            }
            return false;
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
         * @method characterCount
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
                for (var i = 0, length = containedVocabIds.length; i < length; i++)
                    if (this.get('lang') === 'zh') {
                        characters.push(skritter.fn.simptrad.fromBase(containedVocabIds[i]));
                    } else {
                        characters.push(containedVocabIds[i].split('-')[1]);
                    }
            } else {
                var splitWriting = this.get('writing').split('');
                if (splitWriting.length === 1 && !skritter.fn.isKana(splitWriting[0]))
                    characters.push(splitWriting[0]);

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
            var containedVocabIds = this.has('containedVocabIds') ? this.get('containedVocabIds') : [];
            if (part === 'rune') {
                for (var a = 0, lengthA = containedVocabIds.length; a < lengthA; a++)
                    containedItemIds.push(skritter.user.id + '-' + containedVocabIds[a] + '-' + part);
            } else if (part === 'tone') {
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
            if (this.isChinese())
                return 'simkai';
            return 'kaisho';
        },
        /**
         * @method fontClass
         * @returns {String}
         */
        getFontClass: function() {
            if (this.isChinese())
                return 'chinese-text';
            return 'japanese-text';
        },
        /**
         * @method getMaskedSentenceWriting
         * @returns {String}
         */
        getMaskedSentenceWriting: function() {
            var sentence = this.getSentence();
            if (sentence)
                return sentence.getMaskedWriting(this.get('writing'));
        },
        /**
         * @method getMnemonic
         * @returns {String}
         */
        getMnemonic: function() {
            if (this.has('mnemonic') && this.get('mnemonic').text !== '') {
                return this.get('mnemonic').text;
            } else if (this.has('topMnemonic')) {
                if (this.get('topMnemonic').public)
                    return this.get('topMnemonic').text;
            }
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return skritter.fn.pinyin.toTone(this.get('reading'));
        },
        /**
         * @method getReadingAt
         * @param {Number} position
         * @returns {String}
         */
        getReadingAt: function(position) {
            position = position === 0 ? 1 : position;
            var reading = this.get('reading').split(', ')[0];
            return reading.match(/[a-z|A-Z]+[0-9]+|\s\.\.\.\s|\'/g)[position - 1];
        },
        /**
         * @method getReadingBlock
         * @param {Number} offset
         * @param {Boolean} mask
         * @returns {String}
         */
        getReadingBlock: function(offset, mask) {
            var element = '';
            var reading = this.get('reading');
            if (skritter.user.settings.isChinese()) {
                reading = reading.indexOf(', ') === -1 ? [reading] : reading.split(', ');
                for (var a = 0, lengthA = reading.length; a < lengthA; a++) {
                    var position = 1;
                    var pieces = reading[a].match(/[a-z|A-Z]+[0-9]+|\s\.\.\.\s|\'/g);
                    element += "<span id='reading-" + (a + 1) + "' class='reading' data-reading='" + reading[a] + "'>";
                    for (var b = 0, lengthB = pieces.length; b < lengthB; b++) {
                        var piece = pieces[b];
                        if (piece.indexOf(' ... ') === -1 && piece.indexOf("'") === -1) {
                            if (offset && position >= offset) {
                                if (mask) {
                                    element += "<span class='position-" + position + " reading-masked'>" + piece.replace(/[0-9]/g, '') + "</span>";
                                } else {
                                    element += "<span class='position-" + position + " reading-hidden'><span>" + skritter.fn.pinyin.toTone(piece) + "</span></span>";
                                }
                            } else {
                                element += "<span class='position-" + position + "'>" + skritter.fn.pinyin.toTone(piece) + "</span>";
                            }
                            position++;
                        } else {
                            element += "<span class='reading-filler'>" + piece + "</span>";
                        }
                    }
                    element += a + 1 >= reading.length ? "</span>" : "</span> , ";
                }
            } else {
                reading = reading.split('');
                for (var i = 0, length = reading.length; i < length; i++) {
                    element += "<span class='reading-kana reading'>" + reading[i] + "</span>";
                }
            }
            return element;
        },
        /**
         * @method getSentence
         * @returns {Backbone.Model}
         */
        getSentence: function() {
            return skritter.user.data.sentences.get(this.get('sentenceId'));
        },
        /**
         * @method getStyle
         * @returns {String}
         */
        getStyle: function() {
            if (this.has('style') && this.get('style') !== 'both')
                return this.get('style');
            return '';
        },
        /**
         * Returns an array of unique possible tone numbers in the order they appear in the
         * reading string. Japanese will just return an empty array since it doesn't have tones.
         * 
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
                    for (var a = 0, lengthA = reading.length; a < lengthA; a++)
                        tones.push([parseInt(reading[a], 10)]);
                } else {
                    reading = reading.split(', ');
                    for (var b = 0, lengthB = reading.length; b < lengthB; b++)
                        tones.push([skritter.fn.arrayToInt(reading[b].match(/[0-9]+/g))]);
                }
            }
            if (position && this.getCharacterCount() > 1)
                return tones[position - 1];
            return tones;
        },
        /**
         * @method getWritingBlock
         * @param {Number} offset
         * @returns {String}
         */
        getWritingBlock: function(offset) {
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
         * @method playAudio
         * @param {Number} position
         */
        playAudio: function(position) {
            if (position) {
                var filename = this.getReadingAt(position) + '.mp3';
                skritter.assets.playAudio(filename.toLowerCase());
            } else if (this.has('audio')) {
                skritter.assets.playAudio(this.getAudioFileName());
            }
        },
        /**
         * @method spawnItem
         * @param {String} part
         * @returns {Backbone.Model}
         */
        spawnItem: function(part) {
            return new Item({
                id: this.id + '-' + part,
                part: part,
                lang: this.get('lang'),
                vocabIds: [this.id],
                style: this.get('style'),
                next: 0,
                last: 0,
                interval: 0,
                reviews: 0,
                successes: 0,
                created: skritter.fn.getUnixTime(),
                previousSuccess: false,
                previousInterval: 0
            });
        }
    });

    return Vocab;
}); 