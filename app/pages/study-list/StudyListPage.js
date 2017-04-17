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

    this.currentItem = null;
    this.currentPromptItems = null;
    this.previousItem = null;
    this.previousPrompt = false;
    this.previousPromptItems = null;

    this.items = new Items();
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
    if (app.isMobile()) {
      this.template = require('./MobileStudyListPage.jade');
    }

    this.renderTemplate();
    this.prompt.setElement('#study-prompt-container').render();
    this.toolbar.setElement('#study-toolbar-container').render();

    if (!app.isMobile() && app.user.get('eccentric')) {
      this._views['recipe'].setElement('#recipes-container').render();
    }

    if (!app.isMobile()) {
      this.toolbar.hide();
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

    this.items.listId = this.vocablist.id;
    this.items.updateDueCount();

    async.parallel(
      [
        (callback) => {
          app.user.subscription.fetch({
            error: function() {
              callback();
            },
            success: function() {
              callback();
            }
          });
        },
        (callback) => {
          this.items.fetchNext({limit: 50, lists: this.vocablist.id})
            .catch(callback)
            .then(callback);
        },
        (callback) => {
          this.vocablist.fetch({
            error: function() {
              callback();
            },
            success: function() {
              callback();
            }
          });
        }
      ],
      () => {
        const active = app.user.isSubscriptionActive();

        if (!this.vocablist) {
          ScreenLoader.hide();
          app.router.navigate('', {trigger: true});
        } else if (!this.items.length) {
          if (active) {
            ScreenLoader.post('Adding words from list');
            document.title = this.vocablist.get('name') + ' - Skritter';
            this.items.addItems(
              {
                lang: app.getLanguage(),
                limit: 5,
                listId: this.vocablist.id
              },
              function() {
                app.reload();
              }
            );
          } else {
            this.prompt.render();
            this.prompt.$('#overlay').show();
            ScreenLoader.hide();
          }
        } else {
          document.title = this.vocablist.get('name') + ' - Skritter';

          this.stopListening(this.items);
          this.listenTo(this.items, 'preload', this.handleItemPreload);

          this.next();

          ScreenLoader.hide();
        }
      }
    );
  },

  /**
   * @method handleItemPreload
   */
  handleItemPreload: function() {
    if (!this.currentPromptItems) {
      this.next();
    }
  },

  /**
   * @method handlePromptNext
   * @param {PromptItemCollection} promptItems
   */
  handlePromptNext: function(promptItems) {
    this.items.reviews.put(promptItems.getReview());

    if (this.previousPrompt) {
      this.previousPrompt = false;
      this.next();

      return;
    }

    if (this.currentPromptItems) {
      if (this.items.reviews.length > 2) {
        this.items.reviews.post({skip: 1});
        this.items.updateDueCount();
      }

      if (promptItems.readiness >= 1.0) {
        this.toolbar.dueCountOffset++;
      }

      this.toolbar.timer.addLocalOffset(promptItems.getBaseReviewingTime());

      this.currentItem._queue = false;
      this.currentPromptItems = null;
      this.previousPromptItems = promptItems;

      this.next();
    }
  },

  /**
   * @method handlePromptPrevious
   * @param {PromptItemCollection} promptItems
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
    const items = this.items.getNext();
    const queue = this.items.getQueue();

    if (!queue.length) {
      this.prompt.$panelLeft.css('opacity', 0.4);
      this.prompt.$panelLeft.css('pointer-events', 'none');
      this.prompt.$panelRight.css('pointer-events', 'none');
      this.items.reviews.post({skip: 1});
      this.items.fetchNext({limit: 50, lists: this.vocablist.id});

      return;
    }

    if (this.previousPrompt) {
      this.prompt.$panelLeft.css('opacity', 1.0);
      this.prompt.$panelLeft.css('pointer-events', 'auto');
      this.prompt.$panelRight.css('pointer-events', 'auto');
      this.prompt.reviewStatus.render();
      this.prompt.set(this.currentPromptItems);
      this.toolbar.render();

      return;
    }

    if (items.length) {
      this.currentItem = items[0];
      this.currentPromptItems = items[0].getPromptItems();
      this.prompt.$panelLeft.css('opacity', 1.0);
      this.prompt.$panelLeft.css('pointer-events', 'auto');
      this.prompt.$panelRight.css('pointer-events', 'auto');
      this.prompt.reviewStatus.render();
      this.prompt.set(this.currentPromptItems);
      this.toolbar.render();

      if (app.user.isItemAddingAllowed() && this.items.dueCount < 5) {
        this.addItem(true);
      }

      if (items.length < 5) {
        this.items.preloadNext();
      }

      return;
    }

    if (!queue.length) {
      this.prompt.$panelLeft.css('opacity', 0.4);
      this.prompt.$panelLeft.css('pointer-events', 'none');
      this.prompt.$panelRight.css('pointer-events', 'none');
      this.items.reviews.post({skip: 1});
      this.items.fetchNext({limit: 50});
      return;
    }

    if (this.items.skipped) {
      this.items.preloadNext();
      this.items.skipped = false;
      return;
    }

    // disable things while preloading
    this.prompt.$panelLeft.css('opacity', 0.4);
    this.prompt.$panelLeft.css('pointer-events', 'none');
    this.prompt.$panelRight.css('pointer-events', 'none');
    this.items.preloadNext();
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
            this.items.reviews.post()
              .then(
                () => {
                  this.render();
                  dialog.close();
                }
              );
          }
        }
      );
    });
  }

});

module.exports = StudyListPage;
