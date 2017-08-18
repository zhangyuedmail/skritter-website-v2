const GelatoPage = require('gelato/page');

/**
 * @class SyncStatusPage
 * @extends {GelatoPage}
 */
const SyncStatusPage = GelatoPage.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #reset-now': 'handleResetNow',
    'click #sync-now': 'handleSyncNow'
  },

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
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.listenTo(app.user.offline, 'status', this.render);
  },

  /**
   * @method render
   * @returns {SyncStatusPage}
   */
  render: function() {
    this.renderTemplate();

    return this;
  },

  /**
   * @method handleResetNow
   */
  handleResetNow: function() {
    app.user.offline.uncache();
  },

  /**
   * @method handleSyncNow
   */
  handleSyncNow: function() {
    app.user.offline.sync();
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
