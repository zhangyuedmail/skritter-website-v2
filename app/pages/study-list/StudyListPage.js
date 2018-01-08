const GelatoPage = require('gelato/page');
const Prompt = require('components/prompt/StudyPromptComponent.js');
const Toolbar = require('components/study/toolbar/StudyToolbarComponent.js');
const Recipes = require('components/common/CommonRecipesComponent.js');
const Items = require('collections/ItemCollection.js');
const Vocablist = require('models/VocablistModel.js');
const MobileStudyNavbar = require('components/navbars/NavbarMobileStudyComponent.js');
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
            const targetLangName = app.getLanguage() === 'zh' ? 'chinese' : 'japanese';
            this.itemsAddedToday += (added * (app.user.get(targetLangName + 'StudyParts').length));
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
          const today = moment().format(app.config.dateFormatApp);
          this._getNumItemsAddedToday(today)
            .catch(callback)
            .then((added) => {
              this.itemsAddedToday = added;
              callback();
            }, callback);
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
            this.prompt.toggleOverlayMessage(null, true);
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
   * Gets the max number of items that can be auto-added in a day
   * @returns {number}
   */
  getMaxItemsPerDay: function () {
    const targetLangName = app.getLanguage() === 'zh' ? 'chinese' : 'japanese';
    const addFreqMultiplier = 1; // {0.7: .75, 0.8: 1, 0.9: 1.2};
    const maxVocabsMap = {0.6: 7, 0.7: 10, 0.9: 15}; // 12};
    const addFreq = app.user.get('addFrequency') / 100;

    if (Number(app.user.get('dailyAddLimit')) === 0) {
      return 0;
    }

    return (app.user.get('dailyAddLimit') || maxVocabsMap[addFreq]) * (app.user.get(targetLangName + 'StudyParts').length) * addFreqMultiplier;
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
      this.promptsReviewed++;
      this.promptsSinceLastAutoAdd++;

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
   * Displays a notification to the user based on how many words were added
   * @param {Number} [added] how many items were just added
   * @param {Boolean} [fromAutoAdd] whether the add was triggered from auto-add.
   *                                Affects display of popups.
   */
  showItemsAddedNotification: function (added, fromAutoAdd) {
    if (added) {
      if (this.itemsAddedToday >= this.getMaxItemsPerDay() && this.getMaxItemsPerDay() > 0 && !this.userNotifiedAutoAddLimit && fromAutoAdd) {
        app.notifyUser({
          message: 'You\'ve reached your daily auto-add limit today! You can still manually add more words if you want to progress faster.',
          type: 'pastel-success',
        });

        this.userNotifiedAutoAddLimit = true;
      } else {
        if (app.isMobile()) {
          this.prompt.showNotification(added + (added > 1 ? ' words ' : ' word ') + ' added');
        } else {
          app.notifyUser({
            message: added + (added > 1 ? ' words have ' : ' word has ') + 'been added.',
            type: 'pastel-success',
          });
        }
      }
    } else {
      if (!fromAutoAdd) {
        app.notifyUser({
          message: 'No more words to add. <br><a href="/vocablists/browse">Add a new list</a>',
          type: 'pastel-info',
        });
      }
    }
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

    if ((this.items.dueCount > 50 && (addFreq !== 0.9)) ||
      (this.itemsAddedToday >= maxItemsPerDay && maxItemsPerDay > 0)) {
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
    const isReadyToStudy = readiness > addFreq + addRange;

    // the most common add case--the current item has been sufficiently studied,
    // with a couple rate-limiting checks
    if (0.5 < diff*diff && this.promptsReviewed > 1 && this.promptsSinceLastAutoAdd > 4 && !isReadyToStudy) {
      return true;
    }

    // for the case of accounts with barely anything to study and we haven't added much yet,
    // let's keep adding things
    if (addFreq > 0.6 && this.items.dueCount < 10 && this.items.dueCount > 0 &&
      (this.itemsAddedToday < maxItemsPerDay / 2 || !maxItemsPerDay)
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
    this.prompt.toggleLoadingIndicator(loading);
  },

  /**
   * Gets the number of items a user has added today
   * @param {Moment} today today's date
   * @returns {Promise}
   * @private
   */
  _getNumItemsAddedToday: function (today) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: app.getApiUrl(2) + 'gae/items/added',
        type: 'GET',
        headers: app.user.session.getHeaders(),
        context: this,
        data: {
          languageCode: app.getLanguage(),
          startDate: today.format(app.config.dateFormatApp),
        },
        error: (error) => {
          resolve(this._getNumItemsAddedTodayFromLocalStorage());
        },
        success: function (result) {
          resolve(result.added);
        },
      });
    });
  },

  /**
   * Gets the number of items added today from localStorage. Refreshes and
   * cleans up the cache so only today's data is saved.
   * @private
   */
  _getNumItemsAddedTodayFromLocalStorage: function () {
    const itemsAdded = app.getSetting('itemsAutoAddedToday') || {};
    const today = moment().format(app.config.dateFormatApp);

    if (itemsAdded[today] === undefined) {
      itemsAdded[today] = 0;
    }

    // refresh the cache so that any previous days are erased from localStorage,
    // only today's data is persisted
    const newAddedObj = {};
    newAddedObj[today] = itemsAdded[today];
    app.setSetting('itemsAutoAddedToday', newAddedObj);

    return itemsAdded[today];
  },

});

module.exports = StudyListPage;
