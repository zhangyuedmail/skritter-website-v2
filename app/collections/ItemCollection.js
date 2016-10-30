const BaseSkritterCollection = require('base/BaseSkritterCollection');
const ReviewCollection = require('collections/ReviewCollection');
const VocabCollection = require('collections/VocabCollection');
const ItemModel = require('models/ItemModel');

/**
 * A collection of ItemModels for a user to review related to a specific
 * Vocab they are studying.
 * @class ItemCollection
 * @extends {BaseSkritterCollection}
 */
const ItemCollection = BaseSkritterCollection.extend({

  /**
   * @property model
   * @type {ItemModel}
   */
  model: ItemModel,

  /**
   * @property url
   * @type {String}
   */
  url: 'items',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(models, options) {
    options = options || {};
    this.cursor = null;
    this.dueCount = 0;
    this.history = [];
    this.addingState = 'standby';
    this.dueCountState = 'standby';
    this.fetchingState = 'standby';
    this.sorted = null;
    this.reviews = new ReviewCollection(null, {items: this});
    this.vocabs = new VocabCollection(null, {items: this});
  },

  /**
   * @method parse
   * @param {Object} response
   * @returns {Object}
   */
  parse: function(response) {
    this.cursor = response.cursor;
    this.vocabs.add(response.Vocabs);
    this.vocabs.decomps.add(response.Decomps);
    this.vocabs.sentences.add(response.Sentences);
    this.vocabs.character.add(response.Strokes);
    return response.Items.concat(response.ContainedItems || []);
  },

  /**
   * @method reset
   * @returns {Items}
   */
  reset: function() {
    this.vocabs.reset();
    return BaseSkritterCollection.prototype.reset.call(this);
  },

  /**
   * @method addHistory
   * @param {ItemModel} item
   * @returns {ItemCollection}
   */
  addHistory: function(item) {
    this.remove(item);
    this.history.unshift(item.getBase().split(''));
    if (this.history.length > 4) {
      this.history.pop();
    }

    return this;
  },

  /**
   * @method addItem
   * @param {Object} [options]
   * @param {Function} callback
   */
  addItem: function(options, callback) {
    var self = this;
    if (this.addingState === 'standby') {
      this.addingState = 'adding';
    } else {
      _.isFunction(callback) && callback();
      return;
    }

    options.listId = options.listId || '';

    $.ajax({
      url: app.getApiUrl() + 'items/add?lists=' + options.listId,
      type: 'POST',
      headers: app.user.session.getHeaders(),
      context: this,
      data: {
        lang: app.getLanguage()
      },
      error: function(error) {
        console.log(error);
        self.addingState = 'standby';
        callback(error);
      },
      success: function(result) {
        self.addingState = 'standby';
        callback(null, result);
      }
    });
  },

  /**
   * @method addItems
   * @param {Object} [options]
   * @param {Function} callback
   */
  addItems: function(options, callback) {
    var self = this;
    var count = 0;
    var results = {items: [], numVocabsAdded: 0};

    options = options || {};
    options.limit = options.limit || 1;

    async.whilst(
      function() {
        return count < options.limit;
      },
      function(callback) {
        app.user.isSubscriptionActive(function(active) {
          if (active) {
            count++;
            self.addItem(
              options,
              function(error, result) {
                if (!error && result) {
                  results.items.push(result);
                  results.numVocabsAdded += result.numVocabsAdded;
                }
                callback();
              }
            );
          } else {
            callback(null, results);
          }
        });
      },
      function() {
        self.updateDueCount();
        callback(null, results);
      }
    );
  },

  /**
   * @method clearHistory
   * @returns {Items}
   */
  clearHistory: function() {
    this.reset();
    this.history = [];

    return this;
  },

  /**
   * @method comparator
   * @param {Item} item
   * @returns {Number}
   */
  comparator: function(item) {
    return -item.getReadiness();
  },

  /**
   * @method fetchNext
   * @param {Object} options
   * @param {Function} [callback]
   */
  fetchNext: function(options, callback) {
    var self = this;
    var count = 0;

    options = options || {};
    options.cursor = options.cursor || null;
    options.limit = options.limit || 10;
    options.listId = options.listId || null;
    options.loop = options.loop || 1;

    if (this.fetchingState === 'fetching') {
      _.isFunction(callback) && callback(null, self);
      return;
    } else {
      this.fetchingState = 'fetching';
    }

    async.whilst(
      function() {
        return count < options.loop;
      },
      function(callback) {
        count++;
        self.fetch({
          data: {
            sort: 'next',
            cursor: options.cursor,
            lang: app.getLanguage(),
            limit: 2,
            include_contained: true,
            include_decomps: true,
            include_heisigs: true,
            include_sentences: false,
            include_strokes: true,
            include_vocabs: true,
            parts: app.user.getFilteredParts().join(','),
            styles: app.user.getFilteredStyles().join(','),
            vocab_list: options.listId
          },
          merge: true,
          remove: false,
          sort: false,
          error: function(error) {
            callback(error);
          },
          success: function(items) {
            options.cursor = items.cursor;
            callback();
          }
        });
      },
      function(error) {
        self.updateDueCount();
        self.fetchingState = 'standby';
        _.isFunction(callback) && callback(error, self);
      }
    );
  },

  /**
   * @method getNext
   * @returns {Array}
   */
  getNext: function() {
    var collection = this;
    var history = _.flatten(this.history);
    return _
      .chain(this.models)
      .filter(
        function(model) {

          //check if model has been removed from collection
          if (!model) {
            return false;
          }

          //exclude items with related characters from history
          for (var i = 0, length = history.length; i < length; i++) {
            if (_.includes(model.getBase(), history[i])) {
              return false;
            }
          }

          if (model.isJapanese()) {
            //skip all kana writings when study kana disabled
            if (!app.user.get('studyKana') && model.isPartRune() && model.isKana()) {
              //TODO: investigate why models unable to save
              collection.remove(model);
              model.bump();
              model.save();
              return false;
            }
          }

          if (!model.isActive()) {
            return false;
          } else if (model.isBanned()) {
            return false;
          } else {
            return model;
          }
        }
      )
      .value();
  },

  /**
   * @method shortenHistory
   * @returns {Items}
   */
  shortenHistory: function() {
    if (this.history.length > 1) {
      this.history = [this.history[0]];
    }

    return this;
  },

  /**
   * @method sort
   * @returns {Items}
   */
  sort: function() {
    this.sorted = moment().unix();

    return BaseSkritterCollection.prototype.sort.call(this);
  },

  /**
   * @method updateDueCount
   */
  updateDueCount: function() {
    var self = this;
    if (this.dueCountState === 'fetching') {
      return;
    } else {
      this.dueCountState = 'fetching';
    }

    $.ajax({
      url: app.getApiUrl() + 'items/due',
      type: 'GET',
      headers: app.user.session.getHeaders(),
      context: this,
      data: {
        lang: app.getLanguage(),
        parts: app.user.getFilteredParts().join(','),
        styles: app.user.getFilteredStyles().join(',')
      },
      error: function(error) {
        console.log(error);
        self.dueCount = '-';
        self.dueCountState = 'standby';
      },
      success: function(result) {
        var count = 0;
        for (var part in result.due) {
          for (var style in result.due[part]) {
            count += result.due[part][style];
          }
        }
        self.dueCount =  count;
        self.dueCountState = 'standby';
        self.trigger('update:due-count', this.dueCount);
      }
    });
  }

});

module.exports = ItemCollection;
