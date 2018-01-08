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
 * @class StudyListSectionPage
 * @extends {StudyPage}
 */
const StudyListSectionPage = StudyPage.extend({

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
  template: require('./StudyListSection'),

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
   * @returns {StudyListSectionPage}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileStudyListSection');
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
   * @returns {StudyListSectionPage}
   */
  remove: function () {
    this.prompt.remove();
    this.toolbar.remove();
    this.items.reviews.post();
    return GelatoPage.prototype.remove.call(this);
  },

});

module.exports = StudyListSectionPage;
