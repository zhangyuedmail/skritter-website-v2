var GelatoComponent = require('gelato/component');
var TimeStudiedBragraphComponent = require('components/stats/time-studied-bargraph/view');
var ItemsLearnedGraphComponent = require('components/stats/items-learned/view');

/**
 * A component that is a composite of graphs which show user study statistics
 * over a certain range of time.
 * @class StatsTimelineComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function(options) {
    this._views = {};

    // TODO: get actual selectable range
    var userTZ = app.user.get('timezone');
    var now = moment().tz(userTZ).subtract(4, 'hours').startOf('day')
      .format('YYYY-MM-DD');
    var past = moment().tz(userTZ).subtract(4, 'hours').subtract(6, 'days')
      .startOf('day').format('YYYY-MM-DD');

    /**
     * The date range by which to filter the stats contained in this view.
     * Dates should be in YYYY-MM-DD format.
     * @type {{start: String, end: String}}
     */
    this.range = {
      start: past,
      end: now
    };

    /**
     * The granularity level of the timeline graphs "minutes"|"hours"
     * @type {String}
     * @private
     * @default
     */
    this.granularity = 'minutes';

    // TODO: check localStorage for user-set granularity config?
    this._views['bargraph'] = new TimeStudiedBragraphComponent({
      collection: this.collection,
      granularity: 'minutes'
    });

    this._views['items-learned'] = new ItemsLearnedGraphComponent({
      collection: this.collection,
      showNumReviews: false,
      showTimeStudied: false,
      range: this.range
    });

    this.listenTo(this.collection, 'state:standby', this.update);
  },

  events: {
    'change #granularity-selector': 'onTimelineUnitsChanged'
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),

  /**
   * @method render
   * @returns {VocablistSideBar}
   */
  render: function() {
    this.renderTemplate();
    this._views['bargraph'].setElement('#time-studied-bar-graph-container').render();
    this._views['items-learned'].setElement('#items-learned-container').render();
  },

  /**
   * Gets the total amount of time a user has studied in the selected time period
   * @returns {Object} a larget units time object from progress-stats
   */
  getTimeStudied: function() {
    return this.collection.getTimeStudiedForPeriod(this.range.start, this.range.end);
  },

  /**
   * Runs entrance animations, fetches any data, and does any resetting that
   * should be performed when this section of the stats page is made visible.
   * @method onTabVisible
   */
  onTabVisible: function() {
    this._views['bargraph'].redrawGraph();
  },

  /**
   * Updates the granularity level of units(hours, minutes) in which to display
   * certain graphs.
   * @param {jQuery.Event} event the change event
   * @method onTimelineUnitsChanged
   */
  onTimelineUnitsChanged: function(event) {
    event.preventDefault();
    var units = event.target.value;

    this._views['bargraph'].updateUnits(units);
  },

  /**
   * Updates the amount of time studied. Child graphs should update themselves independently of this method.
   */
  update: function() {
    var timeStudied = this.getTimeStudied();
    this.$('#time-studied').text(timeStudied.amount);
    this.$('#time-studied-units-label').text(timeStudied.units);
  }
});
