var SkritterModel = require('base/skritter-model');
var PromptReviews = require('collections/prompt-reviews');
var PromptReview = require('models/prompt-review');

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
   * @method getCharacters
   * @returns {Array}
   */
  getCharacters: function() {
    return this.get('writing').split('');
  },
  /**
   * @method getContained
   * @returns {Array}
   */
  getContained: function() {
    var containedVocabs = [];
    var containedVocabIds = this.get('containedVocabIds') || [];
    for (var i = 0, length = containedVocabIds.length; i < length; i++) {
      containedVocabs.push(this.collection.get(containedVocabIds[i]));
    }
    return containedVocabs;
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
   * @method getFontClass
   * @returns {String}
   */
  getFontClass: function() {
    return this.isChinese() ? 'text-chinese' : 'text-japanese';
  },
  /**
   * @method getFontName
   * @returns {String}
   */
  getFontName: function() {
    return this.isChinese() ? 'KaiTi' : 'DFKaiSho-Md';
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
   * @method getPromptReviews
   * @param {String} part
   * @returns {PromptReviews}
   */
  getPromptReviews: function(part) {
    var reviews = new PromptReviews();
    var containedVocabs = this.getContained();
    var vocab = this;
    var characters = [];
    var vocabs = [];
    switch (part) {
      case 'rune':
        characters = vocab.getPromptCharacters();
        vocabs = containedVocabs.length ? containedVocabs : [vocab];
        break;
      case 'tone':
        characters = vocab.getPromptTones();
        vocabs = containedVocabs.length ? containedVocabs : [vocab];
        break;
      default:
        vocabs = [vocab];
    }
    for (var i = 0, length = vocabs.length; i < length; i++) {
      var review = new PromptReview();
      review.character = characters[i];
      review.vocab = vocabs[i];
      reviews.add(review);
    }
    reviews.group = Date.now() + '_' + this.id;
    reviews.part = part;
    reviews.vocab = vocab;
    return reviews;
  },
  /**
   * @method getPromptTones
   * @returns {Array}
   */
  getPromptTones: function() {
    var tones = [];
    var strokes = this.getCharacters();
    for (var i = 0, length = strokes.length; i < length; i++) {
      tones.push(this.collection.strokes.getPromptTones());
    }
    return tones;
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
   * @method getTones
   * @returns {Array}
   */
  getTones: function() {
    var tones = [];
    var readings = this.get('reading').split(', ');
    for (var a = 0, lengthA = readings.length; a < lengthA; a++) {
      var reading = readings[a].match(/[1-5]+/g);
      for (var b = 0, lengthB = reading.length; b < lengthB; b++) {
        var tone = parseInt(reading[b], 10);
        tones[b] = Array.isArray(tones[b]) ? tones[b].concat(tone) : [tone];
      }
    }
    return this.isChinese() ? tones : [];
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
