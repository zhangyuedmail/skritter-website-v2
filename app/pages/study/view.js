var GelatoPage = require('gelato/page');
var Prompt = require('components/study/prompt/view');
var Toolbar = require('components/study/toolbar/view');
var Recipes = require('components/common/recipes/view');
var Items = require('collections/items');

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
    this.promptCurrent = null;
    this.promptPrevious = null;
    this.scheduleState = 'standby';
    this.toolbar = new Toolbar({page: this});

    if (app.user.get('eccentric')) {
      this._views['recipe'] = new Recipes();
    }

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
    window.onbeforeunload = this.handleWindowOnBeforeUnload.bind(this);
  },

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #add-item-button': 'handleClickAddItemButton'
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
    ScreenLoader.post('Preparing study');
    this.renderTemplate();
    this.prompt.setElement('#study-prompt-container').render();
    this.toolbar.setElement('#study-toolbar-container').render();

    if (app.user.get('eccentric')) {
      this._views['recipe'].setElement('#recipes-container').render();
    }

    this.prompt.reviewStatus.setItems(this.items);
    this.next();

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
        lists: this.vocablist ? this.vocablist.id : null
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
                title: 'Update',
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
              title: 'Update',
              message: added + (added > 1 ? ' words have ' : ' word has ') + 'been added.'
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
        }

      }
    );
  },

  /**
   * @method handleClickAddItemButton
   */
  handleClickAddItemButton: function(event) {
    event.preventDefault();
    this.addItem();
  },

  /**
   * @method handleWindowOnBeforeUnload
   */
  handleWindowOnBeforeUnload: function() {
    if (!this.items.reviews.length) {
      return;
    }
    return 'You have ' + this.items.reviews.length + ' unsaved reviews!';
  },

  /**
   * @method handlePromptNext
   * @param {PromptItems} promptItems
   */
  handlePromptNext: function(promptItems) {
    var self = this;
    if (this.item) {
      var review = promptItems.getReview();
      this.items.reviews.put(
        review,
        null,
        function() {
          if (self.items.reviews.length > 3) {
            self.items.reviews.post({skip: 1});
          }
          self.items.addHistory(self.item);
          self.item = null;
          self.next();
        }
      );
    } else {
      this.prompt.reviewStatus.render();
    }
  },

  /**
   * @method handlePromptPrevious
   * @param {PromptItems} promptItems
   */
  handlePromptPrevious: function(promptItems) {
    //TODO: FIX THIS SHIT
  },

  /**
   * @method next
   */
  next: function() {
    var items = this.items.getNext();
    this.prompt.reviewStatus.render();
    if (items.length) {
      ScreenLoader.hide();
      this.item = items[0];
      this.prompt.set(this.item.getPromptItems());
      if (this.items.length < 5) {
        this.items.fetchNext({limit: 10});
      }
    } else {
      this.items.clearHistory();
      this.items.fetchNext({limit: 10}, this.next.bind(this));
    }
  },

  /**
   * @method previous
   */
  previous: function() {
    if (this.items.reviews.length) {
      var review = this.items.reviews.last();
      if (review.has('promptItems')) {
        this.toolbar.render();
        this.prompt.set(review.get('promptItems'));
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
    window.onbeforeunload = null;

    return GelatoPage.prototype.remove.call(this);
  }

});
