const GelatoComponent = require('gelato/component');
const TimeStudiedBargraphComponent = require('components/stats/StatsTimeStudiedBargraphComponent');
const ItemsLearnedGraphComponent = require('components/stats/StatsItemsLearnedComponent');
const TimeStudiedCircleComponent = require('components/stats/StatsTimeStudiedCircleComponent');
const StudyPartLinegraphComponent = require('components/stats/StatsStudyPartLinegraphComponent');
const config = require('config');

/**
 * A component that is a composite of graphs which show user study statistics
 * over a certain range of time.
 * @class StatsTimelineComponent
 * @extends {GelatoComponent}
 */
const StatsTimelineComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Event}
   */
  events: {
    'change #granularity-selector': 'onTimelineUnitsChanged',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: app.isMobile() ? require('./MobileStatsTimeline.jade') : require('./StatsTimeline.jade'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function (options) {
    // TODO: get actual selectable range
    let userTZ = app.user.get('timezone');
    let now = moment().tz(userTZ).subtract(4, 'hours').startOf('day')
      .format('YYYY-MM-DD');
    let past = moment().tz(userTZ).subtract(4, 'hours').subtract(6, 'days')
      .startOf('day').format('YYYY-MM-DD');

    /**
     * The date range by which to filter the stats contained in this view.
     * Dates should be in YYYY-MM-DD format.
     * @type {{start: String, end: String}}
     */
    this.range = {
      start: past,
      end: now,
    };

    /**
     * The granularity level of the timeline graphs "minutes"|"hours"
     * @type {String}
     * @private
     * @default
     */
    this.granularity = 'minutes';

    // TODO: check localStorage for user-set granularity config?
    this._views['bargraph'] = new TimeStudiedBargraphComponent({
      collection: this.collection,
      granularity: 'minutes',
    });

    this._views['items-learned'] = new ItemsLearnedGraphComponent({
      collection: this.collection,
      showNumReviews: false,
      showTimeStudied: false,
      range: this.range,
    });

    this._views['daysStudied'] = new TimeStudiedCircleComponent({
      collection: this.collection,
      range: this.range,
    });


    this._views['lineCharWriting'] = new StudyPartLinegraphComponent({
      collection: this.collection,
      graphTitle: app.isMobile() ? 'Characters' : '',
      range: this.range,
      type: 'char',
      part: 'rune',
    });

    this._views['lineCharDefinition'] = new StudyPartLinegraphComponent({
      collection: this.collection,
      graphTitle: app.isMobile() ? 'Characters' : '',
      range: this.range,
      type: 'char',
      part: 'defn',
    });

    this._views['lineCharReading'] = new StudyPartLinegraphComponent({
      collection: this.collection,
      graphTitle: app.isMobile() ? 'Characters' : '',
      range: this.range,
      type: 'char',
      part: 'rdng',
    });

    this._views['lineWordWriting'] = new StudyPartLinegraphComponent({
      collection: this.collection,
      graphTitle: app.isMobile() ? 'Words' : '',
      range: this.range,
      type: 'word',
      part: 'rune',
    });

    this._views['lineWordDefinition'] = new StudyPartLinegraphComponent({
      collection: this.collection,
      graphTitle: app.isMobile() ? 'Words' : '',
      range: this.range,
      type: 'word',
      part: 'defn',
    });

    this._views['lineWordReading'] = new StudyPartLinegraphComponent({
      collection: this.collection,
      graphTitle: app.isMobile() ? 'Words' : '',
      range: this.range,
      type: 'word',
      part: 'rdng',
    });

    if (app.isChinese()) {
      this._views['lineCharTone'] = new StudyPartLinegraphComponent({
        collection: this.collection,
        graphTitle: app.isMobile() ? 'Characters' : '',
        range: this.range,
        type: 'char',
        part: 'tone',
      });

      this._views['lineWordTone'] = new StudyPartLinegraphComponent({
        collection: this.collection,
        graphTitle: app.isMobile() ? 'Words' : '',
        range: this.range,
        type: 'word',
        part: 'tone',
      });
    }

    this.listenTo(this.collection, 'state:standby', this.update);
  },

  /**
   * @method render
   * @returns {VocablistSideBar}
   */
  render: function () {
    this.renderTemplate();

    const userTZ = app.user.get('timezone');
    const now = moment().tz(userTZ).subtract(4, 'hours').startOf('day');

    this.$('#date-range-picker').daterangepicker({
      alwaysShowCalendars: !app.isMobile(),
      startDate: moment(this.range.start, app.config.dateFormatApp),
      endDate: moment(this.range.end, app.config.dateFormatApp),
      maxDate: now,
      minDate: moment(app.user.get('created') * 1000),
      locale: {
        format: app.config.dateFormatApp,
      },
      opens: app.isMobile() ? 'center' : 'left',

      showCustomRangeLabel: false,
      ranges: {
        'Last 7 Days': [moment(now).subtract(6, 'days'), now],
        'Last 30 Days': [moment(now).subtract(29, 'days'), now],
        'This Month': [moment(now).startOf('month'), moment(now).endOf('month')],
        'Last Month': [moment(now).subtract(1, 'month').startOf('month'), moment(now).subtract(1, 'month').endOf('month')],
      },
    });

    this.$('#date-range-picker').on('apply.daterangepicker', $.proxy(this.onDatePickerUpdated, this));

    this._views['bargraph'].setElement('#time-studied-bar-graph-container').render();
    this._views['items-learned'].setElement('#items-learned-container').render();
    this._views['daysStudied'].setElement('#days-studied-container').render();

    this._views['lineCharWriting'].setElement('#line-char-writing-container').render();
    this._views['lineCharDefinition'].setElement('#line-char-definition-container').render();
    this._views['lineCharReading'].setElement('#line-char-reading-container').render();

    this._views['lineWordWriting'].setElement('#line-word-writing-container').render();
    this._views['lineWordDefinition'].setElement('#line-word-definition-container').render();
    this._views['lineWordReading'].setElement('#line-word-reading-container').render();

    if (app.isChinese()) {
      this._views['lineCharTone'].setElement('#line-char-tone-container').render();
      this._views['lineWordTone'].setElement('#line-word-tone-container').render();
    }
  },

  remove: function () {
    this.$('#date-range-picker').off();

    GelatoComponent.prototype.remove.call(this);
  },

  /**
   * Gets the total amount of time a user has studied in the selected time period
   * @returns {Object} a larget units time object from progress-stats
   */
  getTimeStudied: function () {
    return this.collection.getTimeStudiedForPeriod(this.range.start, this.range.end);
  },

  /**
   * Updates the range, UI, and graphs based on changed values from the DateRangePicker.
   * @param {Event} event
   * @param {DateRangePicker} picker
   */
  onDatePickerUpdated: function (event, picker) {
    const startDate = picker.startDate;
    const endDate = picker.endDate;
    const self = this;

    const oldRangeStart = moment(this.range.start, config.dateFormatApp);
    const oldRangeEnd = moment(this.range.end, config.dateFormatApp);

    this.range.start = startDate.format(config.dateFormatApp);
    this.range.end = endDate.format(config.dateFormatApp);

    this.$('#start-date').text(startDate.format('MMM DD, YYYY'))
      .addClass('fetching');
    this.$('#end-date').text(endDate.format('MMM DD, YYYY'))
      .addClass('fetching');

    this.collection.fetchRange(
      startDate.format(config.dateFormatApp),
      endDate.format(config.dateFormatApp),
      {
        success: () => {
          self.$('#start-date').removeClass('fetching');
          self.$('#end-date').removeClass('fetching');
        },
        error: () => {
          self.$('#start-date').text(oldRangeStart.format('MMM DD, YYYY')).removeClass('fetching');
          self.$('#end-date').text(oldRangeEnd.format('MMM DD, YYYY')).removeClass('fetching');
          self.range.start = oldRangeStart.format(config.dateFormatApp);
          self.range.end = oldRangeEnd.format(config.dateFormatApp);
        },
      }
    );
  },

  /**
   * Runs entrance animations, fetches any data, and does any resetting that
   * should be performed when this section of the stats page is made visible.
   * @method onTabVisible
   */
  onTabVisible: function () {
    this._views['bargraph'].redrawGraph();
  },

  /**
   * Updates the granularity level of units(hours, minutes) in which to display
   * certain graphs.
   * @param {jQuery.Event} event the change event
   * @method onTimelineUnitsChanged
   */
  onTimelineUnitsChanged: function (event) {
    event.preventDefault();
    let units = event.target.value;

    this._views['bargraph'].updateUnits(units);
  },

  /**
   * Updates the amount of time studied. Child graphs should update themselves independently of this method.
   */
  update: function () {
    const timeStudied = this.getTimeStudied();
    this.$('#time-studied').text(timeStudied.amount);
    this.$('#time-studied-units-label').text(timeStudied.units);

    if (app.config.recordLoadTimes && !this.loaded) {
      this.loaded = true;
      this.trigger('component:loaded', 'timeline');
    }
  },

});

module.exports = StatsTimelineComponent;
