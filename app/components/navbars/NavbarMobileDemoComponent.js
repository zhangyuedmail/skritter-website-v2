const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const DemoProgressComponent = require('components/demo/DemoProgressComponent.js');
const vent = require('vent');


const NavbarMobileComponent = NavbarDefaultComponent.extend({

  events: {
    'click #back-btn': 'handleBackClick',
  },

  /**
   * Template to use
   */
  template: require('./NavbarMobileDemo.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    options = options || {};
    const viewOptions = options.viewOptions || {};

    this._views['progress'] = new DemoProgressComponent({
      demoPage: this,
      firstStep: 'languageSelection',
    });

    if (app.user.isLoggedIn()) {
      app.user.stats.fetchToday();
    }

    this.showBackBtn = viewOptions.showBackBtn;
    this.showCreateListBtn = viewOptions.showCreateListBtn;
    this.showSyncBtn = app.config.offlineEnabled && viewOptions.showSyncBtn;


    this.listenTo(app.user.offline, 'status', this.handleOfflineStatus);
  },

  render () {
    this.renderTemplate();
    this.$('#progress-container').html(this._views['progress'].render().el);

    return this;
  },

  /**
   * Handles the user
   * @param event
   */
  handleBackClick: function (event) {
    event.preventDefault();
    app.router.navigateHome();
  },

});

module.exports = NavbarMobileComponent;
