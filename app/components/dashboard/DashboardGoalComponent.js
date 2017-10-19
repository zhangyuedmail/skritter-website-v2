const GelatoComponent = require('gelato/component');

/**
 * @class DashboardGoalComponent
 * @extends {GelatoComponent}
 */
const DashboardGoalComponent = GelatoComponent.extend({

  /**
   * @property template
   * @type {Function}
   */
  template: require('./DashboardGoal'),

  /**
   * @method initialize
   * @constructor
   */
  initialize: function () {
    this.errorFetchingDueCount = false;
    this.dueCount = null;
    this.doughnut = null;

    this.listenTo(this.vocablists, 'state', this.updateDueCount);
    this.on('resize', this.resize);
    this.getDueCount();
  },

  /**
   * @method render
   * @returns {DashboardGoal}
   */
  render: function () {
    this.renderTemplate();

    this.doughnut = new Highcharts.Chart({
      chart: {
        backgroundColor: 'transparent',
        height: this.getSize(),
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        renderTo: 'goal-doughnut',
        type: 'pie',
        width: this.getSize(),
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [{
        name: 'Goal',
        animation: false,
        colorByPoint: true,
        data: [
          {name: 'Completed', color: '#c5da4b', y: 0},
          {name: 'Remaining', color: '#efeef3', y: 100},
        ],
        innerSize: '80%',
      }],
      title: {
        text: '',
        align: 'center',
        style: {
          color: '#87a64b',
          fontSize: '24px',
          fontWeight: '300',
        },
        verticalAlign: 'middle',
        y: 0,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
    });

    this.listenTo(app.user.stats, 'sync', this.updateDoughnut);
    this.listenTo(app.user.stats, 'sync', this.updateText);

    return this;
  },

  /**
   * @method remove
   * @returns {DashboardGoal}
   */
  remove: function () {
    this.doughnut.destroy();
    return GelatoComponent.prototype.remove.call(this);
  },

  /**
   * Makes a readable string from the user's study parts for the target language
   * @returns {string}
   */
  getReviewParts () {
    const studyParts = (app.isChinese() ? 'chinese' : 'japanese') + 'StudyParts';
    const partsList = app.user.get(studyParts).map((i) => app.locale('common.parts.' +i));
    let partsStr = '';
    for (let i = 0; i < partsList.length; i++) {
      partsStr += partsList[i];
      if (i === partsList.length - 2) {
        if (partsList.length > 2) {
          partsStr += ', and ';
        } else {
          partsStr += ' and ';
        }
      } else {
        partsStr += ', ';
      }
    }

    return partsStr.substr(0, partsStr.length - 2);
  },

  /**
   * @method getSize
   * @returns {Number}
   */
  getSize: function () {
    return this.$el.width() > 200 ? 200 : this.$el.width();
  },

  /**
   * @method resize
   */
  resize: function () {
    this.doughnut.setSize(this.getSize(), this.getSize(), true);
  },

  /**
   * @method updateDoughnut
   */
  updateDoughnut: function () {
    const goal = app.user.getGoal();
    let percent = 0;

    switch (goal.type) {
      case 'item': {
        const totalReviews = app.user.stats.getDailyItemsReviewed();

        this.doughnut.setTitle({
          text: totalReviews + ' / ' + (goal.value || 0) + '<br>items',
          align: 'center',
          verticalAlign: 'middle',
          y: 0,
        });

        percent = app.user.stats.getGoalItemPercent();

        break;
      }
      case 'time': {
        const totalTime = app.user.stats.getDailyTimeStudied();

        this.doughnut.setTitle({
          text: moment(totalTime * 1000).format('m') + ' / ' + (goal.value || 0) + '<br>minutes',
          align: 'center',
          verticalAlign: 'middle',
          y: 0,
        });

        percent = app.user.stats.getGoalTimePercent();

        break;
      }
    }

    this.doughnut.series[0].setData([
      {name: 'Completed', color: '#c5da4b', y: percent},
      {name: 'Remaining', color: '#efeef3', y: 100 - percent},
    ], true);
  },

  getDueCount () {
    let url = app.getApiUrl() + 'items/due';

    if (app.config.useV2Gets.itemsdue) {
      url = app.getApiUrl(2) + 'gae/items/due';
    }
    $.ajax({
      url: url,
      type: 'GET',
      headers: app.user.session.getHeaders(),
      context: this,
      data: {
        lang: app.getLanguage(),
        languageCode: app.getLanguage(),
        parts: app.user.getFilteredParts().join(','),
        styles: app.user.getFilteredStyles().join(','),
      },
      error: (error) => {
        this.dueCount = '-';
        this.errorFetchingDueCount = true;
        this.updateDueCount(this.dueCount);
        this.trigger('fetch-data:failed', 'goal');
      },
      success: function (result) {
        let count = 0;
        for (let part in result.due) {
          if (result.due.hasOwnProperty(part)) {
            for (let style in result.due[part]) {
              if (result.due[part].hasOwnProperty(style)) {
                count += result.due[part][style];
              }
            }
          }
        }
        this.dueCount = count;
        this.updateDueCount(count);
        this.trigger('component:loaded', 'goal');
      },
    });
  },

  updateDueCount (count) {
    console.log(count);
    if (typeof count === 'object') {
      count = this.dueCount;
    }

    if (this.dueCount) {
      this.$('#review-count').text(count);
    } else if (this.dueCount === 0 && this.vocablists.state === 'standby') {
      this.$('#review-count').text('no');
    } else if (this.errorFetchingDueCount) {
      this.$('#review-count').text('');
    } else {
      this.$('#review-count').text('-');
    }
  },

  /**
   * @method updateText
   */
  updateText: function () {
    // if (app.user.data.items.length) {
    //   this.$('#items-added .value').text(app.user.data.items.getAddedCount());
    // }
    // if (app.user.data.stats.length) {
    //   this.$('#items-reviewed .value').text(app.user.data.stats.getDailyItemsReviewed());
    // }
  },

});

module.exports = DashboardGoalComponent;
