const GelatoPage = require('gelato/page');

/**
 * @class FeaturesPage
 * @extends {GelatoPage}
 */
const FeaturesPage = GelatoPage.extend({

  /**
   * @property title
   * @type {String}
   */
  title: 'Features - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Features'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    app.mixpanel.track('Viewed features page');
  },

  /**
   * @method render
   * @returns {FeaturesPage}
   */
  render: function() {
    this.renderTemplate();

    return this;
  }
});

module.exports = FeaturesPage;
