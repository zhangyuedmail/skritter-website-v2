var GelatoModel = require('gelato/modules/model');

/**
 * @class DataVocab
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @method getPromptCharacters
     * @returns {Array}
     */
    getCanvasCharacters: function() {
        var characters = [];
        var strokes = this.getStrokes();
        for (var i = 0, length = strokes.length; i < length; i++) {
            characters.push(strokes[i].getPromptCharacter());
        }
        return _.without(characters, undefined);
    },
    /**
     * @method getPromptTones
     * @returns {Array}
     */
    getCanvasTones: function() {
        var characters = [];
        var strokes = this.getCharacters();
        for (var i = 0, length = strokes.length; i < length; i++) {
            characters.push(app.user.data.strokes.getPromptTones());
        }
        return _.without(characters, undefined);
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
        if (app.isChinese()) {
            var variations = this.get('reading').split(', ');
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var variation = variations[a];
                var segments = variation.match(/\s|[a-z|A-Z]+[1-5]+| ... |'/g) || [];
                element += '<div class="variation" data-variation="' + a + '">';
                for (var b = 0, lengthB = segments.length; b < lengthB; b++) {
                    var segment = segments[b];
                    var segmentMarks = app.fn.pinyin.toTone(segment);
                    var segmentRaw = segment.replace(/[1-5]/g, '');
                    element += '<div class="segment mask" data-segment="' + b + '">';
                    element += '<span class="raw">' + segmentRaw + '</span>';
                    element += '<span class="tone hidden">' + segmentMarks + '</span>';
                    element += '</div>';
                }
                element += '</div>';
            }
        } else {
            element += '<div class="variation" data-variation="0">';
            element += '<div class="segment" data-segment="0">';
            element += '<span class="raw">' + this.get('reading') + '</span>';
            element += '</div></div>';
        }
        return element;
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
            strokes.push(app.user.data.strokes.get(characters[i]));
        }
        return _.without(strokes, undefined);
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
            default:
                return '';
        }
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
     * @method getVariation
     * @returns {Number}
     */
    getVariation: function() {
        return this.id.split('-')[2];
    },
    /**
     * @method getWriting
     * @returns {String}
     */
    getWriting: function() {
        return this.get('writing');
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
