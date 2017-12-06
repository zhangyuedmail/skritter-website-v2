const NavbarDefaultComponent = require('./NavbarDefaultComponent.js');
const DemoProgressComponent = require('components/demo/DemoProgressComponent.js');

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
      demoPage: app.router.page,
      firstStep: 'languageSelection',
    });

    this.showBackBtn = viewOptions.showBackBtn;
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
