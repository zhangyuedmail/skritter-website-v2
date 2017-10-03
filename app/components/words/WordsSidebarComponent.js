const GelatoComponent = require('gelato/component');

/**
 * @class WordsSidebarComponent
 * @extends {GelatoComponent}
 */
const WordsSidebarComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./WordsSidebar'),

  /**
   * @method render
   * @returns {WordsSidebarComponent}
   */
  render: function() {
    this.renderTemplate();
    this.$('[data-toggle="tooltip"]').tooltip();
    $.each(this.$('.options a'), function(i, el) {
      let $el = $(el);
      if ($el.attr('href') === document.location.pathname ||
        ($el.attr('href') === '/words/all' && document.location.pathname === '/words')) {
        $el.addClass('active');
      }
    });
  },

});

module.exports = WordsSidebarComponent;
