const SkritterModel = require('base/BaseSkritterModel');
const NeutralTones = require('data/neutral-tones');
const PromptItemCollection = require('collections/PromptItemCollection');
const PromptItemModel = require('models/PromptItemModel');

/**
 * @class VocabModel
 * @extends {SkritterModel}
 */
const VocabModel = SkritterModel.extend({

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
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.audios = _.map(
      this.getUniqueAudios(),
      (data) => {
        const name = data.id + '.mp3';
        const url = data.mp3.replace('http://storage.googleapis.com/skritter_audio/', 'https://skritter.com/audio/');

        if (app.isCordova()) {
          resolveLocalFileSystemURL(app.config.cordovaAudioUrl + name, null, function() {
            new FileTransfer().download(url, app.config.cordovaAudioUrl + name);
          });
        }

        return {name: name, url: url};
      }
    );
  },

  /**
   * @method defaults
   * @returns {Object}
   */
  defaults: function() {
    return {
      definitions: {},
      filler: false,
      kana: false,
      vocabIds: []
    };
  },

  /**
   * @method banAll
   * @returns {Vocab}
   */
  banAll: function() {
    this.set('bannedParts', ['defn', 'rdng', 'rune', 'tone']);
    return this;
  },

  /**
   * @method banPart
   * @param {String} part
   * @returns {Vocab}
   */
  banPart: function(part) {
    this.get('bannedParts').push(part);
    this.set('bannedParts', _.uniq(this.get('bannedParts')));
    return this;
  },

  fetchSentence: function() {
    const self = this;

    let url = app.getApiUrl(2) + 'sentences?languageCode=' + app.getLanguage() + '&vocabId=' + this.id + '&user=' + app.user.id;

    this.state = 'fetching';
    return new Promise((resolve, reject) => {
      $.ajax({
        context: this,
        url,
        type: 'GET',
        headers: app.user.session.getHeaders(),
        error: function(error) {
          reject();
        },
        success: function(sentence) {
          if (self.collection) {
            self.collection.sentences.add(sentence);
          }
          self.state = 'standby';
          resolve(sentence);
        }
      });
    });
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
   * @method getCharactersWithoutFillers
   * @returns {Array}
   */
  getCharactersWithoutFillers: function() {
    return _.filter(this.get('writing').split(''), writing => {
      return !_.includes(app.config.writingFillers, writing);
    });
  },

  /**
   * @method getContained
   * @returns {Array}
   */
  getContained: function(excludeFillers) {
    let containedVocabs = [];
    let characters = this.getCharacters();
    let lang = this.get('lang');
    for (let i = 0, length = characters.length; i < length; i++) {
      let base = app.fn.mapper.toBase(characters[i], {lang: lang});
      let containedVocab = this.collection.get(base);
      if (!containedVocab) {
        containedVocab = new VocabModel({
          id: base,
          filler: true,
          lang: lang,
          writing: characters[i]
        });

        this.collection.add(containedVocab);
      }
      containedVocabs.push(containedVocab);
    }
    if (excludeFillers) {
      return containedVocabs.filter(function(vocab) {
        return !vocab.get('filler');
      });
    }
    return containedVocabs;
  },

  /**
   * @method getDecomp
   * @returns {Decomp}
   */
  getDecomp: function() {
    let decomp = this.collection.decomps.get(this.get('writing'));
    if (decomp && !decomp.get('atomic')) {
      return decomp;
    } else {
      return null;
    }
  },

  /**
   * @method getDefinition
   * @param {Boolean} [ignoreFormat]
   * @returns {String}
   */
  getDefinition: function(ignoreFormat) {
    let customDefinition = this.get('customDefinition');
    let definition = this.get('definitions')[app.user.get('sourceLang')];
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
    let characters = [];
    let strokes = this.getStrokes();
    for (let i = 0, length = strokes.length; i < length; i++) {
      let stroke = strokes[i];
      if (stroke) {
        characters.push(strokes[i].getPromptCharacter());
      } else {
        characters.push(null);
      }
    }
    return characters;
  },

  /**
   * @method getPromptItems
   * @param {String} part
   * @returns {PromptItemCollection}
   */
  getPromptItems: function(part) {
    let promptItems = new PromptItemCollection();
    let containedVocabs = this.getContained();
    let characters = [];
    let now = Date.now();
    let vocab = this;
    let vocabs = [];
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
    for (let i = 0, length = vocabs.length; i < length; i++) {
      let childVocab = vocabs[i];
      let promptItem = new PromptItemModel();
      promptItem.character = characters[i];
      promptItem.vocab = childVocab;
      promptItem.set('filler', childVocab.isFiller());
      promptItem.set('kana', childVocab.isKana());
      promptItems.add(promptItem);
    }
    promptItems.group = now + '_' + this.id;
    promptItems.part = part;
    promptItems.vocab = vocab;
    return promptItems;
  },

  /**
   * @method getPromptTones
   * @returns {Array}
   */
  getPromptTones: function() {
    let tones = [];
    let strokes = this.getCharacters();
    for (let i = 0, length = strokes.length; i < length; i++) {
      tones.push(app.user.characters.getPromptTones());
    }
    return tones;
  },

  /**
   * @method getReading
   * @returns {String}
   */
  getReading: function() {
    if (this.isChinese()) {
      if (app.user.get('readingChinese') === 'zhuyin') {
        return app.fn.pinyin.toZhuyin(this.get('reading'));
      } else {
        return app.fn.pinyin.toTone(this.get('reading'));
      }
    }

    return this.get('reading');
  },

  /**
   * @method getReadingObjects
   * @returns {Array}
   */
  getReadingObjects: function() {
    let readings = [];
    let reading = this.get('reading');

    if (this.isChinese()) {
      if (app.fn.pinyin.hasToneMarks(reading)) {
        Raven.captureMessage('PINYIN FORMAT ERROR: ' + this.id);

        return [];
      }

      if (reading.indexOf(', ') === -1) {
        readings = reading.match(/[a-z|A-Z]+[1-5]+|'| ... |\s/g);
      } else {
        readings = [reading];
      }
    } else {
      readings = [reading];
    }

    return readings.map(
      function(value) {
        if ([' ', ' ... ', '\''].indexOf(value) > -1) {
          return {type: 'filler', value: value};
        }

        return {type: 'character', value: value};
      }
    );
  },

  /**
   * Gets the sentence for the vocab, if available
   * @method getSentence
   * @returns {Sentence} null if a sentence for the vocab isn't found
   */
  getSentence: function() {
    if (this.collection) {
      return this.collection.sentences.get(this.id);
    }

    return null;
  },

  /**
   * @method getStrokes
   * @returns {Array}
   */
  getStrokes: function() {
    let strokes = [];
    let characters = this.getCharacters();

    for (let i = 0, length = characters.length; i < length; i++) {
      let stroke = app.user.characters.findWhere({writing: characters[i]});

      if (stroke) {
        if (this.isJapanese()) {
          if (!app.user.get('studyKana') && stroke.isKana()) {
            strokes.push(null);
          } else {
            strokes.push(stroke);
          }
        } else {
          strokes.push(stroke);
        }
      } else {
        strokes.push(null);
      }
    }

    return strokes;
  },

  /**
   * @method getTones
   * @returns {Array}
   */
  getTones: function() {
    if (this.isChinese()) {
      let tones = [];
      let contained = this.get('containedVocabIds') ? this.getContained() : [this];
      let readings = this.get('reading').split(', ');
      for (let a = 0, lengthA = readings.length; a < lengthA; a++) {
        let reading = readings[a].match(/[1-5]+/g);
        for (let b = 0, lengthB = reading.length; b < lengthB; b++) {
          let tone = parseInt(reading[b], 10);
          let containedWriting = contained[b].get('writing');
          let wordWriting = this.get('writing');
          tones[b] = Array.isArray(tones[b]) ? tones[b].concat(tone) : [tone];
          //TODO: make tests to verify neutral tone wimps
          if (NeutralTones.isWimp(containedWriting, wordWriting, b)) {
            tones[b] = tones[b].concat(contained[b].getTones()[0]);
          }
        }
      }
      return tones;
    }
    return [];
  },

  /**
   * @method getUniqueAudios
   * @returns {Array}
   */
  getUniqueAudios: function() {
    return _.uniqBy(this.get('audios'), 'reading');
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
   * Gets the alternate writing for a character. E.g. If given a simplified
   * character, will find the traditional variant of it.
   * @method getWritingDifference
   * @param {String} vocabId the
   * @returns {String}
   */
  getWritingDifference: function(vocabId) {
    vocabId = vocabId || this.id;

    return _.zipWith(
      this.get('writing').split(),
      app.fn.mapper.fromBase(vocabId).split(),
      function(thisChar, otherChar) {

        // the simplified character
        let idChar = vocabId.split('-')[1];

        // default case -- no difference
        let res = null;

        if (thisChar === otherChar) {

          // Means we got two traditional characters back.
          // The id char is simplified, so send that back
          if (thisChar !== idChar) {
            res = idChar;
          }
        } else {
          res = otherChar;
        }

        return res;
      }).join('');
  },

  /**
   * Return a scaled pixel value based on length of the definition.
   * @method getDefinitionFontSize
   * @returns {number}
   */
  getDefinitionFontSize () {
    const definition = this.getDefinition();
    const definitionLength = definition.length;
    const screenWidth = app.getWidth();

    return 3 - (definitionLength * 1.4) / screenWidth;
  },

  /**
   * Return a scaled pixel value based on length of the writing.
   * @method getWritingFontSize
   * @returns {number}
   */
  getWritingFontSize: function() {
    const screenWidth = app.getWidth();
    const characterLength = this.getCharacters().length;

    if (app.isMobile()) {
      if (characterLength > 10) {
        return screenWidth / 12;
      }

      if (characterLength > 6) {
        return screenWidth / 8;
      }

      if (characterLength > 2) {
        return screenWidth / 6;
      }

      return screenWidth / 4;
    }

    if (characterLength > 10) {
      return 32;
    }

    if (characterLength > 5) {
      return 48;
    }

    return 64;
  },

  /**
   * @method isBanned
   * @returns {Boolean}
   */
  isBanned: function() {
    return !!this.get('bannedParts').length;
  },

  /**
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function() {
    return this.get('lang') === 'zh';
  },

  /**
   * @method isFiller
   * @returns {Boolean}
   */
  isFiller: function() {
    if (app.isJapanese()) {
      if (!app.user.get('studyKana') && this.isKana()) {
        return true;
      }
    }

    return _.includes(app.config.writingFillers, this.get('writing'));
  },

  /**
   * @method isJapanese
   * @returns {Boolean}
   */
  isJapanese: function() {
    return this.get('lang') === 'ja';
  },

  /**
   * @method isKana
   * @returns {Boolean}
   */
  isKana: function() {
    return app.fn.isKana(this.get('writing'));
  },

  /**
   * @method isStarred
   * @returns {Boolean}
   */
  isStarred: function() {
    return this.get('starred');
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns {Object}
   */
  parse: function(response) {
    if (this.collection) {
      this.collection.decomps.add(response.Decomp);
      this.collection.sentences.add(response.Sentence);
    }
    return response.Vocab || response;
  },

  /**
   * Plays the associated audio with the vocab when it is loaded, if it exists.
   * @method play
   * @return {Boolean} whether the audio played when the function was called
   */
  play: function() {
    if (!this.audios.length) {
      return false;
    }

    let self = this;
    let audio = this.audios[0];

    if (app.isCordova()) {
      resolveLocalFileSystemURL(app.config.cordovaAudioUrl + audio.name,
        function(entry) {
          self.playCordovaAudio(entry.toURL());
        },
        function() {
          new FileTransfer().download(audio.url, app.config.cordovaAudioUrl + audio.name, function(entry) {
            self.playCordovaAudio(entry.toURL());
          });
        }
      );
    } else {
      new Howl({
        src: [audio.url],
        format: ['mp3'],
        volume: app.user.get('volume')
      }).play();
    }

    return true;
  },

  playCordovaAudio: function(url) {
    const media = new Media(
      url,
      function() {
        media.stop();
        media.release();
      }
    );

    media.setVolume(app.user.get('volume'));
    media.play();
  },

  /**
   * @method post
   * @param {Function} callback
   */
  post: function(callback) {
    $.ajax({
      context: this,
      url: app.getApiUrl() + 'vocabs',
      type: 'POST',
      headers: app.user.session.getHeaders(),
      data: {
        id: this.id,
        definitions: JSON.stringify(this.get('definitions')),
        lang: app.getLanguage(),
        reading: this.get('reading'),
        traditionalWriting: this.get('writingTraditional'),
        writing: this.get('writing')
      },
      error: function(error) {
        typeof callback === 'function' && callback(error);
      },
      success: function(result) {
        typeof callback === 'function' && callback(null, this.set(result.Vocab, {merge: true}));
      }
    });
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
  },

  /**
   * @method unbanAll
   * @returns {Vocab}
   */
  unbanAll: function() {
    this.set('bannedParts', []);
    return this;
  },

  /**
   * @method unbanPart
   * @param {String} part
   * @returns {Vocab}
   */
  unbanPart: function(part) {
    this.set('bannedParts', _.remove(this.get('bannedParts'), part));
    return this;
  }

});

module.exports = VocabModel;
