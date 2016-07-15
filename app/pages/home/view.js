var GelatoPage = require('gelato/page');

/**
 * @class Home
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    app.mixpanel.track('Viewed home page');
  },

  events: {
    'click #link-apple-store': 'handleClickLinkAppleStore',
    'click #link-google-store': 'handleClickLinkGoogleStore'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @property title
   * @type {String}
   */
  title: 'Skritter - Learn to Write Chinese and Japanese Characters',

  /**
   * @method render
   * @returns {Home}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method handleClickLinkAppleStore
   * @param {Event} event
   */
  handleClickLinkAppleStore: function(event) {
    event.preventDefault();
    app.mixpanel.track('Clicked ios app button');
    window.open('https://itunes.apple.com/us/artist/inkren-llc/id402280587', '_blank');
  },

  /**
   * @method handleClickLinkGoogleStore
   * @param {Event} event
   */
  handleClickLinkGoogleStore: function(event) {
    event.preventDefault();
    app.mixpanel.track('Clicked android app button');
    window.open('https://play.google.com/store/apps/developer?id=Skritter', '_blank');
  },

  /**
   * @method remove
   * @returns {Home}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }
});
