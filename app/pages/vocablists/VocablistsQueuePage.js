const GelatoPage = require('gelato/page');
const SignupNotification = require('components/account/SignupNotificationComponent');
const ExpiredNotification = require('components/account/AccountExpiredNotificationComponent');
const AddingTable = require('components/vocablists/VocablistsAddingTableComponent');
const ReviewingTable = require('components/vocablists/VocablistsReviewingTableComponent');
const Sidebar = require('components/vocablists/VocablistsSidebarComponent');
// const Vocablists = require('collections/VocablistCollection');

/**
 * @class VocablistsQueue
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.vocabLists.titleQueue'),

  navbarOptions: {
    showCreateListBtn: true,
  },

  section: 'Lists',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsQueue'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    if (app.config.recordLoadTimes) {
      this.loadStart = window.performance.now();
      this.loadAlreadyTimed = false;
    }

    this.vocablists = app.user.vocablists;
    this.addingTable = new AddingTable({vocablists: this.vocablists});
    this.reviewingTable = new ReviewingTable({vocablists: this.vocablists});
    this.sidebar = new Sidebar();
    this._views['expiration'] = new ExpiredNotification();
    this._views['signup'] = new SignupNotification();

    this.listenTo(
      this.vocablists, 'state:standby',
      function () {
        if (!this.vocablists.length) {
          app.router.navigate('vocablists/browse', {trigger: true});
        }
        if (this.vocablists.cursor) {
          this.vocablists.fetch({
            data: {
              cursor: this.vocablists.cursor,
              limit: 10,
              sort: 'studying',
              include_percent_done: 'true',
              lang: app.getLanguage(),
              languageCode: app.getLanguage(),
            },
            remove: false,
          });
        } else {
          if (app.config.recordLoadTimes) {
            this._recordLoadTime();
          }
        }
      }
    );

    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'studying',
        include_percent_done: 'true',
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
      },
    });
  },

  /**
   * @method render
   * @returns {VocablistsQueue}
   */
  render: function () {
    if (app.isMobile()) {
      this.template = require('./MobileVocablistsQueue.jade');
    }

    this.renderTemplate();
    this.addingTable.setElement('#adding-container').render();
    this.reviewingTable.setElement('#reviewing-container').render();
    this.sidebar.setElement('#vocablist-sidebar-container').render();

    if (app.user.isAnonymous()) {
      this._views['signup'].setElement('#signup-container').render();
    } else {
      this._views['expiration'].setElement('#expiration-container').render();
    }

    return this;
  },

  /**
   * @method remove
   * @returns {VocablistsQueue}
   */
  remove: function () {
    this.addingTable.remove();
    this.reviewingTable.remove();
    this.sidebar.remove();

    return GelatoPage.prototype.remove.call(this);
  },

  /**
   * Records the load time for this page once.
   * @private
   */
  _recordLoadTime: function () {
    if (this.loadAlreadyTimed || !app.config.recordLoadTimes) {
      return;
    }

    this.loadAlreadyTimed = true;
    const loadTime = window.performance.now() - this.loadStart;
    app.loadTimes.pages.vocablistsQueue.push(loadTime);
  },

});
