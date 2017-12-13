const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const vent = require('vent');


const NavbarMobileComponent = NavbarDefaultComponent.extend({

  events: {
    'click #toggle-menu': 'handleToggleMenuClick',
    'click #back-btn': 'handleBackClick',
    'click #create-list-btn': 'handleCreateListClick',
    'click #sync-btn': 'handleSyncClick',
  },

  /**
   * Template to use
   */
  template: require('./NavbarMobileDashboard.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    options = options || {};
    const viewOptions = options.viewOptions || {};

    if (app.user.isLoggedIn()) {
      app.user.stats.fetchToday();
    }

    this.showBackBtn = viewOptions.showBackBtn;
    this.showCreateListBtn = viewOptions.showCreateListBtn;
    this.showSyncBtn = app.config.offlineEnabled && viewOptions.showSyncBtn;


    this.listenTo(app.user.offline, 'status', this.handleOfflineStatus);
  },

  /**
   * Handles the user
   * @param event
   */
  handleBackClick: function (event) {
    event.preventDefault();
    window.history.back();
  },

  handleCreateListClick: function (event) {
    event.preventDefault();

    if (app.user.isAnonymous()) {
      app.signup();
    } else {
      app.router.navigate('vocablists/create', {trigger: true});
    }
  },

  /**
   * Update sync button display based on offline sync status.
   * @method handleOfflineStatus
   */
  handleOfflineStatus: function (value) {
    const $button = this.$('#sync-btn');
    const spinClass = 'fa-spin';

    if (value === 'syncing') {
      $button.addClass(spinClass);
    } else {
      $button.removeClass(spinClass);
    }
  },

  /**
   *
   * @param event
   */
  handleToggleMenuClick: function (event) {
    event.preventDefault();
    vent.trigger('mobileNavMenu:toggle');
  },

  /**
   *
   * @param event
   */
  handleSyncClick: function (event) {
    event.preventDefault();
    app.user.offline.sync();
    app.user.stats.fetchMonth();
  },
});

module.exports = NavbarMobileComponent;
