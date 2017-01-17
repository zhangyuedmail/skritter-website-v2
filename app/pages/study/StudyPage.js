const GelatoPage = require('gelato/page');
const Prompt = require('components/study/prompt/StudyPromptComponent.js');
const Toolbar = require('components/study/toolbar/StudyToolbarComponent.js');
const Recipes = require('components/common/CommonRecipesComponent.js');
const Items = require('collections/ItemCollection.js');
const Vocablists = require('collections/VocablistCollection.js');
const MobileStudyNavbar = require('components/navbars/NavbarMobileStudyComponent.js');
const StudySettings = require('dialogs/study-settings/view');
const vent = require('vent');

/**
 * @class StudyPage
 * @extends {GelatoPage}
 */
const StudyPage = GelatoPage.extend({

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

    this.currentItem = null;
    this.currentPromptItems = null;
    this.previousItem = null;
    this.previousPrompt = false;
    this.previousPromptItems = null;

    this.items = new Items();
    this.prompt = new Prompt({page: this});
    this.toolbar = new Toolbar({page: this});
    this.vocablists = new Vocablists();

    if (app.user.get('eccentric')) {
      this._views['recipe'] = new Recipes();
    }

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
    this.listenTo(vent, 'item:add', this.addItem);
    this.listenTo(vent, 'studySettings:show', this.showStudySettings);

    // Handle specific cordova related events
    document.addEventListener('pause', this.handlePauseEvent.bind(this), false);
  },

  /**
   * @method render
   * @returns {StudyPage}
   */
  render: function() {
    if (app.isMobile()) {
      this.template = require('./MobileStudyPage.jade');
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
        limit: 1
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
          this.items.fetchNext({limit: 50})
            .catch(callback)
            .then(callback);
        },
        (callback) => {
          this.vocablists.fetch({
            data: {
              lang: app.getLanguage(),
              limit: 1,
              sort: 'adding'
            },
            error: function() {
              callback();
            },
            success: function() {
              callback();
            }
          });
        }
      ],
      (error) => {
        if (error) {
          let msg = 'Error fetching items. Please ';
          if (app.isMobile()) {
            msg += 'reload the application';
          } else {
            msg += 'refresh the page.';
          }
          ScreenLoader.post(msg);
          return;
        }

        const active = app.user.isSubscriptionActive();

        if (!this.items.length && !this.vocablists.length) {
          this.prompt.render();
          this.prompt.$('#overlay').show();
          ScreenLoader.hide();
        } else if (!this.items.length && this.vocablists.length) {
          if (active) {
            ScreenLoader.post('Adding your first words');
            this.items.addItems(
              {
                lang: app.getLanguage(),
                limit: 5
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
   * @method handlePauseEvent
   */
  handlePauseEvent: function() {
    this.items.reviews.post(1);
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
    const queue = this.items.getQueue();
    const items = this.items.getNext();

    if (!queue.length) {
      this.prompt.$panelLeft.css('opacity', 0.4);
      this.prompt.$panelLeft.css('pointer-events', 'none');
      this.prompt.$panelRight.css('pointer-events', 'none');
      this.items.reviews.post({skip: 1});
      this.items.fetchNext({limit: 50});

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
   * @returns {StudyPage}
   */
  remove: function() {
    this.prompt.remove();
    this.toolbar.remove();
    this.items.reviews.post();

    document.removeEventListener('pause', this.handlePauseEvent.bind(this), false);

    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Shows a dialog that allows the user to adjust their study settings
   * @method showStudySettings
   */
  showStudySettings: function() {
    const dialog = new StudySettings();

    dialog.open();

    dialog.on(
      'save',
      (settings) => {
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
      }
    );
  }

});

module.exports = StudyPage;
