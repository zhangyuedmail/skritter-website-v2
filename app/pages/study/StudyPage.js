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
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
      this.loadAlreadyTimed = false;
    }

    ScreenLoader.show();

    Howler.autoSuspend = false;

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
    this.listenTo(vent, 'items:add', this.addItems);
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
   * Adds items to the study queue
   * @method addItem
   * @param {Boolean} [silenceNoItems] whether to hide a popup if no items are added
   * @param {Number} [numToAdd] the number of items to add. Defaults to 1.
   * whether to suppress messages to the user about the items added if nothing was added.
   */
  addItems: function(silenceNoItems, numToAdd) {
    numToAdd = numToAdd || 1;

    this.items.addItems(
      {
        lang: app.getLanguage(),
        limit: numToAdd
      },
      function(error, result) {
        if (!error) {
          let added = result.numVocabsAdded;

          if (added === 0) {
            if (silenceNoItems) {
              return;
            }
            // TODO: this should respond to vent items:added in a separate
            // function--"app-level" notification?
            // Could be added from lists or vocab info dialog...
            app.notifyUser({
              message: 'No more words to add. <br><a href="/vocablists/browse">Add a new list</a>',
              type: 'pastel-info'
            });
          } else {
            app.notifyUser({
              message: added + (added > 1 ? ' words have ' : ' word has ') + 'been added.',
              type: 'pastel-success'
            });
          }
        }
        vent.trigger('items:added', !error ? result : null);
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
          this.items.fetchNext({limit: 30})
            .catch(callback)
            .then(callback);
        },
        (callback) => {
          this.vocablists.fetch({
            data: {
              lang: app.getLanguage(),
              languageCode: app.getLanguage(),
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
        vent.trigger('dueCountOffset:increase');
      }

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


      // TODO: fix automatic item adding
      // if (app.user.isItemAddingAllowed() && this.items.dueCount < 5) {
      //   this.addItems(true);
      // }

      if (items.length < 5) {
        this.items.preloadNext();
      }

      ScreenLoader.hide();

      if (app.config.recordLoadTimes) {
        this._recordLoadTime();
      }

      return;
    }

    if (!queue.length) {
      this.prompt.$panelLeft.css('opacity', 0.4);
      this.prompt.$panelLeft.css('pointer-events', 'none');
      this.prompt.$panelRight.css('pointer-events', 'none');
      this.items.reviews.post({skip: 1});
      this.items.fetchNext({limit: 30});
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
   * @returns {StudyPage}
   */
  remove: function() {
    this.prompt.remove();
    this.toolbar.remove();
    this.items.reviews.post();

    document.removeEventListener('pause', this.handlePauseEvent.bind(this), false);

    Howler.autoSuspend = true;

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
              this.render();
              dialog.close();
            }
          }
        );
      }
    );
  },

  /**
   * Records the load time for this page once.
   * @private
   */
  _recordLoadTime: function() {
    if (this.loadAlreadyTimed) {
      return;
    }

    this.loadAlreadyTimed = true;
    const loadTime = window.performance.now() - this.loadStart;
    app.loadTimes.pages.study.push(loadTime);
  }

});

module.exports = StudyPage;
