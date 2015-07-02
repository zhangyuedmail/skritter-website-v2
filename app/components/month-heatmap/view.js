var GelatoComponent = require('gelato/modules/component');

/**
 * @class MonthHeatmap
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.heatmap = new Heatmap();
        this.listenTo(app.user.data.stats, 'update', this.updateHeatmap);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/month-heatmap/template'),
    /**
     * @method render
     * @returns {MonthHeatmap}
     */
    render: function() {
        this.renderTemplate();
        this.heatmap.init({
            cellSize: 25,
            cellPadding: 5,
            cellRadius: 25,
            domain: 'month',
            domainDynamicDimension: false,
            domainGutter: 20,
            itemSelector: '[data-name="month-heatmap"]',
            legend: [0, 50, 100, 200],
            range: 1,
            start: new Date(2015, new Date().getMonth(), 1),
            subDomain: 'x_day'
        });
        this.updateHeatmap();
        return this;
    },
    /**
     * @method remove
     * @returns {MonthHeatmap}
     */
    remove: function() {
        this.heatmap.destroy();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method updateHeatmap
     */
    updateHeatmap: function() {
        this.heatmap.update(app.user.data.stats.getMonthlyHeatmapData());
    }
});
