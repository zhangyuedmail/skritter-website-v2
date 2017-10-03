const SkritterModel = require('base/BaseSkritterModel');
const PromptItemCollection = require('collections/PromptItemCollection');
const PromptItemModel = require('models/PromptItemModel');

/**
 * @class ItemModel
 * @extends {SkritterModel}
 */
const ItemModel = SkritterModel.extend({

  /**
   * @property consecutiveWrong
   * @type {Number}
   */
  consecutiveWrong: 0,

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   * @type {String}
   */
  urlRoot: 'items',

  /**
   * @method ban
   */
  ban: function () {
    this.getVocab().banPart(this.get('part'));
  },

  /**
   * Forcefully bump the next value two weeks into the future.
   * @method bump
   * @returns {ItemModel}
   */
  bump: function () {
    const update = {id: this.id};

    if (!this.get('next') || this.get('next') < moment().unix()) {
      update.next = moment().add(2, 'weeks').unix();
    } else {
      update.next = moment(this.get('next') * 1000).add(2, 'weeks').unix();
    }

    $.ajax({
      url: app.getApiUrl() + 'items/' + this.id,
      type: 'PUT',
      headers: app.user.session.getHeaders(),
      data: JSON.stringify(update),
      success: (result) => this.set(result.Item, {merge: true}),
    });

    return this;
  },

  /**
   * @property defaults
   * @type {Object}
   */
  defaults: function () {
    return {
      vocabIds: [],
      vocabListIds: [],
    };
  },

  /**
   * @method getBase
   * @returns {String}
   */
  getBase: function () {
    return this.id.split('-')[2];
  },

  /**
   * @method getContainedItems
   * @returns {Array}
   */
  getContainedItems: function () {
    const containedItems = [];
    const part = this.get('part');

    if (['rune', 'tone'].indexOf(part) > -1) {
      const containedVocabs = this.getContainedVocabs();

      for (let i = 0, length = containedVocabs.length; i < length; i++) {
        const vocabId = containedVocabs[i].id;
        const splitId = vocabId.split('-');
        const fallbackId = [app.user.id, splitId[0], splitId[1], 0, part].join('-');
        const intendedId = [app.user.id, vocabId, part].join('-');

        if (this.collection.get(intendedId)) {
          containedItems.push(this.collection.get(intendedId));
        } else if (this.collection.get(fallbackId)) {
          containedItems.push(this.collection.get(fallbackId));
        } else {
          containedItems.push(this.collection.add(
            {
              id: fallbackId,
              writing: splitId[1],
            },
            {
              merge: true,
            }
          ));
        }
      }
    }

    return containedItems;
  },

  /**
   * @method getContainedVocabs
   * @returns {Array}
   */
  getContainedVocabs: function () {
    const vocab = this.getVocab();

    return vocab ? vocab.getContained() : [];
  },

  /**
   * @method getPromptItems
   * @returns {PromptItemCollection}
   */
  getPromptItems: function () {
    let promptItems = new PromptItemCollection();
    let containedItems = this.getContainedItems();
    let containedVocabs = this.getContainedVocabs();
    let now = Date.now();
    let part = this.get('part');
    let vocab = this.getVocab();
    let characters = [];
    let items = [];
    let vocabs = [];

    switch (part) {
      case 'rune':
        characters = vocab.getPromptCharacters();
        items = containedItems.length ? containedItems : [this];
        vocabs = containedVocabs.length ? containedVocabs : [vocab];
        break;
      case 'tone':
        characters = vocab.getPromptTones();
        items = containedItems.length ? containedItems : [this];
        vocabs = containedVocabs.length ? containedVocabs : [vocab];
        break;
      default:
        items = [this];
        vocabs = [vocab];
    }

    for (let i = 0, length = vocabs.length; i < length; i++) {
      let childItem = items[i];
      let childVocab = vocabs[i];
      let promptItem = new PromptItemModel();

      promptItem.character = characters[i];
      promptItem.interval = childItem.get('interval');
      promptItem.item = childItem;
      promptItem.vocab = childVocab;

      if (i === 0 && vocabs.length > 1) {
        promptItem.set('submitTime', Date.now() / 1000);
      }

      if (_.includes(['rune', 'tone'], part)) {
        promptItem.set('filler', characters[i] ? childVocab.isFiller() : true);
        promptItem.set('complete', characters[i] ? childVocab.isFiller() : true);
      } else {
        promptItem.set('filler', false);
      }

      promptItem.set('due', childItem.isDue());
      promptItem.set('kana', childVocab.isKana());

      promptItems.add(promptItem);
    }

    promptItems.due = this.isDue();
    promptItems.created = now;
    promptItems.group = now + '_' + this.id;
    promptItems.interval = this.get('interval');
    promptItems.item = this;
    promptItems.part = part;
    promptItems.readiness = this.getReadiness();
    promptItems.vocab = vocab;

    return promptItems;
  },

  /**
   * Gets the readiness value for an item based on the current time.
   * The closer the readiness is to 0, the less it is due. The higher it is
   * above 1.0, the more an item is due.
   * @method getReadiness
   * @param {Number} [startingAt] a UNIX-style timestamp to represent the
   *                              current time. Calculates based on the current
   *                              time when the function is called if not provided.
   * @returns {Number} the item's readiness
   */
  getReadiness: function (startingAt) {
    let readiness = 0;
    let last = this.get('last');
    let next = this.get('next');

    // check if local reviews need to be calculated manually
    if (this.collection && this.collection.reviews) {
      const reviews = this.collection.reviews.getByItemId(this.id);

      if (reviews.length) {
        last = _.last(reviews).submitTime;
      }

      for (let i = 0, length = reviews.length; i < length; i++) {
        next += reviews[i].newInterval;
      }
    }

    // check if initial values are available
    if (!last || !next) {
      this._readiness = 9999;

      return 9999;
    }

    const now = startingAt || moment().unix();
    const timeElapsedSinceLastAttempt = now - last;
    const scheduledInterval = next - last;

    readiness = timeElapsedSinceLastAttempt / scheduledInterval;

    if (readiness < 0 && scheduledInterval > 1) {
      readiness = 0.7;
    }

    // Tweak readiness to favor items that haven't been seen in a while at really
    // low readiness, so that new items don't crowd them out and you see everything
    // when studying a small set of words.

    // I want it to grow logarithmically such that it'll give a very small but non-
    // negligible change to items that are older than a few minutes, while giving
    // about .50 boost after a year to something maxed out (10 years).

    // The boost should drop off quickly for items that have some readiness themselves.
    if (readiness > 0 && timeElapsedSinceLastAttempt > 9000) {
      // const dayBonus = 1.0;

      // 0.0000115740740741 = the ratio of a day elapsed in a second, 1/86400
      let ageBonus = 0.1 * Math.log(1 + (2 * timeElapsedSinceLastAttempt) * 0.0000115740740741);
      const readiness2 = readiness > 1.0 ? 0.0 : 1.0 - readiness;
      ageBonus *= readiness2 * readiness2; // Less bonus if ready
      readiness += ageBonus;
    }

    // Don't let anything long-term be more ready than 250%; deprioritize the
    // really overdue long shots so that the more doable stuff comes first
    // (down to 150%).
    if (readiness > 2.5 && scheduledInterval > 550) {
      if (readiness > 20.0) {
        readiness = 1.5;
      } else {
         readiness = 3.5 - Math.pow(readiness * 0.4, 0.33333);
      }
    }

    this._readiness = readiness;

    return readiness;
  },

  /**
   * @method getVariation
   * @returns {Number}
   */
  getVariation: function () {
    return parseInt(this.id.split('-')[3], 10);
  },

  /**
   * @method getVocab
   * @returns {Vocab}
   */
  getVocab: function () {
    let vocabs = this.getVocabs();
    return vocabs[this.get('reviews') % vocabs.length];
  },

  /**
   * @method getVocabs
   * @returns {Array}
   */
  getVocabs: function () {
    let vocabs = [];
    let vocabIds = this.get('vocabIds');
    let reviewSimplified = app.user.get('reviewSimplified');
    let reviewTraditional = app.user.get('reviewTraditional');
    for (let i = 0, length = vocabIds.length; i < length; i++) {
      let vocab = this.collection.vocabs.get(vocabIds[i]);
      if (vocab) {
        let vocabStyle = vocab.get('style');
        if (vocab.isChinese()) {
          if (reviewSimplified && vocabStyle === 'simp') {
            vocabs.push(vocab);
          } else if (reviewTraditional && vocabStyle === 'trad') {
            vocabs.push(vocab);
          } else if (vocabStyle === 'both') {
            vocabs.push(vocab);
          } else if (vocabStyle === 'none') {
            vocabs.push(vocab);
          }
        } else {
          vocabs.push(vocab);
        }
      }
    }
    return vocabs;
  },

  /**
   * @method isActive
   * @returns {Boolean}
   */
  isActive: function () {
    return this.get('vocabIds').length > 0;
  },

  /**
   * Determines whether the current item is banned
   * @method isBanned
   * @returns {Boolean}
   */
  isBanned: function () {
    const vocab = this.getVocab();
    if (vocab) {
      return _.includes(this.getVocab().get('bannedParts'), this.get('part'));
    }

    return false;
  },

  /**
   * @method isCharacterDataLoaded
   * @returns {Boolean}
   */
  isCharacterDataLoaded: function () {
    let vocabCharacters = this.getVocab().getCharactersWithoutFillers();
    let loadedCharacters = app.user.characters.pluck('writing');

    return _.every(vocabCharacters, (character) => _.includes(loadedCharacters, character));
  },

  /**
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function () {
    return this.get('lang') === 'zh';
  },

  /**
   * @method isDue
   * @returns {Boolean}
   */
  isDue: function () {
    return !!this.get('vocabIds').length && this.getReadiness() >= 1.0;
  },

  /**
   * @method isJapanese
   * @returns {Boolean}
   */
  isJapanese: function () {
    return this.get('lang') === 'ja';
  },

  /**
   * @method isKana
   * @returns {Boolean}
   */
  isKana: function () {
    return app.fn.isKana(this.getBase());
  },

  /**
   * @method isLeech
   * @returns {Boolean}
   */
  isLeech: function () {
    return !this.isNew() && this.consecutiveWrong > 2;
  },

  /**
   * @method isNew
   * @returns {Boolean}
   */
  isNew: function () {
    return !this.get('reviews');
  },

  /**
   * @method isPartDefn
   * @returns {Boolean}
   */
  isPartDefn: function () {
    return this.get('part') === 'defn';
  },

  /**
   * @method isPartRdng
   * @returns {Boolean}
   */
  isPartRdng: function () {
    return this.get('part') === 'rdng';
  },

  /**
   * @method isPartRune
   * @returns {Boolean}
   */
  isPartRune: function () {
    return this.get('part') === 'rune';
  },

  /**
   * @method isPartTone
   * @returns {Boolean}
   */
  isPartTone: function () {
    return this.get('part') === 'tone';
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns {Object}
   */
  parse: function (response) {
    return response.Item || response;
  },

  /**
   * @method skip
   */
  skip: function () {
    $.ajax({
      url: app.getApiUrl(2) + 'queue/skip/' + this.id,
      type: 'POST',
      headers: app.user.session.getHeaders(),
    });
  },

  /**
   * @method unban
   */
  unban: function () {
    this.getVocab().unbanPart(this.get('part'));
  },

});

module.exports = ItemModel;
