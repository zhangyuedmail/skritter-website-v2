const SkritterModel = require('base/BaseSkritterModel');
const VocablistHistoryCollection = require('collections/VocablistHistoryCollection');

/**
 * A model that represents a VocabList with sections and words a user can study
 * @class VocablistModel
 * @extends {SkritterModel}
 */
const VocablistModel = SkritterModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: 'id',

  /**
   * @property urlRoot
   * @type {String}
   */
  urlRoot: 'vocablists',

  /**
   *
   * @param models
   * @param options
   * @method initialize
   */
  initialize: function(models, options) {
    this.history = new VocablistHistoryCollection(null, {
      id: this.id
    });
  },

  /**
   * @method parse
   * @returns {Object}
   */
  parse: function(response) {
    return response.VocabList || response;
  },

  /**
   * @method sync
   * @param {String} method
   * @param {Model} model
   * @param {Object} options
   */
  sync: function(method, model, options) {
    options.headers = _.result(this, 'headers');

    if (!options.url) {
      options.url = app.getApiUrl() + _.result(this, 'url');
    }

    if (method === 'read' && app.config.useV2Gets.vocablists) {
      options.url = app.getApiUrl(2) + 'gae/vocablists/' + this.id;
    }

    SkritterModel.prototype.sync.call(this, method, model, options);
  },

  /**
   * Determines whether the user has permission to delete a list
   * @method deletable
   * @returns {Boolean}
   */
  deletable: function() {
    return _.every([
      !this.get('disabled'),
      !this.get('published'),
      this.get('sort') === 'custom',
      (this.get('user') || this.get('creator')) === app.user.id
    ]);
  },

  /**
   * Determines whether the list can be copied by a user
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
   * Gets information on what category this list belongs to
   * @method getCategoryUrl
   * @returns {Object} contains a label attribute with the section name
   *                    and a url attribute with the URL to the category.
   */
  getCategoryAndUrl: function() {
    const publisher = this.getPublisherName();

    if (publisher === 'Skritter') {
      return {label: 'Official Lists', url: '/vocablists/browse'};
    }

    if (publisher === 'ChinesePod') {
      return {label: 'ChinesePod Lists', url: '/vocablists/chinesepod'};
    }

    if (publisher === app.user.get('name')) {
      if (this.get('deleted')) {
        return {label: 'Deleted Lists', url: '/vocablists/deleted'};
      }
      return {label: 'My Lists', url: '/vocablists/my-lists'};
    }

    return {label: 'Published Lists', url: '/vocablists/published'};
  },

  /**
   * Gets the changed date and presents it in a nice format.
   * @returns {String} a UI-printable representation of the publish date
   */
  getFormattedChangedDate: function(format) {
    format = format || 'l';
    let changed = moment(this.get('changed') * 1000);

    if (app.config.useV2Gets.vocablists) {
      changed = moment(this.get('changed'));
    }

    return changed.format(format);
  },

  /**
   * Gets the publish date and presents it in a nice format.
   * @returns {String} a UI-printable representation of the publish date
   */
  getFormattedPublishedDate: function(format) {
    format = format || 'l';
    let published = moment(this.get('published') * 1000);

    if (app.config.useV2Gets.vocablists) {
      published = moment(this.get('published'));
    }

    return published.format(format);
  },

  /**
   *
   * @method getNormalizedStudyingMode
   * @returns {String}
   */
  getNormalizedStudyingMode: function() {
    if (_.includes(['adding', 'studing', 'studying'], this.get('studyingMode'))) {
      return 'studying';
    } else {
      return this.get('studyingMode');
    }
  },

  /**
   * Gets the URL for the list's image
   * @method getImageUrl
   * @returns {String} the URL to the image
   */
  getImageUrl: function() {
    return app.getApiUrl() + 'vocablists/' + this.id + '/image';
  },

  /**
   * Gets a number based on how popular a list is
   * @method getPopularity
   * @returns {Number} the popularity of the list
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
    } else if (this.get('percentDone')) {
      return {percent: this.get('percentDone')};
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
    } else {
      return {percent: 0};
    }
  },

  /**
   * Gets a UI-printable version of the publisher of the list
   * @return {string}
   */
  getPublisherName: function() {
    if (this.get('sort') === 'official') {
      return 'Skritter';
    } else if (this.get('sort') === 'chinesepod-lesson') {
      return 'ChinesePod';
    } else if (this.get('creator') === app.user.id) {
      return app.user.get('name') || app.user.id;
    } else if (this.get('creator')) {
      return this.get('creator');
    }

    return 'Unknown';
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
    //give admin account full editing power
    if (app.user.get('isAdmin')) {
      return true;
    }

    return _.every(
      [
        !this.get('disabled'),
        this.get('sort') === 'custom',
        _.some(
          [
            _.includes(this.get('editors'), app.user.id),
            this.get('creator') === app.user.id
          ]
        )
      ]
    );
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
   * Publishes a list so it can be publicly searched.
   * @param {Function} callback
   * @method publish
   */
  publish: function(callback) {
    var publishUrl = app.getApiUrl() + _.result(this, 'url') + '/publish';

    $.ajax({
      url: publishUrl,
      method: 'POST',
      headers: app.user.headers(),
      data: {
        isTextbook: this.get('isTextbook')
      },
      success: function() {
        if (_.isFunction(callback)) {
          callback(true);
        }
      },
      error: function(error) {
        if (_.isFunction(callback)) {
          callback(false, error);
        }
      }
    });
  },

  /**
   * @method resetPosition
   * @param {Function} callback
   * @returns {VocablistModel}
   */
  resetPosition: function(callback) {
    this.fetch({
      error: function(error) {
        _.isFunction(callback) && callback(error);
      },
      success: function(model) {
        var sections = model.get('sections');
        if (model.isEditable() && sections && sections.length) {
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

module.exports = VocablistModel;
