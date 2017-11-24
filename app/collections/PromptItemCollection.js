const GelatoCollection = require('gelato/collection');
const PromptItemModel = require('models/PromptItemModel');

/**
 * @class PromptItemCollection
 * @extends {GelatoCollection}
 */
const PromptItemCollection = GelatoCollection.extend({

  /**
   * @property complete
   * @type {Boolean}
   */
  complete: false,

  /**
   * @property due
   * @type {Boolean}
   */
  due: false,

  /**
   * @property group
   * @type {String}
   */
  group: null,

  /**
   * @property interval
   * @type {Number}
   */
  interval: 0,

  /**
   * @property item
   * @type {Item}
   */
  item: null,

  /**
   * @property model
   * @type {PromptItemModel}
   */
  model: PromptItemModel,

  /**
   * @property originals
   * @type {Array}
   */
  originals: [],

  /**
   * @property part
   * @type {String}
   */
  part: null,

  /**
   * @property position
   * @type {Number}
   */
  position: 0,

  /**
   * @property showContained
   * @type {Boolean}
   */
  showContained: false,

  /**
   * @property showDefinition
   * @type {Boolean}
   */
  showDefinition: false,

  /**
   * @property skip
   * @type {Boolean}
   */
  skip: false,

  /**
   * @property vocab
   * @type {Vocab}
   */
  vocab: null,

  /**
   * @method current
   * @returns {PromptItemModel}
   */
  current: function () {
    return this.getActive()[this.position];
  },

  /**
   * @method getActive
   * @returns {Array}
   */
  getActive: function () {
    return _.filter(
      this.models,
      function (item) {
        return !item.get('filler');
      }
    );
  },

  /**
   * @method getActiveLength
   * @returns {Number}
   */
  getActiveLength: function () {
    return this.getActive().length;
  },

  /**
   * @method getBaseReviewData
   * @returns {Object}
   */
  getBaseReviewData: function () {
    return {
      item: this.item,
      itemId: this.item ? this.item.id : this.vocab.id,
      bearTime: true,
      currentInterval: this.interval || 0,
      due: this.due,
      reviewTime: this.getBaseReviewingTime(),
      score: this.getBaseScore(),
      submitTime: this.getBaseSubmitTime(),
      thinkingTime: this.getBaseThinkingTime(),
      wordGroup: this.group,
    };
  },

  /**
   * @method getBaseSubmitTime
   * @returns {Number}
   */
  getBaseSubmitTime: function () {
    return this.at(0).get('submitTime');
  },

  /**
   * @method getBaseReviewingTime
   * @returns {Number}
   */
  getBaseReviewingTime: function () {
    let reviewingTime = 0;
    for (let i = 0, length = this.length; i < length; i++) {
      reviewingTime += this.at(i).getReviewingTime();
    }
    return reviewingTime;
  },

  /**
   * @method getBaseScore
   * @returns {Number}
   */
  getBaseScore: function () {
    let score = null;
    if (this.length > 1) {
      let totalCount = this.length;
      let totalScore = 0;
      let totalWrong = 0;
      for (let i = 0, length = this.length; i < length; i++) {
        let reviewScore = this.at(i).get('score');
        totalScore += reviewScore;
        if (reviewScore === 1) {
          totalWrong++;
        }
      }
      if (totalCount === 2 && totalWrong === 1) {
        score = 1;
      } else if (totalWrong > 1) {
        score = 1;
      } else {
        score = Math.floor(totalScore / totalCount);
      }
    }
    return score || this.at(0).get('score');
  },

  /**
   * @method getBaseThinkingTime
   * @returns {Number}
   */
  getBaseThinkingTime: function () {
    let thinkingTime = 0;
    for (let i = 0, length = this.length; i < length; i++) {
      thinkingTime += this.at(i).getThinkingTime();
    }
    return thinkingTime;
  },

  /**
   * @method getChildReviewData
   * @returns {Array}
   */
  getChildReviewData: function () {
    return this.filter(function (review) {
      return !review.get('filler') && !review.get('kana');
    }).map(function (model) {
      return model.getReviewData();
    });
  },

  /**
   * @method getReview
   * @returns {Object}
   */
  getReview: function () {
    let reviews = [this.getBaseReviewData()];

    if (this.length > 1) {
      reviews = reviews.concat(this.getChildReviewData());
    }

    return {
      created: this.created,
      data: reviews,
      group: this.group,
      promptItems: this,
    };
  },

  /**
   * @method getLimit
   * @returns {Number}
   */
  getLimit: function () {
    return this.part === 'tone' ? 15000 : 30000;
  },

  /**
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function () {
    return this.vocab.isChinese();
  },

  /**
   * @method isComplete
   * @returns {Boolean}
   */
  isComplete: function () {
    return this.complete || _.includes(this.map('complete'), false) === false;
  },

  /**
   * @method isContainedShown
   * @returns {Boolean}
   */
  isContainedShown: function () {
    return this.showContained || this.current().get('showContained');
  },

  /**
   * @method isDefinitionShown
   * @returns {Boolean}
   */
  isDefinitionShown: function () {
    // show definition on mobile writing prompts when definition and reading are hidden
    if (app.isMobile() && this.part === 'rune' && app.user.get('hideDefinition') && app.user.get('hideReading')) {
      return true;
    }

    return this.showDefinition || !app.user.get('hideDefinition') || this.isComplete();
  },

  /**
   * @method isFirst
   * @returns {Boolean}
   */
  isFirst: function () {
    return this.position === 0;
  },

  /**
   * @method isJapanese
   * @returns {Boolean}
   */
  isJapanese: function () {
    return this.vocab.isJapanese();
  },

  /**
   * @method isNew
   * @returns {Boolean}
   */
  isNew: function () {
    return this.item ? this.item.isNew() : false;
  },

  /**
   * @method isLast
   * @returns {Boolean}
   */
  isLast: function () {
    return this.position >= this.getActiveLength() - 1;
  },

  /**
   * @method isTeachable
   * @returns {Boolean}
   */
  isTeachable: function () {
    if (this.item && app.user.get('teachingMode')) {
      return this.item.isNew();
    }
    return false;
  },

  /**
   * @method next
   * @returns {PromptItemModel}
   */
  next: function () {
    if (!this.isLast()) {
      this.position++;
    }
    return this.current();
  },

  /**
   * @method previous
   * @returns {PromptItemModel}
   */
  previous: function () {
    if (!this.isFirst()) {
      this.position--;
    }
    return this.current();
  },

  /**
   * @method teachAll
   */
  teachAll: function () {
    this.forEach(function (review) {
      review.set('showTeaching', true);
    });
  },
});

module.exports = PromptItemCollection;
