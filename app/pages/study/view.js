var GelatoPage = require('gelato/page');
var Prompt = require('components/study/prompt/view');
var Toolbar = require('components/study/toolbar/view');
var Recipes = require('components/common/recipes/view');
var Items = require('collections/items');
var Vocablists = require('collections/vocablists');

/**
 * @class Study
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    ScreenLoader.show();

    this.item = null;
    this.items = new Items();
    this.prompt = new Prompt({page: this});
    this.toolbar = new Toolbar({page: this});
    this.vocablists = new Vocablists();

    if (app.user.get('eccentric')) {
      this._views['recipe'] = new Recipes();
    }

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
  },

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: false,

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Study - Skritter',

  /**
   * @method render
   * @returns {Study}
   */
  render: function() {
    this.renderTemplate();
    this.prompt.setElement('#study-prompt-container').render();
    this.toolbar.setElement('#study-toolbar-container').render();

    if (app.user.get('eccentric')) {
      this._views['recipe'].setElement('#recipes-container').render();
    }

    this.checkRequirements();

    return this;
  },

  /**
   * Adds an item to the study queue
   * @method addItem
   * @param {Boolean} [silenceNoItems]
   * whether to suppress messages to the user about the items added if nothing was added.
   */
  addItem: function(silenceNoItems) {
    this.items.addItems(
      {
        lang: app.getLanguage(),
        limit: 1
      },
      function(error, result) {
        if (!error) {
          var added = result.numVocabsAdded;

          if (added === 0) {
            if (silenceNoItems) {
              return;
            }

            $.notify(
              {
                message: 'No more words to add. <a href="/vocablists/browse">Add a new list</a>'
              },
              {
                type: 'pastel-info',
                animate: {
                  enter: 'animated fadeInDown',
                  exit: 'animated fadeOutUp'
                },
                delay: 5000,
                icon_type: 'class'
              }
            );
            return;
          }

          $.notify(
            {
              message: added + (added > 1 ? ' words have ' : ' word has ') + 'been added.'
            },
            {
              type: 'pastel-success',
              animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
              },
              delay: 5000,
              icon_type: 'class'
            }
          );
        }

      }
    );
  },

  /**
   * @method checkRequirements
   */
  checkRequirements: function() {
    ScreenLoader.post('Preparing study');
    var self = this;
    var hasItems = false;
    var hasVocablists = false;
    async.parallel(
      [
        function(callback) {
          app.user.subscription.fetch({
            error: function() {
              callback();
            },
            success: function() {
              callback();
            }
          });
        },
        function(callback) {
          self.items.clearHistory();
          self.items.updateDueCount();
          self.items.fetchNext(
            {
              limit: 1
            },
            function(error, result) {
              self.items.fetchNext({
                cursor: result.cursor,
                limit: 2,
                loop: 5
              });
              hasItems = !error && result.length;
              callback();
            }
          );
        },
        function(callback) {
          self.vocablists.fetch({
            data: {
              lang: app.getLanguage(),
              limit: 1,
              sort: 'adding'
            },
            error: function() {
              hasVocablists = false;
              callback();
            },
            success: function(result) {
              hasVocablists = result.length > 0;
              callback();
            }
          });
        }
      ],
      function() {
        if (!hasItems && !hasVocablists) {
          self.prompt.render();
          self.prompt.$('#overlay').show();
          ScreenLoader.hide();
        } else if (!hasItems && hasVocablists) {
          ScreenLoader.post('Adding your first words');
          self.items.addItems(
            {
              lang: app.getLanguage(),
              limit: 5
            },
            function() {
              app.reload();
            }
          );
        } else {
          ScreenLoader.hide();
          self.next();
          self.stopListening(self.items);
          self.listenTo(self.items, 'state', self.handleItemState);
        }
      }
    );
  },

  /**
   * @method handleItemState
   */
  handleItemState: function() {
    if (!this.item) {
      this.next();
    }
  },

  /**
   * @method handlePromptNext
   * @param {PromptItems} promptItems
   */
  handlePromptNext: function(promptItems) {
    var self = this;
    var review = promptItems.getReview();
    if (this.item) {
      this.items.reviews.put(
        review,
        null,
        function() {
          if (promptItems.readiness >= 1.0) {
            self.toolbar.dueCountOffset++;
          }
          if (self.items.reviews.length > 2) {
            self.items.reviews.post({skip: 1});
          }
          self.items.addHistory(self.item);
          self.item = null;
          self.toolbar.timer.addLocalOffset(promptItems.getBaseReviewingTime());
          self.next();
        }
      );
    }
  },

  /**
   * @method handlePromptPrevious
   * @param {PromptItems} promptItems
   */
  handlePromptPrevious: function(promptItems) {
    this.previous();
  },

  /**
   * @method next
   */
  next: function() {
    var items = this.items.getNext();
    if (items.length) {
      this.item = items[0];
      this.prompt.$panelLeft.css('opacity', 1.0);
      this.prompt.set(this.item.getPromptItems());
      this.prompt.reviewStatus.render();
      this.toolbar.render();
      if (this.items.length < 5) {
        this.items.fetchNext({limit: 2, loop: 5});
      }
      if (app.user.isItemAddingAllowed() && this.items.dueCount < 5) {
        this.addItem(true);
      }
    } else {
      this.prompt.$panelLeft.css('opacity', 0.2);
      this.items.shortenHistory();
      this.items.fetchNext({limit: 1});
    }
  },

  /**
   * @method previous
   */
  previous: function() {
    if (this.items.reviews.length) {
      var review = this.items.reviews.last();
      if (review.has('promptItems')) {
        this.prompt.set(review.get('promptItems'));
        this.toolbar.render();
      }
    }
  },

  /**
   * @method remove
   * @returns {Study}
   */
  remove: function() {
    this.prompt.remove();
    this.toolbar.remove();
    this.items.reviews.post();
    return GelatoPage.prototype.remove.call(this);
  }

});
