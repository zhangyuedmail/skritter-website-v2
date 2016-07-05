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
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.page = options.page;
    this.stats = new ProgressStats();
    this.timer = new Timer();
    this.listenTo(this.stats, 'state:standby', this.updateTimerOffset);
    this.stats.fetchToday();
    this.updateDueCount();
  },
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
   * @method render
   * @returns {StudyToolbar}
   */
  render: function() {
    this.renderTemplate();
    this.timer.setElement('#timer-container').render();
    return this;
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
            //TODO: show some kind of error message
            ScreenLoader.hide();
            dialog.close();
          },
          success: function() {
            self.page.schedule.reset();
            self.page.prompt.reset();
            self.page.loadSchedule();
            dialog.close();
          }
        }
      );
    });
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
   * @method updateDueCount
   */
  updateDueCount: function() {
    var self = this;
    var count = 0;
    var lang = app.getLanguage();
    var now = moment().unix();
    var parts = app.user.getFilteredParts();
    var styles = app.user.getFilteredStyles();
    app.user.db.items
      .where('next')
      .belowOrEqual(now)
      .toArray()
      .then(function(items) {
        _.forEach(
          items,
          function(item) {
            if (!item.vocabIds.length) {
              return;
            } else if (item.lang !== lang) {
              return
            } else if (!_.includes(parts, item.part)) {
              return;
            } else if (!_.includes(styles, item.style)) {
              return;
            }
            if (!item.last) {
              count++;
              return;
            }
            var readiness = (now - item.last) / (item.next - item.last);
            if (readiness >= 1.0) {
              count++;
            }
          }
        );
        if (app.user.isItemAddingAllowed() && count < 5) {
          self.page.addItem();
        }
        self.dueCount = count;
        self.render();
      });
  },
  /**
   * @method updateTimerOffset
   */
  updateTimerOffset: function(stats) {
    this.timer.setServerOffset(stats.getDailyTimeStudied());
  }
});
