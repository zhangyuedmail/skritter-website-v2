const GelatoComponent = require('gelato/component');

/**
 * @class AccountSidebarComponent
 * @extends {GelatoComponent}
 */
const AccountSidebarComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./AccountSidebar'),

  /**
   * @method render
   * @returns {AccountSidebarComponent}
   */
  render: function() {
    this.renderTemplate();
    $.each(this.$('.options a'), function(i, el) {
      if ($(el).attr('href') === document.location.pathname) {
        $(el).addClass('active');
      }
    });
  },

});

module.exports = AccountSidebarComponent;
