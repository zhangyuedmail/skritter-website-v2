const GelatoComponent = require('gelato/component');

/**
 * @class VocablistsSidebarComponent
 * @extends {GelatoComponent}
 */
const VocablistsSidebarComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsSidebar'),

  /**
   * @method render
   * @returns {VocablistsSidebarComponent}
   */
  render: function () {
    this.renderTemplate();
    if (document.location.pathname === '/vocablists') {
      this.$('.options > a:first-child').addClass('active');
    } else {
      this.$('.options > a').each(function (index, element) {
        let $element = $(element);
        if ($element.attr('href') === document.location.pathname) {
          $element.addClass('active');
        }
      });
    }
  },

});

module.exports = VocablistsSidebarComponent;
