var GelatoComponent = require('gelato/component');

/**
 * @class StatsAllTimeComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     *
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.listenTo(this.collection, 'state:standby', this.update);
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
    },
    
    update: function() {
        var totalCharactersLearned = this.collection.getAllTimeCharactersLearned();
        var totalWordsLearned = this.collection.getAllTimeWordsLearned();
        var totalItemsLearned = totalCharactersLearned + totalWordsLearned;

        var chartData = this.$('#items-learned').highcharts().series[0].points;
        chartData[0].update(totalWordsLearned);
        chartData[1].update(totalCharactersLearned);

        this.$('#characters-learned').text(totalCharactersLearned);
        this.$('#words-learned').text(totalWordsLearned);
        this.$('#num-items-learned').text(totalItemsLearned);

        var totalTimeData = this.collection.getAllTimeTimeStudied() ;
        this.$('#total-time-studied-num').text(totalTimeData.amount);
        this.$('#units-total-label').text(totalTimeData.units);

        this.$('#total-reviews-num').text(this.collection.getCountAllTimeReviews());
    }
});
