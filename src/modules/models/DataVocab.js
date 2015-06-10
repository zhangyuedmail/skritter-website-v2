/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel',
    'modules/collections/PromptReviews',
    'modules/models/PromptReview'
], function(GelatoModel, PromptReviews, PromptReview) {

    /**
     * @class DataVocab
     * @extends GelatoModel
     */
    var DataVocab = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method cache
         */
        cache: function() {
            app.user.data.storage.put('vocabs', this.toJSON());
        },
        /**
         * @method getContainedVocabIds
         * @returns {Array}
         */
        getContainedVocabIds: function() {
            return this.get('containedVocabIds') || [];
        },
        /**
         * @method getCanvasCharacters
         * @returns {Array}
         */
        getCanvasCharacters: function() {
            var characters = [];
            var strokes = this.getStrokes();
            for (var i = 0, length = strokes.length; i < length; i++) {
                var stroke = strokes[i];
                if (stroke) {
                    characters.push(stroke.getCanvasCharacter());
                }
            }
            return characters;
        },
        /**
         * @method getCanvasTones
         * @returns {Array}
         */
        getCanvasTones: function() {
            var characters = [];
            var strokes = this.getStrokes();
            for (var i = 0, length = strokes.length; i < length; i++) {
                var tones = app.user.data.strokes.get('tones');
                if (tones) {
                    characters.push(tones.getCanvasCharacter());
                }
            }
            return characters;
        },
        /**
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            return this.get('writing').split('');
        },
        /**
         * @method getDefinition
         * @param {Boolean} [ignoreFormat]
         * @returns {String}
         */
        getDefinition: function(ignoreFormat) {
            var customDefinition = this.get('customDefinition');
            var definition = this.get('definitions')[app.user.settings.get('sourceLang')];
            if (customDefinition && customDefinition !== '') {
                definition = this.get('customDefinition');
            } else if (!definition) {
                definition = this.get('definitions').en;
            }
            return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
        },
        /**
         * @method getFontClass
         * @return {String}
         */
        getFontClass: function() {
            return this.isChinese() ? 'text-chinese' : 'text-japanese';
        },
        /**
         * @method getFontName
         * @return {String}
         */
        getFontName: function() {
            return this.isChinese() ? 'Simkai' : 'Kaisho';
        },
        /**
         * @method getHeisig
         * @returns {String}
         */
        getHeisig: function() {
            return null;
        },
        /**
         * @method getMnemonic
         * @returns {Object}
         */
        getMnemonic: function() {
            if (this.get('mnemonic')) {
                return this.get('mnemonic');
            } else if (this.get('topMnemonic')) {
                return this.get('topMnemonic');
            }
            return null;
        },
        /**
         * @method getMnemonicText
         * @returns {String}
         */
        getMnemonicText: function() {
            return this.getMnemonic() ? app.fn.textToHTML(this.getMnemonic().text) : null;
        },
        /**
         * @method getPromptReviews
         * @param {String} part
         * @returns {PromptReviews}
         */
        getPromptReviews: function(part) {
            var reviews = new PromptReviews();
            var containedVocabIds = this.getContainedVocabIds();
            var characters = [];
            var vocabIds = [];
            if (['rune', 'tone'].indexOf(part) > -1) {
                if (containedVocabIds.length) {
                    vocabIds = containedVocabIds;
                } else {
                    vocabIds = [this.id];
                }
                if (part === 'tone') {
                    characters = this.getCanvasTones();
                } else {
                    characters = this.getCanvasCharacters();
                }
            } else {
                vocabIds = [this.id];
            }
            for (var i = 0, length = vocabIds.length; i < length; i++) {
                var review = new PromptReview();
                review.character = characters.length ? characters[i] : null;
                review.item = this.toJSON();
                review.vocab = app.user.data.vocabs.get(vocabIds[i]);
                reviews.add(review);
            }
            reviews.vocab = this;
            reviews.part = part;
            return reviews;
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return this.isChinese() ? app.fn.pinyin.toTone(this.get('reading')) : this.get('reading');
        },
        /**
         * @method getReadingElement
         * @returns {String}
         */
        getReadingElement: function() {
            var element = '';
            //var fillers = [" ... ", "'", " "];
            var variations = this.getSegmentedReading();
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var variation = variations[a];
                for (var b = 0, lengthB = variation.length; b < lengthB; b++) {
                    var reading = variation[b];
                    var readingMarks = app.fn.pinyin.toTone(reading);
                    var readingToneless = reading.replace(/[1-5]/g, '');
                    element += "<div class='reading-element mask' data-position='" + b + "'>";
                    element += "<span class='pinyin-marks'>" + readingMarks + "</span>";
                    element += "<span class='pinyin-toneless hidden'>" + readingToneless + "</span>";
                    element += "</div>";
                }
            }
            return element;
        },
        /**
         * @method getSegmentedReading
         * @returns {Array}
         */
        getSegmentedReading: function() {
            var segments = [];
            if (this.isChinese()) {
                var variations = this.get('reading').split(', ');
                for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                    var variation = variations[a];
                    segments.push(variation.match(/\s|[a-z|A-Z]+[1-5]+| ... |'/g));
                }
            } else {
                //TODO: properly segment Japanese
            }
            return segments;
        },
        /**
         * @method getSentence
         * @returns {DataSentence}
         */
        getSentence: function() {
            return this.get('sentenceId') ? app.user.data.sentences.get(this.get('sentenceId')) : null;
        },
        /**
         * @method getSentenceWriting
         * @returns {String}
         */
        getSentenceWriting: function() {
            return this.getSentence() ? this.getSentence().getWriting() : null;
        },
        /**
         * @method getStrokes
         * @returns {Array}
         */
        getStrokes: function() {
            var strokes = [];
            var characters = this.getCharacters();
            for (var i = 0, length = characters.length; i < length; i++) {
                var stroke = app.user.data.strokes.get(characters[i]);
                if (stroke) {
                    strokes.push(stroke);
                }
            }
            return strokes;
        },
        /**
         * @method getStyle
         * @returns {String}
         */
        getStyle: function() {
            switch (this.get('style')) {
                case 'simp':
                    return 'simplified';
                case 'trad':
                    return 'traditional';
            }
            return '';
        },
        /**
         * @method getToneNumbers
         * @param {Number} [position]
         * @returns {Array}
         */
        getToneNumbers: function(position) {
            var tones = [];
            if (this.isChinese()) {
                var readings = this.get('reading').split(', ');
                for (var a = 0, lengthA = readings.length; a < lengthA; a++) {
                    var reading = readings[a].match(/[1-5]+/g);
                    for (var b = 0, lengthB = reading.length; b < lengthB; b++) {
                        var tone = parseInt(reading[b], 10);
                        tones[b] = Array.isArray(tones[b]) ? tones[b].concat(tone) : [tone];
                    }
                }
            }
            return position === undefined ? tones : tones[position];
        },
        /**
         * @method getVocabIds
         * @returns {Array}
         */
        getVocabIds: function() {
            return [this.id].concat(this.get('containedVocabIds') || []);
        },
        /**
         * @method getWritingElement
         * @returns {String}
         */
        getWritingElement: function() {
            var element = '';
            var characters = this.getCharacters();
            for (var i = 0, length = characters.length; i < length; i++) {
                var character = characters[i];
                element += "<div class='writing-element mask' data-position='" + i + "'><span>";
                element += character;
                element += "</span></div>";
            }
            return element;
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
         * @method play
         * @returns {DataVocab}
         */
        play: function() {
            if (this.has('audioURL')) {
                app.media.play(this.get('audioURL'));
            }
            return this;
        },
        /**
         * @method toggleBanned
         * @returns {Boolean}
         */
        toggleBanned: function() {
            if (this.isBanned()) {
                this.set('bannedParts', []);
                return false;
            }
            if (this.isChinese()) {
                this.set('bannedParts', ['defn', 'rdng', 'rune', 'tone']);
            } else {
                this.set('bannedParts', ['defn', 'rdng', 'rune']);
            }
            return true;
        },
        /**
         * @method toggleStarred
         * @returns {Boolean}
         */
        toggleStarred: function() {
            if (this.get('starred')) {
                this.set('starred', false);
                return false;
            }
            this.set('starred', true);
            return true;
        }
    });

    return DataVocab;

});