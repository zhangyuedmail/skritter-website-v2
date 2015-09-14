var SkritterModel = require('base/skritter-model');

/**
 * @class Vocab
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @property urlRoot
     * @type {String}
     */
    urlRoot: 'vocabs',
    /**
     * @method parse
     * @param {Object} response
     * @returns {Object}
     */
    parse: function(response) {
        return response.Vocab || response;
    },
    /**
     * @method getBase
     * @returns {String}
     */
    getBase: function() {
        return this.id.split('-')[1];
    },
    /**
     * @method getPromptCharacters
     * @returns {Array}
     */
    getPromptCharacters: function() {
        var characters = [];
        var strokes = this.getStrokes();
        for (var i = 0, length = strokes.length; i < length; i++) {
            characters.push(strokes[i].getPromptCharacter());
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
        var definition = this.get('definitions')[app.user.get('sourceLang')];
        if (customDefinition && customDefinition !== '') {
            definition = this.get('customDefinition');
        } else if (!definition) {
            definition = this.get('definitions').en;
        }
        return ignoreFormat === false ? definition : app.fn.textToHTML(definition);
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
     * @method getReading
     * @returns {String}
     */
    getReading: function() {
        return this.isChinese() ? app.fn.pinyin.toTone(this.get('reading')) : this.get('reading');
    },
    /**
     * @method getReadings
     * @returns {Array}
     */
    getReadings: function() {
        var reading = this.get('reading');
        if (this.isChinese()) {
            if (reading.indexOf(', ') > -1) {
                return [reading];
            }
            return reading.match(/\s|[a-z|A-Z]+[1-5]+| ... |'/g);
        }
        return [reading];
    },
    /**
     * @method getSentence
     * @returns {Sentence}
     */
    getSentence: function() {
        return this.collection.sentences.get(this.get('sentenceId'));
    },
    /**
     * @method getStrokes
     * @returns {Array}
     */
    getStrokes: function() {
        var strokes = [];
        var characters = this.getCharacters();
        for (var i = 0, length = characters.length; i < length; i++) {
            var stroke = this.collection.strokes.get(characters[i]);
            if (stroke) {
                strokes.push(stroke);
            }
        }
        return strokes;
    },
    /**
     * @method getVariation
     * @returns {Number}
     */
    getVariation: function() {
        return parseInt(this.id.split('-')[2], 10);
    },
    /**
     * @method getWriting
     * @returns {String}
     */
    getWriting: function() {
        return this.get('writing');
    },
    /**
     * @method getWritingDifference
     * @param {String} otherVocab
     * @returns {String}
     */
    getWritingDifference: function(otherVocab) {
        return _.zipWith(this.getWriting(), otherVocab.getWriting(), function(thisChar, otherChar) {
            return thisChar === otherChar ? '-' : otherChar;
        }).join('');
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
     * @method toggleBanned
     * @returns {Boolean}
     */
    toggleBanned: function() {
        if (this.isBanned()) {
            this.set('bannedParts', []);
            return false;
        }
        if (this.isChinese()) {
            this.set('bannedParts', this.get('allChineseParts'));
        } else {
            this.set('bannedParts', this.get('allJapaneseParts'));
        }
        return true;
    }
});
