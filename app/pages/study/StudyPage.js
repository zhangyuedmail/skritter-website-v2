var GelatoPage = require('gelato/page');
var Prompt = require('components/study/prompt/view');
var Toolbar = require('components/study/toolbar/view');
var Recipes = require('components/common/CommonRecipesComponent');
var Items = require('collections/ItemCollection');
var Vocablists = require('collections/VocablistCollection');

/**
 * @class Study
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: false,

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyPage.jade'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Study - Skritter',

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    ScreenLoader.show();

    this.currentPromptItems = null;
    this.items = new Items();
    this.previousPrompt = false;
    this.previousPromptItems = null;
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
        var active = app.user.isSubscriptionActive();

        if (!hasItems && !hasVocablists) {
          self.prompt.render();
          self.prompt.$('#overlay').show();
          ScreenLoader.hide();
        } else if (!hasItems && hasVocablists) {
          if (active) {
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
            self.prompt.render();
            self.prompt.$('#overlay').show();
            ScreenLoader.hide();
          }
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
    if (!this.currentPromptItems) {
      this.next();
    }
  },

  /**
   * @method handlePromptNext
   * @param {PromptItems} promptItems
   */
  handlePromptNext: function(promptItems) {
    this.items.reviews.put(promptItems.getReview());

    if (!this.previousPrompt) {
      if (promptItems.readiness >= 1.0) {
        this.toolbar.dueCountOffset++;
      }
      if (this.items.reviews.length > 2) {
        this.items.reviews.post({skip: 1});
      }
      this.currentPromptItems = null;
      this.previousPromptItems = promptItems;
      this.toolbar.timer.addLocalOffset(promptItems.getBaseReviewingTime());
      this.items.addHistory(promptItems.item);
    }

    this.previousPrompt = false;
    this.next();
  },

  /**
   * @method handlePromptPrevious
   * @param {PromptItems} promptItems
   */
  handlePromptPrevious: function(promptItems) {
    this.previousPrompt = true;
    this.currentPromptItems = promptItems;
    this.previous();
  },

  /**
   * @method next
   */
  next: function() {
    var items = this.items.getNext();
    if (this.previousPrompt) {
      this.prompt.$panelLeft.css('opacity', 1.0);
      this.prompt.reviewStatus.render();
      this.prompt.set(this.currentPromptItems);
      this.toolbar.render();
    } else if (items.length) {
      this.currentPromptItems = items[0].getPromptItems();
      this.prompt.$panelLeft.css('opacity', 1.0);
      this.prompt.reviewStatus.render();
      this.prompt.set(this.currentPromptItems);
      this.toolbar.render();
      if (items.length < 5) {
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
    if (this.previousPromptItems) {
      this.prompt.$panelLeft.css('opacity', 1.0);
      this.prompt.reviewStatus.render();
      this.prompt.set(this.previousPromptItems);
      this.toolbar.render();
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
