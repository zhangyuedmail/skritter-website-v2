var GelatoComponent = require('gelato/component');

var ProgressStats = require('collections/progress-stats');
var StudySettings = require('dialogs/study-settings/view');
var Timer = require('components/study/toolbar/timer/view');

/**
 * @class StudyToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-add-item': 'handleClickAddItem',
    'click #button-study-settings': 'handleClickStudySettings'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.dueCountOffset = 0;
    this.page = options.page;
    this.stats = new ProgressStats();
    this.timer = new Timer();
    this.listenTo(this.page.items, 'update:due-count', this.handleUpdateDueCount);
    this.listenTo(this.stats, 'state:standby', this.updateTimerOffset);
    this.stats.fetchToday();

  },

  /**
   * @method render
   * @returns {StudyToolbar}
   */
  render: function() {
    this.renderTemplate();
    this.timer.setElement('#timer-container').render();

    this.checkSubscription();

    return this;
  },

  /**
   * Checks whether a subscription is active and hides UI elements that
   * won't work if it's not active.
   * @method checkSubscription
   */
  checkSubscription: function() {
    var self = this;

    app.user.isSubscriptionActive(function(active) {
      if (!active) {
        self.$('#button-add-item').hide();
      }
    });
  },

  /**
   * @method getDueCountWithOffset
   * @returns {Number}
   */
  getDueCountWithOffset: function() {
    var dueCount = this.page.items.dueCount - this.dueCountOffset;
    return dueCount > 0 ? dueCount : 0;
  },

  /**
   * @method handleClickAddItem
   * @param {Event} event
   */
  handleClickAddItem: function(event) {
    event.preventDefault();
    this.page.addItem();
  },

  /**
   * @method handleClickStudySettings
   * @param {Event} event
   */
  handleClickStudySettings: function(event) {
    var self = this;
    var dialog = new StudySettings();
    event.preventDefault();
    dialog.open();
    dialog.on('save', function(settings) {
      ScreenLoader.show();
      ScreenLoader.post('Saving study settings');
      app.user.set(settings, {merge: true});
      app.user.cache();
      app.user.save(
        null,
        {
          error: function() {
            ScreenLoader.hide();
            dialog.close();
          },
          success: function() {
            app.reload();
          }
        }
      );
    });
  },

  /**
   * @method handleUpdateDueCount
   */
  handleUpdateDueCount: function() {
    this.dueCountOffset = 0;
    this.render();
  },

  /**
   * @function remove
   * @returns {StudyToolbar}
   */
  remove: function() {
    this.timer.remove();
    return this;
  },

  /**
   * @method updateTimerOffset
   */
  updateTimerOffset: function(stats) {
    this.timer.setServerOffset(stats.getDailyTimeStudied());
  }

});
