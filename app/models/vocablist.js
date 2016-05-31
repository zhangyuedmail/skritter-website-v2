var SkritterModel = require('base/skritter-model');

/**
 * @class Vocablist
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',
  /**
   * @method parse
   * @returns {Object}
   */
  parse: function(response) {
    return response.VocabList || response;
  },
  /**
   * @property urlRoot
   * @type {String}
   */
  urlRoot: 'vocablists',
  /**
   * @method deletable
   * @returns {Boolean}
   */
  deletable: function() {
    return _.every([
      !this.get('disabled'),
      !this.get('published'),
      this.get('sort') === 'custom',
      this.get('user') === app.user.id
    ]);
  },
  /**
   * @method copyable
   * @returns {Boolean}
   */
  copyable: function() {
    return _.every([
      !this.get('disabled'),
      this.get('sort') !== 'chinesepod-lesson'
    ]);
  },
  /**
   * @method getImageUrl
   * @returns {String}
   */
  getImageUrl: function() {
    return app.getApiUrl() + 'vocablists/' + this.id + '/image';
  },
  /**
   * @method getPopularity
   * @returns {Number}
   */
  getPopularity: function() {
    var peopleStudying = this.get('peopleStudying');
    if (peopleStudying === 0) {
      return 0;
    } else if (peopleStudying > 2000) {
      return 1;
    } else {
      return Math.pow(peopleStudying / 2000, 0.3)
    }
  },
  /**
   * @method getProgress
   * @returns {Object}
   */
  getProgress: function() {
    var added = 0;
    var passed = false;
    var total = 0;
    var sections = this.get('sections') || [];
    if (this.get('studyingMode') === 'finished') {
      return {percent: 100};
    } else if (sections.length) {
      var currentIndex = this.get('currentIndex') || 0;
      var currentSection = this.get('currentSection') || sections[0].id;
      var sectionsSkipping = this.get('sectionsSkipping');
      for (var i = 0, length = sections.length; i < length; i++) {
        var section = sections[i];
        if (section.id === currentSection) {
          added += currentIndex;
          passed = true;
        }
        if (_.includes(sectionsSkipping, section.id)) {
          continue;
        }
        if (!passed) {
          added += section.rows.length;
        }
        total += section.rows.length;
      }
      return {
        added: added,
        total: total,
        percent: total ? Math.round(100 * added / total) : 0
      };
    } else if (this.get('percentDone')) {
      return {percent: this.get('percentDone')};
    } else {
      return {percent: 0};
    }
  },
  /**
   * @method getRows
   * @returns {Array}
   */
  getRows: function() {
    return _
      .chain(this.get('sections'))
      .map('rows')
      .flatten()
      .value();
  },
  /**
   * @method getSectionById
   * @param {String} sectionId
   * @returns {Object}
   */
  getSectionById: function(sectionId) {
    return _.find(this.get('sections'), {id: sectionId});
  },
  /**
   * @method getSectionVocabIds
   * @param {String} sectionId
   * @returns {Array}
   */
  getSectionVocabIds: function(sectionId) {
    var vocabIds = [];
    var section = this.getSectionById(sectionId);
    if (section) {
      vocabIds = vocabIds.concat(_.map(section.rows, 'vocabId'));
      vocabIds = vocabIds.concat(_.map(section.rows, 'tradVocabId'));
    }
    return vocabIds;
  },
  /**
   * @method getWordCount
   * @returns {Number}
   */
  getWordCount: function() {
    var count = 0;
    var rows = _.map(this.get('sections'), 'rows');
    for (var i = 0, length = rows.length; i < length; i++) {
      count += rows[i].length;
    }
    return count;
  },
  /**
   * @method isChinese
   * @returns {Boolean}
   */
  isChinese: function() {
    return this.get('lang') === 'zh';
  },
  /**
   * @method isEditable
   * @returns {Boolean}
   */
  isEditable: function() {
    return app.user.get('isAdmin') ? true : _.every([
      !this.get('disabled'),
      this.get('sort') === 'custom',
      _.some([
        this.get('user') === app.user.id,
        _.includes(this.get('editors'), app.user.id),
        this.get('public')
      ])
    ]);
  },
  /**
   * @method isFinished
   * @returns {Boolean}
   */
  isFinished: function() {
    return this.get('studyingMode') === 'finished';
  },
  /**
   * @method isJapanese
   * @returns {Boolean}
   */
  isJapanese: function() {
    return this.get('lang') === 'ja';
  },
  /**
   * @method publishable
   * @returns {Boolean}
   */
  publishable: function() {
    return _.every([
      !this.get('disabled'),
      !this.get('published'),
      this.get('sort') === 'custom',
      this.get('user') === app.user.id,
      (this.get('sections') || []).length
    ]);
  },
  /**
   * @method resetPosition
   * @param {Function} callback
   * @returns {Vocablist}
   */
  resetPosition: function(callback) {
    this.fetch({
      error: function(error) {
        _.isFunction(callback) && callback(error);
      },
      success: function(model) {
        if (model.isEditable() && model.get('sections')) {
          $.ajax({
            url: app.getApiUrl() + 'vocablists/' + model.id,
            headers: app.user.session.getHeaders(),
            type: 'PUT',
            data: {
              currentIndex: 0,
              currentSection: model.get('sections')[0].id,
              id: model.id
            },
            error: function(error) {
              _.isFunction(callback) && callback(error);
            },
            success: function(data) {
              model.set(data.VocabList);
              _.isFunction(callback) && callback();
            }
          });
        } else {
          _.isFunction(callback) && callback();
        }
      }
    });
    return this;
  }
});
