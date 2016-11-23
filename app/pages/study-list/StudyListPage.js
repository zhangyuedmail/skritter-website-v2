const GelatoPage = require('gelato/page');
const Prompt = require('components/study/prompt/StudyPromptComponent.js');
const Toolbar = require('components/study/toolbar/StudyToolbarComponent.js');
const Recipes = require('components/common/CommonRecipesComponent.js');
const Items = require('collections/ItemCollection.js');
const Vocablist = require('models/VocablistModel.js');
const MobileStudyNavbar = require('components/navbars/NavbarMobileStudyComponent.js');
const StudySettings = require('dialogs/study-settings/view');
const vent = require('vent');

/**
 * @class StudyListPage
 * @extends {GelatoPage}
 */
const StudyListPage = GelatoPage.extend({

  /**
   * @property showFooter
   * @type {Boolean}
   */
  showFooter: false,

  /**
   * The navbar to use in mobile views
   * @type {NavbarMobileStudyComponent}
   */
  mobileNavbar: MobileStudyNavbar,

  /**
   * @property template
   * @type {Function}
   */
  template: require('./StudyListPage.jade'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Study - Skritter',

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    ScreenLoader.show();

    this.currentPromptItems = null;
    this.items = new Items();
    this.previousPrompt = false;
    this.previousPromptItems = null;
    this.prompt = new Prompt({page: this});
    this.toolbar = new Toolbar({page: this});
    this.vocablist = new Vocablist({id: options.listId});

    if (app.user.get('eccentric')) {
      this._views['recipe'] = new Recipes();
    }

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
    this.listenTo(vent, 'item:add', this.addItem);
    this.listenTo(vent, 'studySettings:show', this.showStudySettings);
  },

  /**
   * @method render
   * @returns {StudyListPage}
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
        limit: 1,
        listId: this.vocablist.id
      },
      function(error, result) {
        if (!error) {
          let added = result.numVocabsAdded;

          if (added === 0) {
            if (silenceNoItems) {
              return;
            }
            // TODO: this should respond to vent item:added in a separate
            // function--"app-level" notification?
            // Could be added from lists or vocab info dialog...
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
        vent.trigger('item:added', !error ? result : null);
      }
    );
  },

  /**
   * @method checkRequirements
   */
  checkRequirements: function() {
    ScreenLoader.post('Preparing study');
    let self = this;
    let hasItems = false;
    let hasVocablist = false;
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
              limit: 1,
              listId: self.vocablist.id
            },
            function(error, result) {
              self.items.fetchNext({
                cursor: result.cursor,
                limit: 2,
                listId: self.vocablist.id,
                loop: 5
              });
              hasItems = !error && result.length;
              callback();
            }
          );
        },
        function(callback) {
          self.vocablist.fetch({
            error: function() {
              hasVocablist = false;
              callback();
            },
            success: function(result) {
              hasVocablist = result !== undefined;
              callback();
            }
          });
        }
      ],
      function() {
        let active = app.user.isSubscriptionActive();

        if (!hasVocablist) {
          ScreenLoader.hide();
          app.router.navigate('', {trigger: true});
        } else if (!hasItems) {
          if (active) {
            ScreenLoader.post('Adding words from list');
            document.title = self.vocablist.get('name') + ' - Skritter';
            self.items.addItems(
              {
                lang: app.getLanguage(),
                limit: 5,
                listId: self.vocablist.id
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
          document.title = self.vocablist.get('name') + ' - Skritter';
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
    let items = this.items.getNext();
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
        this.items.fetchNext({limit: 2, listId: this.vocablist.id, loop: 5});
      }
      if (app.user.isItemAddingAllowed() && this.items.dueCount < 5) {
        this.addItem(true);
      }
    } else {
      this.prompt.$panelLeft.css('opacity', 0.2);
      this.items.shortenHistory();
      this.items.fetchNext({limit: 1, listId: this.vocablist.id});
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
   * @returns {StudyListPage}
   */
  remove: function() {
    this.prompt.remove();
    this.toolbar.remove();
    this.items.reviews.post();
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Shows a dialog that allows the user to adjust their study settings
   */
  showStudySettings: function() {
    const dialog = new StudySettings();

    dialog.open();

    dialog.on('save', (settings) => {
      ScreenLoader.show();
      ScreenLoader.post('Saving study settings');
      app.user.set(settings, {merge: true});
      app.user.cache();
      app.user.save(
        null,
        {
          error: () => {
            ScreenLoader.hide();
            dialog.close();
          },
          success: () => {
            this.items.reviews.post().then(app.reload);
          }
        }
      );
    });
  }

});

module.exports = StudyListPage;
