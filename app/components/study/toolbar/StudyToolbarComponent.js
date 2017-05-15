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
    'click .add-amt': 'handleAddWordAmountClick',
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

    _.bindAll(this, 'toggleAddWordsPopup');

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
   * Handles when the user clicks an amount of words to add.
   * Triggers an event to start the add item process for that amount.
   * @param {jQuery.Event} event the click event
   */
  handleAddWordAmountClick: function(event) {
    const numItemsToAdd = $(event.target).data('amt');

    this.toggleAddWordsPopup();
    this.updateAddButton(null, true);
    vent.trigger('items:add', null, numItemsToAdd);
  },

  /**
   * Triggers an event to add an item from the user's lists
   * @method handleClickAddItem
   * @param {jQuery.ClickEvent} event
   * @triggers items:add
   */
  handleClickAddItem: function(event) {
    if (this._adding) {
      return;
    }

    event.stopPropagation();

    this.toggleAddWordsPopup(null, true);
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
    $(document).off('click', this.toggleAddWordsPopup);

    return this;
  },

  /**
   * Shows a popup that allows the user to select the number of words they want to add
   * @param event
   * @param show
   */
  toggleAddWordsPopup: function(event, show) {
    if (event && event.stopPropagation()) {
      event.stopPropagation()
    }

    this.$('#add-popup').toggleClass('hidden', !show);
    $(document).off('click', this.toggleAddWordsPopup);

    if (show) {
      $(document).on('click', this.toggleAddWordsPopup);
    }
  },

  /**
   * Updates the adding state and UI to reflect whether items are currently
   * being added.
   * @param {Number} [num] the number of items added
   * @param {Boolean} [adding] whether items are currently being added
   */
  updateAddButton: function(num, adding) {
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
