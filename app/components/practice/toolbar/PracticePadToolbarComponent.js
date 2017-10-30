const GelatoComponent = require('gelato/component');

/**
 * @class PracticePadToolbarComponent
 * @extends {GelatoComponent}
 */
const PracticePadToolbarComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./PracticePadToolbarComponent.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    this.dueCountOffset = 0;
    this.page = options.page;
  },

  /**
   * @method render
   * @returns {PracticePadToolbarComponent}
   */
  render: function () {
    this.renderTemplate();

    return this;
  },
});

module.exports = PracticePadToolbarComponent;
