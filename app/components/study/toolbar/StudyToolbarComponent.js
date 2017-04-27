const GelatoComponent = require('gelato/component');
const ProgressStats = require('collections/ProgressStatsCollection');
const StudyToolbarTimerComponent = require('components/study/toolbar/timer/StudyToolbarTimerComponent.js');
const vent = require('vent');

/**
 * @class StudyToolbarComponent
 * @extends {GelatoComponent}
 */
const StudyToolbarComponent = GelatoComponent.extend({

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
  template: require('./StudyToolbarComponent.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this.dueCountOffset = 0;
    this.page = options.page;

    this._adding = false;

    this.stats = new ProgressStats();
    this.timer = new StudyToolbarTimerComponent();

    this.listenTo(this.page.items, 'update:due-count', this.handleUpdateDueCount);
    this.listenTo(this.stats, 'state:standby', this.updateTimerOffset);
    this.listenTo(vent, 'items:added', this.updateAddButton);

    this.stats.fetchToday();
  },

  /**
   * @method render
   * @returns {StudyToolbarComponent}
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
   * Triggers an event to add an item from the user's lists
   * @method handleClickAddItem
   * @param {jQuery.ClickEvent} event
   * @triggers item:add
   */
  handleClickAddItem: function(event) {
    event.preventDefault();
    if (this._adding) {
      return;
    }

    vent.trigger('item:add');
    this.updateAddButton(true);
  },

  /**
   * Triggers an event to show a study settings popup.
   * @method handleClickStudySettings
   * @param {jQuery.ClickEvent} event
   * @triggers studySettings:show
   */
  handleClickStudySettings: function(event) {
    event.preventDefault();

    vent.trigger('studySettings:show');
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
   * @returns {StudyToolbarComponent}
   */
  remove: function() {
    this.timer.remove();
    return this;
  },

  /**
   * Updates the adding state and UI to reflect whether items are currently
   * being added.
   * @param {Boolean} [adding] whether items are currently being added
   */
  updateAddButton: function(adding) {
    adding = adding || false;

    this._adding = adding;
    this.$('#button-add-item').toggleClass('adding', adding);
  },

  /**
   * @method updateTimerOffset
   */
  updateTimerOffset: function(stats) {
    this.timer.setServerOffset(stats.getDailyTimeStudied());
  }

});

module.exports = StudyToolbarComponent;
