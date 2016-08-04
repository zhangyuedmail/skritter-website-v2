var SkritterCollection = require('base/skritter-collection');
var Reviews = require('collections/reviews');
var Vocabs = require('collections/vocabs');
var Item = require('models/item');

/**
 * @class Items
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(models, options) {
    options = options || {};
    this.cursor = null;
    this.dueCount = 0;
    this.history = [];
    this.sorted = null;
    this.reviews = new Reviews(null, {items: this});
    this.vocabs = new Vocabs(null, {items: this});
  },

  /**
   * @property model
   * @type {Item}
   */
  model: Item,

  /**
   * @property url
   * @type {String}
   */
  url: 'items',

  /**
   * @method addHistory
   * @param {Item} item
   * @returns {Items}
   */
  addHistory: function(item) {
    this.remove(item);
    this.history.push(item.getBase());
    if (this.history.length > 4) {
      this.history.shift();
    }

    return this;
  },

  /**
   * @method addItem
   * @param {Object} [options]
   * @param {Function} callback
   */
  addItem: function(options, callback) {
    $.ajax({
      url: app.getApiUrl() + 'items/add?lists=' + (options.lists || ''),
      type: 'POST',
      headers: app.user.session.getHeaders(),
      context: this,
      data: {
        lang: app.getLanguage()
      },
      error: function(error) {
        console.log(error);
        callback(error);
      },
      success: function(result) {
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
                if (!error) {
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
    if (this.state === 'fetching') {
      return;
    }

    var self = this;
    var count = 0;
    options = options || {};
    options.cursor = options.cursor || null;
    options.limit = options.limit || 10;
    options.loop = options.loop || 1;

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
            include_sentences: true,
            include_strokes: true,
            include_vocabs: true,
            parts: app.user.getFilteredParts().join(','),
            styles: app.user.getFilteredStyles().join(',')
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
        _.isFunction(callback) && callback(error, self);
      }
    );
  },

  /**
   * @method getNext
   * @returns {Array}
   */
  getNext: function() {
    var history = this.history;
    return _
      .chain(this.models)
      .filter(
        function(model) {
          return model.isActive() && !model.isBanned() && !_.includes(history, model.getBase());
        }
      )
      .shuffle()
      .value();
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
    this.vocabs.strokes.add(response.Strokes);
    return response.Items.concat(response.ContainedItems || []);
  },

  /**
   * @method reset
   * @returns {Items}
   */
  reset: function() {
    this.vocabs.reset();
    return SkritterCollection.prototype.reset.call(this);
  },

  /**
   * @method sort
   * @returns {Items}
   */
  sort: function() {
    this.sorted = moment().unix();
    return SkritterCollection.prototype.sort.call(this);
  },

  /**
   * @method updateDueCount
   */
  updateDueCount: function() {
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
        this.dueCount = '-';
      },
      success: function(result) {
        var count = 0;
        for (var part in result.due) {
          for (var style in result.due[part]) {
            count += result.due[part][style];
          }
        }
        this.dueCount =  count;
        this.trigger('due-count', this.dueCount);
      }
    });
  }

});
