const GelatoPage = require('gelato/page');

/**
 * @class LegalPage
 * @extends {GelatoPage}
 */
const LegalPage = GelatoPage.extend({

  /**
   * Describes a CSS class name for what type of background this page should have.
   * The class is applied higher up in the hierarchy than the page element.
   * @type {String}
   */
  background: 'marketing',

  /**
   * @property bodyClass
   * @type {String}
   */
  bodyClass: 'background2',

  /**
   * @property title
   * @type {String}
   */
  title: 'Legal - Skritter',

  /**
   * @property template
   * @type {Function}
   */
  template: require('./Legal'),

  /**
   * @method render
   * @returns {LegalPage}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },
});

module.exports = LegalPage;
