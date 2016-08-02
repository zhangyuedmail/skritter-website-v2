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
    $.getScript('https://www.youtube.com/iframe_api');
    window.onYouTubeIframeAPIReady = this.handleYouTubeIframeAPIReady.bind(this);

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
   * @method handleYouTubeStateChangePromoVideo
   */
  handleYouTubeStateChangePromoVideo: function(event) {
    if (event.data === -1) {
      app.mixpanel.track('Started home promo video');
    }
  },

  /**
   * @method handleYouTubeIframeAPIReady
   */
  handleYouTubeIframeAPIReady: function() {
    new YT.Player(
      'promo-video',
      {
        videoId: 'LafTN34lc_Q',
        height: '360',
        width: '640',
        events: {
          onStateChange: this.handleYouTubeStateChangePromoVideo.bind(this)
        }
      }
    );
  },

  /**
   * @method remove
   * @returns {Home}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }

});
