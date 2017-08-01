const GelatoPage = require('gelato/page');

/**
 * @class SyncStatusPage
 * @extends {GelatoPage}
 */
const SyncStatusPage = GelatoPage.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./SyncStatus'),

  /**
   * @property title
   * @type {String}
   */
  title: app.locale('pages.syncStatus.title'),

  /**
   * @method render
   * @returns {SyncStatusPage}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method remove
   * @returns {SyncStatusPage}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  }

});

module.exports = SyncStatusPage;
