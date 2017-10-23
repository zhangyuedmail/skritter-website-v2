const GelatoPage = require('gelato/page');
const Prompt = require('components/study/prompt/StudyPromptComponent.js');
const Toolbar = require('components/study/toolbar/StudyToolbarComponent.js');
const Recipes = require('components/common/CommonRecipesComponent.js');
const Items = require('collections/ItemCollection.js');
const Vocablist = require('models/VocablistModel.js');
const MobileStudyNavbar = require('components/navbars/NavbarMobileStudyComponent.js');
const QuickSettings = require('dialogs1/quick-settings/QuickSettingsDialog.js');
const StudyPage = require('pages/study/StudyPage.js');
const vent = require('vent');

/**
 * @class StudyListPage
 * @extends {StudyPage}
 */
const StudyListPage = StudyPage.extend({

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
  template: require('./StudyList'),

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
  initialize: function (options) {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
      this.loadAlreadyTimed = false;
    }

    Howler.autoSuspend = false;

    ScreenLoader.show(true);

    this.currentItem = null;
    this.currentPromptItems = null;
    this.previousItem = null;
    this.previousPrompt = false;
    this.previousPromptItems = null;

    this.items = new Items();
    this.prompt = new Prompt({page: this});
    this.toolbar = new Toolbar({page: this});
    this.vocablist = new Vocablist({id: options.listId});

    // merge unsynced reviews into item collection reviews
    if (app.user.offline.isReady()) {
      this.items.reviews.add(app.user.offline.reviews);
    }

    // will hold a number that shows how many items have been added in the last 24 hours
    this.itemsAddedToday = null;
    this.promptsReviewed = 0;
    this.promptsSinceLastAutoAdd = 0;
    this.userNotifiedAutoAddLimit = false;

    if (app.user.get('eccentric')) {
      this._views['recipe'] = new Recipes();
    }

    // will hold a number that shows how many items have been added in the last 24 hours
    this.itemsAddedToday = null;
    this.promptsReviewed = 0;
    this.promptsSinceLastAutoAdd = 0;
    this.userNotifiedAutoAddLimit = false;

    // make sure the item collection knows about filtered list
    this.items.listIds = [this.vocablist.id];

    this.listenTo(this.prompt, 'next', this.handlePromptNext);
    this.listenTo(this.prompt, 'previous', this.handlePromptPrevious);
    this.listenTo(vent, 'items:add', this.handleAddItems);
    this.listenTo(vent, 'studySettings:show', this.showStudySettings);

    // handle specific cordova related events
    document.addEventListener('pause', this.handlePauseEvent.bind(this), false);
  },

  /**
   * @method render
   * @returns {StudyListPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileStudyList');
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
   * @method handlePauseEvent
   */
  handlePauseEvent: function () {
    this.items.reviews.post(1);
  },

  /**
   * Adds items to the study queue
   * @method addItem
   * @param {Boolean} [silenceNoItems] whether to hide a popup if no items are added
   * @param {Number} [numToAdd] the number of items to add. Defaults to 1.
   * whether to suppress messages to the user about the items added if nothing was added.
   */
  addItems: function (silenceNoItems, numToAdd) {
    numToAdd = numToAdd || 1;

    return new Promise((resolve, reject) => {
      const addOptions = {
        lang: app.getLanguage(),
        limit: numToAdd,
        lists: this.vocablist.id,
      };

      this.items.addItems(addOptions, (error, result) => {
        if (!error) {
          let added = result.numVocabsAdded;

          if (added === 0) {
              resolve(0);
          } else {
            this.itemsAddedToday += added;
            resolve(added);
          }
        } else {
          reject(error);
        }
        vent.trigger('items:added', !error ? result : null);
      });
    });
  },

  /**
   * Displays a notification to the user based on how many words were added
   * @param {Number} [added] how many items were just added
   */
  showItemsAddedNotification: function (added) {
    if (added) {
      if (this.itemsAddedToday >= this.getMaxItemsPerDay() && !this.userNotifiedAutoAddLimit) {
        app.notifyUser({
          message: 'You\'ve reached your daily auto-add limit today! You can still manually add more words if you want to progress faster.',
          type: 'pastel-success',
        });
        this.userNotifiedAutoAddLimit = true;
      } else {
        app.notifyUser({
          message: added + (added > 1 ? ' words have ' : ' word has ') + 'been added.',
          type: 'pastel-success',
        });
      }
    } else {
      app.notifyUser({
        message: 'No more words to add. <br><a href="/vocablists/browse">Add a new list</a>',
        type: 'pastel-info',
      });
    }
  },

  /**
   * @method checkRequirements
   */
  checkRequirements: function () {
    ScreenLoader.post('Preparing study');

    this.items.updateDueCount();

    async.parallel(
      [
        (callback) => {
          app.user.subscription.fetch({
            error: function () {
              callback();
            },
            success: function () {
              callback();
            },
          });
        },
        (callback) => {
          this.items.fetchNext({limit: 30, lists: this.vocablist.id})
            .catch(callback)
            .then(callback);
        },
        (callback) => {
          this.vocablist.fetch({
            error: function () {
              callback();
            },
            success: function () {
              callback();
            },
          });
        },
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
                lists: this.vocablist.id,
              },
              function () {
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
   * Event handler for when a call to add items from another component is reveived
   */
  handleAddItems: function (silenceNoItems, numToAdd) {
    this.addItems(silenceNoItems, numToAdd).then((added) => {
      this.showItemsAddedNotification(added);
    });
  },

  /**
   * @method handleItemPreload
   */
  handleItemPreload: function () {
    if (!this.currentPromptItems) {
      this.next();
    }
  },

  /**
   * @method handlePromptNext
   * @param {PromptItemCollection} promptItems
   */
  handlePromptNext: function (promptItems) {
    this.items.reviews.put(promptItems.getReview());

    if (this.previousPrompt) {
      this.previousPrompt = false;
      this.next();

      return;
    }

    if (this.currentPromptItems) {
      if (this.items.reviews.length > 2) {
        this.items.reviews.post({skip: 1});
      }

      this.currentItem._loaded = false;
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
  handlePromptPrevious: function (promptItems) {
    this.previousPrompt = true;
    this.currentPromptItems = promptItems;
    this.previous();
  },

  /**
   * @method next
   */
  next: function () {
    const items = this.items.getNext();
    const queue = this.items.getQueue();

    if (this.previousPrompt) {
      this.togglePromptLoading(false);
      this.prompt.reviewStatus.render();
      this.prompt.set(this.currentPromptItems);

      return;
    }

    if (items.length) {
      this.currentItem = items[0];
      this.currentPromptItems = items[0].getPromptItems();
      this.togglePromptLoading(false);
      this.prompt.reviewStatus.render();
      this.prompt.set(this.currentPromptItems);

      if (app.user.isItemAddingAllowed() && this.shouldAutoAddItem(this.currentItem)) {
        this.addItems(true).then((added) => {
          this.showItemsAddedNotification(added);
          this.promptsSinceLastAutoAdd = 0;
        });
      }

      if (items.length < 5) {
        this.items.preloadNext();
      }

      return;
    }

    ScreenLoader.hide();

    if (app.config.recordLoadTimes) {
      this._recordLoadTime();
    }

    if (!queue.length) {
      this.togglePromptLoading(true);
      this.items.reviews.post({skip: 1});
      this.items.fetchNext({limit: 30, lists: this.vocablist.id});
      return;
    }

    if (this.items.skipped) {
      this.items.preloadNext();
      this.items.skipped = false;
      return;
    }

    // disable things while preloading
    this.togglePromptLoading(true);
    this.items.preloadNext();
  },

  /**
   * @method previous
   */
  previous: function () {
    if (this.previousPromptItems) {
      this.togglePromptLoading(false);
      this.prompt.reviewStatus.render();
      this.prompt.set(this.previousPromptItems);
    }
  },

  /**
   * @method remove
   * @returns {StudyListPage}
   */
  remove: function () {
    this.prompt.remove();
    this.toolbar.remove();
    this.items.reviews.post();
    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Shows a dialog that allows the user to adjust their study settings
   */
  showStudySettings: function () {
    const dialog = new QuickSettings();

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
            // TODO: figure out why this causes canvas sizing issue
            // this.render();
            // dialog.close();

            app.reload();
          },
        }
      );
    });
  },

  /**
   * Determines whether an item should be auto-added based on its readiness and other heuristics about the queue
   * @param {UserItem} currentItem the current item that the user is studying
   * @returns {boolean} whether an item should be added
   */
  shouldAutoAddItem: function (currentItem) {
    // TODO: figure out some good values for this
    const addFreq = app.user.get('addFrequency') / 100;
    const maxItemsPerDay = app.user.getMaxItemsPerDay();

    if ((this.items.dueCount > 50 && (addFreq !== 0.9)) || this.itemsAddedToday >= maxItemsPerDay) {
      return false;
    }

    // kinda a magic number
    const addRange = 0.4;
    const readiness = currentItem.getReadiness();


    // if they're currently studying a brand new item, let's wait until after they get through that
    if (readiness === 9999) {
      return false;
    }

    const diff = 1 - (readiness - addFreq) / addRange;


    // the most common add case--the current item has been sufficiently studied,
    // with a couple rate-limiting checks
    if (diff*diff > 0.5 && this.promptsReviewed > 1 && this.promptsSinceLastAutoAdd > 4) {
      console.log(`normal auto-add case: promptsSinceLastAutoAdd > 4 ${readiness}  diff: ${diff}  diff quad: ${diff*diff}`);
      return true;
    }

    // for the case of accounts with barely anything to study and we haven't added much yet,
    // let's keep adding things
    if (addFreq > 0.6 && this.items.dueCount < 10 && this.items.dueCount > 0 &&
      this.itemsAddedToday < maxItemsPerDay / 2
      && this.promptsSinceLastAutoAdd > 10) {
      return true;
    }

    // for accounts set with a high add rate but a lot of reviews, still add something every once in a while
    // to keep things motivating
    if (addFreq === 0.9 && this.promptsReviewed % 80 === 0 && this.promptsSinceLastAutoAdd > 50) {
      return true;
    }

    return false;
  },

  /**
   * Toggles the loading state on the canvas when fetching new items
   * @param {Boolean} loading whether the prompt is loading
   */
  togglePromptLoading: function (loading) {
    // toggle it if it wasn't passed in
    if (loading === undefined) {
      loading = !(this.prompt.$panelLeft.css('opacity') === 0.4);
    }

    const componentName = app.isMobile() ? 'mobile-study-prompt' : 'study-prompt';
    this.prompt.$el.find('gelato-component[data-name="' + componentName + '"]').toggleClass('fetching-items', loading);
  },
});

module.exports = StudyListPage;
